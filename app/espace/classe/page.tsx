import { listMyAnnouncements } from "@/app/actions/announcements";
import { getExtensionTokenDate, getMyClassInfo } from "@/app/actions/classInfo";
import { MyClassView } from "@/components/class-info/MyClassView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ma classe", robots: { index: false } };

export default async function MyClassPage() {
  const [info, announcements, tokenDate] = await Promise.all([getMyClassInfo(), listMyAnnouncements(), getExtensionTokenDate()]);
  return <MyClassView info={info} announcements={announcements} tokenDate={tokenDate} />;
}
