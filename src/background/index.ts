import { ApiMessageRequest } from '../api/types';

const API_BASE = 'https://arctic-shift.photon-reddit.com';

let rateLimitRemaining = 100;
let rateLimitResetTime = 0;

async function fetchWithRateLimit(url: string) {
  if (rateLimitRemaining < 5 && Date.now() < rateLimitResetTime) {
    throw new Error('Rate limit exceeded. Please wait a moment.');
  }

  const response = await fetch(url);
  
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const reset = response.headers.get('X-RateLimit-Reset');
  
  if (remaining !== null) rateLimitRemaining = parseInt(remaining, 10);
  if (reset !== null) rateLimitResetTime = Date.now() + parseInt(reset, 10) * 1000;

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

chrome.runtime.onMessage.addListener((request: ApiMessageRequest, sender, sendResponse) => {
  const handleRequest = async () => {
    try {
      const { action, username, before } = request;
      let url = '';
      
      if (action === 'GET_USER') {
        url = `${API_BASE}/api/users/search?author=${encodeURIComponent(username)}`;
        const resp = await fetchWithRateLimit(url);
        let items = Array.isArray(resp) ? resp : (resp.data && Array.isArray(resp.data) ? resp.data : []);
        const userStats = items.length > 0 ? items[0] : null;
        sendResponse({ success: true, data: userStats });
        return;
      }
      
      const beforeParam = before ? `&before=${before}` : '';
      
      if (action === 'GET_POSTS') {
        url = `${API_BASE}/api/posts/search?author=${encodeURIComponent(username)}&limit=25&sort=desc&md2html=true${beforeParam}`;
      } else if (action === 'GET_COMMENTS') {
        url = `${API_BASE}/api/comments/search?author=${encodeURIComponent(username)}&limit=25&sort=desc&md2html=true${beforeParam}`;
      } else {
        throw new Error('Unknown action');
      }

      const data = await fetchWithRateLimit(url);
      sendResponse({ success: true, data });
    } catch (error: any) {
      sendResponse({ success: false, error: error.message });
    }
  };

  handleRequest();
  
  // Return true to indicate asynchronous response
  return true;
});
