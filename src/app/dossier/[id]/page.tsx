import { dossiers } from "@/data/dossiers";
import { dossierDetail } from "@/data/detail";
import { DossierSuite } from "@/components/dossier/DossierSuite";

export function generateStaticParams() {
  return dossiers.map((d) => ({ id: d.id }));
}

export default function DossierPage({ params }: { params: { id: string } }) {
  const row = dossiers.find((d) => d.id === params.id) ?? dossiers[0];
  // The full detail payload is modeled for M-127060 (Yu Shang Yu); other
  // dossiers reuse the same rich detail with their identity overlaid.
  const index = dossiers.findIndex((d) => d.id === row.id);
  return (
    <DossierSuite
      detail={dossierDetail}
      row={row}
      caseNumber={index + 1}
      caseTotal={186}
    />
  );
}
