# Cell Therapy Landscape Tracker (MVP Scaffold)

This repository now includes a working MVP scaffold using:
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL

## What is included
- Basic dashboard page (`/`) with simple search and filters.
- Basic program detail page (`/programs/[slug]`).
- Prisma schema aligned with MVP entities and join tables.
- Seed script with example companies, targets, programs, indications, and one clinical trial link.
- Placeholder ingestion scripts for trials and publications.

## Setup
1. Copy environment file:
   ```bash
   cp .env.example .env
   ```
2. Ensure PostgreSQL is running and database exists.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
5. Run migrations:
   ```bash
   npm run prisma:migrate -- --name init
   ```
6. Seed data:
   ```bash
   npm run prisma:seed
   ```
7. Start app:
   ```bash
   npm run dev
   ```

## Ingestion placeholders
- Trials: `npm run ingest:trials`
- Publications: `npm run ingest:publications`

These scripts currently create and complete ingestion run records only.
