export type ExportColumn<T> = {
  header: string;
  value: (row: T) => string | number;
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export function exportToCsv<T>(
  filename: string,
  columns: ExportColumn<T>[],
  rows: T[]
) {
  const header = columns.map((c) => escapeCsv(c.header)).join(",");
  const lines = rows.map((row) => columns.map((c) => escapeCsv(c.value(row))).join(","));
  const csv = [header, ...lines].join("\n");
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), filename.endsWith(".csv") ? filename : `${filename}.csv`);
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

/** Minimal multi-page text PDF (no external dependency). */
export function exportToPdf<T>(
  filename: string,
  title: string,
  columns: ExportColumn<T>[],
  rows: T[]
) {
  const lines: string[] = [title, ""];
  const headerLine = columns.map((c) => c.header).join(" | ");
  lines.push(headerLine);
  lines.push("-".repeat(Math.min(headerLine.length, 90)));

  rows.forEach((row) => {
    lines.push(columns.map((c) => String(c.value(row))).join(" | "));
  });

  if (rows.length === 0) {
    lines.push("(No records)");
  }

  const contentLines = lines.flatMap((line) => {
    const chunks: string[] = [];
    const text = line || " ";
    for (let i = 0; i < text.length; i += 95) {
      chunks.push(text.slice(i, i + 95));
    }
    return chunks.length ? chunks : [" "];
  });

  const pageHeight = 842;
  const marginTop = 50;
  const lineHeight = 14;
  const linesPerPage = Math.floor((pageHeight - marginTop * 2) / lineHeight);
  const pages: string[][] = [];

  for (let i = 0; i < contentLines.length; i += linesPerPage) {
    pages.push(contentLines.slice(i, i + linesPerPage));
  }
  if (pages.length === 0) pages.push([" "]);

  const objects: string[] = [];
  objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  const pageObjectIds = pages.map((_, i) => 3 + i * 2);
  const contentObjectIds = pages.map((_, i) => 4 + i * 2);

  objects.push(
    `2 0 obj\n<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>\nendobj\n`
  );

  pages.forEach((pageLines, pageIndex) => {
    const pageId = pageObjectIds[pageIndex];
    const contentId = contentObjectIds[pageIndex];

    objects.push(
      `${pageId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${3 + pages.length * 2} 0 R >> >> >>\nendobj\n`
    );

    let y = pageHeight - marginTop;
    const streamParts = ["BT", "/F1 10 Tf", "14 TL"];
    pageLines.forEach((line, idx) => {
      if (idx === 0) {
        streamParts.push(`50 ${y} Td`, `(${escapePdfText(line)}) Tj`);
      } else {
        streamParts.push("T*", `(${escapePdfText(line)}) Tj`);
      }
    });
    streamParts.push("ET");
    const stream = streamParts.join("\n");
    objects.push(
      `${contentId} 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`
    );
  });

  const fontId = 3 + pages.length * 2;
  objects.push(
    `${fontId} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`
  );

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  objects.forEach((obj) => {
    offsets.push(pdf.length);
    pdf += obj;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  downloadBlob(new Blob([pdf], { type: "application/pdf" }), filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}
