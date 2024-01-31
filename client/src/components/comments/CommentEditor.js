import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isLoggedIn } from '../../helpers/authHelper';
import { createComment } from '../../api/comments';
import { Box, Button, Card, Stack, TextField, Typography } from '@mui/material';
import HorizontalStack from '../utils/HorizontalStack';
import ErrorAlert from '../utils/ErrorAlert';

const CommentEditor = ({ label, comment, addComment, setReplying }) => {
  const [formData, setFormData] = useState({
    content: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const user = isLoggedIn();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      ...formData,
      parent: comment && comment._id,
    };

    setLoading(true);
    const data = await createComment(body, params, user);
    setLoading(false);

    if (!data) {
      setError('Server Error');
    } else if (data && !data.data) {
      setError(data.message);
    } else {
      formData.content = '';
      setReplying && setReplying(false);
      addComment(data.data);
    }
  };

  const handleFocus = (e) => {
    !user && navigate('/login');
  };

  return (
    <Card>
      <Stack spacing={2}>
        <HorizontalStack justifyContent="space-between">
          <Typography variant="h5">
            {comment ? <>Reply</> : <>Comment</>}
          </Typography>
        </HorizontalStack>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            multiline
            fullWidth
            label={label}
            rows={5}
            required
            name="content"
            onChange={handleChange}
            onFocus={handleFocus}
            value={formData.content}
          />

          <ErrorAlert error={error} sx={{ my: 4 }} />
          <Button
            variant="outlined"
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              mt: 2,
            }}
          >
            {loading ? <div>Submitting</div> : <div>Submit</div>}
          </Button>
        </Box>
      </Stack>
    </Card>
  );
};

export default CommentEditor;
