// api/plaid-actions/routes.ts

import { NextRequest, NextResponse } from "next/server";
import {
  CountryCode,
  Products,
  SandboxItemFireWebhookRequestWebhookCodeEnum,
} from "plaid";
import { plaidClient } from "@/lib/plaid";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  switch (action) {
    case "createLinkToken":
      return createLinkToken(request);
    case "exchangePublicToken":
      return exchangePublicToken(request);
    case "fireWebhook":
      return fireWebhook(request);
    case "disconnectAccount":
      return disconnectAccount(request);
    case "deleteAccount":
      return deleteAccount(request);
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}

async function createLinkToken(request: NextRequest) {
  const { userId } = await request.json();
  const createTokenRequest = {
    user: { client_user_id: userId },
    client_name: "Budget Canvas",
    products: [Products.Transactions],
    country_codes: [CountryCode.Gb],
    language: "en",
    webhook: process.env.WEBHOOK_URL,
  };
  try {
    const response = await plaidClient.linkTokenCreate(createTokenRequest);
    return NextResponse.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error("Error creating link token:", error);
    return NextResponse.json(
      { error: "Failed to create link token" },
      { status: 500 }
    );
  }
}

async function exchangePublicToken(request: NextRequest) {
  const { publicToken, userId, userEmail } = await request.json();
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Fetch account balances
    const balanceResponse = await plaidClient.accountsBalanceGet({
      access_token: accessToken,
    });
    const accounts = balanceResponse.data.accounts;
    let totalBalance = 0;
    accounts.forEach((account) => {
      if (account.balances.current !== null) {
        totalBalance += account.balances.current;
      }
    });

    // Fetch institution details
    const itemResponse = await plaidClient.itemGet({
      access_token: accessToken,
    });
    const institutionId = itemResponse.data.item.institution_id;
    let bankName = "";

    if (typeof institutionId === "string") {
      const institutionResponse = await plaidClient.institutionsGetById({
        institution_id: institutionId,
        country_codes: [CountryCode.Gb],
      });
      const institution = institutionResponse.data.institution;
      bankName = institution.name;
    }

    // Store the data in Firebase
    await setDoc(doc(db, "users", userId), {
      accessToken,
      itemId,
      totalBalance,
      bankName,
      userEmail,
      isBankConnected: true,
      totalBudgetAmount: 0,
    });

    await syncTransactions(userId);

    return NextResponse.json({ access_token: accessToken, item_id: itemId });
  } catch (error) {
    console.error("Error exchanging public token:", error);
    return NextResponse.json(
      { error: "Failed to exchange public token" },
      { status: 500 }
    );
  }
}

async function syncTransactions(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.data();
    const accessToken = userData?.accessToken;
    const lastCursor = userData?.lastCursor || null;

    if (!accessToken) {
      throw new Error("Access token not found for the user");
    }

    const transactionsResponse = await plaidClient.transactionsSync({
      access_token: accessToken,
      cursor: lastCursor,
    });
    const addedTransactions = transactionsResponse.data.added;

    for (const transaction of addedTransactions) {
      const transactionRef = doc(
        collection(db, "transactions"),
        transaction.transaction_id
      );
      await setDoc(transactionRef, {
        ...transaction,
        userId,
        category: transaction.category,
      });
    }

    const newCursor = transactionsResponse.data.next_cursor;
    await updateDoc(doc(db, "users", userId), {
      lastCursor: newCursor,
    });

    return NextResponse.json({ message: "Transactions synced successfully" });
  } catch (error) {
    console.error("Error syncing transactions for user:", userId, error);
    return NextResponse.json(
      { error: "Failed to sync transactions" },
      { status: 500 }
    );
  }
}

async function fireWebhook(request: NextRequest) {
  const { accessToken, userId } = await request.json();

  try {
    // Fire the webhook with the DEFAULT_UPDATE code
    await plaidClient.sandboxItemFireWebhook({
      access_token: accessToken,
      webhook_code: SandboxItemFireWebhookRequestWebhookCodeEnum.DefaultUpdate,
    });

    console.log("Webhook fired successfully");

    // Generate random new transactions
    const newTransactions = generateRandomTransactions(5, userId);

    // Process and store the new transactions in your database
    for (const transaction of newTransactions) {
      const transactionRef = doc(collection(db, "transactions"));
      await setDoc(transactionRef, transaction);
    }

    return NextResponse.json({
      message: "New transactions generated and processed successfully",
    });
  } catch (error) {
    console.error("Error generating and processing new transactions:", error);
    return NextResponse.json(
      { error: "Failed to generate and process new transactions" },
      { status: 500 }
    );
  }
}

