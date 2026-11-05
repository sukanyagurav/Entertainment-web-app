import React from 'react'
import App from './components/App'
import { createRoot } from 'react-dom/client'
import './components/globals.css'
const container = document.getElementById('root')
const root = createRoot(container)
root.render(<>
    <App/>
</>)
