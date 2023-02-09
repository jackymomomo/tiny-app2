
//Required functions and npm packages for project completion
const { urlsForUser, getUserByEmail, generateRandomString, addUser, urlDatabase, users } = require('./helpers');
const express = require('express');
const app = express();
const bcrypt = require("bcryptjs");
const PORT = 8080;
cookieSession = require('cookie-session');
app.use(express.urlencoded({ extended: true }));

//App functionality
app.set('view engine', 'ejs');
app.use(
  cookieSession({
    name: 'session',
    keys: ['e1d50c4f-538a-4682-89f4-c002f10a59c8', '2d310699-67d3-4b26-a3a4-1dbf2b67be5c'],
  })
);

// / => homepage
app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});


//Logout of Tiny App
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

//Login to Your Tiny App


app.get('/login', (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  res.render('login_page', templateVars);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, users);
  if (!user) {
    let templateVars = {
      status: 401,
      message: 'Email not found',
      user: users[req.session.user_id]
    }
    res.status(401);
    res.render("urls_error", templateVars);
  } else if (!bcrypt.compareSync(password, user.password)) {
    let templateVars = {
      status: 401,
      message: 'Password incorrect',
      user: users[req.session.user_id]
    }
    res.status(401);
    res.render("urls_error", templateVars);
  } else {
    req.session.user_id = user.id;
    res.redirect("/urls");
  }
});

//Register Your Tiny APP Account

app.get('/register', (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  res.render('registration-form', templateVars);
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    let templateVars = {
      status: 409,
      message: 'This email or password are incorrect: try again',
      user: users[req.session.user_id]
    }
    res.status(409);
    res.render("urls_error", templateVars);
  }  if (getUserByEmail(email, users)) {
    let templateVars = {
      status: 409,
      message: 'This email has already been registered',
      user: users[req.session.user_id]
    }
    res.status(409);
    res.render("urls_error", templateVars);
  } else {
    const user_id = addUser(email, password);
    req.session.user_id = user_id;
    res.redirect("/urls");
  }
});


app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.session.user_id] };
  if (templateVars.user) {
    res.render("urls_new", templateVars);
  } else {
    let templateVars = {
      status: 401,
      message: 'You need to be logged in to perform that action',
      user: users[req.session.user_id]
    }
    res.status(401);
    res.render("urls_error", templateVars);
  }
});

// /URLS => list of all of the user's URLs

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const userID = req.session.user_id;
  const randomShort = generateRandomString();
  urlDatabase[randomShort] = { longURL, userID };
  res.redirect('/urls/' + String(randomShort));
});


app.get("/urls", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
    urls: urlsForUser(req.session.user_id)
  };
  if (templateVars.user) {
    res.render("urls_index", templateVars);
  } else {
    let templateVars = {
      status: 401,
      message: 'You need to be logged in to perform that action',
      user: users[req.session.user_id]
    }
    res.status(401);
    res.render("urls_error", templateVars);
  }
});

// /URLS/:id => page of the specific id

app.get('/urls/:id', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    let templateVars = {
      status: 404,
      message: 'This TinyURL does not exist',
      user: users[req.session.user_id]
    }
    res.status(404);
    res.render("urls_error", templateVars);
  }
  let templateVarsForUrlIDS = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.session.user_id],
  };
  if (req.session.user_id === urlDatabase[templateVarsForUrlIDS.id].userID) {
    res.render('urls_show', templateVarsForUrlIDS);
  } else {
    let templateVars = {
      status: 401,
      message: 'This TinyURL does not belong to you',
      user: users[req.session.user_id]
    }
    res.status(401);
    res.render("urls_error", templateVars)
  }
});

//Edit Your URLs

app.post('/urls/:id', (req, res) => {
  const shortURL = req.params.id;
  const longURL = req.body.longURL;
  if (req.session.user_id === urlDatabase[shortURL].userID) {
    urlDatabase[shortURL].longURL = longURL;
    res.redirect(`/urls`);
  } else {
    let templateVars = {
      status: 401,
      message: 'You are not allowed to edit that TinyURL',
      user: users[req.session.user_id]
    }
    res.status(401);
    res.render("urls_error", templateVars);
  }
});

//Delete Your URLs

app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id;
  if (req.session.user_id === urlDatabase[id].userID) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  } else {
    let templateVars = {
      status: 401,
      message: 'You are not allowed to delete that TinyURL',
      user: users[req.session.user_id]
    }
    res.status(401);
    res.render("urls_error", templateVars);
  }
});

//Error page

app.get('/error', (req, res) => {
  res.render('urls_error');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});