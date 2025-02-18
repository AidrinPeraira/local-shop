export function validateUserData(username, email, phone, password) {

  const usernameRegex = /^[a-zA-Z\s]{3,20}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\d{10}$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

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

// Example usage
// const username = "user_123";
// const email = "user@example.com";
// const phone = "9876543210";
// const password = "Password@123";

// const validationMessage = validateUserData(username, email, phone, password);
// console.log(validationMessage);
