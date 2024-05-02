// /components/LinkedAccountsDialog.tsx
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaLink } from 'react-icons/fa';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useData } from '@/context/DataContext';
import { useUser } from '@clerk/nextjs';

const LinkedAccountsDialog: React.FC = () => {
  const {
    bankName,
    setIsBankConnected,
    setBankName,
    setTotalBalance,
    setTotalIncome,
    setTotalExpenses,
    setTransactions,
    setTotalBudgetAmount
  } = useData();
  const { user } = useUser();
  const userId = user?.id;
  const { toast } = useToast();
  const router = useRouter();

  const disconnectAccount = async () => {
    try {
      await fetch(`/api/plaid-actions?action=disconnectAccount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      setIsBankConnected(false);
      setBankName("");
      setTotalBalance(0);
      setTotalIncome(0);
      setTotalExpenses(0);
      setTransactions([]);
      setTotalBudgetAmount(0)

      toast({
        title: "Account disconnected",
        description: "Your bank account has been successfully disconnected.",
        variant: "success",
      });

      router.push("/user");
    } catch (error) {
      console.error('Error disconnecting account:', error);
      toast({
        title: "Error",
        description: "An error occurred while disconnecting the account.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="flex items-center py-6 px-8 text-gray-800 hover:bg-gray-100 transition duration-300 cursor-pointer">
        <FaLink className="mr-6 text-3xl text-blue-500 md:text-4xl lg:text-5xl" />
        <span className="text-xl md:text-2xl lg:text-3xl">Linked Accounts</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Linked Accounts</DialogTitle>
          <DialogDescription>
            Manage your connected bank accounts and financial institutions.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Connected Accounts</h3>
          <ul>
            {bankName && (
              <li className="flex items-center justify-between py-2">
                <span>{bankName}</span>
                <Button variant="destructive" onClick={disconnectAccount}>
                  Disconnect
                </Button>
              </li>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkedAccountsDialog;