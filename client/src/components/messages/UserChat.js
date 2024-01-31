import { ListItemAvatar, ListItemText, MenuItem } from '@mui/material';
import UserAvatar from '../utils/UserAvatar';
import moment from 'moment';

const UserChat = (props) => {
  const recipient = props.conversation.recipient;
  const username = recipient.username;
  const selected =
    props.conservant && props.conservant.username === recipient.username;

  const handleClick = () => {
    props.setConservant(recipient);
  };

  return (
    <>
      <MenuItem
        onClick={handleClick}
        sx={{ padding: 2 }}
        divider
        disableGutters
        selected={selected}
      >
        <ListItemAvatar>
          <UserAvatar height={45} width={45} username={username} />
        </ListItemAvatar>
        <ListItemText
          primary={username}
          secondary={moment(props.conversation.lastMessagedAt).fromNow()}
        />
      </MenuItem>
    </>
  );
};

export default UserChat;
