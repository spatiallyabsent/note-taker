const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const htmlRoutes = require('./routes/htmlRoutes');

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.use('/', htmlRoutes);


//used to start the server
app.listen(PORT, () => {
    console.log(`server on Port ${PORT}`);
});