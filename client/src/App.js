import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ExploreView from './components/views/ExploreView';
import CreatePostView from './components/views/CreatePostView';
import PostView from './components/views/PostView';
import SignupView from './components/views/SignupView';
import LoginView from './components/views/LoginView';
import SearchView from './components/views/SearchView';
import ProfileView from './components/views/ProfileView';
import MessageView from './components/views/MessageView';
import PrivateRoute from './components/utils/PrivateRoute';
import theme from './components/utils/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<ExploreView />} />
          <Route
            path="/posts/create"
            element={
              <PrivateRoute>
                <CreatePostView />
              </PrivateRoute>
            }
          />
          <Route
            path="/message"
            element={
              <PrivateRoute>
                <MessageView />
              </PrivateRoute>
            }
          />
          <Route path="/posts/:id" element={<PostView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/signup" element={<SignupView />} />
          <Route path="/search" element={<SearchView />} />
          <Route path="/users/:username" element={<ProfileView />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
