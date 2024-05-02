// DataContext.tsx
"use client";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { doc, getDoc, onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { sendEmail } from "@/lib/mailgun";

interface DataContextProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  transactions: any[];
  totalUnspentAmount: number;
  totalBudgetAmount: number;
  bankName: string;
  isLoading: boolean;
  budgetData: any[];
  notificationEnabled: boolean;
  notificationPercentage: string;
  isBankConnected: boolean;
  setTotalBalance: (balance: number) => void;
  setTotalIncome: (income: number) => void;
  setTotalExpenses: (expenses: number) => void;
  setTotalUnspentAmount: (unspentAmount: number) => void;
  setTotalBudgetAmount: (budgetAmount: number) => void;
  setTransactions: (transactions: any[]) => void;
  setBudgetData: (budgetData: any[]) => void;
  setNotificationEnabled: (enabled: boolean) => void;
  setNotificationPercentage: (percentage: string) => void;
  setIsBankConnected: (connected: boolean) => void;
  setBankName: (name: string) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalUnspentAmount, setTotalUnspentAmount] = useState(0);
  const [totalBudgetAmount, setTotalBudgetAmount] = useState(0);
  const [bankName, setBankName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [budgetData, setBudgetData] = useState<any[]>([]);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [notificationPercentage, setNotificationPercentage] = useState("70");
  const [isBankConnected, setIsBankConnected] = useState(false);
  const [notifiedCategories, setNotifiedCategories] = useState<{ [key: string]: boolean }>({});

  const { userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const checkBudgetNotifications = async () => {
      if (notificationEnabled && user) {
        for (const category of budgetData) {
          const categoryTransactions = transactions.filter(
            (transaction) =>
              transaction.category &&
              transaction.category.includes(category.name) &&
              transaction.amount < 0
          );

          const totalSpent = categoryTransactions.reduce(
            (total, transaction) => total + Math.abs(transaction.amount),
            0
          );
          const remainingAmount = category.amount - totalSpent;
          const usedPercentage = Math.min(parseFloat(((totalSpent / category.amount) * 100).toFixed(2)), 100);
          const progress = Math.min((totalSpent / category.amount) * 100, 100);

          if (
            progress >= parseInt(notificationPercentage) &&
            !notifiedCategories[category.name]
          ) {
            const subject = 'Budget Alert';
            const message = `Your budget for ${category.name} is nearly exceeded. You have used ${usedPercentage}% of your budget. Amount remaining: £${remainingAmount.toFixed(2)}.`;

            if (user.primaryEmailAddress) {
              try {
                console.log(user.primaryEmailAddress.emailAddress);

                await sendEmail(user.primaryEmailAddress.emailAddress, subject, message);
                setNotifiedCategories((prevCategories) => ({
                  ...prevCategories,
                  [category.name]: true,
                }));
              } catch (error) {
                console.error('Error sending email notification:', error);
              }
            }
          } else if (
            progress >= 100 &&
            !notifiedCategories[`${category.name}_exceeded`]
          ) {
            const subject = 'Budget Exceeded Alert';
            const message = `Your budget for ${category.name} is exceeded. You have used ${usedPercentage}% of your budget. Amount remaining: £${remainingAmount.toFixed(2)}.`;

            if (user.primaryEmailAddress) {
              try {
                console.log(user.primaryEmailAddress.emailAddress);

                await sendEmail(user.primaryEmailAddress.emailAddress, subject, message);
                setNotifiedCategories((prevCategories) => ({
                  ...prevCategories,
                  [`${category.name}_exceeded`]: true,
                }));
              } catch (error) {
                console.error('Error sending email notification:', error);
              }
            }
          }
        }
      }
    };

    checkBudgetNotifications();
  }, [notificationEnabled, notificationPercentage, budgetData, transactions, userId, notifiedCategories]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.error("User ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", userId);
        const unsubscribe = onSnapshot(userDocRef, (userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setTotalBalance(userData.totalBalance);
            setTotalIncome(userData.totalIncome);
            setTotalExpenses(userData.totalExpenses);
            setBankName(userData.bankName);
            setIsBankConnected(userData.isBankConnected);
            // Set other user data as needed
          }
          setIsLoading(false);
        });

        // Fetch transactions for the user
        const transactionsRef = collection(db, "transactions");
        const transactionsQuery = query(transactionsRef, where("userId", "==", userId));
        const transactionsUnsubscribe = onSnapshot(transactionsQuery, (snapshot) => {
          const transactionsData = snapshot.docs.map((doc) => doc.data());
          setTransactions(transactionsData);
        });

        // Fetch budget data for the user
        const budgetDataRef = collection(db, "budgetData");
        const budgetDataQuery = query(budgetDataRef, where("userId", "==", userId));
        const budgetDataUnsubscribe = onSnapshot(budgetDataQuery, (snapshot) => {
          const budgetDataFromDb = snapshot.docs.map((doc) => doc.data());
          setBudgetData(budgetDataFromDb);
        });

        // Fetch the total budget amount from Firestore
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setTotalBudgetAmount(userData.totalBudgetAmount || 0);
        }

        // Cleanup the listeners when the component unmounts
        return () => {
          unsubscribe();
          transactionsUnsubscribe();
          budgetDataUnsubscribe();
        };
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  return (
    <DataContext.Provider
      value={{
        totalBalance,
        totalIncome,
        totalExpenses,
        transactions,
        totalUnspentAmount,
        totalBudgetAmount,
        bankName,
        isLoading,
        budgetData,
        notificationEnabled,
        notificationPercentage,
        isBankConnected,
        setTotalBalance,
        setTotalIncome,
        setTotalExpenses,
        setTotalUnspentAmount,
        setTotalBudgetAmount,
        setTransactions,
        setBudgetData,
        setNotificationEnabled,
        setNotificationPercentage,
        setIsBankConnected,
        setBankName,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};