import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  filename?: string;
  quality?: number;
  scale?: number;
}

/**
 * Capture an HTML DOM element and save it as a high-quality multi-page or single-page PDF
 */
export async function generatePDFFromElement(
  element: HTMLElement,
  options: PDFExportOptions = {}
): Promise<void> {
  const {
    filename = 'rapport_session.pdf',
    scale = 2,
  } = options;

  // Capture element using html2canvas with optimal settings
  const canvas = await html2canvas(element, {
    scale: scale,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    onclone: (clonedDoc) => {
      // Ensure all elements in the cloned document are visible
      const clonedEl = clonedDoc.getElementById(element.id);
      if (clonedEl) {
        clonedEl.style.display = 'block';
        clonedEl.style.visibility = 'visible';
      }
    }
  });

  const imgData = canvas.toDataURL('image/png', 1.0);
  
  // A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  
  // Calculate total height of the image on the PDF page
  const totalImgHeightOnPdf = (canvasHeight * pdfWidth) / canvasWidth;

  // If the content fits in one page or slightly more
  if (totalImgHeightOnPdf <= pdfHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, totalImgHeightOnPdf);
  } else {
    // Multi-page slicing
    let heightLeft = totalImgHeightOnPdf;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalImgHeightOnPdf);
    heightLeft -= pdfHeight;

    // Additional pages
    while (heightLeft > 0) {
      position = position - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalImgHeightOnPdf);
      heightLeft -= pdfHeight;
    }
  }

  // Save the PDF
  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}
