// /components/BudgetTab.tsx
"use client";

import { useState } from 'react';
import { BudgetCategory } from '@/components/BudgetCategory';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusIcon } from '@heroicons/react/24/solid';
import { useAuth as useClerkAuth } from '@clerk/nextjs';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/context/DataContext";

const desiredCategories = [
  "Community",
  "Food and Drink",
  "Healthcare",
  "Payment",
  "Recreation",
  "Service",
  "Shops",
  "Travel",
  "Miscellaneous",
];

const BudgetTab: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { userId } = useClerkAuth();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryAmount, setCategoryAmount] = useState(0);
  const { totalBalance, totalBudgetAmount, setTotalBudgetAmount, transactions, budgetData, setBudgetData } = useData();
  const amountLeft = totalBalance - totalBudgetAmount;
  const availableCategories = desiredCategories.filter(
    (category) => !budgetData.some((budgetCategory) => budgetCategory.name === category)
  );

  const handleCreateBudget = async () => {
    if (selectedCategory && categoryAmount > 0 && categoryAmount <= amountLeft) {
      const newBudgetCategory = {
        id: selectedCategory,
        name: selectedCategory,
        amount: categoryAmount,
        transactions: [],
      };

      try {
        const response = await fetch('/api/budget-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ budgetCategory: newBudgetCategory, userId }),
        });

        if (response.ok) {
          setBudgetData([...budgetData, newBudgetCategory]);
          const updatedTotalBudgetAmount = totalBudgetAmount + categoryAmount;
          setTotalBudgetAmount(updatedTotalBudgetAmount);
          setSelectedCategory('');
          setCategoryAmount(0);
          setOpen(false);
        } else {
          const errorData = await response.json();
          console.error('Error creating budget category:', errorData.error, errorData.details);
        }
      } catch (error) {
        console.error('Error creating budget category:', error);
      }
    }
  };

  

  return (
    <div className="mt-6">
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Create a budget</h2>
            <p className="text-gray-500">Save more by setting a budget</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full">
                <PlusIcon className="w-4 h-4 mr-2" /> Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-2">Create Budget Category</DialogTitle>
                <DialogDescription className="text-gray-500">
                  Select a category and enter the budget amount.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="totalBalance" className="text-gray-700 dark:text-gray-400">
                    Total Balance:
                  </Label>
                  <Input
                    id="totalBalance"
                    type="number"
                    value={totalBalance}
                    disabled
                    className="col-span-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="amountLeft" className="text-gray-700 dark:text-gray-400">
                    Amount Left:
                  </Label>
                  <Input
                    id="amountLeft"
                    type="number"
                    value={amountLeft}
                    disabled
                    className="col-span-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="categorySelect" className="text-gray-700 dark:text-gray-400">
                    Category:
                  </Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="col-span-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="categoryAmount" className="text-gray-700 dark:text-gray-400">
                    Amount:
                  </Label>
                  <Input
                    id="categoryAmount"
                    type="number"
                    value={categoryAmount || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setCategoryAmount(0);
                      } else {
                        const parsedValue = parseInt(value);
                        if (!isNaN(parsedValue)) {
                          setCategoryAmount(parsedValue);
                        }
                      }
                    }}
                    className="col-span-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateBudget} disabled={categoryAmount > amountLeft}>
                  Create Budget
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">My budget</h3>
        {budgetData.map((category) => {
          const categoryTransactions = transactions.filter(
            (transaction) =>
              transaction.category &&
              transaction.category.includes(category.name) &&
              transaction.amount < 0
          );

          return (
            <BudgetCategory
              key={category.id}
              {...category}
              transactions={categoryTransactions}
            />
          );
        })}
      </Card>
    </div>
  );
};

export default BudgetTab;