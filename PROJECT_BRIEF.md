# Cell Therapy Landscape Tracker

## Goal
Build a web app that tracks the cell therapy competitive landscape, starting with CAR-T, TCR, and NK programs.

## Target users
- biotech analysts
- venture firms
- pharma business development teams

## Core MVP
1. Ingest clinical trial data
2. Normalize companies, targets, indications, modality
3. Show searchable/filterable dashboard
4. Show program detail pages
5. Track publications relevant to programs/targets
6. Flag updates over time

## MVP entities
- Company
- Program
- Target
- Modality
- Indication
- Clinical Trial
- Publication

## Must-have filters
- target
- company
- indication
- modality
- phase
- recruitment status

## Suggested stack
- Next.js
- TypeScript
- Postgres
- Prisma
- Tailwind
- simple cron jobs for ingestion

## Non-goals for v1
- no billing
- no multi-tenant enterprise features
- no advanced forecasting
- no complex proprietary scoring yet

## Initial data sources
- ClinicalTrials.gov
- PubMed
- manually curated seed data

## Immediate milestone
Get a working prototype with:
- seeded database
- searchable dashboard
- detail page for one program
- import script for trial data

