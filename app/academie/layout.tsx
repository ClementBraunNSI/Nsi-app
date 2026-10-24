import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le renard dans le poulailler",
};

export default function AcademieLayout({ children }: { children: React.ReactNode }) {
  return children;
}
