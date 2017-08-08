const express = require('express')
const app = express()

const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const expressSession = require('express-session') //added express
app.engine('mst', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mst')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())

app.set('trust proxy', 1) //added sessions
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
console.log("the word is" + wordToGuess)

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
  // push to guessed
  guessed.push(req.body.guess)

  if (wordLength.includes(req.body.guess)) {
    wordLength.forEach((letter, index) => {
      if (letter === req.body.guess) {
        placeholder[index] = letter
      }
    })
    res.redirect('/')
  } else {
    count -= 1

    if (count <= 0) {
      res.redirect('/lose')
    } else {
      // PROBLEM: its telling i win when i guess a letter that is not in the word

      // where we need to check if we still need to guess
      // re-check the mystery word vs the letters guessed to see if all the letters where guessed or not
      let countOfLettersThatStillNeedToBeGuessed = 0
      wordLength.forEach((letter, index) => {
        // want to check to see if the current letter was guessed
        if (!(guessed.indexOf(letter) >= 0)) {
          // they did not guess the letter yet
          countOfLettersThatStillNeedToBeGuessed++;
        }
      })
      console.log({countOfLettersThatStillNeedToBeGuessed})

      if (countOfLettersThatStillNeedToBeGuessed === 0){
        res.redirect('/win')
      } else {
        res.redirect('/')
      }

    }
  }
})

app.listen(3000, () => {
  console.log('Magic is happening on port 3000')
})
