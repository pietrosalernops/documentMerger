import { PDFDocument } from 'pdf-lib';

export const mergeFiles = async (frontFile, backFile) => {
  const pdfDoc = await PDFDocument.create();
  
  const files = [frontFile, backFile];
  
  for (const file of files) {
    const fileType = file.type;

    if (fileType.includes('image')) {
      const imageBytes = await file.arrayBuffer();
      const image = fileType.includes('png') 
        ? await pdfDoc.embedPng(imageBytes) 
        : await pdfDoc.embedJpg(imageBytes);
        
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
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