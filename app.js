import express from "express";
import passport from "passport";
import session from "express-session";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import user_model from "./models/user.js";
import db from "./config/mongoose-connection.js";
import books_model from "./models/book.js";
import axios from "axios";
import ensureAuthenticated from "./middlewares/auth.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.render("signup.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/BookStore", ensureAuthenticated, async (req, res) => {
  try {
    const user = await user_model.findOne({ email: req.user.email });
    res.render("bookStore.ejs", { user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal server error.");
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/BookStore",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/BookStore",
  })
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

app.get("/books", ensureAuthenticated, async (req, res) => {
  try {
    const user = await user_model.findOne({ email: req.user.email }).populate("books");
    res.render("yourBooks.ejs", { user });
  } catch (err) {
    console.error(err);
  }
});

app.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;
  let existUser = await user_model.findOne({ email });
  if (existUser) {
    res.redirect("/login");
  } else {
    bcrypt.genSalt(parseInt(process.env.GENSALT), (err, salt) => {
      if (err) {
        console.error("Error generating salt:", err.message);
        return res.status(500).send("Internal server error.");
      }
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err.message);
          return res.status(500).send("Internal server error.");
        }
        try {
          const user = await user_model.create({ name, email, password: hash });
          req.login(user, (err) => {
            if (err) {
              console.error("Error logging in user:", err.message);
              return res.status(500).send("Internal server error.");
            }
            res.redirect("/BookStore");
          });
        } catch (err) {
          console.error("Error creating user:", err.message);
          res.status(500).send("Internal server error.");
        }
      });
    });
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/BookStore",
    failureRedirect: "/login",
  })
);

app.post("/books/submit", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  const { title, author } = req.body;
  try {
    const response = await axios.get(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`
    );
    const booksData = response.data.docs[0];

    let coverImageUrl = null;
    if (booksData && booksData.cover_i) {
      coverImageUrl = `https://covers.openlibrary.org/b/id/${booksData.cover_i}-L.jpg`;
    }

    const newBook = await books_model.create({
      title,
      author,
      coverImageUrl,
      user: req.user._id,
    });

    const user = await user_model.findById(req.user._id);
    if (user) {
      user.books.push(newBook._id);
      await user.save();
    }

    res.redirect("/BookStore");
  } catch (err) {
    console.error("Error submitting book:", err.message);
    res.status(500).send("An error occurred while submitting the book.");
  }
});

// Passport Configuration
passport.use(
  "local",
  new Strategy(async function (email, password, cb) {
    try {
      let existUser = await user_model.findOne({ email });
      if (!existUser) {
        return cb(null, false, { message: "Incorrect email or password." });
      }
      bcrypt.compare(password, existUser.password, (err, result) => {
        if (err) return cb(err);
        if (result) {
          return cb(null, existUser);
        } else {
          return cb(null, false, { message: "Incorrect email or password." });
        }
      });
    } catch (err) {
      cb(err);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (refreshToken, accessToken, profile, cb) => {
      try {
        let existUser = await user_model.findOne({ email: profile.email });
        if (!existUser) {
          const user = await user_model.create({
            email: profile.email,
            password: "google",
          });
          return cb(null, user);
        } else {
          return cb(null, existUser);
        }
      } catch (err) {
        cb(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await user_model.findById(id);
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
