import React from 'react';
import { RedditComment } from '../api/types';

function decodeHtmlEntity(html: string) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

export default function CommentCard({ comment }: { comment: RedditComment, username: string }) {
  const date = new Date(comment.created_utc * 1000).toLocaleDateString();
  const htmlContent = comment.body_html ? decodeHtmlEntity(comment.body_html) : '';

  return (
    <div className="card">
      <div className="card-meta">
        <span className="card-subreddit">
          <a href={`https://reddit.com/r/${comment.subreddit}`} target="_blank" rel="noreferrer">r/{comment.subreddit}</a>
        </span>
        <span>•</span>
        <span>{date}</span>
        <span>•</span>
        <span>Commented</span>
      </div>
      {htmlContent && (
        <div className="card-body md-html fade-out">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      )}
      <div className="card-footer">
        <span>{comment.score} points</span>
      </div>
    </div>
  );
}
