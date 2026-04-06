import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app'
import { BRAND_NAME } from 'shared/config/brand'

document.title = BRAND_NAME

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

