import * as ynab from "ynab";
import { SaveTransactionWrapper } from "ynab";

const YNAB_ACCESS_TOKEN =
  "be651dc2f7903b4a477961352b95ca1f364eef82123c30005e93ca0b7f5c97b4";
export const YNAB_BUDGET_ID = "ab3274ba-cbbe-4f21-8c5b-bf356dc69142";

export type Account = {
  id: string;
  name: string;
  on_budget?: boolean;
  closed?: boolean;
  deleted?: boolean;
};

export type Payee = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
  hidden?: boolean;
  deleted?: boolean;
};

type MinimalObject = { id: string; name: string };

export type TransactionStatus = "idle" | "pending" | "success" | "error";

export const ynabAPI = new ynab.API(YNAB_ACCESS_TOKEN);

export const createTransaction = async ({
  accountId,
  amount,
  payee = { id: "", name: "" },
  category = { id: "", name: "" },
  memo = "",
  inflow = false,
}: {
  accountId: string;
  amount: number;
  payee?: Payee;
  category?: Category;
  memo?: string;
  inflow?: boolean;
}) => {
  const budgetId = YNAB_BUDGET_ID;
  if (!amount) {
    throw new Error("Amount is required");
  }

  const transactionsWrapper: SaveTransactionWrapper = {
    transaction: {
      account_id: accountId,
      date: new Date().toISOString().split("T")[0],
      amount: inflow ? Math.abs(amount) : -Math.abs(amount),
      payee_name: payee.name || null,
      payee_id: payee.id || null,
      category_id: category.id,
      memo,
    },
  };
  console.log("Transaction: %o", transactionsWrapper.transaction);

  await ynabAPI.transactions.createTransaction(budgetId, transactionsWrapper);
};

export async function getBudget() {
  const budgetResponse = await ynabAPI.budgets.getBudgetById(YNAB_BUDGET_ID);
  return budgetResponse.data.budget;
}

export function normalizeAccounts(accounts: Account[]): MinimalObject[] {
  return (
    accounts
      .filter(({ closed, deleted }) => !closed && !deleted)
      .filter(Boolean)
      .map(({ id, name }) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name)) || []
  );
}

export function normalizePayees(payees: Payee[]): MinimalObject[] {
  return payees
    .map(({ id, name }) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function normalizeCategories(categories: Category[]): MinimalObject[] {
  const cats =
    categories
      .filter(({ hidden, deleted }) => !hidden && !deleted)
      .filter(Boolean)
      .map(({ id, name }) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name)) || [];
  return cats;
}
