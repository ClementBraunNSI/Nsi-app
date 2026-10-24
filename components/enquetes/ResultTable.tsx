import type { QueryResult } from "@/lib/enquetes/engines";

const MAX_ROWS = 200;

export function ResultTable({ result }: { result: QueryResult }) {
  const shown = result.rows.slice(0, MAX_ROWS);
  const total = result.total ?? result.rows.length;
  return (
    <div className="enq-table">
      <p className="enq-table-count">
        {total} ligne{total > 1 ? "s" : ""}
        {total > shown.length ? ` (les ${shown.length} premières sont affichées)` : ""}
      </p>
      <div className="enq-table-scroll">
        <table>
          <thead>
            <tr>
              {result.columns.map((column, index) => (
                <th key={`${column}-${index}`}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell === null ? <em>vide</em> : String(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
