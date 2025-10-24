import { ReactNode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './error-boundary';
import { ThemeProvider } from './theme-provider';
import { router } from './router';
import { queryClient } from 'shared/config/query-client';

interface AppProvidersProps {
  children?: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="unet-ui-theme">
        <QueryClientProvider client={queryClient}>
          {children || <RouterProvider router={router} />}
          <Toaster position="top-right" richColors />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export { ThemeProvider, useTheme } from './theme-provider';

