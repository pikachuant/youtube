import React, { useEffect, useRef, useState } from "react";
import Reply from "./Reply";

function Comment({
  commentId,
  commentMap,
  onDelete,
  onFindReplies,
  onReply,
  onSaveEdit,
  editCommentId,
  setEditCommentId,
  setOriginalComment,
  likescontrol,
  isLast,
  onLoadMore,
  replyPage,
}) {
  const data = commentMap[commentId];
  const [draft, setDraft] = useState(data?.comment ?? "");

  const [replyId, setReplyId] = useState("");
  const [replyInput, setReplyInput] = useState("");

  const [showReplies, setShowReplies] = useState(false);
  const lastRef = useRef(null);
  const commentRef = useRef(null);

  function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  // const loadReply = async (commentId) => {
  //   if (replyPage?.loaded && !replyPage.hasMore) return;

  //   const cursor = replyPage?.loaded ? replyPage.cursor : null;

  //   await onFindReplies(commentId, cursor);
  // };

  useEffect(() => {
    if (!isLast || !lastRef.current) return;

    let timer;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        clearTimeout(timer);
        return;
      }

      timer = setTimeout(() => onLoadMore(), 500);
    });

    observer.observe(lastRef.current);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isLast, onLoadMore]);

  return (
    <>
      <div className="cmt-item" key={commentId} ref={commentRef}>
        {/* Avatar + meta row */}
        <div className="cmt-avatar-wrap">
          <img
            className="cmt-avatar"
            src={data.owner.avatar}
            alt={data.owner.username}
          />
        </div>

        <div className="cmt-body">
          <div className="cmt-meta">
            <span className="cmt-username">{data.owner.username}</span>
            <span className="cmt-time">{timeAgo(data.createdAt)}</span>
          </div>

          {/* Edit mode vs read mode */}
          {editCommentId === commentId ? (
            <div className="cmt-edit-form">
              <textarea
                className="cmt-edit-textarea"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <div className="cmt-edit-actions">
                <button
                  className="cmt-act-btn cmt-act-btn--cancel"
                  onClick={() => {
                    setDraft(data.comment);
                    setEditCommentId(null);
                  }}
                >
                  Discard
                </button>
                <button
                  className="cmt-act-btn cmt-act-btn--save"
                  onClick={async () => {
                    onSaveEdit(draft);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="cmt-text">{data.comment}</p>

              {/* Action bar */}
              <div className="cmt-actions">
                {/* Like */}
                <button
                  className={`cmt-like-btn${data.isLiked ? " liked" : ""}`}
                  onClick={() => likescontrol(commentId, data.isLiked)}
                  title={data.isLiked ? "Unlike" : "Like"}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={data.isLiked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z" />
                    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                  <span>{data.totalLikes > 0 ? data.totalLikes : ""}</span>
                </button>

                {/* Reply */}
                <button
                  className="cmt-reply-btn"
                  onClick={() =>
                    setReplyId(replyId === commentId ? "" : commentId)
                  }
                >
                  Reply
                </button>

                {/* Owner actions */}
                {data.isEditable && (
                  <>
                    <button
                      className="cmt-act-btn cmt-act-btn--edit"
                      onClick={() => {
                        setDraft(data.comment);
                        setOriginalComment(data.comment);
                        setEditCommentId(commentId);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="cmt-act-btn cmt-act-btn--delete"
                      onClick={() => onDelete(data._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {/* Inline reply input */}
          {replyId === commentId && (
            <div className="cmt-reply-form">
              <textarea
                className="cmt-reply-textarea"
                value={replyInput}
                placeholder="Add a reply…"
                onChange={(e) => setReplyInput(e.target.value)}
              />
              <div className="cmt-edit-actions">
                <button
                  className="cmt-act-btn cmt-act-btn--cancel"
                  onClick={() => {
                    setReplyId("");
                    setReplyInput("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="cmt-act-btn cmt-act-btn--save"
                  onClick={async () => {
                    await onReply(commentId, replyInput);
                    setReplyInput("");
                    setReplyId("");
                  }}
                >
                  Reply
                </button>
              </div>
            </div>
          )}

          {/* Show replies toggle */}
          {data.totalReplies > 0 && !showReplies && (
            <button
              className="cmt-show-replies-btn"
              onClick={() => {
                setShowReplies(true);
                //loadReply(commentId);
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
              {`${data.totalReplies} ${data.totalReplies === 1 ? "reply" : "replies"}`}
            </button>
          )}

          {showReplies && (
            <div className="cmt-replies-indent">
              <Reply
                CommentId={commentId}
                commentMap={commentMap}
                replyPage={replyPage}
                onFindReplies={onFindReplies}
                onReply={onReply}
                onSaveEdit={onSaveEdit}
                onDelete={onDelete}
                likescontrol={likescontrol}
                editCommentId={editCommentId}
                setEditCommentId={setEditCommentId}
                setOriginalComment={setOriginalComment}
                commentRef={commentRef}
              />
            </div>
          )}
        </div>
      </div>

      {isLast && <div ref={lastRef} />}
    </>
  );
}

export default Comment;
