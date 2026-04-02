import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Suspense } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import './index.css'
import App from './App.tsx'
import {Spinner} from "@/components/ui/Spinner.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {TIME} from "@/utils/constants.ts";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 *  TIME.MINUTE,
            gcTime: 30 * TIME.MINUTE,
            retry: 3,
        },
    },
});

document.documentElement.classList.add('wx-willow-theme');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-white-bg z-[9999]">
            <div className="p-4 text-danger">Ошибка загрузки приложения</div>
          </div>
        }>
          <Suspense fallback={
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white-bg z-[9999]">
              <Spinner />
            </div>
          }>
            <App />
          </Suspense>
        </ErrorBoundary>
      </QueryClientProvider>
  </StrictMode>,
)
