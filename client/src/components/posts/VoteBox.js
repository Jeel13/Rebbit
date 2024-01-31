import { useTheme } from '@emotion/react';
import { IconButton, Stack, Typography } from '@mui/material';
import { isLoggedIn } from '../../helpers/authHelper';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { IconContext } from 'react-icons/lib';
import {
  BiDownvote,
  BiSolidDownvote,
  BiSolidUpvote,
  BiUpvote,
} from 'react-icons/bi';
import { PiBookmarkSimpleBold, PiBookmarkSimpleFill } from 'react-icons/pi';
import { downvotePost, savePost, upvotePost } from '../../api/posts';

const VoteBox = (props) => {
  const theme = useTheme();
  const user = isLoggedIn();
  const navigate = useNavigate();
  const [upvoted, setUpvoted] = useState(props.upvoted);
  const [downvoted, setDownvoted] = useState(props.downvoted);
  const [saved, setSaved] = useState(props.saved);
  const [votes, setVotes] = useState(props.votes);

  const handleUpvote = async (e) => {
    if (user) {
      const newUpvotedValue = !upvoted;
      setUpvoted(newUpvotedValue);

      if (downvoted && newUpvotedValue) {
        setVotes(votes + 2);
      } else if (!downvoted && newUpvotedValue) {
        setVotes(votes + 1);
      } else if (!newUpvotedValue) {
        setVotes(votes - 1);
      }

      if (newUpvotedValue && downvoted) {
        setDownvoted(!downvoted);
      }

      await upvotePost(props.postId, user);
    } else {
      navigate('/login');
    }
  };
  const handleDownvote = async (e) => {
    if (user) {
      const newDownvotedValue = !downvoted;
      setDownvoted(newDownvotedValue);

      if (upvoted && newDownvotedValue) {
        setVotes(votes - 2);
      } else if (!upvoted && newDownvotedValue) {
        setVotes(votes - 1);
      } else if (!newDownvotedValue) {
        setVotes(votes + 1);
      }

      if (newDownvotedValue && upvoted) {
        setUpvoted(!upvoted);
      }
      await downvotePost(props.postId, user);
    } else {
      navigate('/login');
    }
  };
  const handleSavepost = async (e) => {
    if (user) {
      setSaved(!saved);

      await savePost(props.postId, user);
    } else {
      navigate('/login');
    }
  };

  return (
    <Stack sx={{ flexDirection: 'column', height: '100%' }}>
      <Stack alignItems="center">
        <IconButton sx={{ padding: 0.5 }} onClick={handleUpvote}>
          {upvoted ? (
            <IconContext.Provider value={{ color: theme.palette.primary.main }}>
              <BiSolidUpvote />
            </IconContext.Provider>
          ) : (
            <BiUpvote />
          )}
        </IconButton>
        <Typography>{votes}</Typography>
        <IconButton sx={{ padding: 0.5 }} onClick={handleDownvote}>
          {downvoted ? (
            <IconContext.Provider value={{ color: theme.palette.primary.main }}>
              <BiSolidDownvote />
            </IconContext.Provider>
          ) : (
            <BiDownvote />
          )}
        </IconButton>
      </Stack>
      <Stack alignItems="center" sx={{ marginTop: 'auto' }}>
        <IconButton
          sx={{ padding: 0.5, fontSize: '1.3em' }}
          onClick={handleSavepost}
        >
          {saved ? (
            <IconContext.Provider value={{ color: theme.palette.primary.main }}>
              <PiBookmarkSimpleFill />
            </IconContext.Provider>
          ) : (
            <PiBookmarkSimpleBold />
          )}
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default VoteBox;
