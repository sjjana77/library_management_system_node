const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const app = express();
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

const corsOptions = {
  origin: ['http://localhost:3000/react_task/register', 'http://localhost:3000/react_task', 'http://localhost:3000', 'http://localhost/', 'http://localhost:3001/react_task', 'http://localhost:3001', 'https://github.com/'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/react_task/users', userRoutes);
app.use('/react_task/books', bookRoutes);
app.use('/react_task/transactions', transactionRoutes);
app.use('/react_task/books', bookRoutes);
app.use('/react_task/transactions', transactionRoutes);


connectDB();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
