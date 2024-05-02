// /components/Statistics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, CreditCard, PoundSterlingIcon, TrendingUp } from "lucide-react";
import { useData } from '@/context/DataContext';

export default function StatisticsComponent() {
  const { transactions, budgetData } = useData();

  const totalTransactions = transactions.length;
  const totalBudgets = budgetData.length;
  const totalBudgetAmount = budgetData.reduce((total, budget) => total + budget.amount, 0);

  const moneySaved = budgetData.reduce((total, budget) => {
    const categoryTransactions = transactions.filter((transaction) => {
      const category = transaction.category;
      return category && category.includes(budget.name) && transaction.amount < 0;
    });
    const totalSpent = categoryTransactions.reduce(
      (spent, transaction) => spent + Math.abs(transaction.amount),
      0
    );
    const remainingAmount = budget.amount - totalSpent;
    return total + remainingAmount;
  }, 0);

  const financialHealthPercentage = totalBudgetAmount > 0 ? (moneySaved / totalBudgetAmount) * 100 : 0;

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-4">Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Card 1: Financial Health */}
        <Card className="shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Financial Health</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between py-4">
            <p className="text-4xl font-bold">
              {financialHealthPercentage.toFixed(2)}%
            </p>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </CardContent>
        </Card>
        {/* Card 2: Budgets */}
        <Card className="shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Budgets</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between py-4">
            <p className="text-4xl font-bold">{totalBudgets}</p>
            <Wallet className="w-6 h-6 text-blue-500" />
          </CardContent>
        </Card>
        {/* Card 3: Money saved */}
        <Card className="shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Money saved</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between py-4">
            <p className="text-4xl font-bold">
              £{moneySaved.toFixed(2)}
            </p>
            <PoundSterlingIcon className="w-6 h-6 text-pink-500" />
          </CardContent>
        </Card>
        {/* Card 4: Transactions */}
        <Card className="shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between py-4">
            <p className="text-4xl font-bold">{totalTransactions}</p>
            <CreditCard className="w-6 h-6 text-orange-500" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}