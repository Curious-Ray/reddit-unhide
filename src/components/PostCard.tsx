import React, { useState } from 'react';
import { RedditPost } from '../api/types';

export default function PostCard({ post, username }: { post: RedditPost, username: string }) {
  const [hovered, setHovered] = useState(false);
  const [subHovered, setSubHovered] = useState(false);

  const [expanded, setExpanded] = useState(false);

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
      onClick={(e) => {
         try {
           window.localStorage.setItem(`unhide_post_${post.id}`, JSON.stringify(post));
         } catch (err) {}
         if (chrome.storage && chrome.storage.local) {
           chrome.storage.local.set({ [`unhide_post_${post.id}`]: post });
         }
         
         window.location.href = `https://reddit.com${post.permalink}`;
      }}
    >
      <div>
        <div style={{ fontSize: '12px', display: 'flex', gap: '6px', color: 'var(--color-neutral-content-weak, #8da4ae)', marginBottom: '4px', alignItems: 'center' }}>
          <img src="https://www.redditstatic.com/desktop2x/img/favicon/favicon-16x16.png" style={{width: 16, height: 16, borderRadius: '50%', transform: 'translateY(8.5px)'}} alt="Subreddit" />
          <a 
            href={`https://reddit.com/r/${post.subreddit}`} 
            onClick={(e) => e.stopPropagation()} 
            onMouseEnter={() => setSubHovered(true)}
            onMouseLeave={() => setSubHovered(false)}
            style={{ fontWeight: 600, color: subHovered ? '#24a0ed' : 'var(--color-neutral-content-strong, #f2f4f5)', textDecoration: subHovered ? 'underline' : 'none', lineHeight: '16px' }}
          >
            r/{post.subreddit}
          </a>
          <span style={{ lineHeight: '16px' }}>•</span>
          <span style={{ lineHeight: '16px' }}>{renderTime(post.created_utc)}</span>
        </div>
        
        <h3 style={{ fontSize: '16px', margin: '0 0 8px 0', fontWeight: 600, color: 'var(--color-neutral-content-strong, #f2f4f5)', lineHeight: 1.2 }}>
          <a
            href={`https://reddit.com${post.permalink}`}
            style={aStyle}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={() => {
               try {
                 window.localStorage.setItem(`unhide_post_${post.id}`, JSON.stringify(post));
               } catch (err) {}
               if (chrome.storage && chrome.storage.local) {
                 chrome.storage.local.set({ [`unhide_post_${post.id}`]: post });
               }
            }}
          >
            {post.title}
          </a>
        </h3>

        {post.selftext && (
          <div className="selftext-container" style={{ marginBottom: '8px', pointerEvents: 'none' }}>
            <div 
              key={`selftext`}
              style={{ 
                color: 'var(--color-neutral-content-strong, #f2f4f5)', 
                fontSize: '14px', 
                maxHeight: '100px', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' 
              }} 
              dangerouslySetInnerHTML={{ __html: post.selftext }} 
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', color: 'var(--color-neutral-content-weak, #8da4ae)', fontSize: '12px', fontWeight: 600, alignItems: 'center', marginTop: '8px' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '4px', cursor: 'pointer' }} onClick={() => window.location.href = `https://reddit.com${post.permalink}`}>
             <span style={{ fontSize: 16, fontWeight: 'normal' }}>💬</span>
             <span>{post.num_comments} Comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
