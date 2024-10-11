import { PDFDocument } from 'pdf-lib';
import PDFMerger from 'pdf-merger-js/browser';

export const mergeFiles = async (frontFile, backFile) => {
  const merger = new PDFMerger();
  const pdfDoc = await PDFDocument.create();

  const processFile = async (file) => {
    const fileType = file.type;

    if (fileType.includes('pdf')) {
      await merger.add(file);
    } else if (fileType.includes('image')) {
      const imageBytes = await file.arrayBuffer();
      let image;

      if (fileType.includes('png')) {
        image = await pdfDoc.embedPng(imageBytes);
      } else if (fileType.includes('jpeg') || fileType.includes('jpg')) {
        image = await pdfDoc.embedJpg(imageBytes);
      }

      const page = pdfDoc.addPage();
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
      });
    }
  };

  await processFile(frontFile);
  await processFile(backFile);

  const mergedPdfBlob = await merger.saveAsBlob();
  return mergedPdfBlob;
};
