const Service = require('../../models/serviceModel');
const ApiError = require('../../utils/apiError');
const { check, body, param, query } = require('express-validator');
const errors = require('../../utils/errors');

// Dynamically choose validator based on location
const getValidator = (location, fieldName) => {
  switch (location) {
    case 'body':
      return body(fieldName);
    case 'param':
      return param(fieldName);
    case 'query':
      return query(fieldName);
    default:
      return check(fieldName);
  }
};

// Check service belongs to the user
const checkServiceOwnership = async (userId) => {
  const service = await Service.findOne({ userId });
  if (!service || !service.userId.equals(userId)) {
    throw new ApiError(errors.unauthorizedService, 403);
  }
};

// Validate future date
const validateFutureDate = (fieldName, location = 'body') =>
  getValidator(location, fieldName)
    .isISO8601()
    .withMessage(`${fieldName} must be a valid date format (ISO 8601)`)
    .custom((value) => {
      const inputDate = new Date(value);
      if (inputDate <= new Date()) {
        throw new ApiError(errors.invalidFutureDate, 400);
      }
      return true;
    });

// Validate MongoDB ObjectId for any request location
const validateMongoId = (fieldName, location = 'param') =>
  getValidator(location, fieldName)
    .isMongoId()
    .withMessage(errors.invalidMongoId(fieldName))
    .custom((value, { req }) => {
      const fieldLocation = req[location] && req[location][fieldName];
      if (!fieldLocation) {
        throw new Error(`Missing ${location} field: ${fieldName}`);
      }
      return true;
    });

// Reusable status validation
const validateStatus = (fieldName, allowedStatuses, location = 'body') =>
  getValidator(location, fieldName)
    .isString()
    .withMessage(`${fieldName} must be a valid string`)
    .isIn(allowedStatuses)
    .withMessage(`${fieldName} must be one of: ${allowedStatuses.join(', ')}`);

// Check birth date is not in the future (at least 16 years old)
const checkBirthDate = (fieldName, location = 'body') =>
  getValidator(location, fieldName)
    .isISO8601()
    .withMessage(`${fieldName} must be a valid date format (ISO 8601)`)
    .custom((value) => {
      const inputDate = new Date(value);
      const today = new Date();
      const minAgeDate = new Date(today.setFullYear(today.getFullYear() - 16));

      if (inputDate > minAgeDate) {
        throw new ApiError('You must be at least 16 years old', 400);
      }

      return true;
    });

// Check if an item exists in the database
const checkExists = async (model, id) => {
  const exists = await model.exists({ _id: id });
  if (!exists) {
    throw new ApiError(errors.resourceNotFound, 404);
  }
};

module.exports = {
  checkServiceOwnership,
  validateFutureDate,
  checkExists,
  validateMongoId,
  checkBirthDate,
  validateStatus,
};
