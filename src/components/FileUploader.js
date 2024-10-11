import React, { useState } from 'react';
import './FileUploader.css';

const FileUploader = ({ onFilesSelected, mergedPdfUrl }) => {
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const allowedFileTypes = ['image/png', 'image/jpeg', 'application/pdf'];

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];

    if (file && allowedFileTypes.includes(file.type)) {
      setFile(file);
      setErrorMessage('');
    } else {
      setFile(null);
      setErrorMessage('Errore: Il file deve essere in formato PNG, JPEG o PDF.');
    }
  };

  const handleMergeClick = () => {
    if (frontFile && backFile) {
      onFilesSelected(frontFile, backFile);
    } else {
      alert("Carica entrambi i file.");
    }
  };

  const handleRemoveFrontFile = () => {
    setFrontFile(null);
  };

  const handleRemoveBackFile = () => {
    setBackFile(null);
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
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Carica il retro del documento (PNG, JPEG o PDF)</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => handleFileChange(e, setBackFile)}
          />
        </div>
      </div>

      <div className="row text-center mb-4">
        <div className={`col-md-6 mx-0 ${mergedPdfUrl ? "align-right" : "align-center"}`}>
          <button className="btn btn-primary" onClick={handleMergeClick} disabled={!frontFile || !backFile}>
            Carica
          </button>
        </div>
        <div className={`col-md-6 mx-0 ${mergedPdfUrl ? "align-left" : "d-none"}`}>
          <a href={mergedPdfUrl} download="merged_document.pdf" className="btn btn-success">
            Scarica documento unito
          </a>
        </div>
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
