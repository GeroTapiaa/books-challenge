const express = require('express');
const mainRouter = require('./routes/main');
const method = require('method-override')
const session = require('express-session')
var cookie = require('cookie-parser');
const cookieCheck = require('./middleware/cookieCheck');

const app = express();
app.use(method('_method'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret :'book',
  saveUninitialized : true,
  resave : true
}));
app.use(cookie());
app.use(cookieCheck)
app.use((req,res,next) => {
  req.session.userLogin ? res.locals.userLogin = req.session.userLogin : null
next()
})

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use('/', mainRouter);


app.listen(3000, () => {
  console.log('listening in http://localhost:3000');
});
