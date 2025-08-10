// Type declaration to silence missing types error for expo-notifications module
declare module "expo-notifications";

// Type declarations for environment variables
declare module "@env" {
  export const EXPO_PUBLIC_GOOGLE_OAUTH_WEB_ID: string;
  export const EXPO_PUBLIC_GOOGLE_OAUTH_IOS_ID: string;
  export const EXPO_PUBLIC_GOOGLE_OAUTH_IOS_SCHEME: string;
  export const EXPO_PUBLIC_SHEET_ID: string;
  export const EXPO_PUBLIC_SHEET_NAME: string;
}
