import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  EMPLOYEE_TASKS_QUERY_KEY,
  TASK_DETAILS_QUERY_KEY,
} from 'entities/task/model/queries';
import { NOTIFICATIONS_QUERY_KEY } from '../queries';
import type { WsNotification } from '../types';

const WS_BASE_URL = 
'wss://uadmin.kstu.kg/notifications/ws'
;
const RECONNECT_DELAY_MS = 3000;
const MAX_RECONNECT_ATTEMPTS = 10;

export function useNotificationWebSocket(userId: string | undefined) {
  const queryClient = useQueryClient();
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

        queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
        if (notification.source_service === 'tasks') {
          queryClient.invalidateQueries({ queryKey: [EMPLOYEE_TASKS_QUERY_KEY] });
          queryClient.invalidateQueries({ queryKey: [TASK_DETAILS_QUERY_KEY] });
        }
        toast(notification.title, {
          description: notification.body,
          duration: 5000,
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
  }, [userId, queryClient]);

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
