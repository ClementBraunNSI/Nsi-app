import { redirect } from "next/navigation";

/** L'admin s'ouvre sur « Classes ». */
export default function AdminHomePage() {
  redirect("/admin/classes");
}
