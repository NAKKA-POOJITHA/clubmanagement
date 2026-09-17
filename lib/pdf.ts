import { jsPDF } from 'jspdf';

export interface CertificateData {
  studentName: string;
  eventName: string;
  clubName: string;
  date: string;
  certificateNumber: string;
  qrCodeUrl?: string;
}

export function generateCertificatePDF(data: CertificateData): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // Background tint
  doc.setFillColor(248, 247, 255); // primary-50
  doc.rect(0, 0, width, height, 'F');

  // Outer Border
  doc.setDrawColor(115, 96, 232); // primary-600
  doc.setLineWidth(2);
  doc.rect(10, 10, width - 20, height - 20);

  // Inner thin border
  doc.setDrawColor(201, 191, 252); // primary-300
  doc.setLineWidth(0.5);
  doc.rect(14, 14, width - 28, height - 28);

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(35, 35, 56); // ink-DEFAULT
  doc.text('CERTIFICATE OF PARTICIPATION', width / 2, 45, { align: 'center' });

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(139, 141, 168); // ink-muted
  doc.text('THIS IS PROUDLY PRESENTED TO', width / 2, 60, { align: 'center' });

  // Student Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(91, 72, 199); // primary-700
  doc.text(data.studentName.toUpperCase(), width / 2, 80, { align: 'center' });

  // Decorative line under name
  doc.setDrawColor(115, 96, 232);
  doc.setLineWidth(1);
  doc.line(width / 2 - 60, 85, width / 2 + 60, 85);

  // Body text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(35, 35, 56);
  const bodyText = `for successfully attending and actively participating in the workshop / event`;
  doc.text(bodyText, width / 2, 105, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(115, 96, 232);
  doc.text(`"${data.eventName}"`, width / 2, 120, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(139, 141, 168);
  doc.text(`Organized by ${data.clubName} on ${data.date}`, width / 2, 133, { align: 'center' });

  // Signatures
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(35, 35, 56);
  doc.text('Nakka Poojitha', 45, 165);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(139, 141, 168);
  doc.text('Super Admin / Faculty Head', 45, 172);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(35, 35, 56);
  doc.text('Dr. Rajeshwari Kulkarni', width - 75, 165);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(139, 141, 168);
  doc.text('Faculty Coordinator', width - 75, 172);

  // Verification & Serial
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(115, 96, 232);
  doc.text(`CERTIFICATE ID: ${data.certificateNumber}`, width / 2, 185, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(139, 141, 168);
  doc.text(`Verify online at: /verify/${data.certificateNumber}`, width / 2, 190, { align: 'center' });

  doc.save(`Certificate_${data.certificateNumber}.pdf`);
}

export function generateReportPDF(title: string, columns: string[], rows: any[][], filename: string = 'Report.pdf') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const width = doc.internal.pageSize.getWidth();

  doc.setFillColor(115, 96, 232);
  doc.rect(0, 0, width, 25, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(title, 15, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(139, 141, 168);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 15, 32);

  let y = 42;
  // Header row
  doc.setFillColor(239, 235, 255);
  doc.rect(15, y - 5, width - 30, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(91, 72, 199);

  const colWidth = (width - 30) / columns.length;
  columns.forEach((col, i) => {
    doc.text(col, 17 + i * colWidth, y);
  });

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(35, 35, 56);

  rows.forEach((row, rIdx) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    if (rIdx % 2 === 1) {
      doc.setFillColor(248, 247, 255);
      doc.rect(15, y - 5, width - 30, 7, 'F');
    }
    row.forEach((cell, cIdx) => {
      doc.text(String(cell || '-'), 17 + cIdx * colWidth, y);
    });
    y += 7;
  });

  doc.save(filename);
}
