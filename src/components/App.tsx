import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { RedditUserStats } from '../api/types';
import ProfileHeader from './ProfileHeader';
import HiddenProfileFeed from './HiddenProfileFeed';

interface AppProps {
  username: string;
}

export default function App({ username }: AppProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [stats, setStats] = useState<RedditUserStats | null>(null);

  useEffect(() => {
    apiClient.getUser(username).then(setStats).catch(console.error);
  }, [username]);

  return (
    <div className="unhider-box">
      <div className="toggle-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="toggle-title">
          Hidden Profile Recovered
          <span className="arctic-badge">via Arctic Shift</span>
        </div>
        <div>
          {isOpen ? '▼' : '►'}
        </div>
      </div>
      
      <div className={`unhider-content ${isOpen ? 'is-open' : ''}`}>
        {stats && <ProfileHeader stats={stats} />}
        <HiddenProfileFeed username={username} />
      </div>
    </div>
  );
}
