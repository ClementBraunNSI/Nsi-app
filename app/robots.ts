import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/espace", "/connexion", "/exercice"],
    },
    sitemap: "https://www.clementbraun.info/sitemap.xml",
  };
}
