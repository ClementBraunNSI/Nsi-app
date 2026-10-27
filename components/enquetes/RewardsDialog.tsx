"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { EnqueteReward } from "@/lib/enquetes/rewards";
import { AchievementMark } from "@/components/fox/AchievementMark";

/** Badges et succès gagnés par une accusation juste. */
export default function RewardsDialog({ rewards, onClose }: { rewards: EnqueteReward[]; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const badges = rewards.filter((reward) => reward.kind === "badge").length;
  const succes = rewards.length - badges;
  const heading = [badges ? (badges > 1 ? `${badges} badges` : "Nouveau badge") : "", succes ? (succes > 1 ? `${succes} succès` : "Nouveau succès") : ""]
    .filter(Boolean)
    .join(" et ");

  return (
    <div className="enq-reward-backdrop" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="enq-reward-title"
        className="enq-reward"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="enq-reward-close" onClick={onClose} aria-label="Fermer">
          <X size={18} aria-hidden />
        </button>
        <p className="enq-reward-kicker">{heading}</p>
        <h2 id="enq-reward-title">Le renard garde la trace de l'enquête</h2>
        <ul className="enq-reward-list">
          {rewards.map((reward) => (
            <li key={reward.id}>
              {reward.image ? (
                <img src={reward.image} alt="" width={88} height={88} className="enq-reward-art" />
              ) : (
                <AchievementMark id={reward.id} title={reward.title} size={88} />
              )}
              <div>
                <p className="enq-reward-kind">{reward.kind === "badge" ? "Badge" : "Succès"}</p>
                <p className="enq-reward-name">{reward.title}</p>
                <p className="enq-reward-text">{reward.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="enq-reward-note">Badges et succès sont visibles dans l'espace élève.</p>
        <button type="button" className="enq-reward-ok" onClick={onClose}>
          Continuer
        </button>
      </div>
    </div>
  );
}
