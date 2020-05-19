import React, { useState, Fragment } from "react";
import axios from "axios";
import { CommentCreate } from "./CommentCreate";
import { CommentList } from "./CommentList";

export const PostListItem = ({
  post: { title, _id, comments: commentsArr },
}) => {
  const [comments, setComments] = useState(commentsArr ? [...commentsArr] : []);

  const createComment = async content => {
    const {
      data: { comment },
    } = await axios.post(`http://localhost:9999/comments/${_id}`, {
      content,
    });
    setComments([...comments, comment]);
  };

  return (
    <div className="PostListItem">
      <h2 className="PostListItem__title">{title}</h2>
      {comments && (
        <Fragment>
          <span className="PostListItem__comments">
            {comments.length} comments
          </span>
          <CommentList comments={comments} />
        </Fragment>
      )}
      <CommentCreate createComment={createComment} />
    </div>
  );
};
