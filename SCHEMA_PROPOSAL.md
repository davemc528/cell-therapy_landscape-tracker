# Schema Proposal (MVP)

This proposal defines a normalized data model for the Cell Therapy Landscape Tracker MVP.

## Design goals
- Normalize core entities: Company, Program, Target, Modality, Indication, ClinicalTrial, Publication.
- Support many-to-many relationships where biologically and clinically appropriate.
- Preserve source provenance and ingestion timestamps for update tracking.
- Keep schema practical for fast filtering in the dashboard.

## Entity model

### Company
Represents sponsoring/developing organizations.

**Fields**
- `id` (uuid, pk)
- `name` (string, required)
- `normalizedName` (string, unique)
- `website` (string, nullable)
- `hqCountry` (string, nullable)
- `createdAt` (datetime)
- `updatedAt` (datetime)

**Indexes/constraints**
- Unique: `normalizedName`

---

### Program
Represents a therapeutic program/asset.

**Fields**
- `id` (uuid, pk)
- `name` (string, required)
- `slug` (string, unique)
- `summary` (text, nullable)
- `companyId` (fk -> Company.id, required)
- `modalityId` (fk -> Modality.id, required)
- `leadIndicationId` (fk -> Indication.id, nullable)
- `active` (boolean, default true)
- `sourceUpdatedAt` (datetime, nullable)
- `createdAt` (datetime)
- `updatedAt` (datetime)

**Indexes/constraints**
- Unique: `slug`
- Index: `companyId`, `modalityId`, `leadIndicationId`

---

### Target
Represents molecular/cellular targets.

**Fields**
- `id` (uuid, pk)
- `name` (string, required)
- `normalizedName` (string, unique)
- `targetType` (enum: `ANTIGEN`, `RECEPTOR`, `PATHWAY`, `OTHER`; nullable)
- `createdAt` (datetime)
- `updatedAt` (datetime)

**Indexes/constraints**
- Unique: `normalizedName`

---

### Modality
Represents therapy modality taxonomy.

**Fields**
- `id` (uuid, pk)
- `name` (string, required, unique)
- `category` (enum: `CAR_T`, `TCR`, `NK`, `OTHER`)
- `createdAt` (datetime)
- `updatedAt` (datetime)

---

### Indication
Represents disease/condition indication.

**Fields**
- `id` (uuid, pk)
- `name` (string, required)
- `normalizedName` (string, unique)
- `therapeuticArea` (string, nullable)
- `createdAt` (datetime)
- `updatedAt` (datetime)

**Indexes/constraints**
- Unique: `normalizedName`

---

### ClinicalTrial
Represents trials (primarily from ClinicalTrials.gov).

**Fields**
- `id` (uuid, pk)
- `nctId` (string, unique, required)
- `title` (string, required)
- `officialTitle` (string, nullable)
- `phase` (enum: `EARLY_PHASE_1`, `PHASE_1`, `PHASE_1_2`, `PHASE_2`, `PHASE_2_3`, `PHASE_3`, `PHASE_4`, `NA`, `UNKNOWN`)
- `recruitmentStatus` (enum: `NOT_YET_RECRUITING`, `RECRUITING`, `ACTIVE_NOT_RECRUITING`, `COMPLETED`, `TERMINATED`, `SUSPENDED`, `WITHDRAWN`, `ENROLLING_BY_INVITATION`, `UNKNOWN`)
- `studyType` (string, nullable)
- `startDate` (date, nullable)
- `primaryCompletionDate` (date, nullable)
- `completionDate` (date, nullable)
- `lastVerifiedDate` (date, nullable)
- `sourceLastUpdatePosted` (date, nullable)
- `sourceUrl` (string, nullable)
- `rawSource` (json, nullable)
- `createdAt` (datetime)
- `updatedAt` (datetime)

**Indexes/constraints**
- Unique: `nctId`
- Index: `phase`, `recruitmentStatus`, `lastVerifiedDate`

---

### Publication
Represents literature records (primarily PubMed).

**Fields**
- `id` (uuid, pk)
- `pmid` (string, unique, nullable)
- `doi` (string, unique, nullable)
- `title` (string, required)
- `journal` (string, nullable)
- `publicationDate` (date, nullable)
- `abstract` (text, nullable)
- `url` (string, nullable)
- `source` (enum: `PUBMED`, `MANUAL`, `OTHER`, default `PUBMED`)
- `rawSource` (json, nullable)
- `createdAt` (datetime)
- `updatedAt` (datetime)

**Indexes/constraints**
- Unique (nullable): `pmid`, `doi`
- Index: `publicationDate`

## Relationship tables

### ProgramTarget (many-to-many)
- `programId` (fk)
- `targetId` (fk)
- `isPrimary` (boolean, default false)
- Unique composite: (`programId`, `targetId`)

### ProgramIndication (many-to-many)
- `programId` (fk)
- `indicationId` (fk)
- `isLead` (boolean, default false)
- Unique composite: (`programId`, `indicationId`)

### ProgramClinicalTrial (many-to-many)
- `programId` (fk)
- `clinicalTrialId` (fk)
- `relationshipType` (enum: `PRIMARY`, `RELATED`, `INFERRED`; default `PRIMARY`)
- Unique composite: (`programId`, `clinicalTrialId`)

### ClinicalTrialIndication (many-to-many)
- `clinicalTrialId` (fk)
- `indicationId` (fk)
- Unique composite: (`clinicalTrialId`, `indicationId`)

### ProgramPublication (many-to-many)
- `programId` (fk)
- `publicationId` (fk)
- Unique composite: (`programId`, `publicationId`)

### TargetPublication (many-to-many)
- `targetId` (fk)
- `publicationId` (fk)
- Unique composite: (`targetId`, `publicationId`)

## Ingestion and update tracking tables

### IngestionRun
Tracks each ingestion execution.

**Fields**
- `id` (uuid, pk)
- `source` (enum: `CLINICALTRIALS_GOV`, `PUBMED`, `MANUAL`)
- `status` (enum: `STARTED`, `SUCCEEDED`, `FAILED`)
- `startedAt` (datetime)
- `finishedAt` (datetime, nullable)
- `recordsFetched` (int, default 0)
- `recordsCreated` (int, default 0)
- `recordsUpdated` (int, default 0)
- `errorMessage` (text, nullable)

### EntityChangeLog (optional but recommended)
Supports “new/updated” indicators.

**Fields**
- `id` (uuid, pk)
- `entityType` (enum: `PROGRAM`, `CLINICAL_TRIAL`, `PUBLICATION`, etc.)
- `entityId` (uuid)
- `changeType` (enum: `CREATED`, `UPDATED`)
- `changedFields` (json, nullable)
- `ingestionRunId` (fk -> IngestionRun.id, nullable)
- `createdAt` (datetime)

## Filter support mapping (must-have)
- `target` -> ProgramTarget + Target
- `company` -> Program.companyId
- `indication` -> ProgramIndication and/or ClinicalTrialIndication
- `modality` -> Program.modalityId
- `phase` -> ClinicalTrial.phase via ProgramClinicalTrial
- `recruitment status` -> ClinicalTrial.recruitmentStatus via ProgramClinicalTrial

## Suggested Prisma modeling notes
- Use explicit join models (not implicit many-to-many) to allow metadata (`isPrimary`, `relationshipType`).
- Add DB indexes on all frequently filtered fields and join FKs.
- Keep `rawSource` JSON snapshots for debugging mappings and future reprocessing.

