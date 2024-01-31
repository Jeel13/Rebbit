import { Typography } from '@mui/material';
import HorizontalStack from '../utils/HorizontalStack';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import React, { useState } from 'react';
import UserAvatar from '../utils/UserAvatar';



const ContentDetails = ({ username, createdAt, edited, preview }) => {

  const [isHovered, setHovered] = useState(false);

  const handleMouseOver = () => {
    setHovered(!isHovered);
  };

  return (
    <HorizontalStack sx={{}}>
      <UserAvatar width={30} height={30} username={username} />
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        <Link
        style={{
        color: isHovered ? '#F05941' : 'white',
        textDecoration: 'none',
        fontWeight: 'bold', 
      }}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOver}
          onClick={(e) => {
            e.stopPropagation();
          }}
          to={'/users/' + username}
        >
          {username}
        </Link>
        {!preview && (
          <>
            {' '}
            · <Moment fromNow>{createdAt}</Moment>
            {edited && <React.Fragment> (Edited) </React.Fragment>}
          </>
        )}
      </Typography>
    </HorizontalStack>
  );
};

export default ContentDetails;
