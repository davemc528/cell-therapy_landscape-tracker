import Link from "next/link";
import { prisma } from "@/lib/prisma";

type DashboardProps = {
  searchParams?: {
    q?: string;
    modality?: string;
    company?: string;
  };
};

export default async function Dashboard({ searchParams }: DashboardProps) {
  const q = searchParams?.q?.trim();
  const modality = searchParams?.modality?.trim();
  const company = searchParams?.company?.trim();

  const [programs, modalities, companies] = await Promise.all([
    prisma.program.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { company: { name: { contains: q, mode: "insensitive" } } },
                ],
              }
            : {},
          modality ? { modality: { name: modality } } : {},
          company ? { company: { name: company } } : {},
        ],
      },
      include: { company: true, modality: true, programTargets: { include: { target: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.modality.findMany({ orderBy: { name: "asc" } }),
    prisma.company.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">MVP Dashboard</h1>
        <p className="text-sm text-slate-600">Search and filter cell therapy programs.</p>
      </div>

      <form className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-4">
        <input
          name="q"
          placeholder="Search program/company"
          defaultValue={q}
          className="rounded border px-3 py-2"
        />
        <select name="modality" defaultValue={modality} className="rounded border px-3 py-2">
          <option value="">All modalities</option>
          {modalities.map((m) => (
            <option key={m.id} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
        <select name="company" defaultValue={company} className="rounded border px-3 py-2">
          <option value="">All companies</option>
          {companies.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <button className="rounded bg-blue-600 px-3 py-2 font-medium text-white">Apply filters</button>
      </form>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3">Program</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Modality</th>
              <th className="px-4 py-3">Targets</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.id} className="border-t">
                <td className="px-4 py-3">
                  <Link className="text-blue-700 hover:underline" href={`/programs/${program.slug}`}>
                    {program.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{program.company.name}</td>
                <td className="px-4 py-3">{program.modality.name}</td>
                <td className="px-4 py-3">
                  {program.programTargets.map((pt) => pt.target.name).join(", ") || "—"}
                </td>
              </tr>
            ))}
            {programs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No programs match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
