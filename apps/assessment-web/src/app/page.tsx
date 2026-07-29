'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { loginRequest, logout } from '@/store/slices/authSlice';

export default function AssessmentPage() {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(loginRequest({ username: 'candidate' }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center text-rose-600">seek.mn Assessment Runtime</h1>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 shadow-md max-w-md mx-auto">
          {user ? (
            <div className="text-center">
              <p className="mb-4">Үнэлгээнд нэвтэрсэн хэрэглэгч: <strong className="text-green-500">{user.username}</strong></p>
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded mb-4 text-left text-xs">
                <p>Status: Ready to Launch</p>
                <p>Environment: Sandbox</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Гарах
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4">Үнэлгээ эхлүүлэхийн тулд эрхээ баталгаажуулна уу.</p>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 disabled:opacity-50 transition"
              >
                {loading ? 'Уншиж байна...' : 'Нэвтрэх (Mock Launch)'}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
