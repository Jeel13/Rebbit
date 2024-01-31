import { useTheme } from '@emotion/react';
import { useState } from 'react';
import { isLoggedIn } from '../../helpers/authHelper';
import { Link, useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import HorizontalStack from '../utils/HorizontalStack';
import ContentDetails from '../posts/ContentDetails';
import { AiFillEdit, AiOutlineLine, AiOutlinePlus } from 'react-icons/ai';
import { MdCancel } from 'react-icons/md';
import Markdown from '../utils/Markdown';
import ContentUpdateEditor from '../posts/ContentUpdateEditor';
import CommentEditor from './CommentEditor';
import { BiTrash } from 'react-icons/bi';
import { BsReplyFill } from 'react-icons/bs';
import Moment from 'react-moment';
import React from 'react';
import { deleteComment, updateComment } from '../../api/comments';

const Comment = (props) => {
  const theme = useTheme();
  const iconColor = theme.palette.primary.main;
  const { depth, addComment, removeComment, editComment } = props;
  const commentData = props.comment;
  const [minimised, setMinimised] = useState(depth % 4 === 3);
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState(commentData);
  const user = isLoggedIn();
  const isAuthor = user && user.userId === comment.author;
  const navigate = useNavigate();

  const handleSetReplying = () => {
    if (user) {
      setReplying(!replying);
    } else {
      navigate('/login');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = e.target.content.value;

    await updateComment(comment._id, user, { content });

    const newCommentData = { ...comment, content, edited: true };

    setComment(newCommentData);

    editComment(newCommentData);

    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteComment(comment._id, user);
    removeComment(comment);
  };

  let style = {
    backgroundColor: '#303030',
    borderRadius: 1.5,
    mb: theme.spacing(2),
    padding: theme.spacing(0),
  };

  if (depth % 2 === 1) {
    style.backgroundColor = '#3E3E3E';
  }

  return (
    <Box sx={style}>
      <Box
        sx={{
          pl: theme.spacing(2),
          pt: theme.spacing(1),
          pb: theme.spacing(1),
          pr: 1,
        }}
      >
        <HorizontalStack justifyContent="space-between">
          <HorizontalStack>
            <ContentDetails
              username={comment.username}
              createdAt={comment.createdAt}
              edited={comment.edited}
            />

            <IconButton
              color="primary"
              onClick={() => setMinimised(!minimised)}
            >
              {minimised ? (
                <AiOutlinePlus size={15} />
              ) : (
                <AiOutlineLine size={15} />
              )}
            </IconButton>
          </HorizontalStack>
          {!minimised && (
            <HorizontalStack spacing={1}>
              <IconButton
                variant="text"
                size="small"
                onClick={handleSetReplying}
              >
                {!replying ? (
                  <BsReplyFill color={iconColor} />
                ) : (
                  <MdCancel color={iconColor} />
                )}
              </IconButton>
              {user && (isAuthor || user.isAdmin) && (
                <HorizontalStack spacing={1}>
                  <IconButton
                    variant="text"
                    size="small"
                    onClick={() => setEditing(!editing)}
                  >
                    {editing ? (
                      <MdCancel color={iconColor} />
                    ) : (
                      <AiFillEdit color={iconColor} />
                    )}
                  </IconButton>
                  <IconButton
                    variant="text"
                    size="small"
                    onClick={handleDelete}
                  >
                    <BiTrash color={theme.palette.error.main} />
                  </IconButton>
                </HorizontalStack>
              )}
            </HorizontalStack>
          )}
        </HorizontalStack>

        {!minimised && (
          <Box sx={{ mt: 1 }} overflow="hidden">
            {!editing ? (
              <Markdown content={comment.content} />
            ) : (
              <ContentUpdateEditor
                handleSubmit={handleSubmit}
                originalContent={comment.content}
              />
            )}

            {replying && !minimised && (
              <Box sx={{ mt: 2 }}>
                <CommentEditor
                  comment={comment}
                  addComment={addComment}
                  setReplying={setReplying}
                  label="What are your thoughts on this comment?"
                />
              </Box>
            )}
            {comment.child && (
              <Box sx={{ pt: theme.spacing(2) }}>
                {comment.child.map((reply, i) => (
                  <Comment
                    key={reply._id}
                    comment={reply}
                    depth={depth + 1}
                    addComment={addComment}
                    removeComment={removeComment}
                    editComment={editComment}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Comment;
