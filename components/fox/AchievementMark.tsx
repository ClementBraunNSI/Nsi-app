import { Trophy } from "lucide-react";
import { ACHIEVEMENTS, achievementImage } from "@/lib/achievements";
import { sheetCourseIdFromAchievement } from "@/lib/sheet-badge-art";
import { SheetBadgeFox } from "@/components/fox/SheetBadgeFox";
import { enqueteAchievement } from "@/lib/enquetes/rewards";

export function AchievementMark({
  id,
  title,
  earned = true,
  size = 56,
}: {
  id: string;
  title: string;
  earned?: boolean;
  size?: number;
}) {
  const courseId = sheetCourseIdFromAchievement(id);
  if (courseId) {
    return <SheetBadgeFox courseId={courseId} title={title} earned={earned} size={size} />;
  }

  const image = enqueteAchievement(id)?.image ?? achievementImage(id);
  if (image) {
    return (
      <img
        src={image}
        alt={earned ? `Succès ${title}` : `Succès ${title}, pas encore obtenu`}
        width={size}
        height={size}
        draggable={false}
        className={`shrink-0 object-contain ${earned ? "" : "opacity-60 grayscale"}`}
        style={{ width: size, height: size }}
      />
    );
  }

  const known = ACHIEVEMENTS.find((achievement) => achievement.id === id);
  const Icon = known?.icon ?? Trophy;
  const tone = earned ? known?.color || "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-400 grayscale opacity-60";
  const label = earned ? `Succès ${title}` : `Succès ${title}, pas encore obtenu`;

  return (
    <div
      role="img"
      aria-label={label}
      className={`flex shrink-0 items-center justify-center rounded-2xl ${tone}`}
      style={{ width: size, height: size }}
    >
      <Icon size={Math.round(size * 0.42)} aria-hidden />
    </div>
  );
}
