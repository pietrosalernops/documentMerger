import React, { useState, useRef } from 'react';
import './FileUploader.css';

const FileUploader = ({ onFilesSelected, mergedPdfUrl, setMergedPdfUrl, setCompression }) => {
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [compressionValue, setCompressionValue] = useState(100);

  const allowedFileTypes = ['image/png', 'image/jpeg', 'application/pdf'];

  const frontFileInputRef = useRef(null);
  const backFileInputRef = useRef(null);

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];

    if (file && allowedFileTypes.includes(file.type)) {
      if (file.size > 5 * 1024 * 1024) { //5MB
        setFile(null);
        setErrorMessage('Errore: Il file deve essere di massimo 5MB.');
        return;
      }
      setFile(file);
      setErrorMessage('');
      console.log("File caricato:", file);
    } else {
      setFile(null);
      setErrorMessage('Errore: Il file deve essere in formato PNG, JPEG o PDF.');
    }
  };

  const handleMergeClick = () => {
    if (frontFile && backFile) {
      onFilesSelected(frontFile, backFile);
    } else {
      setErrorMessage("Carica entrambi i file.");
    }
  };

  const handleRemoveFrontFile = () => {
    setFrontFile(null);
    setMergedPdfUrl(null);
    if (frontFileInputRef.current) {
      frontFileInputRef.current.value = '';
    }
  };

  const handleRemoveBackFile = () => {
    setBackFile(null);
    setMergedPdfUrl(null);
    if (backFileInputRef.current) {
      backFileInputRef.current.value = '';
    }
  };

  const handleCompressionChange = (event) => {
    const value = Number(event.target.value);
    setCompressionValue(value);
    setCompression(value);
  };

  return (
    <div className="file-uploader-container container mt-4">
      <h2 className="text-center mb-4">Carica documento d'identità</h2>
      <p className="text-center">Carica una copia leggibile e a colori del tuo documento di identità (fronte e retro).</p>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      
      <div className="highlight mb-3 text-center">
        Puoi caricare un file unico oppure due file separati e, se stai utilizzando uno smartphone, puoi anche scattare
        direttamente una foto al tuo documento! Puoi caricare file .pdf, .png, .jpeg, per un massimo di 5MB.
      </div>
      
      <div className="upload-area mb-3">
        <div className="mb-3">
          <label className="form-label">Carica il fronte del documento (PNG, JPEG o PDF)</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => handleFileChange(e, setFrontFile)}
            ref={frontFileInputRef} 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Carica il retro del documento (PNG, JPEG o PDF)</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => handleFileChange(e, setBackFile)}
            ref={backFileInputRef}
          />
        </div>
      </div>

      <div className="mb-3 text-center">
        <label className="form-label">Seleziona la compressione (%)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={compressionValue}
          onChange={handleCompressionChange}
        />
        <span>{compressionValue}%</span>
      </div>

      <div className="row text-center mb-4">
        <div className={`col-md-6 mx-0 ${mergedPdfUrl ? "align-right" : "align-center"}`}>
          <button className="btn btn-primary" onClick={handleMergeClick} disabled={!frontFile || !backFile}>
            Carica
          </button>
        </div>
        {mergedPdfUrl && (
          <div className="col-md-6 mx-0 align-left">
            <a href={mergedPdfUrl} download="merged_document.pdf" className="btn btn-success">
              Scarica documento unito
            </a>
          </div>
        )}
      </div>

      <div className="uploaded-files mt-4">
        {frontFile && (
          <div className="uploaded-file">
            <span className="file-name">{frontFile.name}</span>
            <button className="btn btn-link" onClick={handleRemoveFrontFile}>X</button>
          </div>
        )}
        {backFile && (
          <div className="uploaded-file">
            <span className="file-name">{backFile.name}</span>
            <button className="btn btn-link" onClick={handleRemoveBackFile}>X</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;