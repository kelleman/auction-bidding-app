const mongoose = require('mongoose');

const url = process.env.DB_URI;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>console.log('Connected to database'))
.catch(err=>console.error('Unable to connect to database', err));