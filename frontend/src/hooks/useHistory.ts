import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { testApi } from '../services/testApi';

export interface TestHistoryItem {
  id: number;
  test_id: number;
  name: string;
  total_score: number;
  category: string;
  created_at: string;
}

export const useHistory = () => {
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await testApi.getHistory();
      if (response && response.data) {
        setHistory(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch test history:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const getFilteredHistory = () => {
    if (filterType === 'all') return history;
    return history.filter(item => {
      if (filterType === 'anxiety') return item.test_id === 1;
      if (filterType === 'mania') return item.test_id === 2;
      if (filterType === 'depression') return item.test_id === 3;
      return true;
    });
  };

  const changeFilter = (type: string) => {
    setFilterType(type);
  };

  return {
    history: getFilteredHistory(),
    loading,
    filterType,
    changeFilter,
  };
};
