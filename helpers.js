const bcrypt = require('bcryptjs')


const addUser = (email, password) => {
  const id = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10)
  users[id] = {
    id,
    email,
    password: hashedPassword
  };
  return id;
};


const getUserByEmail = (email, database) => {
  return Object.values(database).find(user => user.email === email);
};



const generateRandomString = () => {
  let randomShort = '';
  const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  for (let x = 0; x < 7; x++) {
    if (Math.random() < 0.5) {
      randomShort += Math.floor(Math.random() * 10);
    } else {
      randomShort += char[Math.floor(Math.random() * char.length)];
    }
  }
  return randomShort;
};


const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "user2RandomID",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};


module.exports = {getUserByEmail, generateRandomString, addUser, urlDatabase, users}