'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import api from '../axiosInstance';
import { login, getProfile } from './api';
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { redirect } from "next/navigation";
import { plaidClient } from '@/lib/plaid';
import { revalidatePath } from "next/cache";
import { useRouter } from 'next/navigation';
// import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

export interface SignInProps {
  email: string;
  password: string;
}



export const signIn = async ({ email, password }: SignInProps) => {
  try {
    const { access, refresh } = await login(email, password);

    if (!access || !refresh) {
      throw new Error('Invalid login credentials.');
    }

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

    const user = await getProfile(access);

    return { success: true, user };
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          return { success: false, error: 'Invalid email or password.' };
        case 401:
            return { success: false, error: 'Your account has been blocked. Please contact support.' };
        case 429:
          return { success: false, error: 'Too many login attempts. Please try again later.' };
        default:
          return { success: false, error: data.detail || 'An error occurred during sign-in.' };
      }
    }
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName, address1, city, state, postalCode, dateOfBirth, ssn, pin } = userData;


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
      pin,
    });


    

    if (!userResponse.data || !userResponse.data.user) {
      throw new Error('Error creating user.');
    }

    redirect("/sign-in");
    return { newUser: userResponse.data.user };
  } catch (error) {
    console.error('Error during sign-up:', error);
    throw error;
  }
};

export const setPIN = async ({ email, pin }: { email: string; pin: string }) => {
  try {
    // Step 1: Send PIN to the backend
    const response = await api.post('/setupin/', {
      email,
      pin,
    });

    if (!response.data || !response.data.success) {
      throw new Error('Error setting PIN.');
    }

    // Step 2: Redirect to the dashboard or another appropriate page
    
    
    return { success: true };
  } catch (error: any) {
    console.error('Error during PIN setup:', error);
    return { 
      success: false, 
      error: error.response?.data?.detail || error.message || 'An error occurred during PIN setup.'
    };
  }
};


export const getLoggedInUser = async () => {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return null;
    }

    const user = await getProfile(accessToken);
    return user;
  } catch (error: any) {
    console.error("Error fetching logged-in user data:", error.response?.data || error.message);
    return null;
  }
};

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


