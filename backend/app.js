const express = require('express');
const app = express();

const path = require('path')
const logger = require('morgan')
const createError = require('http-errors')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const cors = require('cors')

require('express-async-errors')
require('dotenv').config()

const PORT = process.env.PORT || 3000;
// listen for the defined port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const mongoose = require('mongoose');
const url = process.env.MONGO_URL;

mongoose.connect(url)
    .then(() => console.log('DB Connected'))
    .catch(err => console.error('DB Connection Error:', err));

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users-route')
const blogpostsRouter = require('./routes/blogposts-route')
const commentsRouter = require('./routes/comments-route')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors({ credentials: true, origin: process.env.CORS_ALLOW }))

app.use(
  cookieSession({
    name: 'session',
    keys: ['secret key'],
  })
)

// route prefixes defined in routes
app.use('/', indexRouter)
app.use('/', usersRouter)
app.use('/', blogpostsRouter)
app.use('/', commentsRouter)

// catch error / error handler
app.use(function (req, res, next) {
    next(createError(404))
})

app.use(function (err, req, res, next) {
  // error object only set in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
