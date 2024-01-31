import { Box, Card, Container, Grid } from '@mui/material';
import Navbar from '../utils/Navbar';
import { useEffect, useState } from 'react';
import { isLoggedIn } from '../../helpers/authHelper';
import { getConversations } from '../../api/messages';
import { useLocation } from 'react-router-dom';
import UserChats from '../messages/UserChats';
import Messages from '../messages/Messages';

const MessageView = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conservant, setConservant] = useState(null);
  const [width, setWidth] = useState(0);
  const mobile = width < 800;
  const user = isLoggedIn();
  const { state } = useLocation();
  const newConservant = state && state.user;

  const getConversation = (conversations, conservantId) => {
    for (let i = 0; i < conversations.length; i++) {
      const conversation = conversations[i];
      if (conversation.recipient._id === conservantId) {
        return conversation;
      }
    }
  };

  const fetchConversations = async () => {
    const data = await getConversations(user);
    let conversations = data?.data;

    if (newConservant) {
      setConservant(newConservant);
      if (!getConversation(conversations, newConservant._id)) {
        const newConversation = {
          _id: newConservant._id,
          recipient: newConservant,
          new: true,
          messages: [],
        };
        conversations = [newConversation, ...conversations];
      }
    }

    setConversations(conversations);
    setLoading(false);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    updateDimensions();

    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const updateDimensions = () => {
    const width = window.innerWidth;
    setWidth(width);
  };

  return (
    <Container>
      <Navbar />
      <Box>
        <Card sx={{ padding: 0 }}>
          <Grid
            container
            sx={{ height: 'calc(100vh - 110px)' }}
            alignItems="stretch"
          >
            {!mobile ? (
              <>
                <Grid
                  item
                  xs={5}
                  sx={{
                    borderRight: 1,
                    borderColor: 'divider',
                    height: '100%',
                  }}
                >
                  <UserChats
                    conservant={conservant}
                    conversations={conversations}
                    setConservant={setConservant}
                    loading={loading}
                  />
                </Grid>

                <Grid item xs={7} sx={{ height: '100%' }}>
                  <Messages
                    conservant={conservant}
                    conversations={conversations}
                    setConservant={setConservant}
                    setConversations={setConversations}
                    getConversation={getConversation}
                  />
                </Grid>
              </>
            ) : !conservant ? (
              <Grid
                item
                xs={12}
                sx={{
                  borderRight: 1,
                  borderColor: 'divider',
                  height: '100%',
                }}
              >
                <UserChats
                  conservant={conservant}
                  conversations={conversations}
                  setConservant={setConservant}
                  loading={loading}
                />
                <Box sx={{ display: 'none' }}>
                  <Messages
                    conservant={conservant}
                    conversations={conversations}
                    setConservant={setConservant}
                    setConversations={setConversations}
                    getConversation={getConversation}
                  />
                </Box>
              </Grid>
            ) : (
              <Grid item xs={12} sx={{ height: '100%' }}>
                <Messages
                  conservant={conservant}
                  conversations={conversations}
                  setConservant={setConservant}
                  setConversations={setConversations}
                  getConversation={getConversation}
                  mobile
                />
              </Grid>
            )}
          </Grid>
        </Card>
      </Box>
    </Container>
  );
};

export default MessageView;
