import { redirect } from "next/navigation";

// Les annonces font partie de la page « Ma classe ».
export default function ClassAnnouncementsPage() {
  redirect("/espace/classe#annonces");
}
