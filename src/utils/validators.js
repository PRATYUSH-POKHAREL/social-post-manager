export const validatePost = (text, photos, platformConfig) => {
  const errors = [];
  const warnings = [];

  const charCount = text.length;
  
  if (charCount === 0) {
    errors.push('Post cannot be empty');
  }
  
  if (charCount > platformConfig.maxChars) {
    errors.push(`Exceeds ${platformConfig.maxChars} character limit by ${charCount - platformConfig.maxChars} chars`);
  }
  
  if (charCount < platformConfig.minChars && charCount > 0) {
    errors.push(`Minimum ${platformConfig.minChars} character required`);
  }

  if (photos.length > platformConfig.maxPhotos) {
    errors.push(`Maximum ${platformConfig.maxPhotos} photos allowed (you have ${photos.length})`);
  }

  const hashtags = text.match(/#\w+/g) || [];
  if (!platformConfig.allowHashtags && hashtags.length > 0) {
    errors.push('Hashtags are not allowed on this platform');
  }

  const charsLeft = platformConfig.maxChars - charCount;
  if (charsLeft > 0 && charsLeft <= 20) {
    warnings.push(`⚠️ Only ${charsLeft} characters left`);
  }

  if (photos.length === 0 && platformConfig.id === 'instagram') {
    warnings.push('💡 Instagram posts perform better with images');
  }

  return { 
    errors, 
    warnings, 
    isValid: errors.length === 0,
    charCount,
    charsLeft,
    hashtagCount: hashtags.length,
    photoCount: photos.length,
  };
};
