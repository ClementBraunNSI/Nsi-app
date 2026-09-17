import { jsPDF } from "jspdf";

export type ExportTextPdfOptions = {
  title?: string;
  filename?: string;
  fontSize?: number;
  lineHeight?: number;
  margin?: number;
};

export function exportTextPdf(
  text: string,
  options: ExportTextPdfOptions = {},
): void {
  const {
    title,
    filename = "export.pdf",
    fontSize = 11,
    lineHeight = 1.4,
    margin = 14,
  } = options;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const addPageIfNeeded = (blockHeight: number) => {
    if (y + blockHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  if (title) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize + 3);
    const titleLines = doc.splitTextToSize(title, maxWidth);
    addPageIfNeeded(titleLines.length * fontSize * 0.5);
    doc.text(titleLines, margin, y);
    y += titleLines.length * fontSize * 0.5 + 4;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);

  const paragraphs = text.split(/\n/);
  for (const paragraph of paragraphs) {
    const lines = doc.splitTextToSize(paragraph || " ", maxWidth);
    const blockHeight = lines.length * fontSize * 0.35 * lineHeight;
    addPageIfNeeded(blockHeight);
    doc.text(lines, margin, y);
    y += blockHeight;
  }

  doc.save(filename);
}
