# MMF Portal PostgreSQL database

This folder contains a normalized PostgreSQL schema and illustrative seed data derived from `reference/MMF_Portal_Prototype_MVP.html`.

## Files

- `schema.sql` creates tables, constraints, relationships, and indexes.
- `seed.sql` loads the prototype's organization, access control, sales, campaign, solution, radar, agent, governance, KPI, and audit data.
- `ERD.md` provides a Mermaid entity relationship diagram of the schema.
- `../src/main/resources/db/migration/V1__create_mmf_portal_schema.sql` is the Flyway schema migration.
- `../src/main/resources/db/migration/V2__seed_mmf_portal_data.sql` loads illustrative development data.

The scripts target PostgreSQL 14 or newer and expect UTF-8 encoding.

## Run With Flyway

Spring Boot discovers the migration scripts automatically from `classpath:db/migration` when `flyway-core` and the PostgreSQL JDBC driver are dependencies. Configure the target database, then start the application:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mmf_portal
spring.datasource.username=postgres
spring.datasource.password=change-me
spring.flyway.enabled=true
```

Flyway records successful versions in `flyway_schema_history`. Do not edit an applied migration; add a new, higher-numbered `V<n>__description.sql` file for every schema or baseline-data change.

## Manual Load

```powershell
createdb mmf_portal
psql -v ON_ERROR_STOP=1 -d mmf_portal -f database/schema.sql
psql -v ON_ERROR_STOP=1 -d mmf_portal -f database/seed.sql
```

Run the scripts against an empty database. Both files use transactions, so an error rolls back that file.

## Source-data notes

- Prospect upload filenames were mapped to their matching batch IDs (`BATCH-0004` through `BATCH-0007`).
- `Haarlem Insurance` and `Eindhoven Devices BV` are referenced by prospects/signals but absent from the reference `ACCOUNTS` array. Seed account rows are derived from those references so foreign keys remain valid.
- Monetary fields ending in `_millions` store EUR millions, matching the prototype display convention.