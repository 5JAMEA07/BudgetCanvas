// /components/TotalBalance.tsx
"use client";
import { CreditCard } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Loader2 } from 'lucide-react';

export default function TotalBalance() {
  const { totalBalance, bankName, isLoading } = useData();

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-[#F0E6F8] to-[#E0F2F1] text-gray-800 p-8 rounded-lg mt-8 flex items-center justify-center h-64 shadow-md">
        <Loader2 className="animate-spin h-12 w-12 text-black" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#F0E6F8] to-[#E0F2F1] text-gray-800 p-8 rounded-lg mt-8 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-black">Total Balance</h2>
          <p className="text-5xl font-bold text-black">
            £{totalBalance !== undefined ? totalBalance.toFixed(2) : '0.00'}
          </p>
        </div>
        <div className="flex items-center bg-white rounded-lg p-4 shadow-md">
          <CreditCard className="h-12 w-12 mr-4 text-black" />
          <div>
            <p className="text-lg font-semibold text-black">{bankName}</p>
            <p className="text-gray-600">**** **** **** 0322</p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <p className="text-gray-800">Your total balance across all connected accounts.</p>
      </div>
    </div>
  );
}