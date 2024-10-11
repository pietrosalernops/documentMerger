import { PDFDocument } from 'pdf-lib';

export const mergeFiles = async (frontFile, backFile, compression) => {
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

      const width = image.width * (compression / 100); 
      const height = image.height * (compression / 100);
      
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
  return new Blob([pdfBytes], { type: 'application/pdf' });
};