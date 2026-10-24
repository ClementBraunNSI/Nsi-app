import type { Metadata } from "next";
import { GAME_NAME, GAME_TAGLINE } from "@/app/foxtest/academy/meta";

export const metadata: Metadata = {
  title: GAME_NAME,
  description: GAME_TAGLINE,
};

export default function AcademieLayout({ children }: { children: React.ReactNode }) {
  return children;
}
