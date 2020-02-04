const dotenv = require('dotenv').config();
const express = require('express');
const app = express();


//Body Parser
app.use(require('body-parser')());

//Mongo DB
var mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);



//Session
const session = require('express-session');
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}))


// view engine setup
require('./view_engine_setup')(app);



//Controllers
require('./controllers/install_app')(app);
require('./controllers/shop')(app);
require('./controllers/products')(app);




app.listen(process.env.PORT, () => {
  console.log('App listening on port '+process.env.PORT);
  
});
