# TASKLIST (MVP Execution)

This tasklist breaks down the project plan into actionable items with priority and sequencing.

## Legend
- Priority: `P0` (must-have), `P1` (important), `P2` (nice-to-have)
- Status: `TODO`, `IN_PROGRESS`, `DONE`, `BLOCKED`

## Phase 0 — Foundation
- [ ] **P0** Create project scaffolding (Next.js + TypeScript + Tailwind) — `TODO`
- [ ] **P0** Configure Postgres + Prisma + env vars — `TODO`
- [ ] **P0** Add scripts for dev/build/lint/typecheck — `TODO`
- [ ] **P1** Add formatting/linting standards (ESLint/Prettier) — `TODO`
- [ ] **P1** Add base README setup instructions — `TODO`

## Phase 1 — Schema + Seed
- [ ] **P0** Implement Prisma models from `SCHEMA_PROPOSAL.md` — `TODO`
- [ ] **P0** Add migrations and verify clean apply/reset flow — `TODO`
- [ ] **P0** Create seed data for at least one complete program — `TODO`
- [ ] **P0** Add normalized lookup seeds (modality, status mappings) — `TODO`
- [ ] **P1** Add DB indexes for planned dashboard filters — `TODO`

## Phase 2 — ClinicalTrials.gov ingestion
- [ ] **P0** Implement source client wrapper for ClinicalTrials.gov — `TODO`
- [ ] **P0** Build trial mapping/normalization utilities — `TODO`
- [ ] **P0** Create idempotent upsert import command — `TODO`
- [ ] **P0** Record ingestion runs (`IngestionRun`) — `TODO`
- [ ] **P1** Capture raw payload snapshots for troubleshooting — `TODO`
- [ ] **P1** Add basic contract tests with sample payloads — `TODO`

## Phase 3 — Dashboard + Filters
- [ ] **P0** Implement dashboard query endpoint with pagination — `TODO`
- [ ] **P0** Add text search (program, company, target) — `TODO`
- [ ] **P0** Add filters: target/company/indication/modality/phase/status — `TODO`
- [ ] **P0** Render result list with links to program detail — `TODO`
- [ ] **P1** Add sorting options (updated date, phase, name) — `TODO`
- [ ] **P1** Add empty/loading/error states — `TODO`

## Phase 4 — Program detail + Publications
- [ ] **P0** Build program detail route/page skeleton — `TODO`
- [ ] **P0** Display linked trials and key trial metadata — `TODO`
- [ ] **P0** Implement baseline PubMed ingestion script — `TODO`
- [ ] **P0** Link/display publications by program and target — `TODO`
- [ ] **P1** Add source links and provenance badges — `TODO`

## Phase 5 — Update tracking + Cron
- [ ] **P0** Add `EntityChangeLog` writes on create/update ingestion events — `TODO`
- [ ] **P0** Surface “new/updated” flags in dashboard and detail views — `TODO`
- [ ] **P0** Configure scheduled ingestion jobs (cron) — `TODO`
- [ ] **P1** Add run health summary (last run time/status/counters) — `TODO`
- [ ] **P1** Add failure alerting path (log + optional webhook/email) — `TODO`

## Cross-cutting quality tasks
- [ ] **P0** Add unit tests for normalization utilities — `TODO`
- [ ] **P0** Add integration test for ingestion upsert idempotency — `TODO`
- [ ] **P1** Add UI tests for filter behavior — `TODO`
- [ ] **P1** Add seed data validation checks — `TODO`
- [ ] **P1** Define minimal observability/logging conventions — `TODO`

## Immediate next 10 tasks (execution order)
1. [ ] **P0** Prisma schema implementation
2. [ ] **P0** Initial migration + DB bootstrap
3. [ ] **P0** Seed script with 1 complete program
4. [ ] **P0** ClinicalTrials.gov client + fetch command
5. [ ] **P0** Trial normalization + upsert
6. [ ] **P0** Ingestion run tracking
7. [ ] **P0** Dashboard backend query (filters + pagination)
8. [ ] **P0** Dashboard UI with required filters
9. [ ] **P0** Program detail page
10. [ ] **P0** PubMed baseline import + publication linking

