// user/budget-details/page.tsx

import { NextPage } from "next";
import TotalBalance from '@/components/TotalBalance';
import Navigation from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from "@/components/OverviewTab";
import BudgetTab from "@/components/BudgetTab";
import TransactionsTab from "@/components/TransactionTab";


const BudgetDetails: NextPage = () => {
  return (
    <div className="mb-16">
      <TotalBalance />

      <Tabs defaultValue="overview" className="w-full mt-2">
        <TabsList className="grid w-full grid-cols-3 bg-white rounded-lg shadow">
          <TabsTrigger value="overview" className="py-2.5 px-4 hover:bg-gray-100 focus:outline-none">Overview</TabsTrigger>
          <TabsTrigger value="budget" className="py-2.5 px-4 hover:bg-gray-100 focus:outline-none">Budget</TabsTrigger>
          <TabsTrigger value="transactions" className="py-2.5 px-4 hover:bg-gray-100 focus:outline-none">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Overview />
        </TabsContent>

        <TabsContent value="budget">
          <BudgetTab />
        </TabsContent>



        <TabsContent value="transactions">
          <TransactionsTab />
        </TabsContent>
      </Tabs>

      <Navigation />
    </div>
  );
};

export default BudgetDetails;