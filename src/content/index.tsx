import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../components/App';
import styleContent from './index.css?inline';

function getUsername() {
  const match = window.location.pathname.match(/\/user\/([^\/]+)/);
  return match ? match[1] : null;
}

function mountReactApp(targetElement: Element) {
  if (document.getElementById('reddit-unhide-root')) return;

  const username = getUsername();
  if (!username) return;

  const container = document.createElement('div');
  container.id = 'reddit-unhide-root';
  container.style.marginTop = '20px';
  container.style.width = '100%';
  
  targetElement.parentNode?.insertBefore(container, targetElement.nextSibling);

  const shadowRoot = container.attachShadow({ mode: 'open' });
  
  const styleElement = document.createElement('style');
  styleElement.textContent = styleContent;
  shadowRoot.appendChild(styleElement);

  const reactRootDiv = document.createElement('div');
  shadowRoot.appendChild(reactRootDiv);

  const root = createRoot(reactRootDiv);
  root.render(<App username={username} />);
}

function findDeepestNodeWithText(searchStr: string): Element | null {
  const allElements = document.querySelectorAll('*');
  let deepestMatch: Element | null = null;
  for (const el of Array.from(allElements)) {
    const text = (el.textContent || '').toLowerCase();
    if (text.includes(searchStr)) {
      deepestMatch = el;
    }
  }
  return deepestMatch;
}

function checkForHiddenMessage() {
  if (document.getElementById('reddit-unhide-root')) return;

  console.log('[Reddit Unhider] Scanning for hidden profile message...');
  
  const searchStr = "likes to keep their posts hidden";
  const targetNode = findDeepestNodeWithText(searchStr);
  
  if (targetNode) {
     console.log('[Reddit Unhider] Found hidden message element!', targetNode);
     mountReactApp(targetNode);
     return;
  }
}

// Check frequently because Reddit is a Single Page Application (SPA)
// MutationObserver might miss it if it's very deeply nested or if we attach it before body exists
let scanningInterval = setInterval(() => {
  checkForHiddenMessage();
}, 2000);

// Also use a more robust MutationObserver
const observer = new MutationObserver(() => {
  checkForHiddenMessage();
});

if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

checkForHiddenMessage();
