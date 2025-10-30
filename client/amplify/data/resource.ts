import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // Placeholder model for now
  Placeholder: a.model({
    id: a.id(),
    name: a.string(),
  }).authorization(allow => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});