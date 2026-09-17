import Papa from "papaparse";

export type CsvRow = Record<string, string>;

export type ParseCsvOptions = {
  header?: boolean;
  delimiter?: string;
  skipEmptyLines?: boolean;
};

export function parseCsv(
  text: string,
  options: ParseCsvOptions = {},
): CsvRow[] {
  const result = Papa.parse<CsvRow>(text, {
    header: options.header ?? true,
    delimiter: options.delimiter,
    skipEmptyLines: options.skipEmptyLines ?? true,
    transformHeader: (header) => header.trim(),
  });

  if (result.errors.length > 0) {
    const message = result.errors.map((error) => error.message).join("; ");
    throw new Error(message || "Erreur lors de la lecture du CSV.");
  }

  return result.data.filter((row) =>
    Object.values(row).some((value) => value.trim() !== ""),
  );
}

export function exportCsv(rows: Record<string, unknown>[], filename: string): void {
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
