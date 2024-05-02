// typinsgs.ts

export type BalanceData = {
  month: string;
  expenses: number;
  income: number;
};

export type SpendingData = {
  month: string;
  travel: number;
  food: number;
  housing: number;
};

export interface Transaction {
  transaction_id: string;
  // Add other properties as needed
}

export interface RemovedTransaction {
  transaction_id: string | undefined;
  // Add other properties as needed
}

export interface TransactionsResponse {
  added: Transaction[];
  removed: RemovedTransaction[];
  modified: Transaction[];
  nextCursor: string | null;
}
