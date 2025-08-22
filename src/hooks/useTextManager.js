import { useState, useEffect } from 'react';
import { getTextBlocks } from '../utils/textManager';

export const useTextManager = () => {
  const [textBlocks, setTextBlocks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTextBlocks();
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
    return textBlocks[key] || defaultValue;
  };

  const refreshTextBlocks = () => {
    loadTextBlocks();
  };

  return {
    textBlocks,
    loading,
    getTextValue,
    refreshTextBlocks
  };
};
