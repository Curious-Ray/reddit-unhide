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

  let emptyStateWrapper: HTMLElement | null = targetElement as HTMLElement;
  for (let i = 0; i < 4; i++) {
    if (emptyStateWrapper?.parentElement && emptyStateWrapper.parentElement.tagName.toLowerCase() !== 'body') {
      emptyStateWrapper = emptyStateWrapper.parentElement;
    }
  }

  let insertPoint = targetElement;
  if (emptyStateWrapper) {
    emptyStateWrapper.style.display = 'none';
    insertPoint = emptyStateWrapper;
  }

  const container = document.createElement('div');
  container.id = 'reddit-unhide-root';
  container.style.width = '100%';
  container.style.marginTop = '12px';
  
  insertPoint.parentNode?.insertBefore(container, insertPoint.nextSibling);

  const root = createRoot(container);
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
