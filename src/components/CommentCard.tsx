import React, { useState } from 'react';
import { RedditComment } from '../api/types';

function decodeHtmlEntity(html: string) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

export default function CommentCard({ comment, username }: { comment: RedditComment, username: string }) {
  const [hovered, setHovered] = useState(false);
  const [subHovered, setSubHovered] = useState(false);
  const [userHovered, setUserHovered] = useState(false);
  const [parentHovered, setParentHovered] = useState(false);
  const htmlContent = comment.body_html ? decodeHtmlEntity(comment.body_html) : '';

  const renderTime = (utc: number) => {
     const diff = Math.floor(Date.now() / 1000) - utc;
     if (diff < 60) return `${diff} sec. ago`;
     if (diff < 3600) return `${Math.floor(diff/60)} min. ago`;
     if (diff < 86400) return `${Math.floor(diff/3600)} hr. ago`;
     return `${Math.floor(diff/86400)} days ago`;
  };

  const getTitle = () => {
    if (!comment.permalink) return 'Post';
    const parts = comment.permalink.split('/');
    if (parts.length >= 6) {
      let str = parts[5].replace(/_/g, ' ');
      if (str.length > 0) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
    }
    return 'Post';
  };

  return (
    <div 
      style={{ 
        padding: '12px 16px', 
        borderBottom: '1px solid var(--color-neutral-border-weak, #34454d)', 
        backgroundColor: hovered ? 'var(--color-neutral-background-hover, #2a3236)' : 'transparent', 
        transition: 'background-color 0.1s',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
         try {
           window.localStorage.setItem(`unhide_comment_${comment.id}`, JSON.stringify(comment));
         } catch (err) {}
         if (chrome.storage && chrome.storage.local) {
           chrome.storage.local.set({ [`unhide_comment_${comment.id}`]: comment });
         }
         window.location.href = `https://reddit.com${comment.permalink}`;
      }}
    >
      <div style={{ fontSize: '12px', display: 'flex', gap: '6px', color: 'var(--color-neutral-content-weak, #8da4ae)', marginBottom: '8px', alignItems: 'center' }}>
        <img src="https://www.redditstatic.com/desktop2x/img/favicon/favicon-16x16.png" style={{width: 16, height: 16, borderRadius: '50%', transform: 'translateY(8.5px)'}} alt="Subreddit" />
        <a 
          href={`https://reddit.com/r/${comment.subreddit}`} 
          onClick={(e) => e.stopPropagation()} 
          onMouseEnter={() => setSubHovered(true)}
          onMouseLeave={() => setSubHovered(false)}
          style={{ fontWeight: 600, color: subHovered ? '#24a0ed' : 'var(--color-neutral-content-strong, #f2f4f5)', textDecoration: subHovered ? 'underline' : 'none', lineHeight: '16px' }}
        >
          r/{comment.subreddit}
        </a>
        <span style={{ margin: '0 2px', lineHeight: '16px' }}>•</span>
        <span style={{ color: 'var(--color-neutral-content-strong, #f2f4f5)', lineHeight: '16px', pointerEvents: 'none' }}>{getTitle()}</span>
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '12px', minWidth: '28px', pointerEvents: 'none' }}>
          <img 
            src={`https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 7)}.png`} 
            alt="User Avatar" 
            style={{ width: '28px', height: '28px', borderRadius: '50%' }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '12px', display: 'flex', gap: '4px', color: 'var(--color-neutral-content-weak, #8da4ae)', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {username === '[deleted]' ? (
              <span style={{ fontWeight: 600, color: 'var(--color-neutral-content-strong, #f2f4f5)' }}>{username}</span>
            ) : (
              <a 
                href={`https://reddit.com/user/${username}`}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={() => setUserHovered(true)}
                onMouseLeave={() => setUserHovered(false)}
                style={{ fontWeight: 600, color: userHovered ? '#24a0ed' : 'var(--color-neutral-content-strong, #f2f4f5)', textDecoration: 'none' }}
              >
                {username}
              </a>
            )}
            {comment.parent_author && (
              <>
                <span>replied to</span>
                {comment.parent_author === '[deleted]' ? (
                  <span style={{ fontWeight: 600, color: 'var(--color-neutral-content-strong, #f2f4f5)' }}>{comment.parent_author}</span>
                ) : (
                  <a 
                    href={`https://reddit.com/user/${comment.parent_author}`}
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={() => setParentHovered(true)}
                    onMouseLeave={() => setParentHovered(false)}
                    style={{ fontWeight: 600, color: parentHovered ? '#24a0ed' : 'var(--color-neutral-content-strong, #f2f4f5)', textDecoration: 'none' }}
                  >
                    {comment.parent_author}
                  </a>
                )}
              </>
            )}
            <span style={{ margin: '0 2px' }}>•</span>
            <span>{renderTime(comment.created_utc)}</span>
          </div>

          <div style={{ pointerEvents: 'none', color: 'var(--color-neutral-content-strong, #f2f4f5)', fontSize: '14px', margin: '4px 0 8px', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </div>
    </div>
  );
}
