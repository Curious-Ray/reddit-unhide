import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { RedditUserStats } from '../api/types';
import HiddenProfileFeed from './HiddenProfileFeed';

export default function App({ username }: { username: string }) {
  const [stats, setStats] = useState<RedditUserStats | null>(null);

  useEffect(() => {
    apiClient.getUser(username).then(setStats).catch(console.error);
  }, [username]);

  return (
    <>
      <style>{`
        .unhider-feed-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 0px;
          border-bottom: 1px solid var(--color-neutral-border-weak, #34454d);
          padding-bottom: 12px;
          margin-top: 12px;
        }
        .unhider-pill {
          background: transparent;
          border: none;
          color: var(--color-neutral-content-weak, #8da4ae);
          padding: 8px 16px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.1s, color 0.1s;
        }
        .unhider-pill:hover {
          background: var(--color-neutral-background-hover, #2a3236);
        }
        .unhider-pill.active {
          background: var(--color-neutral-background-selected, #333d42);
          color: var(--color-neutral-content-strong, #f2f4f5);
        }
        .unhider-load-more {
          width: 100%;
          padding: 12px;
          margin-top: 16px;
          border-radius: 999px;
          background: var(--color-neutral-background-hover, #2a3236);
          color: var(--color-neutral-content-strong, #f2f4f5);
          border: none;
          font-weight: 600;
          cursor: pointer;
        }
        .unhider-load-more:hover {
          background: var(--color-neutral-background-selected, #333d42);
        }
      `}</style>
      <div style={{ width: '100%' }}>
        <HiddenProfileFeed username={username} />
      </div>
    </>
  );
}
