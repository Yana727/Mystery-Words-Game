const express = require('express')
const app = express()
const path = require('path')

const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')

const file = require('file-system')
const fs = require('fs')
const words = fs
  .readFileSync('/usr/share/dict/words', 'utf-8')
  .toLowerCase()
  .split('\n')

//var words = [{
//  'apple', 'banana', 'cherry', 'peach', 'orange'
//}]

app.engine('mst', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mst')

app.use(express.static('public'))

app.get('/', (req, res) => {
  console.log('home page is here!')
  res.render('home')
})
// this 'talks' to the post in the function in home.mst
app.post('letter/add', function(req, res) {
  console.log('letters')
//but it doesn't seem to, bc I don't see the "letters" in terminal + crashes bc of "line 39???" (40 min)

app.listen(3000, () => {
  console.log('Magic is happening on port 3000')
})
