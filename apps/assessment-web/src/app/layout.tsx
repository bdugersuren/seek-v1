import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/store/Provider';

export const metadata: Metadata = {
  title: 'seek.mn Assessment',
  description: 'Competency Assessment Platform Assessment Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
