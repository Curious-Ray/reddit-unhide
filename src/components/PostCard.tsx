import React from 'react';
import { RedditPost } from '../api/types';

export default function PostCard({ post }: { post: RedditPost, username: string }) {
  const date = new Date(post.created_utc * 1000).toLocaleDateString();
  const htmlContent = post.selftext || ''; 
  const link = post.url?.startsWith('http') ? post.url : `https://reddit.com${post.url || ''}`;

  return (
    <div className="card">
      <div className="card-meta">
        <span className="card-subreddit">
          <a href={`https://reddit.com/r/${post.subreddit}`} target="_blank" rel="noreferrer">r/{post.subreddit}</a>
        </span>
        <span>•</span>
        <span>{date}</span>
      </div>
      <h3 className="card-title">
        <a href={link} target="_blank" rel="noreferrer">
          {post.title}
        </a>
      </h3>
      {htmlContent && (
        <div className="card-body md-html fade-out">
           <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      )}
      <div className="card-footer">
        <span>{post.score} points</span>
        <span>{post.num_comments} comments</span>
      </div>
    </div>
  );
}
