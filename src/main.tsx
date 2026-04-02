import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Suspense } from 'react';
import { ErrorBoundary } from '@suspensive/react';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback={
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white-bg z-[9999]">
        <div className="p-4 text-red-600">Ошибка загрузки приложения</div>
      </div>
    }>
      <Suspense fallback={
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white-bg z-[9999]">
          <div className="w-[50px] h-[50px] border-4 border-white-bg border-t-primary rounded-full animate-spin mb-4" />
            <div className="text-sm text-gray">
              Загрузка...
            </div>
        </div>
      }>
        <App />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
)
