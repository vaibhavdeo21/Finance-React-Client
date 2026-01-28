// 'StrictMode' is a tool that helps check for potential problems in your app.
import { StrictMode } from 'react'
// 'createRoot' is the modern way to start React (React 18+).
import { createRoot } from 'react-dom/client'
// We import the main App component we just built.
import App from './App.jsx'

// 1. document.getElementById('root'): Finds the <div id="root"> in your index.html file.
// 2. createRoot(...): Takes control of that div.
// 3. .render(...): Puts your <App /> inside that div.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)