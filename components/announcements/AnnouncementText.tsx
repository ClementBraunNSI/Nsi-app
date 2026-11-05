import { splitLinks } from "@/lib/announcements";

/** Texte d'une annonce : retours à la ligne conservés, adresses http(s) cliquables. */
export function AnnouncementText({ body }: { body: string }) {
  return (
    <p className="annonce-text">
      {splitLinks(body).map((part, index) =>
        part.type === "link" ? (
          <a key={index} href={part.value} target="_blank" rel="noopener noreferrer nofollow">
            {part.value}
          </a>
        ) : (
          <span key={index}>{part.value}</span>
        ),
      )}
    </p>
  );
}
