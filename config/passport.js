const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          // if User in the database is already exists
          throw new ApiError("User already exists, please login", 400);
        }

        // Create a new user if not found
        const newUser = new User({
          googleId: profile.id,
          name: profile.name.givenName,
          email: profile.emails[0].value,
          password: "MyPassword$1",
          avatar: profile._json.picture,
          verifyEmail: true,
        });

        await newUser.save();

        done(null, newUser);
      } catch (err) {
        done(err);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
