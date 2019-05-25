//importing package
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");

//MongoDB configuration
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;

//router configuration
const student = require("./routers/Student");


//connection of the database
mongoose
	.connect(db, {
		useNewUrlParser: true
	})
	.then(() => console.log("mongoDB connected"))
	.catch(err => console.log("mongoDB did not connected", err));

app.get("/", (req, res) => {
	res.send("Hello");
});

//Passport middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);

//configuration of the server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});
app.use(cors());

//routing parameters
app.use("/student", student);


//Server configuration
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server has started on ${port}`));