import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoBack = () => {
  const navigate = useNavigate();
  return (
    <Button variant="text" size="small" onClick={() => navigate('/')}>
      Go back to posts
    </Button>
  );
};

export default GoBack;
