import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ProgramDetail({ params }: { params: { slug: string } }) {
  const program = await prisma.program.findUnique({
    where: { slug: params.slug },
    include: {
      company: true,
      modality: true,
      programTargets: { include: { target: true } },
      programClinicalTrials: { include: { clinicalTrial: true } },
    },
  });

  if (!program) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div className="rounded-lg border bg-white p-5">
        <h1 className="text-2xl font-bold">{program.name}</h1>
        <p className="mt-2 text-sm text-slate-600">{program.summary || "No summary yet."}</p>
        <div className="mt-4 grid gap-2 text-sm md:grid-cols-3">
          <div>
            <span className="font-medium">Company:</span> {program.company.name}
          </div>
          <div>
            <span className="font-medium">Modality:</span> {program.modality.name}
          </div>
          <div>
            <span className="font-medium">Targets:</span>{" "}
            {program.programTargets.map((pt) => pt.target.name).join(", ") || "—"}
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-5">
        <h2 className="text-lg font-semibold">Linked Clinical Trials</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {program.programClinicalTrials.map((pct) => (
            <li key={pct.clinicalTrialId} className="rounded border p-3">
              <p className="font-medium">{pct.clinicalTrial.title}</p>
              <p className="text-slate-600">
                {pct.clinicalTrial.nctId} · {pct.clinicalTrial.phase} · {pct.clinicalTrial.recruitmentStatus}
              </p>
            </li>
          ))}
          {program.programClinicalTrials.length === 0 && <li>No trials linked yet.</li>}
        </ul>
      </div>
    </section>
  );
}
