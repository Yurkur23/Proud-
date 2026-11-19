update notifications
set message = replace(message, 'Pround', 'Proud')
where message like '%Pround%';

create or replace function notify_ticket_created() returns trigger language plpgsql as $$
declare
  v_site text;
  v_code text := 'PR-' || new.ticket_number;
begin
  select name into v_site from sites where id = new.site_id;
  insert into notifications (for_admin, title, message)
  values (true, 'Novo chamado', v_code || ' · ' || coalesce(v_site, ''));
  insert into notifications (user_id, title, message)
  values (new.owner_id, 'Chamado criado', v_code || ' foi recebido pela Proud.');
  return new;
end;
$$;
