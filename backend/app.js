const express = require('express');
const mogoose = require("mongoose");

const subjectRoutes = require("./routes/subjects");
const userRoutes = require("./routes/users");

const app = express();

mogoose.connect("mongodb+srv://moinmedrec:"+process.env.MONGO_ALTAS_PW+"@cluster0.0la7q.mongodb.net/medrec", { useNewUrlParser: true, useUnifiedTopology: true })
        .then(()=>{console.log("Connected to Database")})
        .catch(()=>{console.log("Db connection failed!")});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

//middleware
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next()
});

app.use("/api/subjects",subjectRoutes);
app.use("/api/users",userRoutes);


app.use((req, res, next)=>{
    res.send('Hello From Express')
});

module.exports = app;