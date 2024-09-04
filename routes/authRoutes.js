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
  '/google', 
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }), // Redirect to the login page on failure
  (req, res) => {
    // Successful authentication, redirect to the frontend app
    res.redirect("http://localhost:3000"); // Replace with your frontend URL
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/user', (req, res) => {
  res.send(req.user);
});

module.exports = router;
