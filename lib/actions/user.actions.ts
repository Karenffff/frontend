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
        case 403:
            return { success: false, error: "Email not verified. Please check your inbox." }
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
  const { email, firstName, lastName, address1, city, state, postalCode, dateOfBirth, ssn, } = userData;


  try {
    // Step 1: Register the user
    const response = await api.post('/register/', {
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
    if (response.status === 201) {
      return {
        success: true,
        message: "User registered successfully. Please verify your email.",
      }
    } else {
      throw new Error("Unexpected response from server")
    }
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response
      return {
        success: false,
        error: data.detail || "An error occurred during sign-up.",
      }
    }
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}

export const verifyEmail = async (uidb64: string, token: string) => {
  try {
    const response = await api.get(`/verify/${uidb64}/${token}/`)
    if (response.status === 200) {
      return {
        success: true,
        message: "Email successfully verified",
      }
    } else {
      throw new Error("Unexpected response from server")
    }
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response
      return {
        success: false,
        error: data.error || "An error occurred during email verification.",
      }
    }
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}


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

export async function updateUserProfile(data: {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  ssn:string;
}) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      throw new Error("User not authenticated");
    }

    const response = await api.patch('/profile/', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.data) {
      throw new Error('Error updating user profile.');
    }

    // Revalidate the settings page to reflect the changes
    revalidatePath('/settings');

    return { success: true, user: response.data };
  } catch (error: any) {
    console.error("Error updating user profile:", error.response?.data || error.message);
    return { success: false, error: error.response?.data?.detail || error.message || 'An error occurred while updating the profile.' };
  }
}

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

export const resetPasswordRequest = async (email: string) => {
  try {
    const response = await api.post('/password-reset/', { email });

    if (response.data.message) {
      return { success: true, message: 'Password reset email has been sent.' };
    } else {
      return { success: false, error: 'Failed to send reset password email.' };
    }
  } catch (error: any) {
    console.error('Error during password reset request:', error);
    return { success: false, error: error.response?.data?.detail || error.message || 'An error occurred while sending the reset password request.' };
  }
};



export const resetPassword = async (resetToken: string, newPassword: string,uuid: string) => {
  try {
    const response = await api.post('/password-reset/confirm/', {
      reset_token: resetToken,
      new_password: newPassword,
      uidb64: uuid,
    });

    if (response.data.message) {
      return { success: true, message: 'Password has been successfully reset.' };
    } else {
      return { success: false, error: 'Failed to reset the password.' };
    }
  } catch (error: any) {
    console.error('Error during password reset:', error);
    return { success: false, error: error.response?.data?.detail || error.message || 'An error occurred while resetting the password.' };
  }
};




export const updateUserPassword = async (oldPassword: string, newPassword: string) => {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      throw new Error("User not authenticated");
    }

    const response = await api.put(
      "/api/update-password/",
      { old_password: oldPassword, new_password: newPassword },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use token from cookies
        },
      }
    );

    console.log(response.data.message);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    console.error("Error updating password:", error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.detail || error.response?.data || error.message || 'An error occurred while updating the password.' 
    };
  }
};
