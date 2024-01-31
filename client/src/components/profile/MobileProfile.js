import { useEffect, useState } from 'react';
import { isLoggedIn } from '../../helpers/authHelper';
import { useTheme } from '@emotion/react';
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import HorizontalStack from '../utils/HorizontalStack';
import { MdCancel } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';
import ContentUpdateEditor from '../posts/ContentUpdateEditor';
import UserAvatar from '../utils/UserAvatar';

const MobileProfile = (props) => {
  const [user, setUser] = useState(null);
  const currentUser = isLoggedIn();
  const theme = useTheme();
  const iconColor = theme.palette.primary.main;

  useEffect(() => {
    if (props.profile) {
      setUser(props.profile);
    }
  }, [props.profile]);

  return (
    <Card sx={{ display: { sm: 'block', md: 'none' }, mb: 2 }}>
      {user ? (
        <Stack spacing={2}>
          <HorizontalStack spacing={2} justifyContent="space-between">
            <HorizontalStack>
              <UserAvatar width={50} height={50} username={user.username} />
              <Typography variant="h6" textOverflow="ellipses">
                {user.username}
              </Typography>
            </HorizontalStack>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <HorizontalStack spacing={3}>
                <Stack alignItems="center"></Stack>
                <Stack alignItems="center"></Stack>
              </HorizontalStack>
            </Box>
          </HorizontalStack>
          <Divider />
          <Box>
            {currentUser && user._id === currentUser.userId && (
              <IconButton onClick={props.handleEditing} sx={{ mr: 1 }}>
                {props.editing ? (
                  <MdCancel color={iconColor} />
                ) : (
                  <AiFillEdit color={iconColor} />
                )}
              </IconButton>
            )}
            {user.bio ? (
              <>
                <Typography textAlign="center" variant="p">
                  <b>Bio: </b>
                  {user.bio}
                </Typography>
              </>
            ) : (
              <Typography variant="p">
                <i>
                  No bio yet{' '}
                  {currentUser && user._id === currentUser.userId && (
                    <span>- Tap on the edit icon to add your bio</span>
                  )}
                </i>
              </Typography>
            )}
            {currentUser && user._id !== currentUser.userId && (
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={props.handleMessage}>
                  Message
                </Button>
              </Box>
            )}
            {props.editing && (
              <Box>
                <ContentUpdateEditor
                  handleSubmit={props.handleSubmit}
                  originalContent={user.biography}
                  validate={props.validate}
                />
              </Box>
            )}
          </Box>
        </Stack>
      ) : (
        <>Loading...</>
      )}
    </Card>
  );
};

export default MobileProfile;
