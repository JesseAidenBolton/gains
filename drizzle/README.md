# Database migrations

Run migrations manually against the production Neon database before deploying features that depend on new tables.

## Routine templates

`0001_create_routine_templates.sql` is additive only:

- creates `routine_templates` if it does not already exist
- does not alter, delete, truncate, or recreate `workouts`
- does not modify existing workout history

Apply it with your normal Neon SQL console or a trusted migration command connected to `DATABASE_URL`.
