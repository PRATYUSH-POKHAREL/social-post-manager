import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSelectedPlatform,
  selectAllPlatforms,
  selectPlatform,
} from '../../features/platforms/platformsSlice';
import './PostComposer.css';

const PlatformSelector = () => {
  const dispatch = useDispatch();
  const selectedPlatform = useSelector(selectSelectedPlatform);
  const platforms = useSelector(selectAllPlatforms);

  const handleSelect = (platformId) => {
    dispatch(selectPlatform(platformId));
  };

  return (
    <div className="platform-selector">
      <label className="selector-label">Choose where to post:</label>
      <div className="platform-buttons">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            className={`platform-btn ${selectedPlatform === platform.id ? 'active' : ''}`}
            onClick={() => handleSelect(platform.id)}
            style={{
              borderColor: selectedPlatform === platform.id ? platform.color : '#E5E7EB',
              backgroundColor: selectedPlatform === platform.id ? `${platform.color}15` : 'white',
            }}
          >
            <span className="platform-icon">{platform.icon}</span>
            <span className="platform-name">{platform.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlatformSelector;