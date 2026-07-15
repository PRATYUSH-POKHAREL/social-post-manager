import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockSaveDraft, mockFetchDrafts, mockDeleteDraft } from './draftsAPI';

export const saveDraftAsync = createAsyncThunk(
  'drafts/saveDraft',
  async (draftData) => {
    const response = await mockSaveDraft(draftData);
    return response;
  }
);

export const fetchDraftsAsync = createAsyncThunk(
  'drafts/fetchDrafts',
  async () => {
    const response = await mockFetchDrafts();
    return response;
  }
);

export const deleteDraftAsync = createAsyncThunk(
  'drafts/deleteDraft',
  async (draftId) => {
    await mockDeleteDraft(draftId);
    return draftId;
  }
);

const loadDraftsFromStorage = () => {
  try {
    const saved = localStorage.getItem('drafts');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: loadDraftsFromStorage(),
  status: 'idle',
  error: null,
  currentDraft: null,
};

const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    addDraft: (state, action) => {
      const newDraft = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.items.push(newDraft);
      localStorage.setItem('drafts', JSON.stringify(state.items));
    },
    updateDraft: (state, action) => {
      const { id, updates } = action.payload;
      const draft = state.items.find(d => d.id === id);
      if (draft) {
        Object.assign(draft, updates);
        draft.updatedAt = new Date().toISOString();
        localStorage.setItem('drafts', JSON.stringify(state.items));
      }
    },
    deleteDraft: (state, action) => {
      state.items = state.items.filter(draft => draft.id !== action.payload);
      localStorage.setItem('drafts', JSON.stringify(state.items));
    },
    setCurrentDraft: (state, action) => {
      state.currentDraft = action.payload;
    },
    clearCurrentDraft: (state) => {
      state.currentDraft = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveDraftAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
        localStorage.setItem('drafts', JSON.stringify(state.items));
      })
      .addCase(fetchDraftsAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        localStorage.setItem('drafts', JSON.stringify(state.items));
      })
      .addCase(deleteDraftAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(d => d.id !== action.payload);
        localStorage.setItem('drafts', JSON.stringify(state.items));
      });
  },
});

export const selectAllDrafts = (state) => state.drafts.items;
export const selectDraftStatus = (state) => state.drafts.status;
export const selectCurrentDraft = (state) => state.drafts.currentDraft;

export const { 
  addDraft, 
  updateDraft, 
  deleteDraft, 
  setCurrentDraft, 
  clearCurrentDraft 
} = draftsSlice.actions;

export default draftsSlice.reducer;
