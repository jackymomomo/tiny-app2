const express = require('express');
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.use(cookieParser());



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



const addUser = (email, password) => {
  const id = generateRandomString();
  users[id] = {
    id,
    email,
    password
  };
  return id;
};

const checkRegistration = (email, password) => {
  if (email && password) {
    return true;
  }
  return false;
};


const findUser = email => {
  return Object.values(users).find(user => user.email === email);
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

const getUsersByThierEmail = function(email, data) {
  for (let obj in data) {
    let user = data[obj];
    if (email === user.email) {
      return user;
    }
  }
  return null;
};

const checkPassword = (user, password) => {
  if (user.password === password) {
    return true;
  } else {
    return false;
  }
};
app.get("/urls2.json", (req, res) => {
  res.json(users);
});

app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.get('/urls.json', (req,res) => {
  res.json(urlDatabase)
})



app.post('/urls/:id/edit', (req, res) => {
  // urlDatabase[req.params.id].longURL = req.body.newURL;
  const id = req.params.id
  const newUrl = req.body.newUrl
  if (req.cookies['user_id'] === urlDatabase[id].userID){
    urlDatabase[id].longURL = newUrl
    res.redirect('/urls');
  } else {
    res.status(400).send("Only the user can edit this url")
  }

});

app.post('/urls/:id/delete', (req, res) => {
  // delete urlDatabase[req.params.id];
  // res.redirect('/urls');
  const id = req.params.id 
  if (res.cookie('user_id' === urlDatabase[id].userID)) {
    delete urlDatabase[req.params.id];
    res.redirect('/urls')
  } else {
    res.status(400).send("Only the user can delete this url")
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  let templateVars = { user: users[req.cookies["user_id"]] };
  res.render('login_page', templateVars);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = findUser(email);
  if (!user) {
    res.status(403).send("Email cannot be found");
  } else if (!checkPassword(user, password))  {
    res.status(403).send("Wrong password");
  } else {
    res.cookie('user_id', user.id);
    res.redirect("/urls");
  }
});


app.get('/register', (req, res) => {
  let templateVars = { user: users[req.cookies["user_id"]] };
  res.render('registration-form', templateVars);
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { 
    res.status(400).send('Email and/or password is missing');
  }  if (findUser(email)) {
    res.status(400).send('This email has already been registered');
  } else {
    const user_id = addUser(email, password);
    res.cookie('user_id', user_id);
    res.redirect("/login");
  }
});


app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] };
  if (templateVars.user) {
    res.render("urls_new", templateVars);
  } else {
    res.render("registration-form", templateVars);
  }
});


app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const userID = req.cookies['user_id'];
  const randomShort = generateRandomString();
  urlDatabase[randomShort] = { longURL, userID };
  res.redirect(`/urls`);
});


app.get("/urls", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]],
    urls: urlsForUser(req.cookies["user_id"])
  };
  if (templateVars) {
    res.render("urls_index", templateVars);
  } else {
    res.status(400).redirect('/register');
  }
});

app.get('/urls/:id', (req, res) => {
  let templateVarsForUrlIDS = {
    id : req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.cookies["user_id"]],
  }
   if (!templateVarsForUrlIDS.user) {

  }
  res.render('urls_show', templateVarsForUrlIDS);
});



const urlsForUser = function(idOfUser) {
  const userUrls = {};
  for (const id in urlDatabase) {
    if (urlDatabase[id].userID === idOfUser) {
      userUrls[id] = urlDatabase[id];
    }
  } 
  return userUrls;
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


