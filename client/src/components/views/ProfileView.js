import { useEffect, useState } from 'react';
import { isLoggedIn } from '../../helpers/authHelper';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getUser, updateUser } from '../../api/users';
import PostBrowser from '../posts/PostBrowser';
import { Container, Stack } from '@mui/material';
import Navbar from '../utils/Navbar';
import GridLayout from '../utils/GridLayout';
import Loading from '../utils/Loading';
import ErrorAlert from '../utils/ErrorAlert';
import Profile from '../profile/Profile';
import MobileProfile from '../profile/MobileProfile';
import ProfileTabs from '../profile/ProfileTabs';
import FindUsers from '../utils/FindUsers';

const ProfileView = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState('posts');
  const user = isLoggedIn();
  const [error, setError] = useState('');
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUser = async () => {
    setLoading(true);
    const data = await getUser(user, params);
    setLoading(false);
    if (!data) {
      setError('User info fetch failed');
    } else if (!data.data) {
      setError(data.message);
    } else {
      setProfile(data.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = e.target.content.value;

    await updateUser(user, { bio: content });

    setProfile({ ...profile, bio: content });
    setEditing(false);
  };

  const handleEditing = () => {
    setEditing(!editing);
  };

  const handleMessage = () => {
    navigate('/message', { state: { user: profile } });
  };

  useEffect(() => {
    fetchUser();
  }, [location]);

  const validate = (content) => {
    let error = '';

    if (content.length > 250) {
      error = 'Bio cannot be longer than 250 characters';
    }

    return error;
  };

  let tabs;
  if (profile) {
    tabs = {
      posts: (
        <PostBrowser
          profileUser={profile.username}
          contentType="posts"
          key="posts"
        />
      ),
      upvoted: (
        <PostBrowser
          profileUser={profile.username}
          contentType="upvoted"
          key="upvoted"
        />
      ),
      saved: (
        <PostBrowser
          profileUser={profile.username}
          contentType="saved"
          key="saved"
        />
      ),
    };
  }

  return (
    <Container>
      <Navbar />

      <GridLayout
        left={
          <>
            <MobileProfile
              profile={profile}
              editing={editing}
              handleSubmit={handleSubmit}
              handleEditing={handleEditing}
              handleMessage={handleMessage}
              validate={validate}
            />
            <Stack spacing={2}>
              {profile ? (
                <>
                  <ProfileTabs tab={tab} setTab={setTab} />

                  {tabs[tab]}
                </>
              ) : error ? (
                <ErrorAlert error={error} />
              ) : (
                loading && <Loading />
              )}
            </Stack>
          </>
        }
        right={
          <Stack spacing={2}>
            {!error && (
              <Profile
                profile={profile}
                editing={editing}
                handleSubmit={handleSubmit}
                handleEditing={handleEditing}
                handleMessage={handleMessage}
                validate={validate}
              />
            )}

            <FindUsers />
          </Stack>
        }
      />
    </Container>
  );
};

export default ProfileView;
