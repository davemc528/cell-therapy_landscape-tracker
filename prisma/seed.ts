import { ModalityCategory, RecruitmentStatus, TrialPhase } from "@prisma/client";
import { prisma } from "../lib/prisma";

async function main() {
  const [autolus, adaptimmune] = await Promise.all([
    prisma.company.upsert({
      where: { normalizedName: "autolus" },
      update: {},
      create: { name: "Autolus", normalizedName: "autolus", hqCountry: "UK" },
    }),
    prisma.company.upsert({
      where: { normalizedName: "adaptimmune" },
      update: {},
      create: { name: "Adaptimmune", normalizedName: "adaptimmune", hqCountry: "UK" },
    }),
  ]);

  const [carT, tcr] = await Promise.all([
    prisma.modality.upsert({
      where: { name: "CAR-T" },
      update: {},
      create: { name: "CAR-T", category: ModalityCategory.CAR_T },
    }),
    prisma.modality.upsert({
      where: { name: "TCR" },
      update: {},
      create: { name: "TCR", category: ModalityCategory.TCR },
    }),
  ]);

  const [cd19, mageA4] = await Promise.all([
    prisma.target.upsert({
      where: { normalizedName: "cd19" },
      update: {},
      create: { name: "CD19", normalizedName: "cd19" },
    }),
    prisma.target.upsert({
      where: { normalizedName: "mage-a4" },
      update: {},
      create: { name: "MAGE-A4", normalizedName: "mage-a4" },
    }),
  ]);

  const [bAll, synovialSarcoma] = await Promise.all([
    prisma.indication.upsert({
      where: { normalizedName: "b-cell-acute-lymphoblastic-leukemia" },
      update: {},
      create: {
        name: "B-cell Acute Lymphoblastic Leukemia",
        normalizedName: "b-cell-acute-lymphoblastic-leukemia",
        therapeuticArea: "Oncology",
      },
    }),
    prisma.indication.upsert({
      where: { normalizedName: "synovial-sarcoma" },
      update: {},
      create: { name: "Synovial Sarcoma", normalizedName: "synovial-sarcoma", therapeuticArea: "Oncology" },
    }),
  ]);

  const obeCel = await prisma.program.upsert({
    where: { slug: "obe-cel" },
    update: {},
    create: {
      name: "Obe-cel",
      slug: "obe-cel",
      summary: "Autologous CD19 CAR-T program for B-cell malignancies.",
      companyId: autolus.id,
      modalityId: carT.id,
      leadIndicationId: bAll.id,
    },
  });

  const afamiCel = await prisma.program.upsert({
    where: { slug: "afami-cel" },
    update: {},
    create: {
      name: "Afami-cel",
      slug: "afami-cel",
      summary: "TCR T-cell therapy targeting MAGE-A4.",
      companyId: adaptimmune.id,
      modalityId: tcr.id,
      leadIndicationId: synovialSarcoma.id,
    },
  });

  await prisma.programTarget.upsert({
    where: { programId_targetId: { programId: obeCel.id, targetId: cd19.id } },
    update: {},
    create: { programId: obeCel.id, targetId: cd19.id, isPrimary: true },
  });

  await prisma.programTarget.upsert({
    where: { programId_targetId: { programId: afamiCel.id, targetId: mageA4.id } },
    update: {},
    create: { programId: afamiCel.id, targetId: mageA4.id, isPrimary: true },
  });

  const trial = await prisma.clinicalTrial.upsert({
    where: { nctId: "NCT04404660" },
    update: {},
    create: {
      nctId: "NCT04404660",
      title: "Study of AUTO1 in Adult Relapsed/Refractory B-ALL",
      phase: TrialPhase.PHASE_1_2,
      recruitmentStatus: RecruitmentStatus.RECRUITING,
      sourceUrl: "https://clinicaltrials.gov/study/NCT04404660",
    },
  });

  await prisma.programClinicalTrial.upsert({
    where: { programId_clinicalTrialId: { programId: obeCel.id, clinicalTrialId: trial.id } },
    update: {},
    create: { programId: obeCel.id, clinicalTrialId: trial.id },
  });

  await prisma.programIndication.upsert({
    where: { programId_indicationId: { programId: obeCel.id, indicationId: bAll.id } },
    update: {},
    create: { programId: obeCel.id, indicationId: bAll.id, isLead: true },
  });

  await prisma.programIndication.upsert({
    where: { programId_indicationId: { programId: afamiCel.id, indicationId: synovialSarcoma.id } },
    update: {},
    create: { programId: afamiCel.id, indicationId: synovialSarcoma.id, isLead: true },
  });

  console.log("Seed complete: companies, targets, programs, and one linked trial created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
