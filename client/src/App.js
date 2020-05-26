import React, { useEffect, useState } from "react";
import axios from "axios";
import { PostCreate } from "./components/PostCreate";
import { PostList } from "./components/PostList";

const App = () => {
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const {
          data: { posts },
        } = await axios.get("http://posts.com/posts");
        setPosts(posts);
      } catch (err) {
        setPosts([]);
      }
    };
    fetchPosts();
  }, []);

  const submitPost = async title => {
    const {
      data: { post },
    } = await axios.post("http://posts.com/posts/create", { title });
    console.log(post);
    setPosts([...posts, post]);
  };

  return (
    <React.Fragment>
      <PostCreate submitPost={submitPost} />
      {posts && <PostList posts={posts} />}
    </React.Fragment>
  );
};

export default App;
