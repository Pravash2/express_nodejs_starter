const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcryptjs");

const keys = require("../config/keys");
const jwt = require("jsonwebtoken");
const passport = require("passport");


//importing the mongoose Schema
const Student = require("../models/student");

//Testing the routes
router.get('/test', (req, res) => {
	res.send({
		"message": "test routes works"
	})
})


//Profile Routes

router.post("/register", (req, res) => {
	async function createCourse() {
		Student.findOne({
			registrationNumber: req.body.registrationNumber
		}).then(
			user => {
				if (user) {
					return res.json({
						error: " Registration Number already present"
					});
				} else {
					const body = {
						name: req.body.name,
						password: req.body.password,
						registrationNumber: req.body.registrationNumber.toLowerCase(),
						rollNumber: req.body.rollNumber,
						branch: req.body.branch,
						year: req.body.year,
						course: req.body.course,
						group: req.body.group,
						section: req.body.section,
						type: req.body.type,
						contactNumber: req.body.contactNumber
					};

					const student = new Student(body);

					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(student.password, salt, (err, hash) => {
							if (err) throw err;
							student.password = hash;
							student
								.save()
								.then(user => res.json(user))
								.catch(err => console.log(err));
						});
					});
				}
			}
		);
	}

	createCourse();
});


router.get("/user", (req, res) => {
	async function Get(params) {
		Student.find().then(result => res.json(result));
	}
	Get();
});




router.post("/login", (req, res) => {
	const email = req.body.registrationNumber.toLowerCase();
	const password = req.body.password;

	Student.findOne({
		registrationNumber: email
	}).then(user => {
		if (!user) {
			return res.status(404).json({
				email: "User not found"
			});
		}

		//Check Password
		bcrypt.compare(password, user.password).then(isMatch => {
			if (isMatch) {
				//Create JWT Payload
				const payload = {
					id: user.id,
					name: user.name,
					email: user.registrationNumber,
					type: user.type
				};

				//Sign Token
				jwt.sign(
					payload,
					keys.secretOrKey, {
						expiresIn: 3600
					},
					(err, token) => {
						res.json({
							success: true,
							token: `Bearer ${token}`
						});
					}
				);
			} else {
				return res.status(400).json({
					password: "Password Incorrect"
				});
			}
		});
	});
});

router.get(
	"/current",
	passport.authenticate("jwt", {
		session: false
	}),
	(req, res) => {
		res.json(req.user);
	}
);


module.exports = router;