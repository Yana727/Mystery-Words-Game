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

let count = 8
const guess = [] //<---- what user post

const guessed = [] //<----- will post in guessed

console.log(wordToGuess)

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
