import * as React from 'react';
import Toggle from "../Toggle/Toggle";
import PayeeDropdown from "../PayeeDropdown/PayeeDropdown";
import CategoryDropdown from "../CategoryDropdown/CategoryDropdown";
import CurrencyInput from "../CurrencyInput/CurrencyInput";
import {
  Category,
  createTransaction,
  getBudget,
  normalizeAccounts,
  normalizeCategories,
  normalizePayees,
  Payee,
  TransactionStatus,
  ynabAPI,
  YNAB_BUDGET_ID,
} from "../utils";

// import {browser, Tabs} from 'webextension-polyfill-ts';

// import './styles.scss';

export type CurrencyFormat = {
  currency_symbol: string;
  decimal_digits: number;
  decimal_separator: "." | "," | "";
  display_symbol: boolean;
  group_separator: "," | ".";
  iso_code: string;
  symbol_first: boolean;
};

export default function Popup() {
  const [budget, setBudget] = React.useState({});
  const [currencyFormat, setCurrencyFormat]: [CurrencyFormat, any] =
    React.useState({
      currency_symbol: "$",
      decimal_digits: 2,
      decimal_separator: ".",
      display_symbol: true,
      group_separator: ",",
      iso_code: "USD",
      symbol_first: true,
    });
  const [loadingBudget, setLoadingBudget] = React.useState(true);
  const [accounts, setAccounts] = React.useState([]);
  const [selectedAccount, setSelectedAccount] = React.useState("");
  const [payees, setPayees] = React.useState([]);
  const [selectedPayee, setSelectedPayee] = React.useState({} as Payee);
  const [memo, setMemo] = React.useState("");
  const [inflow, setInflow] = React.useState(false);
  const [amount, setAmount] = React.useState(0);

  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState(
    {} as Category
  );

  const [transactionStatus, setTransactionStatus]: [TransactionStatus, any] =
    React.useState("idle");

  React.useEffect(() => {
    ynabAPI.budgets.getBudgetById(YNAB_BUDGET_ID);
  }, []);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const transactionData = {
      accountId: selectedAccount,
      amount,
      payee: selectedPayee,
      category: selectedCategory,
      memo,
      inflow,
    };
    try {
      setTransactionStatus("pending");
      await createTransaction(transactionData);
      setTransactionStatus("complete");
    } catch (e) {
      setTransactionStatus("error");
      console.error(e);
    }
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

  async function fetchBudget() {
    try {
      const budget = await getBudget();
      setBudget(budget);
      console.log({ budget });
      setCurrencyFormat(budget.currency_format);
      setAccounts(normalizeAccounts(budget.accounts));
      setSelectedAccount(budget.accounts[0].id || "");
      setCategories(normalizeCategories(budget.categories));
      setPayees(normalizePayees(budget.payees));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBudget(false);
    }
  }

  React.useEffect(() => {
    fetchBudget();
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
              <label
                htmlFor="account"
                className="block text-sm font-medium text-gray-700"
              >
                Account
              </label>
              <select
                id="account"
                name="account"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                onChange={(event) => setSelectedAccount(event.target.value)}
              >
                {accounts.map(({ id, name }) => {
                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <PayeeDropdown
                onSelectedItemChange={onSelectedPayeeChange}
                disabled={loadingBudget}
                items={payees}
                label="Payee"
              />
            </div>

            <div>
              <CategoryDropdown
                onSelectedItemChange={onSelectedCategoryChange}
                disabled={loadingBudget}
                items={categories}
                label="Category"
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
                  placeholder="Enter Memo"
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
                <CurrencyInput
                  onNumericValue={(value: number) => setAmount(value)}
                  maskOptions={currencyFormat}
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
            disabled={transactionStatus === "pending"}
          >
            {transactionStatus === "pending" ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
