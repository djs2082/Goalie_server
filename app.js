const express = require('express');
// const cors = require('cors');
// const cookieSession = require('cookie-session');
const dotenv = require('dotenv');
const mongoose = require('mongoose')


dotenv.config();
const expressValidator = require('express-validator');
const app = express();
app.use(expressValidator())
const dbConfig = require('./Config/dbConfig')

let PORT = process.env.PORT || 3000;

// app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}));



// app.use(
//     cookieSession({
//         name: "goalie",
//         secret: process.env.COOKIE_SECRET,
//         httpOnly: true
//     })
// )

// app.get('/',(req,res) => {
//     res.json({message:"Welcome to Goalie!"})
// })

// app.use("/api/users",require('./Routes/users.routes'));

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false, // Don't build indexes
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
});
const userRoutes = require('./Routes/users.routes');
app.use('/user', userRoutes);
app.listen(PORT,()=>console.log(`server started on ${process.env.PORT}`));