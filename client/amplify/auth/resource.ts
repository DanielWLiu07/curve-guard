import { defineAuth, secret } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
      },
      facebook: {
        clientId: secret('FACEBOOK_CLIENT_ID'),
        clientSecret: secret('FACEBOOK_CLIENT_SECRET'),
      },
      signInWithApple: {
        clientId: secret('APPLE_CLIENT_ID'),
        teamId: secret('APPLE_TEAM_ID'),
        keyId: secret('APPLE_KEY_ID'),
        privateKey: secret('APPLE_PRIVATE_KEY'),
      },
      callbackUrls: [
        'http://localhost:5173/',
        'https://your-domain.com/',
      ],
      logoutUrls: [
        'http://localhost:5173/',
        'https://your-domain.com/',
      ],
    },
  },
});