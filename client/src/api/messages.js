import { BASE_URL } from '../config';

const getConversations = async (user) => {
  try {
    const result = await fetch(BASE_URL + 'messages/chats', {
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    });

    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

const getMessages = async (user, chatId) => {
  try {
    const result = await fetch(BASE_URL + 'messages/chat/' + chatId, {
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    });
    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

const sendMessage = async (user, data, receiverId) => {
  try {
    const result = await fetch(BASE_URL + 'messages/send/' + receiverId, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(data),
    });
    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

export { getConversations, getMessages, sendMessage };
