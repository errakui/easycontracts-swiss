import { jsPDF } from "jspdf";

// Funzione per pulire markdown dal testo
function cleanMarkdown(text: string): string {
  return text
    // Rimuove headers markdown (# ## ### ecc)
    .replace(/^#{1,6}\s+/gm, '')
    // Rimuove **bold**
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // Rimuove *italic*
    .replace(/\*(.*?)\*/g, '$1')
    // Rimuove __bold__
    .replace(/__(.*?)__/g, '$1')
    // Rimuove _italic_
    .replace(/_(.*?)_/g, '$1')
    // Rimuove `code`
    .replace(/`(.*?)`/g, '$1')
    // Rimuove ```code blocks```
    .replace(/```[\s\S]*?```/g, '')
    // Rimuove ~~strikethrough~~
    .replace(/~~(.*?)~~/g, '$1')
    // Rimuove [link](url) -> link
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Rimuove bullet points markdown (- * +) ma mantiene il testo
    .replace(/^[\s]*[-*+]\s+/gm, '• ')
    // Rimuove numeri markdown (1. 2. ecc)
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Rimuove > blockquotes
    .replace(/^>\s+/gm, '')
    // Rimuove --- o *** (linee orizzontali)
    .replace(/^[-*_]{3,}$/gm, '═'.repeat(50))
    // Rimuove spazi multipli
    .replace(/  +/g, ' ')
    // Rimuove righe vuote multiple
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

interface ContractData {
  typeName: string;
  party1Name: string;
  party1Email?: string;
  party1Vat?: string;
  party1Address?: string;
  party2Name: string;
  party2Email?: string;
  party2Vat?: string;
  party2Address?: string;
  amount: string;
  paymentTerms?: string;
  paymentMethod?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  description: string;
  deliverables?: string;
  selectedClauses: string[];
  customRequests?: string;
  generatedContent: string;
  hasWatermark: boolean;
}

export function generateContractPDF(data: ContractData): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Colori
  const primaryColor = [79, 70, 229]; // Indigo
  const textColor = [31, 41, 55]; // Gray-800
  const lightGray = [156, 163, 175]; // Gray-400

  // Helper per nuova pagina
  const checkNewPage = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      if (data.hasWatermark) {
        addWatermark();
      }
    }
  };

  // Watermark per FREE
  const addWatermark = () => {
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(60);
    doc.setFont("helvetica", "bold");
    
    // Watermark diagonale
    doc.text("DEMO - easycontracts.ai", pageWidth / 2, pageHeight / 2, {
      angle: 45,
      align: "center",
    });
    
    // Footer watermark
    doc.setFontSize(10);
    doc.text(
      "⚠️ Versione DEMO - Passa a PRO per rimuovere il watermark: easycontracts.ai",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  };

  // Aggiungi watermark se FREE
  if (data.hasWatermark) {
    addWatermark();
  }

  // === HEADER ===
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(data.typeName.toUpperCase(), pageWidth / 2, 18, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const today = new Date().toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(`Generato il ${today}`, pageWidth / 2, 28, { align: "center" });

  y = 50;
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);

  // === TRA LE PARTI ===
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("TRA LE PARTI", margin, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  // Parte 1
  doc.setFont("helvetica", "bold");
  doc.text("PARTE 1 (Committente/Cliente):", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text(`Nome: ${data.party1Name}`, margin + 5, y);
  y += 5;
  if (data.party1Email) {
    doc.text(`Email: ${data.party1Email}`, margin + 5, y);
    y += 5;
  }
  if (data.party1Vat) {
    doc.text(`P.IVA/CF: ${data.party1Vat}`, margin + 5, y);
    y += 5;
  }
  if (data.party1Address) {
    doc.text(`Indirizzo: ${data.party1Address}`, margin + 5, y);
    y += 5;
  }
  y += 5;

  // Parte 2
  doc.setFont("helvetica", "bold");
  doc.text("PARTE 2 (Fornitore/Prestatore):", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text(`Nome: ${data.party2Name}`, margin + 5, y);
  y += 5;
  if (data.party2Email) {
    doc.text(`Email: ${data.party2Email}`, margin + 5, y);
    y += 5;
  }
  if (data.party2Vat) {
    doc.text(`P.IVA/CF: ${data.party2Vat}`, margin + 5, y);
    y += 5;
  }
  if (data.party2Address) {
    doc.text(`Indirizzo: ${data.party2Address}`, margin + 5, y);
    y += 5;
  }
  y += 10;

  // Linea separatrice
  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // === PREMESSA ===
  checkNewPage(30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("PREMESSO CHE", margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const descLines = doc.splitTextToSize(data.description, contentWidth);
  doc.text(descLines, margin, y);
  y += descLines.length * 5 + 10;

  // === CONTENUTO GENERATO DA AI ===
  checkNewPage(20);
  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("ARTICOLI DEL CONTRATTO", margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  // Pulisci markdown e splitta il contenuto generato in linee
  const cleanedContent = cleanMarkdown(data.generatedContent);
  const contentLines = cleanedContent.split("\n");
  
  for (const line of contentLines) {
    checkNewPage(8);
    
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      y += 3;
      continue;
    }

    // Formattazione speciale per titoli articoli
    if (trimmedLine.match(/^(Art\.|Articolo|ARTICOLO)/i)) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
    }

    const wrappedLines = doc.splitTextToSize(trimmedLine, contentWidth);
    for (const wLine of wrappedLines) {
      checkNewPage(6);
      doc.text(wLine, margin, y);
      y += 5;
    }
    y += 2;
  }

  // === DETTAGLI ECONOMICI ===
  checkNewPage(40);
  y += 5;
  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("DETTAGLI ECONOMICI E TEMPORALI", margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const details = [
    ["Compenso", `€ ${data.amount}`],
    ["Termini pagamento", data.paymentTerms || "Da concordare"],
    ["Metodo pagamento", data.paymentMethod || "Da concordare"],
    ["Durata", data.duration || "Da concordare"],
    ["Data inizio", data.startDate ? new Date(data.startDate).toLocaleDateString("it-IT") : "Da concordare"],
    ["Data fine", data.endDate ? new Date(data.endDate).toLocaleDateString("it-IT") : "Da concordare"],
  ];

  for (const [label, value] of details) {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, margin + 45, y);
    y += 6;
  }

  // === CLAUSOLE SELEZIONATE ===
  if (data.selectedClauses && data.selectedClauses.length > 0) {
    checkNewPage(30);
    y += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("CLAUSOLE AGGIUNTIVE", margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    for (const clause of data.selectedClauses) {
      checkNewPage(6);
      doc.text(`• ${clause}`, margin + 5, y);
      y += 6;
    }
  }

  // === NOTE PERSONALIZZATE ===
  if (data.customRequests) {
    checkNewPage(30);
    y += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("NOTE E RICHIESTE SPECIFICHE", margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const customLines = doc.splitTextToSize(data.customRequests, contentWidth);
    doc.text(customLines, margin, y);
    y += customLines.length * 5;
  }

  // === FIRME ===
  checkNewPage(60);
  y += 15;
  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("FIRME", margin, y);
  y += 15;

  // Due colonne per le firme
  const col1X = margin;
  const col2X = pageWidth / 2 + 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text("PARTE 1", col1X, y);
  doc.text("PARTE 2", col2X, y);
  y += 8;

  doc.text(data.party1Name, col1X, y);
  doc.text(data.party2Name, col2X, y);
  y += 20;

  // Linee firma
  doc.line(col1X, y, col1X + 60, y);
  doc.line(col2X, y, col2X + 60, y);
  y += 5;

  doc.setFontSize(8);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.text("Firma", col1X, y);
  doc.text("Firma", col2X, y);
  y += 15;

  doc.text(`Data: ${today}`, col1X, y);
  doc.text(`Data: ${today}`, col2X, y);

  // === FOOTER ===
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    
    if (!data.hasWatermark) {
      doc.text(
        `Generato con easycontracts.ai | Pagina ${i} di ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    }
  }

  return doc;
}

export function downloadContractPDF(data: ContractData, filename: string): void {
  const doc = generateContractPDF(data);
  doc.save(`${filename}.pdf`);
}

