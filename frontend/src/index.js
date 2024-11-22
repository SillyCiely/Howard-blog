import React from 'react';
import ReactDOM from 'react-dom/client';
import './Styles/global-variables.css';
import './Styles/global-font.css';
import './Styles/global-format.css';
import App from './App';
import reportWebVitals from './Utils/reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();