// Regex patterns
const usernameRegex = /^[a-zA-Z\s]{3,20}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\d{10}$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const nameRegex = /^[a-zA-Z\s]{3,50}$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/;
const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const pinCodeRegex = /^\d{6}$/;

export function validateUserData(username, email, phone, password) {
  if (!usernameRegex.test(username)) {
    return "Invalid username. Username must be 3-20 characters long. No special characters.";
  }

  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }

  if (!phoneRegex.test(phone)) {
    return "Invalid phone number.";
  }

  if (!passwordRegex.test(password)) {
    return "Password must be at least 6 characters long and contain at least one number, one uppercase letter, and one special character.";
  }

  return true;
}

export function validateSellerData(data) {
  // Field validations
  if (!nameRegex.test(data.companyName)) {
    return "Invalid company name. Must be 3-50 characters long.";
  }

  if (!emailRegex.test(data.email)) {
    return "Invalid email format.";
  }

  if (!phoneRegex.test(data.phone)) {
    return "Invalid phone number. Must be 10 digits.";
  }

  if (!passwordRegex.test(data.password)) {
    return;
    ("Password must be at least 6 characters long, contain one uppercase letter, one number, and one special character.");
  }

  // GST/PAN validation (either one must be valid)
  if (!panRegex.test(data.gstPan) && !gstRegex.test(data.gstPan)) {
    return "Invalid GST or PAN format.";
  }

  if (!pinCodeRegex.test(data.pinCode)) {
    return "Invalid pin code. Must be 6 digits.";
  }

  if (!nameRegex.test(data.city)) {
    return "Invalid city name.";
  }

  if (!nameRegex.test(data.state)) {
    return "Invalid state name.";
  }

  if (!nameRegex.test(data.bankName)) {
    return "Invalid bank name.";
  }

  if (!nameRegex.test(data.accountHolderName)) {
    return "Invalid account holder name.";
  }

  if (!ifscRegex.test(data.ifscCode)) {
    return "Invalid IFSC code format.";
  }

  if (
    !data.categories ||
    !Array.isArray(data.categories) ||
    data.categories.length === 0
  ) {
    return "At least one category must be selected.";
  }

  return true;
}
