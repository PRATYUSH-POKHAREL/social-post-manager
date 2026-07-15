const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockSavePost = async (postData) => {
  await mockDelay(800);
  
  if (Math.random() > 0.95) {
    throw new Error('Network error: Failed to save post');
  }
  
  return {
    id: Date.now().toString(),
    ...postData,
    publishedAt: new Date().toISOString(),
    status: 'published',
  };
};

export const mockFetchPosts = async () => {
  await mockDelay(600);
  
  return [
    {
      id: '1',
      text: 'Hello Twitter! This is my first post.',
      platform: 'twitter',
      photos: [],
      publishedAt: '2026-07-14T10:00:00Z',
      status: 'published',
    },
    {
      id: '2',
      text: 'Check out my awesome photos on Instagram! 📸',
      platform: 'instagram',
      photos: ['photo1.jpg', 'photo2.jpg'],
      publishedAt: '2026-07-13T15:30:00Z',
      status: 'published',
    },
  ];
};
