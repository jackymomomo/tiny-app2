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

app.get('/', (req, res) => {
  res.send('Hello')
})

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect('/urls')
})

app.get("/urls/new", (req, res) => {
  res.render('urls_new')
});

app.post('/urls', (req, res) => {
  console.log(req.body)
  res.send('hi')
})

app.get('/urls', (req, res) => {
  let templateUrlVariables = { urls: urlDatabase }
res.render('urls_index', templateUrlVariables)
});

app.get('/urls/:id', (req, res) => {
  let templateVarsForUrlIDS = {id : req.params.id, longURL: urlDatabase[req.params.id] }
  res.render('urls_show', templateVarsForUrlIDS)
})

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });
// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
})