function generateRandomTransactions(count: number, userId: string) {
  const transactions = [];
  const categories = [
    "Community",
    "Food and Drink",
    "Healthcare",
    "Payment",
    "Recreation",
    "Service",
    "Shops",
    "Travel",
  ];
  const transactionNames = [
    "Grocery Store",
    "Restaurant",
    "Online Purchase",
    "Gas Station",
    "Salary",
    "Freelance Work",
    "Gift",
    "Investment Income",
  ];

  for (let i = 0; i < count; i++) {
    const transactionId = `random-transaction-${Date.now()}-${i + 1}`;
    const isExpense = Math.random() < 0.8; // 80% chance of being an expense
    const amount = isExpense
      ? -1 * (Math.floor(Math.random() * 8) + 1)
      : Math.floor(Math.random() * 100) + 1;
    const category = isExpense
      ? categories[Math.floor(Math.random() * categories.length)]
      : "Miscellaneous";
    const transactionName = isExpense
      ? transactionNames[Math.floor(Math.random() * 4)] // Select from the first 4 transaction names for expenses
      : transactionNames[Math.floor(Math.random() * 4) + 4]; // Select from the last 4 transaction names for income
    const date = new Date().toISOString().slice(0, 10);

    const transaction = {
      transaction_id: transactionId,
      amount,
      category: [category],
      name: transactionName,
      date,
      userId,
    };

    transactions.push(transaction);
  }

  return transactions;
}

async function disconnectAccount(request: NextRequest) {
  const { userId } = await request.json();

  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const accessToken = userData.accessToken;

      // Remove the item from Plaid
      await plaidClient.itemRemove({
        access_token: accessToken,
      });

      // Remove bank-related data from Firestore
      await updateDoc(userDocRef, {
        accessToken: "",
        itemId: "",
        totalBalance: 0,
        bankName: "",
        isBankConnected: false,
      });

      // Remove transactions associated with the user
      const transactionsRef = collection(db, "transactions");
      const transactionsQuery = query(
        transactionsRef,
        where("userId", "==", userId)
      );
      const transactionsSnapshot = await getDocs(transactionsQuery);
      const transactionDocs = transactionsSnapshot.docs;

      await Promise.all(transactionDocs.map((doc) => deleteDoc(doc.ref)));

      // Remove budget data associated with the user
      const budgetDataRef = collection(db, "budgetData");
      const budgetDataQuery = query(
        budgetDataRef,
        where("userId", "==", userId)
      );
      const budgetDataSnapshot = await getDocs(budgetDataQuery);
      const budgetDataDocs = budgetDataSnapshot.docs;

      await Promise.all(budgetDataDocs.map((doc) => deleteDoc(doc.ref)));

      return NextResponse.json({
        message: "Account disconnected successfully",
      });
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error disconnecting account:", error);
    return NextResponse.json(
      { error: "Failed to disconnect account" },
      { status: 500 }
    );
  }
}

async function deleteAccount(request: NextRequest) {
  const { userId } = await request.json();

  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const accessToken = userData.accessToken;

      // Remove the item from Plaid
      await plaidClient.itemRemove({
        access_token: accessToken,
      });

      // Remove user data from Firestore
      await deleteDoc(userDocRef);

      // Remove transactions associated with the user
      const transactionsRef = collection(db, "transactions");
      const transactionsQuery = query(
        transactionsRef,
        where("userId", "==", userId)
      );
      const transactionsSnapshot = await getDocs(transactionsQuery);
      const transactionDocs = transactionsSnapshot.docs;

      await Promise.all(transactionDocs.map((doc) => deleteDoc(doc.ref)));

      // Remove budget data associated with the user
      const budgetDataRef = collection(db, "budgetData");
      const budgetDataQuery = query(
        budgetDataRef,
        where("userId", "==", userId)
      );
      const budgetDataSnapshot = await getDocs(budgetDataQuery);
      const budgetDataDocs = budgetDataSnapshot.docs;

      await Promise.all(budgetDataDocs.map((doc) => deleteDoc(doc.ref)));

      // Delete the user from Clerk authentication
      await clerkClient.users.deleteUser(userId);

      return NextResponse.json({
        message: "Account deleted successfully",
      });
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
