import { ENQUETES } from "@/lib/enquetes/cases";
import { stagesOf } from "@/lib/enquetes/types";
import HubView from "./HubView";

export default function EnquetesPage() {
  return (
    <HubView
      enquetes={ENQUETES.map((enquete) => {
        const { slug, numero, title, difficulty, pitch, skills } = enquete;
        return { slug, numero, title, difficulty, pitch, skills, stages: stagesOf(enquete).length };
      })}
    />
  );
}
