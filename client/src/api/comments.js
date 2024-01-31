import { BASE_URL } from '../config';

const createComment = async (comment, params, user) => {
  try {
    const { id } = params;
    const result = await fetch(BASE_URL + 'comments/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(comment),
    });

    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

const getPostComments = async (params) => {
  try {
    const { id } = params;
    const result = await fetch(BASE_URL + 'comments/post/' + id);
    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

const updateComment = async (commentId, user, data) => {
  try {
    const result = await fetch(BASE_URL + 'comments/' + commentId, {
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

const deleteComment = async (commentId, user) => {
  try {
    const result = await fetch(BASE_URL + 'comments/' + commentId, {
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

export { createComment, getPostComments, updateComment, deleteComment };
