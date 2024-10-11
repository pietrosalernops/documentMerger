import React, { useState } from 'react';
import { mergeFiles } from './utils/pdfUtils';
import FileUploader from './components/FileUploader';

const App = () => {
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [imageCompression, setImageCompression] = useState(100);
  const [pdfCompression, setPdfCompression] = useState(100);

  const handleMerge = async (frontFile, backFile) => {
    const mergedPdfBlob = await mergeFiles(frontFile, backFile, imageCompression, pdfCompression);
    const mergedPdfUrl = URL.createObjectURL(mergedPdfBlob);
    setMergedPdfUrl(mergedPdfUrl);
  };

  return (
    <div className="container mt-5">
      <FileUploader 
        onFilesSelected={handleMerge} 
        mergedPdfUrl={mergedPdfUrl} 
        setMergedPdfUrl={setMergedPdfUrl}
        setImageCompression={setImageCompression}
        setPdfCompression={setPdfCompression}
      />
    </div>
  );
};

export default App;