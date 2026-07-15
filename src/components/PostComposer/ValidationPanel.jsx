import React from 'react';
import './PostComposer.css';

const ValidationPanel = ({ 
  errors, 
  warnings, 
  isValid, 
  charCount, 
  maxChars,
  photoCount,
  maxPhotos 
}) => {
  if (errors.length === 0 && warnings.length === 0 && charCount === 0) {
    return null;
  }

  return (
    <div className={`validation-panel ${isValid ? 'valid' : 'invalid'}`}>
      <div className="validation-header">
        <span className="validation-icon">
          {isValid ? '✅' : '❌'}
        </span>
        <span className="validation-title">
          {isValid ? 'All rules passed!' : 'Please fix the following:'}
        </span>
      </div>

      <div className="validation-items">
        {errors.map((error, index) => (
          <div key={`error-${index}`} className="validation-item error">
            <span className="item-icon">❌</span>
            <span className="item-text">{error}</span>
          </div>
        ))}

        {warnings.map((warning, index) => (
          <div key={`warning-${index}`} className="validation-item warning">
            <span className="item-icon">⚠️</span>
            <span className="item-text">{warning}</span>
          </div>
        ))}

        <div className="validation-stats">
          <div className="stat-item">
            <span className="stat-label">Characters:</span>
            <span className={`stat-value ${charCount > maxChars ? 'error' : ''}`}>
              {charCount} / {maxChars}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Photos:</span>
            <span className={`stat-value ${photoCount > maxPhotos ? 'error' : ''}`}>
              {photoCount} / {maxPhotos}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationPanel;