//INET2656 - Web Application Programming
// written by: Dylan Cunningham 
//             W0443022


import express from 'express';
import cors from 'cors'; //allow client app to connect to server app 
import usersRouter from './routes/users.js';
import homeRouter from './routes/home.js';
import guitarsRouter from './routes/guitars.js';
import purchaseRouter from './routes/purchase.js';
import session from 'express-session';
import dotenv from 'dotenv';
import PasswordValidator from 'password-validator';

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

// cors middleware
app.use(cors({
  origin: 'http://localhost:5173', // react client
  methods: ['GET', 'POST', 'DELETE'], //allows specific methods
  credentials: true // allow cookies
}));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// express-session middleware
app.use(session({
    secret: 'fkldjbnfdkFTFT5efd3$$sdg89F',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      httpOnly: true,
      secure: false,  // Set to `true` if using HTTPS in production
      sameSite: 'lax',  // Consider 'none' if client and server are on different origins
      maxAge: 3600000 // 1 hour in milliseconds
    }
  }));


//routes
app.use('/api/', homeRouter);
app.use('/api/users', usersRouter);
app.use('/api/guitars', guitarsRouter);
app.use('/api/purchase', purchaseRouter);


//CORS debug middleware 
// CITATION: https://blog.pixelfreestudio.com/cors-errors-demystified-how-to-fix-cross-origin-issues-2/?form=MG0AV3
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Headers', 'GET, POST, PUT,');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.sendStatus(200);
  }
  next();
});


//error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error: ', err);
  res.status(500).send('Internal server error');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


