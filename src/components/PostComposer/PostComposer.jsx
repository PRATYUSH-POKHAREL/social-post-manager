import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  selectSelectedPlatform,
  selectPlatformConfig,
  selectValidationErrors,
  selectValidationWarnings,
  setValidationErrors,
  setValidationWarnings,
  clearValidation,
} from '../../features/platforms/platformsSlice';
import { addPost, savePostAsync } from '../../features/posts/postsSlice';
import { addDraft, saveDraftAsync } from '../../features/drafts/draftsSlice';
import { validatePost } from '../../utils/validators';
import PlatformSelector from './PlatformSelector';
import TextArea from './TextArea';
import MediaUploader from './MediaUploader';
import ValidationPanel from './ValidationPanel';
import './PostComposer.css';

const PostComposer = () => {
  const dispatch = useDispatch();
  const selectedPlatform = useSelector(selectSelectedPlatform);
  const platformConfig = useSelector(selectPlatformConfig);
  const errors = useSelector(selectValidationErrors);
  const warnings = useSelector(selectValidationWarnings);

  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationResult, setValidationResult] = useState({
    errors: [],
    warnings: [],
    isValid: true,
    charCount: 0,
    charsLeft: 0,
    hashtagCount: 0,
    photoCount: 0,
  });

  // Run validation only when text, photos, or platform changes
  useEffect(() => {
    const result = validatePost(text, photos, platformConfig);
    setValidationResult(result);
    dispatch(setValidationErrors(result.errors));
    dispatch(setValidationWarnings(result.warnings));
  }, [text, photos, platformConfig, dispatch]);

  const handleTextChange = useCallback((newText) => {
    setText(newText);
  }, []);

  const handlePhotosChange = useCallback((newPhotos) => {
    setPhotos(newPhotos);
  }, []);

  const handleSaveDraft = useCallback(() => {
    if (!text && photos.length === 0) {
      alert('Please add some content before saving');
      return;
    }

    const draftData = {
      text,
      photos,
      platform: selectedPlatform,
      status: 'draft',
    };
    
    dispatch(addDraft(draftData));
    dispatch(saveDraftAsync(draftData));
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }, [text, photos, selectedPlatform, dispatch]);

  const handlePublish = useCallback(async () => {
    if (!validationResult.isValid) {
      alert('❌ Please fix validation errors before publishing');
      return;
    }

    setIsSubmitting(true);

    const postData = {
      id: uuidv4(),
      text,
      photos,
      platform: selectedPlatform,
      publishedAt: new Date().toISOString(),
      status: 'published',
    };

    try {
      await dispatch(savePostAsync(postData)).unwrap();
      dispatch(addPost(postData));
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      setText('');
      setPhotos([]);
      dispatch(clearValidation());
    } catch (error) {
      alert('❌ Failed to publish: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [text, photos, selectedPlatform, validationResult.isValid, dispatch]);

  const handleReset = useCallback(() => {
    if (window.confirm('Clear all content?')) {
      setText('');
      setPhotos([]);
      dispatch(clearValidation());
    }
  }, [dispatch]);

  return (
    <div className="post-composer">
      {showSuccess && (
        <div className="success-toast">
          ✅ {isSubmitting ? 'Published successfully!' : 'Draft saved!'}
        </div>
      )}

      <div className="composer-header">
        <h2>✍️ Create New Post</h2>
        <span className="platform-badge" style={{ backgroundColor: platformConfig.color }}>
          {platformConfig.icon} {platformConfig.name}
        </span>
      </div>

      <PlatformSelector />

      <div className="composer-body">
        <TextArea
          value={text}
          onChange={handleTextChange}
          placeholder={`What's on your mind? (${platformConfig.name})`}
          maxChars={platformConfig.maxChars}
        />

        <MediaUploader
          photos={photos}
          onChange={handlePhotosChange}
          maxPhotos={platformConfig.maxPhotos}
        />

        <ValidationPanel
          errors={validationResult.errors}
          warnings={validationResult.warnings}
          isValid={validationResult.isValid}
          charCount={validationResult.charCount}
          maxChars={platformConfig.maxChars}
          photoCount={validationResult.photoCount}
          maxPhotos={platformConfig.maxPhotos}
        />
      </div>

      <div className="composer-actions">
        <button 
          className="btn btn-secondary"
          onClick={handleSaveDraft}
          disabled={!text && photos.length === 0}
        >
          💾 Save Draft
        </button>
        
        <button 
          className="btn btn-danger"
          onClick={handleReset}
        >
          🔄 Reset
        </button>
        
        <button 
          className="btn btn-primary"
          onClick={handlePublish}
          disabled={!validationResult.isValid || isSubmitting}
        >
          {isSubmitting ? '⏳ Publishing...' : '📤 Publish'}
        </button>
      </div>

      {!validationResult.isValid && validationResult.errors.length > 0 && (
        <div className="composer-footer error">
          ⚠️ Fix {validationResult.errors.length} issue(s) before publishing
        </div>
      )}
      {validationResult.isValid && text.length > 0 && (
        <div className="composer-footer success">
          ✅ Ready to publish!
        </div>
      )}
    </div>
  );
};

export default PostComposer;