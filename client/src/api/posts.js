import { BASE_URL } from '../config';

const getPosts = async (user, query) => {
  try {
    const result = await fetch(
      BASE_URL + 'posts?' + new URLSearchParams(query),
      user && {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      }
    );
    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

const getUserPosts = async (user, query) => {
  try {
    const result = await fetch(
      BASE_URL + 'posts/user?' + new URLSearchParams(query),
      user && {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      }
    );
    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

const createPost = async (post, user) => {
  try {
    const result = await fetch(BASE_URL + 'posts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(post),
    });

    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

const deletePost = async (postId, user) => {
  try {
    const result = await fetch(BASE_URL + 'posts/' + postId, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    });
    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

const updatePost = async (postId, user, data) => {
  try {
    const result = await fetch(BASE_URL + 'posts/' + postId, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(data),
    });
    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

const upvotePost = async (postId, user) => {
  try {
    const result = await fetch(BASE_URL + 'posts/upvote/' + postId, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    });
    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

const downvotePost = async (postId, user) => {
  try {
    const result = await fetch(BASE_URL + 'posts/downvote/' + postId, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    });
    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

const savePost = async (postId, user) => {
  try {
    const result = await fetch(BASE_URL + 'posts/save/' + postId, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    });
    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

const getUpvotedPosts = async (user, query) => {
  try {
    const result = await fetch(
      BASE_URL + 'posts/upvoted?' + new URLSearchParams(query),
      user && {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      }
    );
    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

const getSavedPosts = async (user, query) => {
  try {
    const result = await fetch(
      BASE_URL + 'posts/saved?' + new URLSearchParams(query),
      user && {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      }
    );
    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

export {
  getPosts,
  getUserPosts,
  createPost,
  deletePost,
  updatePost,
  upvotePost,
  downvotePost,
  savePost,
  getUpvotedPosts,
  getSavedPosts,
};
