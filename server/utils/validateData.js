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
  if (!nameRegex.test(data.sellerName)) {
    return "Invalid seller name. Must be 3-50 characters long.";
  }

  if (!emailRegex.test(data.email)) {
    return "Invalid email format.";
  }

  if (!phoneRegex.test(data.phone)) {
    return "Invalid phone number. Must be 10 digits.";
  }

  if (!passwordRegex.test(data.password)) {
    return "Password must be at least 6 characters long, contain one uppercase letter, one number, and one special character.";
  }

  // GST/PAN validation (either one must be valid)
  if (!panRegex.test(data.taxId) && !gstRegex.test(data.taxId)) {
    return "Invalid GST or PAN format.";
  }

  if (!pinCodeRegex.test(data.address.pincode)) {
    return "Invalid pin code. Must be 6 digits.";
  }

  if (!nameRegex.test(data.address.city)) {
    return "Invalid city name.";
  }

  if (!nameRegex.test(data.address.state)) {
    return "Invalid state name.";
  }

  if (!nameRegex.test(data.bankDetails.bankName)) {
    return "Invalid bank name.";
  }

  if (!nameRegex.test(data.bankDetails.accountHolderName)) {
    return "Invalid account holder name.";
  }

  if (!ifscRegex.test(data.bankDetails.ifscCode)) {
    return "Invalid IFSC code format.";
  }

  if (
    !data.productCategories ||
    !Array.isArray(data.productCategories) ||
    data.productCategories.length === 0
  ) {
    return "At least one category must be selected.";
  }

  return true;
}

export function validateProductData(data) {
  if (!data.productName || data.productName.trim().length < 3) {
    return "Product name must be at least 3 characters long"
  }

  if (!data.description || data.description.trim().length < 10) {
    return "Description must be at least 10 characters long"
  }

  if (!data.category) {
    return "Category is required"
  }

  if (!data.basePrice || isNaN(data.basePrice) || data.basePrice <= 0) {
    return "Valid base price is required"
  }

  // Validate images
  if (!data.images || data.images.length < 3) {
    return "At least 3 images are required"
  }

  // Validate variants if they exist
  if (data.variantTypes && data.variantTypes.length > 0) {
    const variantTypes = JSON.parse(data.variantTypes);
    
    for (const type of variantTypes) {
      if (!type.name || type.values.length === 0) {
        return `Invalid variant type: ${type.name}`
      }
    }

    // Validate variants
    const variants = JSON.parse(data.variants);
    if (!variants || variants.length === 0) {
      return "Variants are required when variant types are specified"
    }
  } else if (!data.stock || isNaN(data.stock) || data.stock < 0) {
    return "Valid stock quantity is required for non-variant products"
  }


  return true
}
