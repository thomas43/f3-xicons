import { prisma } from "@/lib/prisma";

export default async function ExiconPage() {
  const exiconEntries = await prisma.xicon.findMany({
    where: { type: "exicon" },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Exicon</h1>
      <ul className="space-y-4">
        {exiconEntries.map((entry) => (
          <li key={entry.id} className="border-b pb-4">
            <h2 className="text-xl font-semibold">{entry.name}</h2>
            <p className="text-gray-700 mb-2">{entry.description}</p>

            {entry.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-gray-200 text-sm px-2 py-1 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
