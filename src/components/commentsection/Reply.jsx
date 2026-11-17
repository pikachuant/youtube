import React, { useEffect, useState } from "react";
import Comment from "./Comment";

function Reply({
  CommentId,
  commentMap,
  onFindReplies,
  replyPage,
  setEditCommentId,
  onSaveEdit,
  setOriginalComment,
  onDelete,
  likescontrol,
  onReply,
  editCommentId,
  replyonReplyId,
  isReplyToReply,
  commentRef
}) {
  const [draft, setDraft] = useState("");
  const [replyId, setReplyId] = useState("");
  const [replyInput, setReplyInput] = useState("");
  const [hideReply, setHideReply] = useState(false);
  const flag=true


  const page = replyPage?.[CommentId];

  useEffect(() => {
    if (page?.loaded) return;
    onFindReplies(CommentId, null,isReplyToReply);
  }, [CommentId, page?.loaded]);

  const data = commentMap[CommentId];
  const replyrootId = data?.replyIds;

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

  const replyonReply = async function (id) {
    if (replyonReplyId) {
      await onReply(replyonReplyId, replyInput,isReplyToReply);
    } else {
      await onReply(id, replyInput);
    }
  };

  return (
    <>
      {hideReply ? (
        <button
          className="cmt-show-replies-btn"
          onClick={() => setHideReply(false)}
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
            <polyline points="18 15 12 9 6 15" />
          </svg>
          Show Replies
        </button>
      ) : (
        <>
          {replyrootId?.map((id) => (
            <div className="cmt-item cmt-item--reply" key={commentMap[id]._id}>
              {/* Avatar */}
              <div className="cmt-avatar-wrap">
                <img
                  className="cmt-avatar cmt-avatar--sm"
                  src={commentMap[id].owner.avatar}
                  alt={commentMap[id].owner.username}
                />
              </div>

              <div className="cmt-body">
                {/* Meta */}
                <div className="cmt-meta">
                  <span className="cmt-username">
                    {commentMap[id].owner.username}
                  </span>
                  <span className="cmt-time">
                    {timeAgo(commentMap[id].createdAt)}
                  </span>
                </div>

                {/* Edit mode vs read mode */}
                {editCommentId === commentMap[id]._id ? (
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
                          setDraft(commentMap[id].comment);
                          setEditCommentId(null);
                        }}
                      >
                        Discard
                      </button>
                      <button
                        className="cmt-act-btn cmt-act-btn--save"
                        onClick={async () => {
                          await onSaveEdit(draft);
                          setDraft("");
                          setEditCommentId(null);
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="cmt-text">{commentMap[id].comment}</p>

                    {/* Action bar */}
                    <div className="cmt-actions">
                      {/* Like */}
                      <button
                        className={`cmt-like-btn${commentMap[id].isLiked ? " liked" : ""}`}
                        onClick={() => likescontrol(id, commentMap[id].isLiked)}
                        title={commentMap[id].isLiked ? "Unlike" : "Like"}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill={
                            commentMap[id].isLiked ? "currentColor" : "none"
                          }
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z" />
                          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                        </svg>
                        <span>
                          {commentMap[id].totalLikes > 0
                            ? commentMap[id].totalLikes
                            : ""}
                        </span>
                      </button>

                      {/* Reply */}
                      <button
                        className="cmt-reply-btn"
                        onClick={() => setReplyId(replyId === id ? "" : id)}
                      >
                        Reply
                      </button>

                      {/* Owner actions */}
                      {commentMap[id].isEditable && (
                        <>
                          <button
                            className="cmt-act-btn cmt-act-btn--edit"
                            onClick={() => {
                              setDraft(commentMap[id].comment);
                              setOriginalComment(commentMap[id].comment);
                              setEditCommentId(commentMap[id]._id);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="cmt-act-btn cmt-act-btn--delete"
                            onClick={() => onDelete(id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}

                {/* Inline reply textarea */}
                {replyId === id && (
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
                          await replyonReply(id);
                          setReplyInput("");
                          setReplyId("");
                        }}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}

                {/* Nested sub-replies */}
                {commentMap[id].totalReplies > 0 && (
                  <div className="cmt-replies-indent">
                    <Reply
                      CommentId={id}
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
                      replyonReplyId={id}
                      isReplyToReply={flag}
                      commentRef={commentRef}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Load more / Hide replies */}
          {page?.loaded &&
            (page.hasMore ? (
              <button
                className="cmt-show-replies-btn"
                onClick={() => onFindReplies(CommentId, page.cursor)}
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
                Load more replies
              </button>
            ) : (
              <button
                className="cmt-show-replies-btn cmt-show-replies-btn--hide"
                onClick={() => {
                  setHideReply(true);
                  commentRef.current?.scrollIntoView({
                    behavior: "auto",
                    block: "start",
                  });
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
                  <polyline points="18 15 12 9 6 15" />
                </svg>
                Hide replies
              </button>
            ))}
        </>
      )}
    </>
  );
}

export default Reply;
