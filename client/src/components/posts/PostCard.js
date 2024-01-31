import { Box, Card, IconButton, Stack, Typography } from '@mui/material';
import HorizontalStack from '../utils/HorizontalStack';
import PostContentBox from './PostContentBox';
import ContentDetails from './ContentDetails';
import Markdown from '../utils/Markdown';
import { AiFillCheckCircle, AiFillEdit, AiFillMessage } from 'react-icons/ai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { isLoggedIn } from '../../helpers/authHelper';
import { deletePost, updatePost } from '../../api/posts';
import { MdCancel } from 'react-icons/md';
import { BiTrash } from 'react-icons/bi';
import ContentUpdateEditor from './ContentUpdateEditor';
import VoteBox from './VoteBox';

const PostCard = (props) => {
  let postData = props.post;
  const { preview, removePost } = props;
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const user = isLoggedIn();
  const isAuthor = user && user.username === postData.username;

  const iconColor = theme.palette.primary.main;

  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [post, setPost] = useState(postData);

  let maxHeight = null;
  if (preview === 'primary') {
    maxHeight = 250;
  }

  const handleDeletePost = async (e) => {
    e.stopPropagation();
    if (!confirm) {
      setConfirm(true);
    } else {
      setLoading(true);
      await deletePost(post._id, isLoggedIn());
      setLoading(false);
      if (preview) {
        removePost(post);
      } else {
        navigate('/');
      }
    }
  };

  const handleEditPost = async (e) => {
    e.stopPropagation();

    setEditing(!editing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = e.target.content.value;
    await updatePost(post._id, isLoggedIn(), { content });
    setPost({ ...post, content, edited: true });
    setEditing(false);
  };

  return (
    <Card
      sx={{
        padding: 0,
        backgroundColor: '#1A1A1B',
        '&:hover': {
          backgroundColor: '#1A1A1B',
          border: '2px solid #F05941',
        },
      }}
      className="post-card"
    >
      <Box className={preview}>
        <HorizontalStack spacing={0} alignItems="initial">
          <Stack
            justifyContent="space-between "
            alignItems="center"
            spacing={1}
            sx={{
              width: '50px',
              padding: theme.spacing(1),
            }}
          >
            <VoteBox
              upvoted={post.upvoted}
              downvoted={post.downvoted}
              saved={post.saved}
              postId={post._id}
              votes={post.votes}
            />
          </Stack>
          <PostContentBox clickable={preview} post={post} editing={editing}>
            <HorizontalStack justifyContent="space-between">
              <ContentDetails
                username={post.username}
                createdAt={post.createdAt}
                edited={post.edited}
                preview={preview === 'secondary'}
              />
              <Box>
                {user &&
                  (isAuthor || user.isAdmin) &&
                  preview !== 'secondary' && (
                    <HorizontalStack>
                      <IconButton
                        disabled={loading}
                        size="small"
                        onClick={handleEditPost}
                      >
                        {editing ? (
                          <MdCancel color={iconColor} />
                        ) : (
                          <AiFillEdit color={iconColor} />
                        )}
                      </IconButton>
                      <IconButton
                        disabled={loading}
                        size="small"
                        onClick={handleDeletePost}
                      >
                        {confirm ? (
                          <AiFillCheckCircle color={theme.palette.error.main} />
                        ) : (
                          <BiTrash color={theme.palette.error.main} />
                        )}
                      </IconButton>
                    </HorizontalStack>
                  )}
              </Box>
            </HorizontalStack>

            <Typography
              variant="h5"
              gutterBottom
              sx={{ overflow: 'hidden', mt: 1, maxHeight: 125 }}
              className="title"
            >
              {post.title}
            </Typography>

            {preview !== 'secondary' &&
              (editing ? (
                <ContentUpdateEditor
                  handleSubmit={handleSubmit}
                  originalContent={post.content}
                />
              ) : (
                <Box
                  maxHeight={maxHeight}
                  overflow="hidden"
                  className="content"
                >
                  <Markdown content={post.content} />
                </Box>
              ))}

            <HorizontalStack sx={{ mt: 2 }} justifyContent="space-between">
              <HorizontalStack>
                <AiFillMessage style={{ color: '#F05941' }}/>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ fontWeight: 'bold' }}
                >
                  {post.totalComments}
                </Typography>
              </HorizontalStack>
            </HorizontalStack>
          </PostContentBox>
        </HorizontalStack>
      </Box>
    </Card>
  );
};

export default PostCard;
