import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './PostComposer.css';

const MediaUploader = ({ photos, onChange, maxPhotos }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const newPhotos = acceptedFiles.map(file => ({
      id: Date.now() + Math.random().toString(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    
    const updatedPhotos = [...photos, ...newPhotos];
    if (updatedPhotos.length <= maxPhotos) {
      onChange(updatedPhotos);
    } else {
      alert(`Maximum ${maxPhotos} photos allowed`);
    }
  }, [photos, onChange, maxPhotos]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 5242880, // 5MB
    disabled: photos.length >= maxPhotos,
  });

  const removePhoto = (photoId) => {
    const updatedPhotos = photos.filter(p => p.id !== photoId);
    onChange(updatedPhotos);
  };

  return (
    <div className="media-uploader">
      <div className="uploader-header">
        <span>📎 Add Media</span>
        <span className="uploader-limit">(Max {maxPhotos} photos)</span>
      </div>

      <div className="upload-area">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-thumbnail">
            <img src={photo.preview} alt={photo.name} />
            <button 
              className="remove-photo"
              onClick={() => removePhoto(photo.id)}
            >
              ✕
            </button>
          </div>
        ))}

        {photos.length < maxPhotos && (
          <div 
            {...getRootProps()} 
            className={`drop-zone ${isDragActive ? 'active' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="drop-zone-content">
              <span className="drop-icon">📷</span>
              <p>{isDragActive ? 'Drop photos here...' : 'Click or drag to upload'}</p>
              <span className="drop-hint">JPG, PNG, GIF up to 5MB</span>
            </div>
          </div>
        )}
      </div>

      <div className="uploader-stats">
        {photos.length > 0 && (
          <span className="photo-count">
            📸 {photos.length} / {maxPhotos} photos uploaded
          </span>
        )}
      </div>
    </div>
  );
};

export default MediaUploader;