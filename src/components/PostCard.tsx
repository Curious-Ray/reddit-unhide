import React, { useState } from 'react';
import { RedditPost } from '../api/types';

export default function PostCard({ post, username }: { post: RedditPost, username: string }) {
  const [hovered, setHovered] = useState(false);

  const renderTime = (utc: number) => {
     const diff = Math.floor(Date.now() / 1000) - utc;
     if (diff < 60) return `${diff} sec. ago`;
     if (diff < 3600) return `${Math.floor(diff/60)} min. ago`;
     if (diff < 86400) return `${Math.floor(diff/3600)} hr. ago`;
     return `${Math.floor(diff/86400)} days ago`;
  };

  const aStyle = { textDecoration: 'none', color: 'inherit' };

  return (
    <div 
      style={{ padding: '8px 16px', borderBottom: '1px solid var(--color-neutral-border-weak, #34454d)', backgroundColor: hovered ? 'var(--color-neutral-background-hover, #2a3236)' : 'transparent', transition: 'background-color 0.1s', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ fontSize: '12px', display: 'flex', gap: '6px', color: 'var(--color-neutral-content-weak, #8da4ae)', marginBottom: '4px', alignItems: 'center' }}>
        <img src="https://www.redditstatic.com/desktop2x/img/favicon/favicon-16x16.png" style={{width: 16, height: 16, borderRadius: '50%'}} alt="Subreddit" />
        <a href={`https://reddit.com/r/${post.subreddit}`} style={{ fontWeight: 600, color: 'var(--color-neutral-content-strong, #f2f4f5)', textDecoration: 'none' }}>r/{post.subreddit}</a>
        <span>•</span>
        <span>{renderTime(post.created_utc)}</span>
      </div>
      
      <h3 style={{ fontSize: '16px', margin: '0 0 8px 0', fontWeight: 600, color: 'var(--color-neutral-content-strong, #f2f4f5)', lineHeight: 1.2 }}>
        <a href={post.url} style={aStyle}>{post.title}</a>
      </h3>

      {post.selftext && (
        <div style={{ color: 'var(--color-neutral-content-strong, #f2f4f5)', fontSize: '14px', marginBottom: '8px', maxHeight: '100px', overflow: 'hidden', textOverflow: 'ellipsis', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }} dangerouslySetInnerHTML={{ __html: post.selftext }} />
      )}

      <div style={{ display: 'flex', gap: '8px', color: 'var(--color-neutral-content-strong, #f2f4f5)', fontSize: '12px', fontWeight: 600, alignItems: 'center' }}>
        <div style={{ background: 'var(--color-neutral-background-weak, #2a3236)', borderRadius: '999px', padding: '6px 10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
           <span style={{ fontSize: 16 }}>⇧</span> {post.score} <span style={{ fontSize: 16 }}>⇩</span>
        </div>
        <div style={{ background: 'var(--color-neutral-background-weak, #2a3236)', borderRadius: '999px', padding: '6px 12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
           <span style={{ fontSize: 14 }}>💬</span> {post.num_comments}
        </div>
        <div style={{ background: 'var(--color-neutral-background-weak, #2a3236)', borderRadius: '999px', padding: '6px 12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
           <span style={{ fontSize: 14 }}>➥</span> Share
        </div>
      </div>
    </div>
  );
}
