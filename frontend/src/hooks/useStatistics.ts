import { useState, useEffect, useCallback } from 'react';
import { statisticsApi } from '../services/statisticsApi';

// Định nghĩa màu sắc pastel cho từng loại cảm xúc
const EMOTION_COLORS: { [key: string]: string } = {
  'Ngạc nhiên': '#F2C94C',
  'Hạnh phúc': '#27AE60',
  'Tức giận': '#EB5757',
  'Buồn': '#2F80ED',
  'Mệt mỏi': '#C084FC',
  'Trống rỗng': '#5F5F5F',
};

export type ChartDataPoint = {
  value: number;
  label: string;
};

export type DonutDataPoint = {
  value: number;
  color: string;
  label: string;
};

export const useStatistics = () => {
  const [filterType, setFilterType] = useState<'week' | 'month' | 'all'>('week');
  const [lineData, setLineData] = useState<ChartDataPoint[]>([]);
  const [donutData, setDonutData] = useState<DonutDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const formatDateLabel = (dateString: string, filter: 'week' | 'month' | 'all') => {
    const date = new Date(dateString);
    if (filter === 'week') {
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      return days[date.getDay()];
    }
    // For month and all, DD/MM format
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  };

  const fetchStatisticsData = useCallback(async (filter: 'week' | 'month' | 'all') => {
    setIsLoading(true);

    try {
      const [historyRes, emotionsRes] = await Promise.all([
        statisticsApi.getTestHistory(filter),
        statisticsApi.getEmotionStats(filter)
      ]);

      if (historyRes && historyRes.data) {
        const historyData = historyRes.data;
        const formattedScores = historyData.map((item) => ({
          value: item.total_score,
          label: formatDateLabel(item.created_at, filter)
        }));

        // If there's no data, provide an empty array instead of keeping old data
        setLineData(formattedScores);
      } else {
        setLineData([]);
      }

      if (emotionsRes && emotionsRes.data) {
        const emotionsData = emotionsRes.data;
        const totalDiaries = emotionsRes.total || 1;

        const formattedEmotions = emotionsData.map((item) => {
          const emotionName = (item.name || '').trim();
          return {
            value: Math.round((parseInt(item.count) / totalDiaries) * 100),
            color: EMOTION_COLORS[emotionName] || '#C4C4C4',
            label: emotionName
          };
        });

        setDonutData(formattedEmotions);
      } else {
        setDonutData([]);
      }

    } catch (error) {
      console.error('Failed to fetch statistics from API:', error);
      // Fallback or empty state on error
      setLineData([]);
      setDonutData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatisticsData(filterType);
  }, [filterType, fetchStatisticsData]);

  const changeFilter = (type: 'week' | 'month' | 'all') => {
    setFilterType(type);
  };

  return {
    filterType,
    lineData,
    donutData,
    isLoading,
    changeFilter,
  };
};
