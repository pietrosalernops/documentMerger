import React, { useState } from 'react';
import { mergeFiles } from './utils/pdfUtils';
import FileUploader from './components/FileUploader';

const App = () => {
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [compression, setCompression] = useState(100);

  const handleMerge = async (frontFile, backFile) => {
    const mergedPdfBlob = await mergeFiles(frontFile, backFile, compression);
    const mergedPdfUrl = URL.createObjectURL(mergedPdfBlob);
    setMergedPdfUrl(mergedPdfUrl);
  };

  return (
    <div className="container mt-5">
      <FileUploader 
        onFilesSelected={handleMerge} 
        mergedPdfUrl={mergedPdfUrl} 
        setMergedPdfUrl={setMergedPdfUrl}
        setCompression={setCompression}
      />
    </div>
  );
};

export default App;