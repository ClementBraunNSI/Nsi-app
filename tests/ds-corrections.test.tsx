import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { checkDsInput, dsRow } from "../lib/ds-corrections";
import { DsMarkdown } from "../components/ds/DsMarkdown";

const base = { title: "Texte de test", classes: ["1NSI1"], visibleAt: "2026-12-01T07:00:00.000Z", subject: "Texte de test", correction: "" };

describe("DS corrections input", () => {
  it("accepts a complete input and cleans the classes", () => {
    expect(checkDsInput(base)).toBeNull();
    expect(dsRow({ ...base, title: "  Texte de test ", classes: [" 1NSI2", "1NSI1", "1NSI2", ""] })).toMatchObject({
      title: "Texte de test",
      classes: ["1NSI1", "1NSI2"],
      visible_at: "2026-12-01T07:00:00.000Z",
    });
  });

  it("refuses a missing title, class, date or text", () => {
    expect(checkDsInput({ ...base, title: "  " })).toMatch(/titre/);
    expect(checkDsInput({ ...base, classes: [" "] })).toMatch(/classe/);
    expect(checkDsInput({ ...base, visibleAt: "" })).toMatch(/date/);
    expect(checkDsInput({ ...base, visibleAt: "pas une date" })).toMatch(/date/);
    expect(checkDsInput({ ...base, subject: " ", correction: "" })).toMatch(/sujet ou la correction/);
    expect(checkDsInput({ ...base, correction: "x".repeat(200001) })).toMatch(/200 000/);
  });
});

describe("DS markdown rendering", () => {
  it("renders tables and coloured python blocks with the course classes", () => {
    const html = renderToStaticMarkup(<DsMarkdown source={"| a | b |\n|---|---|\n| 1 | 2 |\n\n```python\ndef f(x):\n    return x\n```"} />);
    expect(html).toContain("course-prose");
    expect(html).toContain("<table>");
    expect(html).toContain("language-python");
    expect(html).toContain("hljs-keyword");
  });

  it("does not interpret raw HTML", () => {
    const html = renderToStaticMarkup(<DsMarkdown source={'Texte de test <script>alert(1)</script> <img src=x onerror="alert(1)">'} />);
    expect(html).not.toContain("<script");
    expect(html).not.toContain("<img");
  });
});
