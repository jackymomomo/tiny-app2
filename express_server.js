const express = require('express');
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser')
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(cookieParser())


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

app.get('/register', (req, res) => {
  res.render('registration-form')
})

app.post('/urls/:id/edit', (req, res) => {
  urlDatabase[req.params.id] = req.body.newURL;
  res.redirect('/urls');
});

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  let cookie = req.body.username
  res.cookie("username",cookie);
  res.redirect('/urls');
})


app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
})

app.post('/register', (req, res) => {
  const newUserId = generateRandomString
  let emailBody = req.body.email
  let passwordBody = req.body.password
  const user = {
    id: newUserId,
    email: emailBody,
    password: passwordBody
  }
  users[newUserId] = user

  if (user.emailBody === '' || user.passwordBody ) {
    res.send("400 Bad Request")
  } else {
    res
    .cookie('user_id', newUserId)
    console.log(users)
    res.redirect('/urls')
  }
})

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"], 
  }
  res.render('urls_new', templateVars);
});

app.post('/urls', (req, res) => {
  
  const randomShort = generateRandomString();
  urlDatabase[randomShort] = req.body.longURL;
  res.redirect('/urls/' + String(randomShort));
});

app.get('/urls', (req, res) => {
const templateVars = {
  username: req.cookies["username"],
    urls: urlDatabase
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/:id', (req, res) => {
  let templateVarsForUrlIDS = {
      id : req.params.id,
    longURL: urlDatabase[req.params.id],
    username : req.cookies["username"] 
  };
  res.render('urls_show', templateVarsForUrlIDS);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


// app.get('/', (req, res) => {
//   res.send('Hello')
// })