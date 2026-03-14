# Project Plan: Cell Therapy Landscape Tracker (MVP)

## 1) Scope and Success Criteria

### Objective
Deliver a working prototype that enables analysts to discover and track cell therapy programs (starting with CAR-T, TCR, and NK) from trials and publications data.

### MVP Success Criteria
- Seeded database with initial records for core entities.
- Trial ingestion script that can import and upsert ClinicalTrials.gov records.
- Searchable and filterable dashboard with all must-have filters.
- Program detail page for at least one fully populated program.
- Baseline publication tracking connected to programs/targets.
- Update flags indicating newly added or changed records.

## 2) Workstreams

1. **Data model and storage**
   - Define schema for Company, Program, Target, Modality, Indication, Clinical Trial, Publication.
   - Add join tables and uniqueness constraints for normalized entities.
   - Add audit fields (`createdAt`, `updatedAt`, optional `sourceUpdatedAt`).

2. **Data ingestion and normalization**
   - Build import pipeline for ClinicalTrials.gov.
   - Normalize company names, targets, indications, modalities, and trial phases.
   - Add idempotent upsert behavior and ingestion logs.

3. **Publications ingestion (baseline)**
   - Add PubMed fetch script for trial/program-target keywords.
   - Link publications to programs and/or targets.

4. **Frontend MVP**
   - Dashboard with table/cards and robust filtering/search.
   - Program detail page with linked trials/publications.
   - Change indicators (“new/updated since last run”).

5. **Operations and quality**
   - Seed scripts and local setup docs.
   - Scheduled jobs (cron) for ingestion.
   - Basic tests and data validation checks.

## 3) Implementation Phases

## Phase 0 — Foundation (Day 1–2)
- Initialize/confirm stack (Next.js + TypeScript + Postgres + Prisma + Tailwind).
- Configure environment variables and DB connection.
- Establish repo conventions and scripts.

**Exit criteria**
- App runs locally.
- DB migration workflow is working.

## Phase 1 — Schema + Seed Data (Day 2–4)
- Implement Prisma schema for all MVP entities.
- Add relations, enum mappings (modality, recruitment status, phase where appropriate).
- Create seed script with manually curated starter data.

**Exit criteria**
- `prisma migrate` and `prisma db seed` succeed.
- Seed includes at least one complete end-to-end program record.

## Phase 2 — Clinical Trial Ingestion (Day 4–7)
- Build ClinicalTrials.gov client and import script.
- Map API fields to normalized schema.
- Implement de-duplication/upsert and provenance tracking.

**Exit criteria**
- Import script runs repeatedly without duplicates.
- Imported data populates dashboard-critical fields.

## Phase 3 — Dashboard + Filters (Day 7–10)
- Build searchable dashboard view.
- Implement must-have filters:
  - target
  - company
  - indication
  - modality
  - phase
  - recruitment status
- Add pagination/sorting.

**Exit criteria**
- Users can combine filters and search quickly.
- Result set links to program detail pages.

## Phase 4 — Program Detail + Publications (Day 10–12)
- Build detail page for one program template, then generalize.
- Add baseline PubMed ingestion and display linked publications.
- Show latest updates and key metadata.

**Exit criteria**
- At least one production-like program detail page is complete.
- Publications appear with source metadata and links.

## Phase 5 — Update Tracking + Cron (Day 12–14)
- Add “new/updated” flags from ingestion timestamps/diffs.
- Schedule cron jobs for trial and publication ingestion.
- Add run logs and failure visibility.

**Exit criteria**
- Automated ingestion runs daily (or configurable cadence).
- Dashboard shows update indicators from recent ingestion runs.

## 4) Deliverables

1. **Data Layer**
   - Prisma schema + migrations
   - Seed script with curated initial dataset
   - Ingestion scripts (ClinicalTrials.gov + PubMed baseline)

2. **Product Layer**
   - Filterable dashboard
   - Program detail page
   - Update flags and source provenance

3. **Ops Layer**
   - Cron scheduling config
   - Setup and runbook documentation
   - Basic test suite and data checks

## 5) Risks and Mitigations

- **Entity normalization drift**
  - Mitigation: central normalization utilities + mapping tables + review queue for ambiguous names.

- **Source API schema changes**
  - Mitigation: isolate source adapters and add contract tests on sample payloads.

- **Data quality inconsistency across trials/publications**
  - Mitigation: provenance metadata, null-safe display patterns, and confidence tags.

- **Performance degradation with growing dataset**
  - Mitigation: DB indexes on filter fields and server-side pagination.

## 6) Backlog After MVP (Out of Scope for v1)

- Proprietary scoring/ranking models.
- Alerts/notifications.
- Multi-tenant access control and billing.
- Advanced forecasting and analytics modules.

## 7) Suggested Execution Order (First Week)

1. Finalize schema and seed data.
2. Implement trial ingestion + normalization.
3. Stand up dashboard with required filters.
4. Implement detail page using seeded + ingested program data.
5. Add publication ingestion baseline.
6. Add update flags and automate ingestion.
