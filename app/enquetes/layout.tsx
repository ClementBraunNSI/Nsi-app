import type { Metadata } from "next";
// Mise en page de l'atelier pour les écrans de salle de classe (règles préfixées par .enq-atelier).
import "./atelier.css";

export const metadata: Metadata = {
  title: "Enquêtes de la forêt",
  description: "Résous des enquêtes dans la forêt du renard en interrogeant des données : avec des blocs, en Python ou en SQL.",
};

export default function EnquetesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
