"use server";
import api from '../axiosInstance';
import { cookies } from 'next/headers';


import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,
} from "plaid";

import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";

import { getTransactionsByBankId } from "./transaction.actions";




// Get multiple bank accounts
export const getAccounts = async () => {
  try {
    // Access the cookies on the server
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return null;
    }

    // Call Django's profile endpoint with the access token
    // const profileResponse = await api.get('/profile/', {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });

    // Fetch accounts
    const accountsResponse = await api.get(`/accounts/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const accounts = accountsResponse.data;

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total: number, account: any) => {
      const balance = parseFloat(account.balance || 0);
      return total + balance;
       // Assuming backend returns `current_balance`
    }, 0);

    return { data: accounts, totalBanks, totalCurrentBalance };
  } catch (error) {
    console.error('An error occurred while getting the accounts:', error);
    throw error;
  }
};


// Get one bank account
export const getAccount = async () => {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return null;
    }

    // Fetch data from the backend
    const response = await api.get(`transactions/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const transactionsData = response.data;

    // Map and expand transactions into a proper format
    const transactions = transactionsData.flatMap((transaction: any) => {
      const { account_id, account_name, data } = transaction;

      // Create a flattened list of transactions
      return data.map((item: any) => ({
        id: item.id,
        name: item.title,
        paymentChannel: item.payment_channel,
        type: item.transaction_type,
        accountId: account_id,
        amount: item.amount,
        status: item.status,
        category: item.category ? item.category[0] : "",
        date: new Date(item.date),
      }));
    });
    transactions.sort((a: any, b: any) => b.date.getTime() - a.date.getTime());

    return { transactions }; // Return an object with a transactions key
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
    throw error;
  }
};


// Get transactions
export const getTransactions = async ({
  accessToken,
}: getTransactionsProps) => {
  let hasMore = true;
  let transactions: any = [];

  try {
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;

      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      hasMore = data.has_more;
    }

    return parseStringify(transactions);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

export async function createTransactionOnServer(transactionData: any) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
    }

    const response = await api.post("local-transfer/", transactionData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating transaction on server:", error);
    throw error;
  }
}

// Function to create a local transfer
export async function createLocalTransfer(transactionData: any) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      throw new Error("Unauthorized: No access token found");
    }

    const response = await api.post("local-transfer/", transactionData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating local transfer:", error);
    throw error;
  }
}

// Function to validate local transfer with OTP
export async function validateLocalTransfer(transferId: number, otpCode: string) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      throw new Error("Unauthorized: No access token found");
    }

    const response = await api.post(`validate-local-transfer/${transferId}/`, { otp: otpCode }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error validating local transfer OTP:", error);
    throw error;
  }
}
