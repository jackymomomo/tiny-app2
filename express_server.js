
const {getUserByEmail, generateRandomString, addUser, urlDatabase, users} = require('./helpers')
const express = require('express');
const app = express();
const bcrypt = require("bcryptjs");
const PORT = 8080;
const cookieParser = require('cookie-parser');
cookieSession = require('cookie-session')
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
 app.use(cookieParser());
app.use(
  cookieSession({
    name: 'session',
    keys: ['e1d50c4f-538a-4682-89f4-c002f10a59c8', '2d310699-67d3-4b26-a3a4-1dbf2b67be5c'],
  })
);

app.get("/urls2.json", (req, res) => {
  res.json(users);
});

app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.get('/urls.json', (req,res) => {
  res.json(urlDatabase)
})



app.post('/urls/:id', (req, res) => {
  const shortURL = req.params.id;
  const longURL = req.body.longURL
  if (req.session.user_id === urlDatabase[shortURL].userID) {
    urlDatabase[shortURL].longURL = longURL;
    res.redirect(`/urls`);
  } else {
    res.status(400).send("Your are not allowed to edit that TinyURL!")
  }
});

app.post('/urls/:id/delete', (req, res) => {
  // delete urlDatabase[req.params.id];
  // res.redirect('/urls');
  const id = req.params.id 
  if (req.session.user_id === urlDatabase[id].userID) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  } else {
    res.status(400).send("You are not allowed to delete that TinyURL!");
  }
});
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  res.render('login_page', templateVars);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, users);
  if (!user) {
    res.status(403).send("Email cannot be found");
  } else if (!bcrypt.compareSync(password, user.password))  {
    res.status(403).send("Wrong password");
  } else {
    req.session.user_id = user.id;
    res.redirect("/urls");
  }
});


app.get('/register', (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  res.render('registration-form', templateVars);
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { 
    res.status(400).send('Email and/or password is missing');
  }  if (getUserByEmail(email, users)) {
    res.status(400).send('This email has already been registered');
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
    res.render("registration-form", templateVars);
  }
});


app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const userID = req.session.user_id;
  const randomShort = generateRandomString();
  urlDatabase[randomShort] = { longURL, userID };
  res.redirect(`/urls`);
});


app.get("/urls", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
    urls: urlsForUser(req.session.user_id)
  };
  if (templateVars.user) {
    res.render("urls_index", templateVars);
  } else {
    res.redirect('/register');
  }
});

app.get('/urls/:id', (req, res) => {
  let templateVarsForUrlIDS = {
    id : req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.session.user_id],
  }
  if (req.session.user_id === urlDatabase[templateVarsForUrlIDS.id].userID){
    res.render('urls_show', templateVarsForUrlIDS);
  } else {
    res.render('registration-form')
  }
});

app.get('/error', (req, res) => {
  res.render('urls_error')
})

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


