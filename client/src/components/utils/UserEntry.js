import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import HorizontalStack from './HorizontalStack';
import UserAvatar from './UserAvatar';

const UserEntry = ({ username }) => {

  const [isHovered, setHovered] = useState(false);

  const handleMouseOver = () => {
    setHovered(!isHovered);
  };

  return (
    <HorizontalStack justifyContent="space-between" key={username}>
      <HorizontalStack>
        <UserAvatar width={30} height={30} username={username} />
        <Typography>{username}</Typography>
      </HorizontalStack>
      <Typography color="text.secondary">

      <Link style={{
        color: isHovered ? '#F05941' : 'white',
        textDecoration: 'none',
      }}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOver}
        to={'/users/' + username}
      >
        View
      </Link> 
      </Typography>
    </HorizontalStack>
  );
};

export default UserEntry;
