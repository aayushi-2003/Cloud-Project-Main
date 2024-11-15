/**
* Copyright 2019 IBM
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
**/

var express = require('express');
const connectDB = require('./config/database')
require('dotenv').config();
const session = require('express-session')
const authRouter=require('./routers/authenticator')
const courseRouter=require('./routers/course')
const cors = require('cors')
const passport = require('passport');
const cookieParser = require('cookie-parser');
const PORT=process.env.PORT || 80;

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    // secure: process.env.NODE_ENV === 'production',
    httpOnly: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
};

var app = express();
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(session(sessionConfig))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

connectDB();

app.use('/auth',authRouter)
app.use('/',courseRouter)

app.listen(PORT,()=>{
  console.log(`The server is listening on PORT ${PORT}`)
});
