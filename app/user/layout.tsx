// app/user/layout.tsx
import { ReactNode } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { DataProvider } from '@/context/DataContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (<DataProvider >
    <div className="min-h-screen bg-image p-4 sm:p-6">
      <Header />
      <main className="">{children}</main>
      <Navigation />
    </div>
  </DataProvider>
    
  );
}