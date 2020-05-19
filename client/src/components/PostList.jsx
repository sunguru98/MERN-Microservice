import React from "react";
import { PostListItem } from "./PostListItem";

export const PostList = ({ posts }) => {
  return (
    <div className="PostList">
      {posts.map(p => (
        <PostListItem key={p._id} post={p} />
      ))}
    </div>
  );
};
