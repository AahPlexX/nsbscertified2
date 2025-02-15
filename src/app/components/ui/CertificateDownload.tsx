
"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { Button } from "./Button";

interface CertificateDownloadProps {
  studentName: string;
  courseName: string;
  completionDate: Date;
  certificateId: string;
}

export function CertificateDownload({
  studentName,
  courseName,
  completionDate,
  certificateId
}: CertificateDownloadProps): JSX.Element {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCertificate = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([842, 595]); // A4 landscape
      const { width, height } = page.getSize();

      // Get fonts
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Add watermark
      page.drawText('NSBS CERTIFIED', {
        x: width / 2 - 150,
        y: height / 2,
        size: 60,
        font,
        opacity: 0.1,
        rotate: Math.PI / 4,
      });

      // Add certificate content
      page.drawText('CERTIFICATE OF COMPLETION', {
        x: width / 2 - 150,
        y: height - 150,
        size: 24,
        font
      });

      page.drawText('This certifies that', {
        x: width / 2 - 80,
        y: height - 200,
        size: 16,
        font: regularFont
      });

      page.drawText(studentName, {
        x: width / 2 - (studentName.length * 7),
        y: height - 230,
        size: 24,
        font
      });

      page.drawText('has successfully completed', {
        x: width / 2 - 100,
        y: height - 260,
        size: 16,
        font: regularFont
      });

      page.drawText(courseName, {
        x: width / 2 - (courseName.length * 6),
        y: height - 300,
        size: 20,
        font
      });

      const dateString = completionDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      page.drawText(`Issued on ${dateString}`, {
        x: width / 2 - 80,
        y: height - 340,
        size: 14,
        font: regularFont
      });

      page.drawText(`Certificate ID: ${certificateId}`, {
        x: width / 2 - 80,
        y: 60,
        size: 10,
        font: regularFont
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `NSBS-Certificate-${courseName}-${studentName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to generate certificate. Please try again.');
      console.error('Certificate generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}
      <Button
        label={isGenerating ? 'Generating...' : 'Download Certificate'}
        onClick={generateCertificate}
        variant="primary"
        disabled={isGenerating}
      />
    </div>
  );
}
