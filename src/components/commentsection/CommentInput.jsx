import React, { useState } from "react";

function CommentInput({ onReply }) {
  const [inputComment, setInputComment] = useState("");

  return (
    <div className="ci-wrap">
      <input
        className="ci-input"
        type="text"
        value={inputComment}
        onChange={(e) => setInputComment(e.target.value)}
        placeholder="Add a comment…"
      />
      <div className="ci-actions">
        <button
          className="ci-btn ci-btn--cancel"
          onClick={() => setInputComment("")}
        >Cancel</button>
        <button
          className="ci-btn ci-btn--submit"
          onClick={async () => {
            await onReply(null, inputComment);
            setInputComment("");
          }}
        >
          Comment
        </button>
      </div>
    </div>
  );
}

export default CommentInput;
