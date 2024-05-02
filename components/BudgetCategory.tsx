// /components/BudgetCategory.tsx
import React from 'react';
import { Card } from "@/components/ui/card";

interface BudgetCategoryProps {
  id: string;
  name: string;
  amount: number;
  transactions: any[];
}

export const BudgetCategory: React.FC<BudgetCategoryProps> = ({
  name,
  amount,
  transactions,
}) => {
  const totalSpent = transactions.reduce(
    (total, transaction) => total + Math.abs(transaction.amount),
    0
  );
  const remainingAmount = amount - totalSpent;
  const progress = Math.min((totalSpent / amount) * 100, 100);
  const isOverBudget = progress >= 100;
  const isNearBudget = progress >= 70 && progress < 100;

  const formattedBudgetAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  const formattedSpentAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalSpent);

  const formattedRemainingAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(remainingAmount);

  const getProgressColor = () => {
    if (isOverBudget) {
      return 'bg-red-500';
    } else if (isNearBudget) {
      return 'bg-yellow-500';
    } else {
      return 'bg-blue-600';
    }
  };

  const getPercentageColor = () => {
    if (isOverBudget) {
      return 'text-red-500';
    } else if (isNearBudget) {
      return 'text-yellow-500';
    } else {
      return 'text-gray-500';
    }
  };

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-lg font-semibold">{name}</div>
          <div className="text-gray-500 text-sm">
            Budget: {formattedBudgetAmount}
          </div>
        </div>
        <div className="text-gray-500 text-sm">
          Spent: {formattedSpentAmount}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-gray-500 text-sm">
          Remaining: {formattedRemainingAmount}
        </div>
        <div className={`text-sm ${getPercentageColor()}`}>
          {progress.toFixed(0)}% Spent
        </div>
      </div>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </Card>
  );
};