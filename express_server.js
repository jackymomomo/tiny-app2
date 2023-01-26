const express = require('express')
const app = express()
const PORT = 8080
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs' )


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

app.post('/login', (req, res) => {
  res.cookie('username', req.body)
  res.redirect('/urls')
})

app.post('/urls/:id/edit', (req, res) => {
  urlDatabase[req.params.id] = req.body.newURL
  res.redirect('/urls')
})

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect('/urls')
})

app.get("/urls/new", (req, res) => {
  res.render('urls_new')
});

app.post('/urls', (req, res) => {
  const randomShort = generateRandomString();
  urlDatabase[randomShort] = req.body.longURL;
  res.redirect('/urls/' + String(randomShort));
});

app.get('/urls', (req, res) => {
  let templateUrlVariables = { urls: urlDatabase }
res.render('urls_index', templateUrlVariables)
});

app.get('/urls/:id', (req, res) => {
  let templateVarsForUrlIDS = {id : req.params.id, longURL: urlDatabase[req.params.id] }
  res.render('urls_show', templateVarsForUrlIDS)
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
})


// app.get('/', (req, res) => {
//   res.send('Hello')
// })