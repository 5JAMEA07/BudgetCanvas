// /components/TransacctionTab.tsx 

"use client";
import React, { useEffect, useState } from 'react';
import { FaUsers, FaUtensils, FaHeartbeat, FaCreditCard, FaSmileBeam, FaWrench, FaStore, FaPlane, FaEllipsisH } from 'react-icons/fa';
import { useData } from '@/context/DataContext';
import { useAuth } from "@clerk/nextjs";
import { useAuth as useToken } from '@/context/AuthContext';

const TransactionsTab: React.FC = () => {
  const { transactions, isLoading, setTransactions } = useData();
  const [iconMap, setIconMap] = useState<{ [key: string]: React.ElementType }>({});
  const { userId } = useAuth();
  const { accessToken } = useToken();

  useEffect(() => {
    const iconMapping: { [key: string]: React.ElementType } = {
      Community: FaUsers,
      'Food and Drink': FaUtensils,
      Healthcare: FaHeartbeat,
      Payment: FaCreditCard,
      Recreation: FaSmileBeam,
      Service: FaWrench,
      Shops: FaStore,
      Travel: FaPlane,
      Miscellaneous: FaEllipsisH,
    };
    setIconMap(iconMapping);
  }, []);

  const handleGenerateWebhook = async () => {

    
    try {
      const response = await fetch('/api/plaid-actions?action=fireWebhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken, userId }),
      });
  
      if (response.ok) {
        console.log('Webhook fired successfully');
        const data = await response.json();
      } else {
        console.error('Failed to fire webhook');
      }
    } catch (error) {
      console.error('Error firing webhook:', error);
    }
  };

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  if (!transactions || transactions.length === 0) {
    return <button
    className="bg-[#0e2a30] hover:bg-[#398495] text-white font-bold py-2 px-4 rounded mb-4"
    onClick={handleGenerateWebhook}
  >
    Generate Webhook
  </button>
  }

  return (
    <div className="mt-6">
      <button
        className="bg-[#0e2a30] hover:bg-[#425052] text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleGenerateWebhook}
      >
        Generate Transactions
      </button>

      <ul className="space-y-4">
        {transactions.map((transaction, index) => {
          const Icon = iconMap[transaction.category];
          const amount = transaction.amount;
          const formattedAmount = new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
          }).format(amount);

          return (
            <li key={index} className="flex items-center bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mr-4">
                {Icon && <Icon className="text-xl text-gray-500" />}
              </div>
              <div>
                <h3 className="text-base font-semibold">{transaction.name}</h3>
                <p className="text-sm text-gray-500">{transaction.category && transaction.category[0]}</p>
              </div>
              <div className="ml-auto">
                <p
                  className={`text-base font-semibold ${
                    amount < 0 ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {formattedAmount}
                </p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TransactionsTab;