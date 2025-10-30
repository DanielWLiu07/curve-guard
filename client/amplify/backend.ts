import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';

export const backend = defineBackend({
  auth,
  // data, // Commented out for now - can add back when needed
});