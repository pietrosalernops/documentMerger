import { PDFDocument } from 'pdf-lib';
import PDFMerger from 'pdf-merger-js/browser';

export const mergeFiles = async (frontFile, backFile) => {
  const frontFileType = frontFile.type;
  const backFileType = backFile.type;
  
  const merger = new PDFMerger();
  const pdfDoc = await PDFDocument.create(); 

  if (frontFileType.includes('pdf')) {
    await merger.add(frontFile); 
  } else if (frontFileType.includes('image')) {
    const frontImage = await pdfDoc.embedPng(await frontFile.arrayBuffer());
    const frontPage = pdfDoc.addPage();
    frontPage.drawImage(frontImage, { x: 0, y: 0, width: frontPage.getWidth(), height: frontPage.getHeight() });
  }

  if (backFileType.includes('pdf')) {
    await merger.add(backFile); 
  } else if (backFileType.includes('image')) {
    const backImage = await pdfDoc.embedPng(await backFile.arrayBuffer());
    const backPage = pdfDoc.addPage();
    backPage.drawImage(backImage, { x: 0, y: 0, width: backPage.getWidth(), height: backPage.getHeight() });
  }

  if (frontFileType.includes('pdf') || backFileType.includes('pdf')) {
    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    if (frontFileType.includes('pdf')) {
      await merger.add(pdfBlob); 
    } else if (backFileType.includes('pdf')) {
      await merger.add(pdfBlob); 
    }

    const mergedPdfBlob = await merger.saveAsBlob();
    return mergedPdfBlob;
  } else {
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  }
};
