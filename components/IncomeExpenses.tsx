// /components/IncomeExpenses.tsx
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useData } from '@/context/DataContext';
import { useEffect, useState } from "react";

export default function IncomeExpenses() {
  const { transactions } = useData();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    let income = 0;
    let expenses = 0;

    transactions.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      } else {
        expenses += Math.abs(transaction.amount);
      }
    });

    setTotalIncome(income);
    setTotalExpenses(expenses);
  }, [transactions]);

  return (
    <div className="my-8">
      <div className="grid grid-cols-2 gap-4">
        {/* Income Card */}
        <Card className="shadow-md rounded-lg">
          <CardContent className="flex items-center justify-between px-4 py-6">
            <div>
              <p className="text-gray-500">Income</p>
              <p className="text-2xl font-bold">£ {totalIncome.toFixed(2)}</p>
            </div>
            <ArrowUpCircle className="w-8 h-8 text-green-500" />
          </CardContent>
        </Card>
        {/* Expenses Card */}
        <Card className="shadow-md rounded-lg">
          <CardContent className="flex items-center justify-between px-4 py-6">
            <div>
              <p className="text-gray-500">Expenses</p>
              <p className="text-2xl font-bold">£ {totalExpenses.toFixed(2)}</p>
            </div>
            <ArrowDownCircle className="w-8 h-8 text-red-500" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}