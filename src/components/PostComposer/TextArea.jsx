import React from 'react';
import './PostComposer.css';

const TextArea = ({ value, onChange, placeholder, maxChars }) => {
  const charCount = value.length;
  const isNearLimit = charCount > maxChars * 0.9;
  const isOverLimit = charCount > maxChars;

  return (
    <div className="text-area-container">
      <textarea
        className="text-area"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
      />
      <div className="text-area-footer">
        <div className="char-counter">
          <span className={isOverLimit ? 'over-limit' : isNearLimit ? 'near-limit' : ''}>
            {charCount} / {maxChars}
          </span>
          {isOverLimit && <span className="error-text"> 🔴 Exceeds limit!</span>}
          {isNearLimit && !isOverLimit && <span className="warning-text"> ⚠️ Approaching limit</span>}
        </div>
        <div className="read-time">
          ⏱️ {Math.ceil(charCount / 200)} min read
        </div>
      </div>
      <div className="char-progress-bar">
        <div 
          className={`progress-fill ${isOverLimit ? 'error' : isNearLimit ? 'warning' : ''}`}
          style={{ width: `${Math.min((charCount / maxChars) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default TextArea;