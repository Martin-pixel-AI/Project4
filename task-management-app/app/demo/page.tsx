'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DemoPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initiateDemo = async () => {
      try {
        // Автоматический вход через демо-аккаунт
        const result = await signIn('demo', {
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error || 'Ошибка демо-входа');
        }

        // Перенаправление в дашборд после успешного входа
        router.push('/dashboard');
      } catch (error) {
        console.error('Ошибка демо-входа:', error);
        setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    initiateDemo();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md text-center">
        {loading ? (
          <>
            <h1 className="text-2xl font-bold text-blue-600">Загрузка демо-режима...</h1>
            <div className="flex justify-center mt-4">
              <div className="w-12 h-12 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600">Подготавливаем демонстрационную учетную запись...</p>
          </>
        ) : error ? (
          <>
            <h1 className="text-2xl font-bold text-red-600">Ошибка при входе в демо-режим</h1>
            <p className="mt-4 text-red-500">{error}</p>
            <button 
              onClick={() => router.push('/')} 
              className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Вернуться на главную
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
} 