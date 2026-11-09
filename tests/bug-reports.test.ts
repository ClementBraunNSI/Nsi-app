import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import { cleanBugPage, describeBrowser, isValidScreenshot } from "../lib/bug-reports";

describe("bug reports", () => {
  it("keeps only the path of a page of the site", () => {
    expect(cleanBugPage("https://www.clementbraun.info/cours/1nsi/python_exercices_boucles?x=1", "https://www.clementbraun.info")).toBe(
      "/cours/1nsi/python_exercices_boucles?x=1",
    );
    expect(cleanBugPage("/defi", "http://localhost:3000")).toBe("/defi");
    expect(cleanBugPage("  ", "http://localhost:3000")).toBe("");
    expect(cleanBugPage("la page des enquêtes")).toBe("la page des enquêtes");
    expect(cleanBugPage("https://autre-site.fr/page", "https://www.clementbraun.info")).toBe("https://autre-site.fr/page");
  });

  it("accepts only light image data URLs", () => {
    expect(isValidScreenshot(null)).toBe(true);
    expect(isValidScreenshot("data:image/jpeg;base64,/9j/4AAQSkZJRg==")).toBe(true);
    expect(isValidScreenshot("data:text/html;base64,PGgxPg==")).toBe(false);
    expect(isValidScreenshot("javascript:alert(1)")).toBe(false);
    expect(isValidScreenshot(`data:image/png;base64,${"A".repeat(2_000_000)}`)).toBe(false);
  });

  it("describes the browser in a few words", () => {
    expect(describeBrowser("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36")).toBe("Chrome 130 · Windows");
    expect(describeBrowser("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1")).toBe("Safari · iPhone");
    expect(describeBrowser("Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0")).toBe("Firefox 131 · Linux");
    expect(describeBrowser("")).toBe("Navigateur inconnu");
  });

  it("has its button illustration", () => {
    expect(fs.existsSync(path.join(process.cwd(), "public", "images", "fox_bug.png"))).toBe(true);
  });
});
