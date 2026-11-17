import React, { useCallback, useEffect, useState, useRef } from "react";
import Comment from "./Comment";
import { useAuth } from "../../Context/Authcontext.jsx";
import CommentInput from "./CommentInput.jsx";

function Commentsection({ targetId, targetType }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  //Fetch Comment
  // const [shwComment,setShowComment]=useState([])
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState();

  //Do Comment
  const [comment, setComment] = useState("");

  //Edit Comment
  const [editCommentId, setEditCommentId] = useState(null);
  const [originalComment, setOriginalComment] = useState("");

  // //Fetch All Replies Comment
  // const [repliesComment,setRepliesComment]=useState([])
  // const [subrepliesComment,setSubRepliesComment]=useState([])

  const [commentMap, setCommentMap] = useState({});
  const [rootId, setRootId] = useState([]);

  const [replyPage, setReplyPage] = useState({});

  // const startEdit=function(comment){
  //   setEditCommentId(comment._id)
  //   setOriginalComment(comment.comment)

  // }

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await fetch(
          `https://antonpklive.online/v1/api/user/user/${targetType}/comment`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              targetId,
            }),
          },
        );
        const data = await res.json();
        if (!data.success) {
          setError(data.message);
          return;
        }
        const map = {};
        data.data.comments.forEach((c) => {
          map[c._id] = { ...c, replyIds: [] };
        });
        setCommentMap(map);
        setRootId(data.data.comments.map((c) => c._id));

        setHasMore(data.data.hasMore);
        setCursor(data.data.nextCursor);
      } catch (e) {
        setError(e.message);
      }
    };
    fetchComment();
  }, [targetId]);

  // const doComment = async () => {
  //   if (!comment.trim() || loading) return;
  //   try {
  //     setLoading(true);
  //     const res = await fetch(
  //       "https://antonpklive.online/v1/api/user/user/comment",
  //       {
  //         method: "POST",
  //         credentials: "include",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           comment: comment.trim(),
  //           targetId,
  //           targetType
  //         }),
  //       },
  //     );
  //     const data = await res.json();
  //     if (!data.success) {
  //       setError(data.message);
  //       return;
  //     }
  //     setCommentMap(prev=>(
  //       {
  //        ...prev,
  //        [data.data._id]:{...data.data,replyIds:[]},
  //       }
  //     ))
  //     setRootId(prev=>[data.data._id,...prev])
  //     setComment("");
  //   } catch (e) {
  //     setError(e.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const saveEditComment = async (editComment) => {
    if (!editComment.trim() || loading) {
      setEditCommentId("");
      return;
    }
    if (editComment.trim() === originalComment) {
      setEditCommentId("");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        "https://antonpklive.online/v1/api/user/user/comment/update",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            id: editCommentId,
            comment: editComment.trim(),
          }),
        },
      );
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        return;
      }
      setCommentMap((prev) => ({
        ...prev,
        [data.data._id]: {
          ...prev[data.data._id],
          comment: data.data.comment,
        },
      }));
      setEditCommentId("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (id) => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await fetch(
        "https://antonpklive.online/v1/api/user/user/comment/deletecomment",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ commentId: id }),
        },
      );
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        return;
      }
      const parentId = commentMap[id].parentId;

      setCommentMap((prev) => {
        const newMap = { ...prev };

        delete newMap[id];

        if (parentId) {
          newMap[parentId] = {
            ...newMap[parentId],
            replyIds: newMap[parentId].replyIds.filter((rid) => rid !== id),
          };
        }
        return newMap;
      });

      if (!parentId) {
        setRootId((prev) => prev.filter((rid) => rid != id));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  //Load more Comment
  const loadMoreRef = useRef(false);

  const loadMoreComment = useCallback(async () => {
    if (!hasMore || loadMoreRef.current) return;

    loadMoreRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(
        `https://antonpklive.online/v1/api/user/user/${targetType}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ targetId, cursor }),
        },
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      const newRootIds = data.data.comments.map((c) => c._id);

      setCommentMap((prev) => {
        const newMap = { ...prev };
        data.data.comments.forEach((comment) => {
          newMap[comment._id] = { ...comment, replyIds: [] };
        });
        return newMap;
      });

      if (newRootIds.length > 0) {
        setRootId((prev) => [...prev, ...newRootIds]);
      }

      setHasMore(data.data.hasMore);
      setCursor(data.data.nextCursor);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      loadMoreRef.current = false;
      setLoading(false);
    }
  }, [hasMore, cursor, targetId, targetType]);

  const findreplies = async function (parentId, cursorId, isReplyToReply) {
    let cursor = cursorId || null;
    setLoading(true);
    console.log("findreplies API call:", { parentId, cursor });
    try {
      const response = await fetch(
        `https://antonpklive.online/v1/api/user/yotube/comment/reply`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            parentId,
            cursor,
            isReplyToReply,
          }),
        },
      );
      const data = await response.json();
      if (!data.success) {
        setError(data.message);
        return;
      }

      setCommentMap((prev) => {
        const newMap = { ...prev };
        data.data.comments.forEach((c) => {
          newMap[c._id] = { ...c, replyIds: newMap[c._id]?.replyIds ?? [] };

          newMap[parentId] = {
            ...newMap[parentId],
            replyIds: [
              ...new Set([...(newMap[parentId].replyIds || []), c._id]),
            ],
          };
        });
        return newMap;
      });

      setReplyPage((prev) => ({
        ...prev,
        [parentId]: {
          cursor: data.data.nextCursor,
          hasMore: data.data.hasMore,
          loaded: true,
        },
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const likesControlForComments = async (commentId, isLiked) => {
    if (loading) return;
    if (!commentId) return;
    setCommentMap((prev) => ({
      ...prev,
      [commentId]: {
        ...prev[commentId],
        isLiked: !isLiked,
        totalLikes: isLiked
          ? prev[commentId].totalLikes - 1
          : prev[commentId].totalLikes + 1,
      },
    }));
    try {
      setLoading(true);
      const res = await fetch(
        isLiked
          ? "https://antonpklive.online/v1/api/user/user/unlike"
          : "https://antonpklive.online/v1/api/user/user/like",
        {
          method: isLiked ? "DELETE" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: commentId,
            targetType: "Comment",
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update like");
      }
    } catch (error) {
      setError(error.message);
      setCommentMap((prev) => ({
        ...prev,
        [commentId]: {
          ...prev[commentId],
          isLiked: isLiked,
          totalLikes: isLiked
            ? prev[commentId].totalLikes + 1
            : prev[commentId].totalLikes - 1,
        },
      }));
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async function (
    parentId,
    replycomment,
    isReplyToReply,
  ) {
    if (!replycomment?.trim()) {
      setError("Please Give A reply To Do reply || the parentId is null");
      return;
    }

    if (!user._id) {
      setError("Please Signin to Do reply");
      return;
    }

    const body = {
      comment: replycomment,
      parentId: parentId || null,
    };

    if (!parentId) {
      body.targetId = targetId;
      body.targetType = targetType;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://antonpklive.online/v1/api/user/user/comment`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );
      const data = await response.json();
      if (!data.success) {
        setError(data.message);
        return;
      }

      setCommentMap((prev) => {
        const newMap = { ...prev };

        // Add the new root comment or reply
        newMap[data.data._id] = {
          ...data.data,
          isEditable: true,
          isLiked: false,
          owner: {
            _id: user?._id,
            username: user?.username,
            avatar: user?.avatar,
          },
          replyIds: [],
        };

        // If this is a reply, update its parent
        if (parentId) {
          newMap[parentId] = {
            ...newMap[parentId],
            replyIds: isReplyToReply
              ? [...(newMap[parentId]?.replyIds ?? []), data.data._id]
              : [data.data._id, ...(newMap[parentId]?.replyIds ?? [])],
            totalReplies: (newMap[parentId]?.totalReplies ?? 0) + 1,
          };
        }

        return newMap;
      });

      if (!parentId) {
        setRootId((prev) => [data.data._id, ...prev]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CommentInput onReply={submitComment} />

      <div className="cmt-list">
        {rootId.map((id, index) => (
          <Comment
            key={id}
            commentId={id}
            commentMap={commentMap}
            replyPage={replyPage}
            onFindReplies={findreplies}
            onReply={submitComment}
            onSaveEdit={saveEditComment}
            onDelete={deleteComment}
            likescontrol={likesControlForComments}
            editCommentId={editCommentId}
            setEditCommentId={setEditCommentId}
            setOriginalComment={setOriginalComment}
            isLast={index === rootId.length - 1}
            onLoadMore={loadMoreComment}
          />
        ))}
      </div>

      {/* Infinite-scroll loading indicator */}
      {loading && rootId.length > 0 && (
        <div className="cmt-scroll-loading">
          <span />
          <span />
          <span />
        </div>
      )}

      {/* End of comments */}
      {!hasMore && rootId.length > 0 && !loading && (
        <div className="cmt-end-line">— No more comments —</div>
      )}
    </>
  );
}

export default Commentsection;
