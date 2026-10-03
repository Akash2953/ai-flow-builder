import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { jsPDF } from "jspdf";

/**
 * Downloads plain text as a file.
 */
export function downloadText(content: string, filename = "output.txt") {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parses markdown-like text lines into docx Paragraphs and downloads as .docx.
 */
export async function downloadDocx(content: string, filename = "tailored_resume.docx") {
  const lines = content.split("\n");
  const paragraphs: Paragraph[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("# ")) {
      paragraphs.push(
        new Paragraph({
          text: trimmed.replace(/^#\s+/, ""),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 },
        })
      );
    } else if (trimmed.startsWith("## ")) {
      paragraphs.push(
        new Paragraph({
          text: trimmed.replace(/^##\s+/, ""),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 180, after: 80 },
        })
      );
    } else if (trimmed.startsWith("### ")) {
      paragraphs.push(
        new Paragraph({
          text: trimmed.replace(/^###\s+/, ""),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 140, after: 60 },
        })
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmed.replace(/^[-*]\s+/, ""),
            }),
          ],
          bullet: { level: 0 },
          spacing: { after: 60 },
        })
      );
    } else if (trimmed.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(trimmed)],
          spacing: { after: 100 },
        })
      );
    } else {
      paragraphs.push(new Paragraph({ spacing: { after: 80 } }));
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs.length > 0 ? paragraphs : [new Paragraph(content)],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads formatted text as a PDF file.
 */
export function downloadPdf(content: string, filename = "tailored_resume.pdf") {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);

  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxLineWidth = pageWidth - margin * 2;
  const splitText = doc.splitTextToSize(content, maxLineWidth);

  let cursorY = 40;
  const lineHeight = 14;
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 0; i < splitText.length; i++) {
    if (cursorY + lineHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }
    doc.text(splitText[i], margin, cursorY);
    cursorY += lineHeight;
  }

  doc.save(filename);
}
