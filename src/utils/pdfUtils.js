import { PDFDocument } from 'pdf-lib';
import compressPDF from 'pdf-compressor';

export const mergeFiles = async (frontFile, backFile, imageCompression, pdfCompression) => {
  const pdfDoc = await PDFDocument.create();
  
  const files = [frontFile, backFile];

  for (const file of files) {
    const fileType = file.type;

    if (fileType.includes('image')) {
      const imageBytes = await file.arrayBuffer();

      let image;
      if (fileType.includes('png')) {
        image = await pdfDoc.embedPng(imageBytes);
      } else {
        image = await pdfDoc.embedJpg(imageBytes);
      }

      const width = image.width * (imageCompression / 100); 
      const height = image.height * (imageCompression / 100);
      
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: width,
        height: height,
      });
    } else if (fileType.includes('pdf')) {
      const existingPdfDoc = await PDFDocument.load(await file.arrayBuffer());
      const pages = await pdfDoc.copyPages(existingPdfDoc, existingPdfDoc.getPageIndices());
      pages.forEach((page) => pdfDoc.addPage(page));
    }
  }

  const pdfBytes = await pdfDoc.save();

  const compressedPdfBlob = await compressPDF(new File([pdfBytes], 'merged.pdf', { type: 'application/pdf' }), {
    quality: pdfCompression / 100,
    scale: imageCompression / 100,
  });

  return compressedPdfBlob;
};