import React, { useState } from "react";

export const CommentCreate = ({ createComment }) => {
  const [content, setContent] = useState("");
  const handleChange = e => setContent(e.target.value);
  const handleSubmit = e => {
    e.preventDefault();
    if (!content.length) return alert("Comment cannot not be empty");
    createComment(content);
    setContent("");
  };

  return (
    <form className="CommentCreate" onSubmit={handleSubmit}>
      <label htmlFor="content">Comment</label>
      <input
        type="text"
        id="content"
        name="content"
        onChange={handleChange}
        placeholder="Enter Comment"
        value={content}
      />
      <input type="submit" value="Comment!" />
    </form>
  );
};
