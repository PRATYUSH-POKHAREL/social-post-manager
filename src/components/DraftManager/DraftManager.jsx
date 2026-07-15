import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllDrafts,
  selectDraftStatus,
  deleteDraft,
  deleteDraftAsync,
  setCurrentDraft,
  fetchDraftsAsync,
} from '../../features/drafts/draftsSlice';
import './DraftManager.css';

const DraftManager = () => {
  const dispatch = useDispatch();
  const drafts = useSelector(selectAllDrafts);
  const status = useSelector(selectDraftStatus);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchDraftsAsync());
  }, [dispatch]);

  const handleDelete = (draftId) => {
    if (window.confirm('Delete this draft?')) {
      dispatch(deleteDraft(draftId));
      dispatch(deleteDraftAsync(draftId));
    }
  };

  const handleEdit = (draft) => {
    dispatch(setCurrentDraft(draft));
    alert(`📝 Edit draft: ${draft.text.substring(0, 30)}...`);
  };

  const handleLoad = (draft) => {
    alert(`📂 Loading draft: ${draft.text.substring(0, 30)}...`);
  };

  const filteredDrafts = drafts.filter(draft => {
    if (filter === 'all') return true;
    return draft.platform === filter;
  });

  if (status === 'loading') {
    return (
      <div className="draft-manager loading">
        <div className="loading-spinner">⏳</div>
        <p>Loading drafts...</p>
      </div>
    );
  }

  return (
    <div className="draft-manager">
      <div className="draft-header">
        <div className="draft-title">
          <h3>📂 My Drafts</h3>
          <span className="draft-count">{drafts.length}</span>
        </div>
        <div className="draft-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'twitter' ? 'active' : ''}`}
            onClick={() => setFilter('twitter')}
          >
            🐦
          </button>
          <button
            className={`filter-btn ${filter === 'instagram' ? 'active' : ''}`}
            onClick={() => setFilter('instagram')}
          >
            📷
          </button>
          <button
            className={`filter-btn ${filter === 'facebook' ? 'active' : ''}`}
            onClick={() => setFilter('facebook')}
          >
            📘
          </button>
          <button
            className={`filter-btn ${filter === 'linkedin' ? 'active' : ''}`}
            onClick={() => setFilter('linkedin')}
          >
            💼
          </button>
        </div>
      </div>

      <div className="draft-list">
        {filteredDrafts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-title">No drafts found</p>
            <p className="empty-hint">Create a post and save it as draft</p>
          </div>
        ) : (
          filteredDrafts.map((draft) => (
            <div key={draft.id} className="draft-item">
              <div className="draft-content">
                <div className="draft-text">{draft.text}</div>
                <div className="draft-meta">
                  <span className="draft-platform">{draft.platform}</span>
                  <span className="draft-date">
                    🕐 {new Date(draft.updatedAt).toLocaleDateString()}
                  </span>
                  {draft.photos && draft.photos.length > 0 && (
                    <span className="draft-media">📷 {draft.photos.length}</span>
                  )}
                </div>
              </div>
              <div className="draft-actions">
                <button
                  className="btn-sm btn-load"
                  onClick={() => handleLoad(draft)}
                >
                  📂 Load
                </button>
                <button
                  className="btn-sm btn-edit"
                  onClick={() => handleEdit(draft)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn-sm btn-delete"
                  onClick={() => handleDelete(draft.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DraftManager;