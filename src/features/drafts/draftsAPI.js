export const mockSaveDraft = async (draftData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: Date.now().toString(),
    ...draftData,
    savedAt: new Date().toISOString(),
  };
};

export const mockFetchDrafts = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return [
    {
      id: 'draft1',
      text: 'Working on my new blog post about React...',
      platform: 'linkedin',
      photos: [],
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 'draft2',
      text: 'Just finished designing the new UI! 🎨',
      platform: 'instagram',
      photos: ['design.jpg'],
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];
};

export const mockDeleteDraft = async (draftId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return true;
};
