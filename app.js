// EXPRESS.JS setup //
const express = require("express");
const app = express();
const port = 5000;
const path = require('path');

// SQLITE3 Setup //
const sqlite3  = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log("Database Connection Successful");
});

// Static Files //
app.use(express.static('public'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use('/static', express.static('public'));

// Set Templating Engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');

// EXPRESS.JS Login Session Manager //
const expressSession = require("express-session");
const session = new expressSession({
	secret: "secret",
	resave: true,
	saveUninitialized: true,
	maxAge: 3600000,
});
app.use(session);

// Protected Routes Function //
function isLoggedIn(req, res, next) {
	if (req.session.email) {
	  next();
	} else {
	  res.redirect('/');
	}
}

// Login Route //
app.get("/", (req, res) =>{
	res.render('index');
});

// Signup Route // 
app.get("/signup", (req, res) =>{
	res.render('signup');
});

// Login POST request //
app.post("/user/login", (req, res) => {
	const email = req.body.form_email;
	const password = req.body.form_password;
	db.all(`SELECT * FROM users WHERE Email='${email}' AND Password='${password}'`, [], (error, results) => {
		if(results.length != 0) {
			// Assign session variables then redirect //
			req.session.email = results[0].Email;
			res.redirect(`/dashboard/user/${req.session.email}`);
		} else {
			res.redirect("/");
		}
	});
});

// Signup POST request //
app.post("/user/signup", (req, res) => {
	const email = req.body.form_email;
	const password = req.body.form_password;
	db.run("INSERT INTO users(Email, Password, TutorialComplete, WeeklyTarget, CurrentWeekTotal) VALUES(?,?,?,?,?)", [email, password, "false", 0, 0], (error) =>{
		if(error) {
			console.log(error);
		} else {
			// Assign session variables then redirect //
			req.session.email = email;
			res.redirect(`/dashboard/user/${req.session.email}`);
		}
	});
});

// Support Page Routes //
app.get("/about", (req, res) =>{
	res.render('about');
});

// Support Page Routes //
app.get("/help", (req, res) =>{
	res.render('help');
});

// Support Page Routes //
app.get("/help/search", (req, res) =>{
	db.all(`SELECT * FROM help_articles WHERE help_name LIKE '%${req.query.form_term}%' OR help_article LIKE '%${req.query.form_term}%'`, [], (error, results) => {
		res.render('searchresults', { results, req});
	});
});

// User Dashboard Route //
app.get(`/dashboard/user/:mainuserid`, isLoggedIn, (req, res) =>{
	const mainuserid = req.session.email;
	db.all(`SELECT * FROM users WHERE Email ='${req.session.email}'`, [], (error, results) => {
		db.all(`SELECT * FROM activities WHERE Activity_Author ='${req.session.email}'`, [], (error, results2) => {
			db.all(`SELECT * FROM tips ORDER BY RANDOM() LIMIT 5`, [], (error, results3) => {
				res.render(`dashboard`, { results, results2, results3, locals: { user: req.session.email, } });
			});
		});
	});
});

// Change Target Hours //
app.post("/updateusers", (req, res) => {
	const hours = req.body.form_hours;
	db.run(`UPDATE users SET WeeklyTarget = ${hours} WHERE Email = ?`, [req.session.email], (error) =>{
		if(error) {
			console.log(error);
		} else {
			res.status(204).send();
		}
	});
});

// Complete Tutorial //
app.post("/finalisetut", (req, res) => {
	db.run(`UPDATE users SET TutorialComplete = ? WHERE Email = ?`, ["true", req.session.email], (error) =>{
		if(error) {
			console.log(error);
		} else {
			db.all(`SELECT * FROM users WHERE Email ='${req.session.email}'`, [], (error, results) => {
				db.all(`SELECT * FROM activities WHERE Activity_Author ='${req.session.email}'`, [], (error, results2) => {
					db.all(`SELECT * FROM tips ORDER BY RANDOM() LIMIT 5`, [], (error, results3) => {
						res.render(`dashboard`, { results, results2, results3, locals: { user: req.session.email, } });
					});
				});
			});
		}
	});
});

// User AddActivity Route //
app.get("/add", isLoggedIn, (req, res) =>{
	res.render('add');
});

app.post("/add/submit", (req, res) => {
	const Title = req.body.form_activity_type;
	const Duration = req.body.form_hours;
	const Note = req.body.form_note;
	db.run("INSERT INTO activities(Activity_Author, Activity_Title, Activity_Duration, Activity_Note) VALUES(?,?,?,?)", [req.session.email, Title, Duration, Note], (error) =>{
		if(error) {
			console.log(error);
		} else {
			db.run(`UPDATE users SET CurrentWeekTotal = CurrentWeekTotal + ${req.body.form_hours} WHERE Email = ?`, [req.session.email], (error) =>{
				if(error) {
					console.log(error);
				} else {
					res.redirect(`/dashboard/user/${req.session.email}`);
				}
			});
		}
	});
});

app.get("*", (req, res) =>{
	res.render('error404');
});

// Logout //
app.get("/logout", (req, res) => {
	req.session.destroy();
	res.redirect('/');
});

// Listener // 
app.listen(port, () => {
	console.log(`Application Listening On Port ${port}:`);
});