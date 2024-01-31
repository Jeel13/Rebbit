import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorAlert from '../utils/ErrorAlert';
import { isLength, isEmail, contains } from 'validator';
import { signup } from '../../api/users';
import { loginUser } from '../../helpers/authHelper';
import { AiOutlineAliwangwang } from 'react-icons/ai';
import HorizontalStack from '../utils/HorizontalStack';
import theme from '../utils/theme';

const SignupView = () => {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [serverError, setServerError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();

    if (Object.keys(error).length !== 0) return;

    const data = await signup(formData);

    if (!data) {
      setServerError('User signup failed');
    } else if (!data.data) {
      setServerError(data.message);
    } else {
      loginUser(data.data);
      navigate('/');
    }
  };

  const [isHovered, setHovered] = useState(false);

  const handleMouseOver = () => {
    setHovered(!isHovered);
  };

  const validate = () => {
    const error = {};

    if (!isLength(formData.username, { min: 6, max: 30 })) {
      error.username = 'Must be between 6 and 30 characters long';
    }

    if (contains(formData.username, ' ')) {
      error.username = 'Must contain only valid characters';
    }

    if (!isLength(formData.password, { min: 8 })) {
      error.password = 'Must be at least 8 characters long';
    }

    if (!isEmail(formData.email)) {
      error.email = 'Must be a valid email address';
    }

    setError(error);

    return error;
  };

  return (
    <Container maxWidth={'xs'} sx={{ mt: { xs: 2, md: 6 } }}>
      <Stack alignItems="center">
        <HorizontalStack>
          <AiOutlineAliwangwang
            size={60}
            color={theme.palette.primary.main}
            onClick={() => navigate('/')}
          />
          <Typography variant="h2" color="text.secondary" sx={{ mb: 6 }}>
            <Link
              to="/"
              style={{
                color: '#F05941',
                textDecoration: 'none',
              }}
            >
              Rebbit
            </Link>
          </Typography>
        </HorizontalStack>
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
        <Typography >
          Already have an account? <Link style={{
        color: isHovered ? '#F05941' : 'white',
        textDecoration: 'none',
      }}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOver} to="/login">Log in</Link>
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            autoFocus
            required
            id="username"
            name="username"
            onChange={handleChange}
            error={error.username !== undefined}
            helperText={error.username}
          />
          <TextField
            label="Email Address"
            fullWidth
            margin="normal"
            autoComplete="email"
            required
            id="email"
            name="email"
            onChange={handleChange}
            error={error.email !== undefined}
            helperText={error.email}
          />
          <TextField
            label="Password"
            fullWidth
            required
            margin="normal"
            autoComplete="password"
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            error={error.password !== undefined}
            helperText={error.password}
          />
          {serverError && <ErrorAlert error={serverError} />}
          <Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
            Sign Up
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};

export default SignupView;
