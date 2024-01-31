import { Container, Stack } from '@mui/material';
import Navbar from '../utils/Navbar';
import GoBack from '../utils/GoBack';
import GridLayout from '../utils/GridLayout';
import Loading from '../utils/Loading';
import PostCard from '../posts/PostCard';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPosts } from '../../api/posts';
import Comments from '../comments/Comments';
import ErrorAlert from '../utils/ErrorAlert';
import Sidebar from '../utils/Sidebar';
import { isLoggedIn } from '../../helpers/authHelper';

const PostView = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const user = isLoggedIn();

  const fetchPost = async () => {
    setLoading(true);
    let query = { postId: params.id };
    const data = await getPosts(user, query);
    if (!data) {
      setError('Post fetch failed');
    } else if (!data.data) {
      setError(data.message);
    } else {
      setPost(data.data[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  return (
    <Container>
      <Navbar />
      <GoBack />
      <GridLayout
        left={
          loading ? (
            <Loading />
          ) : post ? (
            <Stack spacing={2}>
              <PostCard post={post} key={post._id} />
              <Comments />
            </Stack>
          ) : (
            error && <ErrorAlert error={error} />
          )
        }
        right={<Sidebar />}
      />
    </Container>
  );
};

export default PostView;
