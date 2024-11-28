export const validateUserForm = (formData) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/; // exactly 10 digits
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // min 8 char, one letter, one number
  
    if (!emailRegex.test(formData.email)) {
      return "Invalid email format!";
    }
    if (!phoneRegex.test(formData.phoneNumber)) {
      return "Phone number must be exactly 10 digits.";
    }
    if (formData.password && !passwordRegex.test(formData.password)) {
      return "Password must be at least 8 characters long and include one letter and one number.";
    }
    if (!formData.first_name.trim()) {
      return "First Name cannot be empty.";
    }
    if (!formData.last_name.trim()) {
        return "Last Name cannot be empty.";
      }
    return null;
  };
  