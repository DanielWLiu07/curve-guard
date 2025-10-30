import React from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import amplifyOutputs from './amplify_outputs.json';
import App from './App.jsx';
import './index.css';

Amplify.configure(amplifyOutputs);

document.documentElement.setAttribute("data-theme", "dark");

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);


