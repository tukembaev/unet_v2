import { useState } from 'react';
import { taskReportsApi } from '../api';
import type { TasksReportParams } from '../types';

export const useDownloadTasksPdf = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadPdf = async (params: TasksReportParams) => {
    try {
      setIsDownloading(true);
      setError(null);
      
      const blob = await taskReportsApi.downloadTasksPdf(params);
      
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Формируем имя файла
      const startDate = params.start_date ? new Date(params.start_date).toLocaleDateString('ru-RU') : '';
      const endDate = params.end_date ? new Date(params.end_date).toLocaleDateString('ru-RU') : '';
      const fileName = `Отчет_по_задачам_${startDate}_${endDate}.pdf`;
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      // Очистка
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось скачать PDF-отчет';
      setError(errorMessage);
      console.error('Ошибка при скачивании PDF:', err);
      throw err;
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadPdf, isDownloading, error };
};
