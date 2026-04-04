import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { RedditPost, RedditComment } from '../api/types';
import PostCard from './PostCard';
import CommentCard from './CommentCard';

type TabType = 'Overview' | 'Posts' | 'Comments';

export default function HiddenProfileFeed({ username }: { username: string }) {
  const [activeTab, setActiveTab] = useState<TabType>('Overview');
  
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [comments, setComments] = useState<RedditComment[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [postsBefore, setPostsBefore] = useState<number | undefined>();
  const [commentsBefore, setCommentsBefore] = useState<number | undefined>();

  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  const fetchPosts = async (before?: number) => {
    if (!hasMorePosts && before) return;
    try {
      const data = await apiClient.getPosts(username, before);
      if (data.length === 0) setHasMorePosts(false);
      setPosts(prev => before ? [...prev, ...data] : data);
      if (data.length > 0) setPostsBefore(data[data.length - 1].created_utc);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchComments = async (before?: number) => {
    if (!hasMoreComments && before) return;
    try {
      const data = await apiClient.getComments(username, before);
      if (data.length === 0) setHasMoreComments(false);
      setComments(prev => before ? [...prev, ...data] : data);
      if (data.length > 0) setCommentsBefore(data[data.length - 1].created_utc);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadData = async (isLoadMore = false) => {
    setLoading(true);
    setError(null);
    if (!isLoadMore) {
      await Promise.all([fetchPosts(), fetchComments()]);
    } else {
      let promises = [];
      if (activeTab === 'Posts' || activeTab === 'Overview') {
        if (hasMorePosts) promises.push(fetchPosts(postsBefore));
      }
      if (activeTab === 'Comments' || activeTab === 'Overview') {
        if (hasMoreComments) promises.push(fetchComments(commentsBefore));
      }
      await Promise.all(promises);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [username]);

  const allItems = [...posts, ...comments].sort((a, b) => b.created_utc - a.created_utc);

  let displayItems: Array<RedditPost | RedditComment> = [];
  if (activeTab === 'Posts') displayItems = posts;
  else if (activeTab === 'Comments') displayItems = comments;
  else displayItems = allItems;

  const handleLoadMore = () => loadData(true);

  const canLoadMore = activeTab === 'Posts' ? hasMorePosts : 
                      activeTab === 'Comments' ? hasMoreComments : 
                      (hasMorePosts || hasMoreComments);

  return (
    <div className="feed-container">
      <div className="tabs-container">
        {(['Overview', 'Posts', 'Comments'] as TabType[]).map(tab => (
          <button 
            key={tab} 
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && <div className="error-state">Error: {error}</div>}
      
      {!loading && !error && displayItems.length === 0 && (
        <div className="empty-state">No activity found.</div>
      )}

      {displayItems.map(item => {
        if ('title' in item) {
          return <PostCard key={`post-${item.id}`} post={item as RedditPost} username={username} />;
        } else {
          return <CommentCard key={`comment-${item.id}`} comment={item as RedditComment} username={username} />;
        }
      })}

      {loading && (
        <>
          <div className="skeleton-box"><div className="skeleton-line" style={{ width: '40%' }}></div><div className="skeleton-line"></div><div className="skeleton-line" style={{ width: '80%' }}></div></div>
          <div className="skeleton-box"><div className="skeleton-line" style={{ width: '30%' }}></div><div className="skeleton-line"></div></div>
        </>
      )}

      {!loading && !error && canLoadMore && displayItems.length > 0 && (
        <button className="load-more-btn" onClick={handleLoadMore}>
          Load More
        </button>
      )}
    </div>
  );
}
