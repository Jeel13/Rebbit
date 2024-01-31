import { Container } from '@mui/material';
import Navbar from '../utils/Navbar';
import GridLayout from '../utils/GridLayout';
import PostBrowser from '../posts/PostBrowser';
import Sidebar from '../utils/Sidebar';

const ExploreView = () => {
  return (
    <Container>
      <Navbar />
      <GridLayout
        left={<PostBrowser createPost contentType="posts" />}
        right={<Sidebar />}
      />
    </Container>
  );
};

export default ExploreView;
