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
  selectPlatform,
} from '../../features/platforms/platformsSlice';
import { addPost, savePostAsync } from '../../features/posts/postsSlice';
import { 
  addDraft, 
  saveDraftAsync,
  updateDraft,
  clearCurrentDraft,
  selectCurrentDraft
} from '../../features/drafts/draftsSlice';
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
  const currentDraft = useSelector(selectCurrentDraft);

  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDraftId, setEditingDraftId] = useState(null);
  const [validationResult, setValidationResult] = useState({
    errors: [],
    warnings: [],
    isValid: true,
    charCount: 0,
    charsLeft: 0,
    hashtagCount: 0,
    photoCount: 0,
  });

  // Load draft when currentDraft changes
  useEffect(() => {
    if (currentDraft) {
      setText(currentDraft.text || '');
      setPhotos(currentDraft.photos || []);
      setIsEditing(true);
      setEditingDraftId(currentDraft.id);
      
      if (currentDraft.platform) {
        dispatch(selectPlatform(currentDraft.platform));
      }
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [currentDraft, dispatch]);

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

  // ✅ FIXED: Save or Update Draft (only once!)
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

    if (isEditing && editingDraftId) {
      // ✅ UPDATE EXISTING DRAFT
      dispatch(updateDraft({
        id: editingDraftId,
        updates: draftData
      }));
      
      setIsEditing(false);
      setEditingDraftId(null);
      dispatch(clearCurrentDraft());
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      // ✅ SAVE NEW DRAFT (ONLY ONCE!)
      dispatch(addDraft(draftData));
      
      // ❌ REMOVED duplicate saveDraftAsync
      // dispatch(saveDraftAsync(draftData));
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [text, photos, selectedPlatform, isEditing, editingDraftId, dispatch]);

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
      
      if (isEditing && editingDraftId) {
        dispatch(updateDraft({
          id: editingDraftId,
          updates: { status: 'published' }
        }));
        setIsEditing(false);
        setEditingDraftId(null);
        dispatch(clearCurrentDraft());
      }
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      clearForm();
    } catch (error) {
      alert('❌ Failed to publish: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [text, photos, selectedPlatform, validationResult.isValid, isEditing, editingDraftId, dispatch]);

  const clearForm = useCallback(() => {
    setText('');
    setPhotos([]);
    dispatch(clearValidation());
    setIsEditing(false);
    setEditingDraftId(null);
    dispatch(clearCurrentDraft());
  }, [dispatch]);

  const handleReset = useCallback(() => {
    if (window.confirm('Clear all content?')) {
      clearForm();
    }
  }, [clearForm]);

  const handleCancelEdit = useCallback(() => {
    if (window.confirm('Cancel editing? Unsaved changes will be lost.')) {
      clearForm();
    }
  }, [clearForm]);

  return (
    <div className="post-composer">
      {showSuccess && (
        <div className="success-toast">
          ✅ {isEditing ? 'Draft updated successfully!' : isSubmitting ? 'Published successfully!' : 'Draft saved!'}
        </div>
      )}

      <div className="composer-header">
        <h2>✍️ {isEditing ? 'Edit Draft' : 'Create New Post'}</h2>
        <span className="platform-badge" style={{ backgroundColor: platformConfig.color }}>
          {platformConfig.icon} {platformConfig.name}
        </span>
      </div>

      {isEditing && (
        <div className="editing-banner">
          ✏️ Editing draft: "{text.substring(0, 50)}..."
          <button className="btn-cancel-edit" onClick={handleCancelEdit}>
            Cancel
          </button>
        </div>
      )}

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
          {isEditing ? '💾 Update Draft' : '💾 Save Draft'}
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
          {isSubmitting ? '⏳ Publishing...' : isEditing ? '📤 Publish & Clear' : '📤 Publish'}
        </button>
      </div>

      {!validationResult.isValid && validationResult.errors.length > 0 && (
        <div className="composer-footer error">
          ⚠️ Fix {validationResult.errors.length} issue(s) before publishing
        </div>
      )}
      {validationResult.isValid && text.length > 0 && (
        <div className="composer-footer success">
          ✅ Ready to {isEditing ? 'update' : 'publish'}!
        </div>
      )}
    </div>
  );
};

export default PostComposer;