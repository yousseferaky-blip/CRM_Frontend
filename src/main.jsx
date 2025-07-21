import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import UserContext from './Context/UserContext.jsx'
import './i18n'; 
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <UserContext>
            <ToastContainer /> 
            <App />
        </UserContext>
      </I18nextProvider>
    </BrowserRouter>
  </StrictMode>,
)
