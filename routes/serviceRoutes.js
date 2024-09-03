const express = require("express");
const {
  purchaseService,
  inProgressService,
  continueService,
  cancelService,
  linkCreditCard,
  validateDomain,
  callSales,
} = require("../controllers/servicesController.js");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);

router.use(authService.allowedTo("user"));

router.post("/in-progress", inProgressService);
router.post("/continue", continueService);
router.post("/cancel", cancelService);
router.post("/call-sales", callSales);
router.post('/link-card', linkCreditCard);
router.post('/purchase-service', purchaseService);
router.post("/validate-domain", validateDomain);

module.exports = router;
