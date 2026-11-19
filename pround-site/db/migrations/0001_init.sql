-- =====================================================================
-- Pround — schema inicial (PostgreSQL puro: Neon, Railway, RDS, local...)
-- Não depende de Supabase, de extensões nem de papéis especiais.
--
-- Quem protege os dados agora é o servidor (rotas /api/*), que sempre filtra
-- por usuário/papel. O banco garante o que dá para garantir sozinho:
-- integridade (FKs, checks), numeração dos chamados e as notificações (triggers).
-- Senhas: ficam só como hash (scrypt) em "account"."password", gerado pelo Better Auth.
-- =====================================================================

-- ---------- Tabelas do Better Auth (login) ----------
-- Nomes/colunas são os que a biblioteca espera ("user", "session", "account", "verification").

create table "user" (
  "id"            text primary key,
  "name"          text not null check (char_length("name") between 1 and 120),
  "email"         text not null unique,
  "emailVerified" boolean not null default false,
  "image"         text,
  "createdAt"     timestamptz not null default now(),
  "updatedAt"     timestamptz not null default now(),
  "phone"         text not null default '' check (char_length("phone") <= 30),
  "role"          text not null default 'client' check ("role" in ('client', 'admin'))
);
-- e-mail único sem diferenciar maiúsculas/minúsculas (defesa extra)
create unique index user_email_lower_key on "user" (lower("email"));

create table "session" (
  "id"        text primary key,
  "expiresAt" timestamptz not null,
  "token"     text not null unique,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null,
  "ipAddress" text,
  "userAgent" text,
  "userId"    text not null references "user" ("id") on delete cascade
);
create index session_user_idx    on "session" ("userId");
create index session_expires_idx on "session" ("expiresAt");

create table "account" (
  "id"                    text primary key,
  "accountId"             text not null,
  "providerId"            text not null,
  "userId"                text not null references "user" ("id") on delete cascade,
  "accessToken"           text,
  "refreshToken"          text,
  "idToken"               text,
  "accessTokenExpiresAt"  timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  "scope"                 text,
  "password"              text,
  "createdAt"             timestamptz not null default now(),
  "updatedAt"             timestamptz not null
);
create index account_user_idx on "account" ("userId");

create table "verification" (
  "id"         text primary key,
  "identifier" text not null,
  "value"      text not null,
  "expiresAt"  timestamptz not null,
  "createdAt"  timestamptz not null default now(),
  "updatedAt"  timestamptz not null default now()
);
create index verification_identifier_idx on "verification" ("identifier");
create index verification_expires_idx    on "verification" ("expiresAt");

-- limite de tentativas do login (guardado no banco porque funções serverless não têm memória fixa)
create table "rateLimit" (
  "id"          text primary key,
  "key"         text not null unique,
  "count"       integer not null,
  "lastRequest" bigint not null
);

-- ---------- Tabelas da Pround ----------

create type ticket_status as enum ('open', 'in-progress', 'resolved');
create type site_status   as enum ('online', 'setup');

create table sites (
  id         uuid primary key default gen_random_uuid(),
  owner_id   text not null references "user" ("id") on delete cascade,
  name       text not null check (char_length(name) between 1 and 120),
  url        text not null default '' check (char_length(url) <= 200),
  plan       text not null default 'Em definição' check (char_length(plan) <= 60),
  status     site_status not null default 'setup',
  created_at timestamptz not null default now(),
  -- permite que tickets referenciem (site, dono) juntos: o dono do chamado nunca diverge do dono do site
  unique (id, owner_id)
);
create index sites_owner_idx on sites (owner_id);

create table tickets (
  id            uuid primary key default gen_random_uuid(),
  ticket_number integer generated always as identity (start with 1051) unique,
  owner_id      text not null,
  site_id       uuid not null,
  subject       text not null check (char_length(subject) between 3 and 120),
  description   text not null default '' check (char_length(description) <= 2000),
  type          text not null default 'technical' check (char_length(type)   <= 60),
  impact        text not null default 'low'       check (char_length(impact) <= 60),
  status        ticket_status not null default 'open',
  created_at    timestamptz not null default now(),
  resolved_at   timestamptz,
  foreign key (site_id, owner_id) references sites (id, owner_id) on delete cascade
);
create index tickets_owner_idx   on tickets (owner_id, created_at desc);
create index tickets_site_idx    on tickets (site_id);
create index tickets_created_idx on tickets (created_at desc);

create table notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    text references "user" ("id") on delete cascade,
  for_admin  boolean not null default false,
  title      text not null,
  message    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now(),
  -- exatamente um destino: um usuário OU os administradores
  check ((user_id is not null and not for_admin) or (user_id is null and for_admin))
);
create index notifications_user_idx  on notifications (user_id, created_at desc) where user_id is not null;
create index notifications_admin_idx on notifications (created_at desc) where for_admin;

create table project_briefs (
  id               uuid primary key default gen_random_uuid(),
  user_id          text references "user" ("id") on delete set null,
  contact          text not null check (char_length(contact)   between 5 and 160),
  service          text not null check (char_length(service)   between 1 and 120),
  objective        text not null check (char_length(objective) between 1 and 120),
  features         text[] not null default '{}' check (cardinality(features) <= 20),
  idea             text not null check (char_length(idea) between 10 and 4000),
  privacy_accepted boolean not null check (privacy_accepted),
  status           text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at       timestamptz not null default now()
);
create index project_briefs_status_idx on project_briefs (status, created_at desc);

-- limite de uso das rotas públicas (briefing, chamados...)
create table rate_limits (
  key          text primary key,
  count        integer not null,
  window_start timestamptz not null default now()
);

-- ---------- Regras de negócio (triggers) ----------

-- Novo usuário -> site "em configuração" (o papel sempre começa como client)
create function create_default_site() returns trigger language plpgsql as $$
begin
  insert into sites (owner_id, name, url, plan, status)
  values (
    new."id",
    -- left(): nome de 120 caracteres sem espaço estouraria o limite do campo e quebraria o cadastro
    'Projeto de ' || left(coalesce(nullif(split_part(trim(new."name"), ' ', 1), ''), 'Cliente'), 100),
    'projeto-em-configuracao.local',
    'Em definição',
    'setup'
  );
  return new;
end;
$$;
create trigger on_user_created after insert on "user"
  for each row execute function create_default_site();

-- Chamado criado -> notifica os admins e o dono
create function notify_ticket_created() returns trigger language plpgsql as $$
declare
  v_site text;
  v_code text := 'PR-' || new.ticket_number;
begin
  select name into v_site from sites where id = new.site_id;
  insert into notifications (for_admin, title, message)
  values (true, 'Novo chamado', v_code || ' · ' || coalesce(v_site, ''));
  insert into notifications (user_id, title, message)
  values (new.owner_id, 'Chamado criado', v_code || ' foi recebido pela Pround.');
  return new;
end;
$$;
create trigger on_ticket_created after insert on tickets
  for each row execute function notify_ticket_created();

-- Chamado resolvido -> carimba resolved_at (e limpa se for reaberto)
create function stamp_ticket_resolved() returns trigger language plpgsql as $$
begin
  if new.status = 'resolved' and old.status is distinct from 'resolved' then
    new.resolved_at := now();
  elsif new.status <> 'resolved' then
    new.resolved_at := null;
  end if;
  return new;
end;
$$;
create trigger before_ticket_update before update on tickets
  for each row execute function stamp_ticket_resolved();

-- ...e notifica o dono
create function notify_ticket_resolved() returns trigger language plpgsql as $$
begin
  if new.status = 'resolved' and old.status is distinct from 'resolved' then
    insert into notifications (user_id, title, message)
    values (
      new.owner_id,
      'Chamado resolvido',
      'PR-' || new.ticket_number || ' foi movido para o histórico de manutenções.'
    );
  end if;
  return new;
end;
$$;
create trigger after_ticket_update after update on tickets
  for each row execute function notify_ticket_resolved();

-- Novo briefing -> avisa os admins
create function notify_brief_created() returns trigger language plpgsql as $$
begin
  insert into notifications (for_admin, title, message)
  values (true, 'Novo briefing', left(new.service, 80) || ' · ' || left(new.contact, 80));
  return new;
end;
$$;
create trigger on_brief_created after insert on project_briefs
  for each row execute function notify_brief_created();
