import { body } from "express-validator";

export const sellerRegValidation = [
  body("companyName").notEmpty().withMessage("Company name is required"),
  body("phone").notEmpty().isMobilePhone().withMessage("Valid phone number is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("address.officeName").notEmpty().withMessage("Office name is required"),
  body("address.city").notEmpty().withMessage("City is required"),
  body("address.state").notEmpty().withMessage("State is required"),
  body("address.pincode").notEmpty().withMessage("Pincode is required"),
  body("taxId").notEmpty().withMessage("Tax ID is required"),
  body("productCategories")
    .isArray({ min: 1 })
    .withMessage("At least one product category is required"),
  body("bankDetails.bankingName").notEmpty().withMessage("Banking name is required"),
  body("bankDetails.accountHolderName").notEmpty().withMessage("Account holder name is required"),
  body("bankDetails.ifscCode").notEmpty().withMessage("IFSC code is required"),
  body("bankDetails.accountNumber").notEmpty().withMessage("Account number is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];
