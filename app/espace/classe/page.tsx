import { listMyAnnouncements } from "@/app/actions/announcements";
import { getExtensionTokenDate, getMyClassInfo } from "@/app/actions/classInfo";
import { getRevisionPlans } from "@/app/actions/revisions";
import { MyClassView } from "@/components/class-info/MyClassView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ma classe", robots: { index: false } };

export default async function MyClassPage() {
  const [info, announcements, tokenDate, revisions] = await Promise.all([
    getMyClassInfo(),
    listMyAnnouncements(),
    getExtensionTokenDate(),
    getRevisionPlans(),
  ]);
  return <MyClassView info={info} announcements={announcements} tokenDate={tokenDate} revisions={revisions} now={new Date().toISOString()} />;
}
