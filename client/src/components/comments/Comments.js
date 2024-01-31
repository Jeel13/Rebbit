import { Box, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CommentEditor from './CommentEditor';
import { useParams } from 'react-router-dom';
import Comment from './Comment';
import Loading from '../utils/Loading';
import { getPostComments } from '../../api/comments';
import ErrorAlert from '../utils/ErrorAlert';

const Comments = () => {
  const [comments, setComments] = useState(null);
  const [rerender, setRerender] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const fetchComments = async () => {
    setLoading(true);
    const data = await getPostComments(params);
    setLoading(false);
    if (!data || !data.data) {
      setError('Failed to fetch comments');
    } else {
      setComments(data.data);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const findComment = (id) => {
    let commentToFind;

    const recurse = (comment, id) => {
      if (comment._id === id) {
        commentToFind = comment;
      } else {
        for (let i = 0; i < comment.child.length; i++) {
          const commentToSearch = comment.child[i];
          recurse(commentToSearch, id);
        }
      }
    };

    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      recurse(comment, id);
    }

    return commentToFind;
  };

  const removeComment = (removedComment) => {
    if (removedComment.parent) {
      const parentComment = findComment(removedComment.parent);
      parentComment.child = parentComment.child.filter(
        (comment) => comment._id !== removedComment._id
      );
      setRerender(!rerender);
    } else {
      setComments(
        comments.filter((comment) => comment._id !== removedComment._id)
      );
    }
  };

  const editComment = (editedComment) => {
    if (editedComment.parent) {
      let parentComment = findComment(editedComment.parent);
      for (let i = 0; i < parentComment.child.length; i++) {
        if (parentComment.child[i]._id === editedComment._id) {
          parentComment.child[i] = editedComment;
        }
      }
    } else {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i]._id === editedComment._id) {
          comments[i] = editedComment;
        }
      }
      setRerender(!rerender);
    }
  };

  const addComment = (comment) => {
    if (comment.parent) {
      const parentComment = findComment(comment.parent);
      parentComment.child = [comment, ...parentComment.child];

      setRerender(!rerender);
    } else {
      setComments([comment, ...comments]);
    }
  };

  return comments ? (
    <Stack spacing={2}>
      <CommentEditor addComment={addComment} label="What are your thoughts?" />

      {comments.length > 0 ? (
        <Box pb={4}>
          {comments.map((comment, i) => (
            <Comment
              addComment={addComment}
              removeComment={removeComment}
              editComment={editComment}
              comment={comment}
              key={comment._id}
              depth={0}
            />
          ))}
          {loading && <Loading />}
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          textAlign="center"
          paddingY={3}
        >
          <Box>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No comments yet...
            </Typography>
            <Typography variant="body" color="text.secondary">
              Be the first one to comment!
            </Typography>
          </Box>
        </Box>
      )}
    </Stack>
  ) : error ? (
    <ErrorAlert error={error} sx={{ my: 4 }} />
  ) : (
    <Loading label="Loading comments" />
  );
};

export default Comments;
