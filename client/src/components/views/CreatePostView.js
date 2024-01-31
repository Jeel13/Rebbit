import { Container } from '@mui/material';
import Navbar from '../utils/Navbar';
import GoBack from '../utils/GoBack';
import PostEditor from '../posts/PostEditor';
import Sidebar from '../utils/Sidebar';
import GridLayout from '../utils/GridLayout';

const CreatePostView = () => {
  return (
    <Container>
      <Navbar />
      <GoBack />
      <GridLayout left={<PostEditor />} right={<Sidebar />} />
    </Container>
  );
};

export default CreatePostView;
