import { useState, useEffect } from 'react';
import { getTextBlocks } from '../utils/textManager';

export const useTextManager = () => {
  const [textBlocks, setTextBlocks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTextBlocks();
    
    // Listen for text block updates from the admin panel
    const handleTextBlocksUpdated = () => {
      loadTextBlocks();
    };
    
    window.addEventListener('textBlocksUpdated', handleTextBlocksUpdated);
    
    // Cleanup event listener
    return () => {
      window.removeEventListener('textBlocksUpdated', handleTextBlocksUpdated);
    };
  }, []);

  const loadTextBlocks = async () => {
    try {
      const blocks = await getTextBlocks();
      const textMap = {};
      blocks.forEach(block => {
        textMap[block.key] = block.english;
      });
      setTextBlocks(textMap);
    } catch (error) {
      console.error('Error loading text blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTextValue = (key, defaultValue = '') => {
    // If text blocks are still loading, return the default value
    if (loading) {
      return defaultValue;
    }
    
    // If we have the text block, return it
    if (textBlocks[key]) {
      return textBlocks[key];
    }
    
    // Otherwise return the default value
    return defaultValue;
  };

  const refreshTextBlocks = () => {
    setLoading(true);
    loadTextBlocks();
  };

  return {
    textBlocks,
    loading,
    getTextValue,
    refreshTextBlocks
  };
};
