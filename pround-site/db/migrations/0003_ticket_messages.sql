create table ticket_messages (
  id         uuid primary key default gen_random_uuid(),
  ticket_id  uuid not null references tickets (id) on delete cascade,
  author_id  text not null references "user" ("id") on delete cascade,
  body       text not null check (char_length(btrim(body)) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index ticket_messages_thread_idx on ticket_messages (ticket_id, created_at, id);
