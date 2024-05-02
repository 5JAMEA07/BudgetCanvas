// /components/Overview.tsx
"use client";
import { useEffect, useState } from "react";
import BalanceChart from "@/components/BalanceChart";
import SpendingChart from "@/components/SpendingsChart";
import { useData } from "@/context/DataContext";

function Overview() {
  const { transactions } = useData();
  const [expenses, setExpenses] = useState<number[]>([]);
  const [income, setIncome] = useState<number[]>([]);
  const [topCategories, setTopCategories] = useState<{ category: string; amount: number }[]>([]);

  useEffect(() => {
    if (transactions) {
      // Calculate monthly expenses and income
      const monthlyExpenses: number[] = Array(12).fill(0);
      const monthlyIncome: number[] = Array(12).fill(0);
      transactions.forEach((transaction: any) => {
        const month = new Date(transaction.date).getMonth();
        if (transaction.amount > 0) {
          monthlyIncome[month] += transaction.amount;
        } else {
          monthlyExpenses[month] += Math.abs(transaction.amount);
        }
      });
      setExpenses(monthlyExpenses);
      setIncome(monthlyIncome);

      // Calculate top 3 most spent budget categories
      const categorySpending: { [category: string]: number } = {};
      transactions.forEach((transaction: any) => {
        if (transaction.category && transaction.amount < 0) {
          const category = transaction.category[0];
          if (categorySpending[category]) {
            categorySpending[category] += Math.abs(transaction.amount);
          } else {
            categorySpending[category] = Math.abs(transaction.amount);
          }
        }
      });

      const sortedCategories = Object.entries(categorySpending)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([category, amount]) => ({ category, amount }));

      setTopCategories(sortedCategories);
    }
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <BalanceChart expenses={expenses} income={income} />
      <SpendingChart topCategories={topCategories} />
    </div>
  );
}

export default Overview;