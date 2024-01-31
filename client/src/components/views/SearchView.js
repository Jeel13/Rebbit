import { Container, Stack } from '@mui/material';
import Navbar from '../utils/Navbar';
import GridLayout from '../utils/GridLayout';
import PostBrowser from '../posts/PostBrowser';
import Sidebar from '../utils/Sidebar';

const SearchView = () => {
  return (
    <Container>
      <Navbar />
      <GridLayout
        left={
          <Stack spacing={2}>
            <PostBrowser createPost contentType="posts" />
          </Stack>
        }
        right={<Sidebar />}
      />
    </Container>
  );
};

export default SearchView;
