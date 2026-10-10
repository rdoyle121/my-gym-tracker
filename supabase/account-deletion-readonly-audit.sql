-- My Gym Tracker account deletion preflight: READ-ONLY audit
-- Run in Supabase SQL Editor. This query does not delete or modify any records.
select t.table_schema, t.table_name,
       exists(select 1 from information_schema.columns c
              where c.table_schema=t.table_schema and c.table_name=t.table_name and c.column_name='user_id') as has_user_id,
       (select string_agg(c.column_name, ', ' order by c.ordinal_position)
        from information_schema.columns c where c.table_schema=t.table_schema and c.table_name=t.table_name
        and c.column_name in ('user_id','owner_id','profile_id','account_id')) as ownership_columns
from information_schema.tables t
where t.table_schema='public' and t.table_type='BASE TABLE'
order by t.table_name;

-- Check foreign keys referencing auth.users.
select tc.table_schema,tc.table_name,kcu.column_name,
       ccu.table_schema as referenced_schema,ccu.table_name as referenced_table,
       rc.delete_rule
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu on kcu.constraint_name=tc.constraint_name and kcu.constraint_schema=tc.constraint_schema
join information_schema.constraint_column_usage ccu on ccu.constraint_name=tc.constraint_name and ccu.constraint_schema=tc.constraint_schema
join information_schema.referential_constraints rc on rc.constraint_name=tc.constraint_name and rc.constraint_schema=tc.constraint_schema
where tc.constraint_type='FOREIGN KEY' and ccu.table_schema='auth' and ccu.table_name='users'
order by tc.table_name;

-- Verify photo bucket settings without exposing anyone's photos.
select id,public,file_size_limit,allowed_mime_types from storage.buckets where id='gym-progress-photos';
