import { ENQUETES } from "@/lib/enquetes/cases";
import HubView from "./HubView";

export default function EnquetesPage() {
  return (
    <HubView
      enquetes={ENQUETES.map(({ slug, numero, title, difficulty, pitch, skills }) => ({ slug, numero, title, difficulty, pitch, skills }))}
    />
  );
}
