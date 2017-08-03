const express = require('express')
const app = express()

const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
app.engine('mst', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mst')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

////given to us in the assignment////
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

const guess = [] //<---- what user post

const guessed = [] //<----- will post in guessed

app.get('/lose', (req, res) => {
  res.render('lose')
})

app.get('/', (req, res) => {
  res.render('home', { guess, guessed, placeholder })
})
// this 'talks' to the post in the function in home.mst
app.post('/letters/add', function(req, res) {
  guessed.push(req.body.guess)
  if (guessed.length >= 8) {
    res.redirect('/lose')
  }
  res.redirect('/')
})

app.listen(3000, () => {
  console.log('Magic is happening on port 3000')
})
