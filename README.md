# REBBIT

Rebbit is a dynamic social platform designed for connecting people and fostering meaningful discussions. It is built using MongoDB for robust data storage, Express.js for flexibility, React for dynamic UIs, and Node.js for server-side execution. It offers an interactive feed to the users for posting, upvoting, downvoting and saving different content.

Visit : https://rebbit-web-app.onrender.com

## Features

- Create, Read, Update, Delete posts
- Upvote, Downvote, Save posts
- Create, Update, Delete comments
- Nested comments
- Create, Update userinfo and biography
- View user's post, upvoted and saved posts
- Signup and Login authentication using JWT
- Messaging in realtime using socket.io
- Post sorting based on votes, comments, date created
- Post searching based on post titles

## Screenshots

### Home feed

![image](https://i.postimg.cc/vBFvxcBY/homefeed.png)
![image](https://i.postimg.cc/d12j2wk8/homefeed2.png)

### User feed

![image](https://i.postimg.cc/pXGYY0T1/userfeed.png)

### Post feed

![image](https://i.postimg.cc/XqxKPLgq/postfeed.png)

### Nested Comments

![image](https://i.postimg.cc/MKKmBkWQ/nestedcomments.png)

### Message feed

![image](https://i.postimg.cc/dQ99DQKF/messagefeed.png)

## Installation

1. Clone this repository

```bash
  git clone https://github.com/Jeel13/Rebbit.git
  cd Rebbit
```

2. Install general dependencies

```bash
  npm install
```

3. Install backend dependencies

```bash
  cd server
  npm install
  cd ..
```

4. Install frontend dependencies

```bash
  cd client
  npm install
  cd ..
```

5. Create a new .env file

```bash
  cd server
  touch .env
```

6. Configure environment variables. Paste the following in the .env file (Fill in your own MongoDB url, password and JWT secret)

```bash
  PORT=8000
  MONGO_URL=<YOUR_MONGO_URL>
  JWT_SECRET=<YOUR_JWT_SECRET>
```

7. Run frontend and backend concurrently

```bash
  cd ..
  npm run watch
```

## Authors

- [@Jeel13](https://github.com/Jeel13)
