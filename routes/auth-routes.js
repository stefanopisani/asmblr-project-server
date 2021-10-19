const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

// Signup
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.status(400).json({message: "Missing Fields"});
    return;
  }

  const user = await User.findOne({ username });
  if (user !== null) {
    //found the user, it already exists
    res.status(400).json({message: "User already exists"});
    return;
  }

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const newUser = await User.create({
    username,
    password: hashedPassword,
  });
  res.status(200).json(newUser);
});

//Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.status(400).json({message: "Missing Fields"});
    return;
  }
  const user = await User.findOne({ username });
  if (user === null) {
    res.status(401).json({message: "Invalid login"});
    return;
  }

  if (bcrypt.compareSync(password, user.password)) {
    //passwords match - login successful
    req.session.currentUser = user;
    res.status(200).json(user);
  } else {
    res.status(401).json({message: "Invalid login"});
  }
});

//Logout
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).json({message: "User logged out"});
});

//Check if is logged in
router.get("/isloggedin", (req, res)=> {
    if(req.session.currentUser) {
        res.status(200).json(req.session.currentUser)
    } else {
        res.status(200).json({})
    }
});

//ALL ROUTES TESTED ON POSTMAN ✅
module.exports = router;