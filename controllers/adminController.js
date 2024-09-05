const asyncHandler = require("express-async-handler");
const { catchError } = require("../middlewares/catchErrorMiddleware");
const Service = require("../models/serviceModel");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

// Get all services
const getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find();

  res.status(200).json({
    success: true,
    services,
  });
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Update a service when status is call-sales
const updateService = asyncHandler(async (req, res) => {
  const { serviceId, updates } = req.body;

  // Fetch the service by ID
  const service = await Service.findById(serviceId);

  if (!service) {
    throw new ApiError("Service not found", 404);
  }

  // check if status is call-sales
  if (service.status !== "call-sales") {
    throw new ApiError("Service status is not call-sales", 400);
  }

  // Update the service and status to completed
  const updatedService = await Service.findByIdAndUpdate(
    serviceId,
    {
      ...updates,
      status: "completed",
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    service: updatedService,
  });
});

module.exports = {
  getAllServices,
  getAllUsers,
  updateService,
};
