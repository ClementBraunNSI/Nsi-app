import Image from "next/image";
import { MousePointer2 } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./InteractiveShell.module.css";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function InteractiveShell({
  title,
  description = "Observe, manipule, puis explique ce que tu constates.",
  children,
}: Props) {
  return (
    <section className={`${styles.shell} not-prose`}>
      <header className={styles.header}>
        <div className={styles.fox}>
          <Image
            src="/images/interactive/fox-guide.png"
            alt=""
            fill
            className="object-contain"
            sizes="52px"
          />
        </div>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Laboratoire du renard</p>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
        <span className={styles.badge}>
          <MousePointer2 size={12} />
          À toi de jouer
        </span>
      </header>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
