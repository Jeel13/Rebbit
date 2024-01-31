import { BASE_URL } from '../config';

const signup = async (user) => {
  try {
    const result = await fetch(BASE_URL + 'users/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

const login = async (user) => {
  try {
    const result = await fetch(BASE_URL + 'users/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (user, params) => {
  try {
    const result = await fetch(BASE_URL + 'users/' + params.username, user && {
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    });

    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (user, data) => {
  try {
    const result = await fetch(BASE_URL + 'users/' + user.userId, {
      method: 'PATCH',
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

const getRandomUsers = async (query) => {
  try {
    const result = await fetch(
      BASE_URL + 'users/random?' + new URLSearchParams(query).toString()
    );
    return await result.json();
  } catch (error) {
    console.log(error);
  }
};

export { signup, login, getUser, updateUser, getRandomUsers };
