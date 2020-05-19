import React, { useState } from "react";

export const PostCreate = ({ submitPost }) => {
  const [title, setTitle] = useState("");
  const handleChange = e => setTitle(e.target.value);
  const handleSubmit = e => {
    e.preventDefault();
    if (!title.length) return alert("Post title should not be empty");
    submitPost(title);
    setTitle("");
  };

  return (
    <form className="PostCreate" onSubmit={handleSubmit}>
      <h1>Create Post</h1>
      <label htmlFor="title">Title</label>
      <input
        type="text"
        id="title"
        name="title"
        onChange={handleChange}
        placeholder="Enter Post title"
        value={title}
      />
      <input type="submit" value="Create post" />
    </form>
  );
};
