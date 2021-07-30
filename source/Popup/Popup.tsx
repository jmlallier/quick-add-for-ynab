import * as React from 'react';
import Toggle from "../Toggle/Toggle";
import * as ynab from "ynab";
import { SaveTransactionWrapper } from "ynab";
import PayeeDropdown from "../PayeeDropdown/PayeeDropdown";
import CategoryDropdown from "../CategoryDropdown/CategoryDropdown";

// import {browser, Tabs} from 'webextension-polyfill-ts';

// import './styles.scss';

const YNAB_ACCESS_TOKEN =
  "be651dc2f7903b4a477961352b95ca1f364eef82123c30005e93ca0b7f5c97b4";
const YNAB_BUDGET_ID = "5a0c4806-5a7d-4c55-8c22-c4ecd11f1041";
const YNAB_ACCOUNT_ID = "edfc49ba-9b7f-457e-a6e5-cb3b6ce87f1d";

export type Payee = {
  id: string | null;
  name: string | null;
};

export type Category = {
  id: string | null;
  name: string | null;
};

type CategoryGroup = {
  categories: Category[];
};

type CategoryGroups = CategoryGroup[];

const ynabAPI = new ynab.API(YNAB_ACCESS_TOKEN);

const createTransaction = async ({
  amount,
  payee = { id: null, name: null },
  category = { id: null, name: null },
  memo = "",
  inflow = false,
}: {
  amount: number;
  payee?: Payee;
  category?: Category;
  memo?: string;
  inflow?: boolean;
}) => {
  const budgetId = YNAB_BUDGET_ID;
  const accountId = YNAB_ACCOUNT_ID;

  const transactionsWrapper: SaveTransactionWrapper = {
    transaction: {
      account_id: accountId,
      date: new Date().toISOString().split("T")[0],
      amount: inflow ? Math.abs(amount) : -Math.abs(amount),
      payee_name: payee.name,
      payee_id: payee.id,
      category_id: category.id,
      memo,
    },
  };
  console.log("Transaction: %o", transactionsWrapper.transaction);

  const saveTransaction = await ynabAPI.transactions.createTransaction(
    budgetId,
    transactionsWrapper
  );
  console.log({ saveTransaction });
};
*/

async function getPayees() {
  const payeesResponse = await ynabAPI.payees.getPayees(YNAB_BUDGET_ID);
  return (
    payeesResponse.data.payees
      .map(({ id, name }) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name)) || []
  );
}

async function getCategories() {
  const categoriesResponse = await ynabAPI.categories.getCategories(
    YNAB_BUDGET_ID
  );
  const cats =
    categoriesResponse.data.category_groups
      .flatMap((group) => group.categories)
      .filter(({ hidden, deleted }) => !hidden && !deleted)
      .filter(Boolean)
      .map(({ id, name }) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name)) || [];
  return cats;
}

export default function Popup() {
  const defaultPayees: Payee[] | [] = [];
  const [payees, setPayees] = React.useState(defaultPayees);
  const [selectedPayee, setSelectedPayee] = React.useState({} as Payee);
  const [loadingPayees, setLoadingPayees] = React.useState(true);
  const [memo, setMemo] = React.useState("");
  const [inflow, setInflow] = React.useState(false);
  const [amount, setAmount] = React.useState(0);

  const defaultCategories: Category[] | [] = [];
  const [categories, setCategories] = React.useState(defaultCategories);
  const [selectedCategory, setSelectedCategory] = React.useState(
    {} as Category
  );
  const [loadingCategories, setLoadingCategories] = React.useState(true);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const transactionData = {
      amount,
      payee: selectedPayee,
      category: selectedCategory,
      memo,
      inflow,
    };
    await createTransaction(transactionData);
  };

  const onSelectedPayeeChange = (changes: {
    selectedItem: Payee;
    [key: string]: any;
  }) => {
    const { selectedItem } = changes;
    setSelectedPayee(selectedItem);
    return changes;
  };

  const onSelectedCategoryChange = (changes: {
    selectedItem: Payee;
    [key: string]: any;
  }) => {
    const { selectedItem } = changes;
    setSelectedCategory(selectedItem);
    return changes;
  };

  async function fetchPayees() {
    try {
      const payeeResponse: Payee[] = await getPayees();
      setPayees(payeeResponse);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPayees(false);
    }
  }

  async function fetchCategories() {
    try {
      const categoryResponse: Category[] = await getCategories();
      setCategories(categoryResponse);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCategories(false);
    }
  }
  React.useEffect(() => {
    fetchPayees();
    fetchCategories();
  }, []);
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow w-96">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Add a new transaction
            </h3>
            <div className="max-w-xl mt-2 text-sm text-gray-500">
              <p>Enter a transaction</p>
            </div>
          </div>
          <Toggle
            onToggle={(value: boolean) => setInflow(value)}
            label={(enabled) => (enabled ? "Inflow" : "Outflow")}
          />
        </div>
        <form
          className="flex-col mt-5 space-y-4 sm:flex"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col w-full space-y-3">
            <div>
              <PayeeDropdown
                onSelectedItemChange={onSelectedPayeeChange}
                disabled={loadingPayees}
                items={payees}
                label="Payee"
              />
            </div>

            <div>
              <CategoryDropdown
                onSelectedItemChange={onSelectedCategoryChange}
                disabled={loadingCategories}
                items={categories}
                label="Categories"
              />
            </div>

            <div>
              <label
                htmlFor="memo"
                className="block text-sm font-medium text-gray-700"
              >
                Memo
              </label>
              <div className="mt-1">
                <input
                  onInput={(event: React.SyntheticEvent<HTMLInputElement>) =>
                    setMemo(event.target.value)
                  }
                  id="memo"
                  name="memo"
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount
              </label>
              <div className="mt-1">
                <input
                  onInput={(event: React.SyntheticEvent<HTMLInputElement>) =>
                    setAmount(Number(event.target.value) || 0)
                  }
                  id="amount"
                  name="amount"
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
