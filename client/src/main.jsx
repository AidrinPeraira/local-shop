import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {ThemeProvider} from '@mui/material'
import { customTheme } from './customThemeMUI.js'


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ThemeProvider theme={customTheme}>
        <App />
      </ThemeProvider>
  </StrictMode>
)
