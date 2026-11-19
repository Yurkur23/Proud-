-- =====================================================================
-- Painel do administrador: aba "Projetos" (briefings enviados em /projeto).
--  - updated_at: quando o briefing mudou de status pela última vez
--  - índice por data para listar os mais recentes primeiro
-- =====================================================================

alter table project_briefs add column updated_at timestamptz not null default now();

create index project_briefs_created_idx on project_briefs (created_at desc);

create function stamp_brief_updated() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
create trigger before_brief_update before update on project_briefs
  for each row execute function stamp_brief_updated();
