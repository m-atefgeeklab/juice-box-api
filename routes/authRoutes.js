const express = require("express");
const passport = require("passport");
const {
  signUpController,
  signInController,
  verifyEmailController,
  forgotPassword,
  resetPassword,
  verifyPassResetCode,
} = require("../controllers/authController.js");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator.js");
const { verifyEmailWebhook } = require("../services/authService.js");
const createToken = require("../utils/createToken");

const router = express.Router();

router.post("/signup", signupValidator, signUpController);
router.post("/login", loginValidator, signInController);
router.get("/verify-email/:token", verifyEmailController);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyPassResetCode);
router.put("/reset-password", resetPassword);

router.post("/webhook/verify-email", verifyEmailWebhook);

// Google auth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  res.redirect("/");
});

router.get("/user", (req, res) => {
  // Check if req.user exists
  if (req.user) {
    // Generate the token using the user's ID
    const token = createToken(req.user._id);

    // Send the user data and token back to the client
    res.send({
      user: req.user,
      token: token,
    });
  } else {
    // If req.user doesn't exist, send an appropriate response
    res.status(401).send({
      message: "User not authenticated",
    });
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
