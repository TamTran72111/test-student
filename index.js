const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const studentRouter = require('./routes/student');
app.use('/api/students', studentRouter);

const PORT = process.env.PORT || 3000;

const DBURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@student.3h4fg.mongodb.net/students?retryWrites=true&w=majority`;

mongoose
  .connect(DBURL, { useNewUrlParser: true })
  .then(() => {
    console.log("Database is connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log(`Something went wrong: ${err}`);
  });