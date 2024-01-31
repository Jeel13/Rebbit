import { useTheme } from '@emotion/react';
import HorizontalStack from '../utils/HorizontalStack';
import UserAvatar from '../utils/UserAvatar';
import { Card } from '@mui/material';

const Message = (props) => {
  const username = props.conservant.username;
  const message = props.message;
  const theme = useTheme();

  let styles = {};
  if (message.direction === 'to') {
    styles = {
      justifyContent: 'flex-start',
    };
  } else if (message.direction === 'from') {
    styles = {
      messageColor: '#1A1A1B',
      justifyContent: 'flex-end',
    };
  }

  return (
    <HorizontalStack
      sx={{ paddingY: 1, width: '100%' }}
      spacing={2}
      justifyContent={styles.justifyContent}
      alignItems="flex-end"
    >
      {message.direction === 'to' && (
        <UserAvatar username={username} height={30} width={30} />
      )}

      <Card
        sx={{
          borderRadius: '25px',
          backgroundColor: styles.messageColor,
          borderWidth: '1px',
          paddingY: '12px',
          maxWidth: '70%',
          paddingX: 2,
        }}
      >
        {message.content}
      </Card>
    </HorizontalStack>
  );
};

export default Message;
