import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/users';
import { loginUser } from '../../helpers/authHelper';
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ErrorAlert from '../utils/ErrorAlert';
import { AiOutlineAliwangwang } from 'react-icons/ai';
import theme from '../utils/theme';
import HorizontalStack from '../utils/HorizontalStack';

const LoginView = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await login(formData);

    if (!data) {
      setServerError('User Login failed');
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

  return (
    <Container maxWidth={'xs'} sx={{ mt: 6 }}>
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
          Log in
        </Typography>
        <Typography color="text.secondary">
          Don't have an account yet? <Link style={{
        color: isHovered ? '#F05941' : 'white',
        textDecoration: 'none',
      }}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOver} to="/signup">Sign up</Link>
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            fullWidth
            margin="normal"
            autoComplete="email"
            autoFocus
            required
            id="email"
            name="email"
            onChange={handleChange}
          />
          <TextField
            label="Password"
            fullWidth
            required
            margin="normal"
            id="password  "
            name="password"
            onChange={handleChange}
            type="password"
          />

          {serverError && <ErrorAlert error={serverError} />}
          <Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
            Login
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};

export default LoginView;
