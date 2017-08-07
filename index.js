const express = require('express')
const app = express()

const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const expressSession = require('express-session')
app.engine('mst', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mst')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())

app.set('trust proxy', 1)
app.use(
  expressSession({
    secret: 'yanasnewword87',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  })
)
//added the max age this morning

const file = require('file-system')
const fs = require('fs')
const words = fs
  .readFileSync('/usr/share/dict/words', 'utf-8')
  .toLowerCase()
  .split('\n')
////////////////////////////////////////////
const wordToGuess = words[Math.floor(Math.random() * words.length)]
const wordLength = wordToGuess.split('')
let placeholder = wordLength.map(x => {
  return '_'
})

let count = 8
const guess = [] //<---- what user post
const guessed = [] //<----- will post in guessed

app.get('/lose', (req, res) => {
  res.render('lose')
})
app.get('/win', (req, res) => {
  res.render('win')
})
app.get('/', (req, res) => {
  res.render('home', { guess, guessed, placeholder, count })
})
// this 'talks' to the post in the function in home.mst
app.post('/letters/add', function(req, res) {
  if (wordLength.includes(req.body.guess)) {
    wordLength.forEach((letter, index) => {
      if (letter === req.body.guess) {
        placeholder[index] = letter
      }
    })
    res.redirect('/')
  } else {
    count -= 1
    guessed.push(req.body.guess)
    if (count <= 0) {
      res.redirect('/lose')
    } else {
      res.redirect('/win')
    }
  }
})

app.listen(3000, () => {
  console.log('Magic is happening on port 3000')
})
