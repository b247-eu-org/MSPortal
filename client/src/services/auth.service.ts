import {
  PublicClientApplication,
  type Configuration,
  type AccountInfo,
  type SilentRequest,
} from '@azure/msal-browser';

const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
};

export class AuthService {
  private static isInitialized = false;

  public static async initialize(): Promise<void> {
    if (!this.isInitialized) {
      await msalInstance.initialize();
      await msalInstance.handleRedirectPromise();
      this.isInitialized = true;
    }
  }

  public static getAccount(): AccountInfo | null {
    const accounts = msalInstance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }

  public static async login(): Promise<AccountInfo | null> {
    await this.initialize();
    const response = await msalInstance.loginPopup(loginRequest);
    return response.account;
  }

  public static async logout(): Promise<void> {
    await this.initialize();
    const account = this.getAccount();
    await msalInstance.logoutPopup({ account: account || undefined });
  }

  public static async getToken(): Promise<string> {
    await this.initialize();
    const account = this.getAccount();
    if (!account) throw new Error('Not logged in');

    const request: SilentRequest = { ...loginRequest, account };
    try {
      const response = await msalInstance.acquireTokenSilent(request);
      return response.idToken;
    } catch {
      const response = await msalInstance.acquireTokenPopup(request);
      return response.idToken;
    }
  }

  // Fetch Microsoft Avatar Blob & Convert to Base64 Image
  public static async getProfilePhoto(): Promise<string | null> {
    try {
      await this.initialize();
      const account = this.getAccount();
      if (!account) return null;

      const tokenRes = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
      });

      const res = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
        headers: { Authorization: `Bearer ${tokenRes.accessToken}` },
      });

      if (!res.ok) return null;

      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  }
}