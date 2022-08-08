const express = requier('express');

const app = express();

app.use(express.json());

app.use(express.urlendocded({extended:false}));

app.use("/api/users",require('./routes/api/users"'));

app.listen(3000,()=>console.log("server started"));