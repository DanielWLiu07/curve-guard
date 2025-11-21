import React from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './App.jsx';
import './index.css';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID || 'us-east-1_placeholder',
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID || 'placeholder',
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true
      }
    }
  }
};

Amplify.configure(amplifyConfig);

document.documentElement.setAttribute("data-theme", "dark");

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);


