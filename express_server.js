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
  return false
};

const checkEmail = email => {
  return Object.values(users).find(user => user.email === email);
}

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
  for(let obj in data){
    let user = data[obj];
    if (email === user.email){
      return user
  } 
  }
  return null
 }


app.get('/register', (req, res) => {
  let templateVars = { user: users[req.cookies["user_id"]],
}
  res.render('registration-form', templateVars)
})

app.get('/login', (req, res) => {
  res.render('login_page')
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
  const user = getUsersByThierEmail(req.body.email, users);
  if (user) {
    if (req.body.password === user.password) {
      res.cookie('user', users);
      res.redirect('/urls');
    } else {
      res.statusCode = 403;
      res.send('<h2>403 Forbidden<br>You entered the wrong password.</h2>')
    }
  } else {
    res.statusCode = 403;
    res.send('<h2>403 Forbidden<br>This email address is not registered.</h2>')
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
})

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!checkRegistration(email, password)) {
    res.status(400).send('Email and/or password is missing');
  } else if (checkEmail(email)) {
    res.status(400).send('This email has already been registered')
  } else {
    const user_id = addUser(email, password);
    res.cookie('user_id', user_id);
    res.redirect("/urls");
  }
});


app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
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
  user: users[req.cookies["user_id"]],
  urls: urlDatabase
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/:id', (req, res) => {
  let templateVarsForUrlIDS = {
      id : req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies["user_id"]],
  };
  res.render('urls_show', templateVarsForUrlIDS);
});

app.get('/', (req, res) => {
  res.redirect('/urls')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


