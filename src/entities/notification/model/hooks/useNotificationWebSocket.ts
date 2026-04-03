import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  EMPLOYEE_TASKS_QUERY_KEY,
  TASK_DETAILS_QUERY_KEY,
} from 'entities/task/model/queries';
import { NOTIFICATIONS_QUERY_KEY } from '../queries';
import type { WsNotification } from '../types';
import { DOCUMENT_DETAILS_QUERY_KEY, DOCUMENTS_QUERY_KEY } from 'entities/documents';

const WS_BASE_URL = 
'wss://uadmin.kstu.kg/notifications/ws'
;
const RECONNECT_DELAY_MS = 3000;
const MAX_RECONNECT_ATTEMPTS = 10;

export function useNotificationWebSocket(userId: string | undefined) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const connect = useCallback(() => {
    if (!userId) return;

    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`${WS_BASE_URL}/${userId}`);

    ws.onopen = () => {
      reconnectAttemptsRef.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const notification: WsNotification = JSON.parse(event.data);
        console.log(notification);
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
        
        if (notification.source_service === 'tasks') {
          queryClient.invalidateQueries({ queryKey: [EMPLOYEE_TASKS_QUERY_KEY] });
          queryClient.invalidateQueries({ queryKey: [TASK_DETAILS_QUERY_KEY] });
        } else if (notification.source_service === 'documentflow') {
          queryClient.invalidateQueries({ queryKey: [DOCUMENTS_QUERY_KEY, 'application', 'inbox', 0, 20] });
          queryClient.invalidateQueries({ queryKey: [DOCUMENT_DETAILS_QUERY_KEY] });
        }
        
        // Show single toast with conditional styling
        const isTask = notification.source_service === 'tasks';
        const isDocument = notification.source_service === 'documentflow';
        
        toast(notification.title, {
          description: notification.body,
          duration: 5000,
          style: {
            borderLeft: isTask 
              ? '4px solid #3b82f6' 
              : isDocument 
              ? '4px solid #8b5cf6' 
              : '4px solid #6b7280',
          },
          action: isTask && notification.extra_data?.task_id
            ? {
                label: 'Открыть',
                onClick: () => navigate('/task-details', { state: { taskId: notification.extra_data.task_id } }),
              }
            : isDocument && notification.extra_data?.link
            ? {
                label: 'Открыть',
                onClick: () => navigate(notification.extra_data.link),
              }
            : undefined,
        });
      } catch {
        queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      }
    };

    ws.onclose = () => {
      wsRef.current = null;

      if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttemptsRef.current += 1;
        reconnectTimerRef.current = setTimeout(connect, RECONNECT_DELAY_MS);
      }
    };

    ws.onerror = () => {
      ws.close();
    };

    wsRef.current = ws;
  }, [userId, queryClient, navigate]);

  useEffect(() => {
    connect();

    return () => {
      const timer = reconnectTimerRef.current;
      if (timer != null) clearTimeout(timer);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);
}
