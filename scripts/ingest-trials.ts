import { prisma } from "../lib/prisma";

async function main() {
  const run = await prisma.ingestionRun.create({
    data: {
      source: "CLINICALTRIALS_GOV",
      status: "STARTED",
    },
  });

  try {
    // Placeholder for ClinicalTrials.gov fetch + normalize + upsert logic.
    // Implement API client and mapping in the next iteration.
    await prisma.ingestionRun.update({
      where: { id: run.id },
      data: {
        status: "SUCCEEDED",
        finishedAt: new Date(),
        recordsFetched: 0,
        recordsCreated: 0,
        recordsUpdated: 0,
      },
    });

    console.log("Trial ingestion placeholder completed.");
  } catch (error) {
    await prisma.ingestionRun.update({
      where: { id: run.id },
      data: {
        status: "FAILED",
        finishedAt: new Date(),
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      },
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
