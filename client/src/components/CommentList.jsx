import React from "react";

export const CommentList = ({ comments }) => {
  return (
    <ul className="CommentList">
      {comments.map(({ _id, content, status }) => {
        let message = "Your comment is awaiting moderation";
        if (status === "resolved") message = content;
        else if (status === "rejected")
          message = "Your comment has been rejected";
        return <li key={_id}>{message}</li>;
      })}
    </ul>
  );
};
