'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import api from '../axiosInstance';
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { redirect } from "next/navigation";
import { plaidClient } from '@/lib/plaid';
import { revalidatePath } from "next/cache";
// import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

export const signIn = async ({ email, password }: signInProps) => {
  try {
    // Step 1: Authenticate user with DRF login endpoint
    const loginResponse = await api.post('/login/', {
      email,
      password,
    });

    if (!loginResponse.data || !loginResponse.data.access) {
      throw new Error('Invalid login credentials.');
    }

    const { access, refresh } = loginResponse.data;

    // Step 2: Save tokens in server cookies
    cookies().set("access_token", access, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    cookies().set("refresh_token", refresh, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    // Step 3: Retrieve user information from DRF profile endpoint
    const profileResponse = await api.get('/profile/', {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    const user = profileResponse.data;

    console.log("User signed in successfully:", user);
    return user;
  } catch (error: any) {
    console.error("Error during sign-in:", error.response?.data || error.message);
    throw error; // Re-throw error for higher-level handling
  }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName, address1, city, state, postalCode, dateOfBirth, ssn } = userData;


  try {
    // Step 1: Register the user
    const userResponse = await api.post('/register/', {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      address: address1,
      city,
      state,
      postal_code: postalCode,
      dob :dateOfBirth,
      ssn,
    });


    

    if (!userResponse.data || !userResponse.data.user) {
      throw new Error('Error creating user.');
    }


   redirect("/sign-in"); // Assuming "/sign-in" is your login page route
    return { newUser: userResponse.data.user };
  } catch (error) {
    console.error('Error during sign-up:', error);
    throw error;
  }
};

export async function getLoggedInUser() {
  try {
    // Access the cookies on the server
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return null;
    }

    // Call Django's profile endpoint with the access token
    const response = await api.get('/profile/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const user = response.data;
    return user;
  } catch (error: any) {
    console.error("Error fetching logged-in user data:", error.response?.data || error.message);
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    // Remove tokens from cookies
    cookies().delete('access_token');
    cookies().delete('refresh_token');

    // Optionally notify the server to invalidate the token
  } catch (error) {
    console.error('Error during logout:', error);
    return null;
  }
};

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id
      },
      client_name: `${user.first_name} ${user.last_name}`,
      products: ['auth'] as Products[],
      language: 'en',
      country_codes: ['US'] as CountryCode[],
    }

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token })
  } catch (error) {
    console.log(error);
  }
}

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      }
    )

    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
}

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    
    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

     // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
    //  const fundingSourceUrl = await addFundingSource({
    //   dwollaCustomerId: user.dwollaCustomerId,
    //   processorToken,
    //   bankName: accountData.name,
    // });
    
    // If the funding source URL is not created, throw an error
    // if (!fundingSourceUrl) throw Error;

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
    // await createBankAccount({
    //   userId: user.$id,
    //   bankId: itemId,
    //   accountId: accountData.account_id,
    //   accessToken,
    //   fundingSourceUrl,
    //   shareableId: encryptId(accountData.account_id),
    // });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
  }
}

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )

    return parseStringify(banks.documents);
  } catch (error) {
    console.log(error)
  }
}

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('$id', [documentId])]
    )

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('accountId', [accountId])]
    )

    if(bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error)
  }
}