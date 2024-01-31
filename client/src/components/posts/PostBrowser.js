import { Box, Button, Card, Stack, Typography } from '@mui/material';
import HorizontalStack from '../utils/HorizontalStack';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import {
  getPosts,
  getSavedPosts,
  getUpvotedPosts,
  getUserPosts,
} from '../../api/posts';
import { useState, useEffect } from 'react';
import { isLoggedIn } from '../../helpers/authHelper';
import { useSearchParams } from 'react-router-dom';
import Loading from '../utils/Loading';
import SortBySelect from '../utils/SortBySelect';
import ErrorAlert from '../utils/ErrorAlert';

const PostBrowser = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [end, setEnd] = useState(false);
  const [sortBy, setSortBy] = useState('-createdAt');
  const [count, setCount] = useState(0);
  const [error, setError] = useState('');
  const user = isLoggedIn();

  const [search] = useSearchParams();
  const [effect, setEffect] = useState(false);

  const searchExists =
    search && search.get('search') && search.get('search').length > 0;

  const fetchPosts = async () => {
    setLoading(true);
    const newPage = currentPage + 1;
    setCurrentPage(newPage);

    let query = {
      currentPage: newPage,
      sortBy,
    };

    let data;
    if (props.contentType === 'posts') {
      if (props.profileUser) query.author = props.profileUser;
      if (searchExists) query.search = search.get('search');
      if (query.author) {
        data = await getUserPosts(user, query);
      } else {
        data = await getPosts(user, query);
      }
    } else if (props.contentType === 'upvoted') {
      query.author = props.profileUser;

      data = await getUpvotedPosts(user, query);
    } else if (props.contentType === 'saved') {
      query.author = props.profileUser;

      data = await getSavedPosts(user, query);
    }

    if (!data) {
      setError('Post fetch failed');
    } else if (!data.data) {
      setLoading(false);
    } else {
      if (data.data.length < 10) {
        setEnd(true);
      }

      setLoading(false);
      setPosts([...posts, ...data.data]);
      setCount(data.count);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sortBy, effect]);

  useEffect(() => {
    setPosts([]);
    setCurrentPage(0);
    setEnd(false);
    setEffect(!effect);
  }, [search, props.profileUser]);

  const handleSortBy = (e) => {
    const newSortName = e.target.value;
    let newSortBy;

    Object.keys(sorts).forEach((sortName) => {
      if (sorts[sortName] === newSortName) newSortBy = sortName;
    });

    setPosts([]);
    setCurrentPage(0);
    setEnd(false);
    setSortBy(newSortBy);
  };

  const removePost = (removedPost) => {
    setPosts(posts.filter((post) => post._id !== removedPost._id));
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const contentTypeSorts = {
    posts: {
      '-createdAt': 'Latest',
      '-votes': 'Votes',
      '-totalComments': 'Comments',
      createdAt: 'Earliest',
    },
    upvoted: {
      '-createdAt': 'Latest',
      createdAt: 'Earliest',
    },
    saved: {
      '-createdAt': 'Latest',
      createdAt: 'Earliest',
    },
  };

  const sorts = contentTypeSorts[props.contentType];

  return error ? (
    <ErrorAlert error={error} sx={{ my: 4 }} />
  ) : (
    <Stack spacing={2}>
      <Card
        sx={{
          backgroundColor: '#1A1A1B',
        }}
      >
        <HorizontalStack justifyContent="space-between">
          {props.createPost && <CreatePost />}
          <SortBySelect onSortBy={handleSortBy} sortBy={sortBy} sorts={sorts} />
        </HorizontalStack>
      </Card>

      {searchExists && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Showing results for "{search.get('search')}"
          </Typography>
          <Typography color="text.secondary" variant="span">
            {count} results found
          </Typography>
        </Box>
      )}

      {posts.map((post, i) => (
        <PostCard
          preview="primary"
          key={post._id}
          post={post}
          removePost={removePost}
        />
      ))}

      {loading && <Loading />}
      {end ? (
        <Stack py={5} alignItems="center">
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {posts.length > 0 ? (
              <>All posts have been viewed</>
            ) : (
              <>No posts available</>
            )}
          </Typography>
          <Button variant="text" size="small" onClick={handleBackToTop}>
            Back to top
          </Button>
        </Stack>
      ) : (
        !loading &&
        posts &&
        posts.length > 0 && (
          <Stack pt={2} pb={6} alignItems="center" spacing={2}>
            <Button onClick={fetchPosts} variant="contained">
              Load more
            </Button>
            <Button variant="text" size="small" onClick={handleBackToTop}>
              Back to top
            </Button>
          </Stack>
        )
      )}
    </Stack>
  );
};

export default PostBrowser;
