import { createRoot } from 'react-dom/client';

import App from './App';

import './index.css';

// Third-party ad scripts (Adsterra) throw non-Error values or fire script-load
// error events with event.error === null when blocked by the browser.
// Intercept these early — before the Replit runtime error modal registers its
// listener — so they don't surface as phantom "unknown runtime error" crashes.
window.addEventListener(
  'error',
  (event) => {
    if (!(event.error instanceof Error)) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  },
  true, // capture phase — runs before modal's bubble-phase listener
);

window.addEventListener('unhandledrejection', (event) => {
  if (!(event.reason instanceof Error)) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(<App />);
