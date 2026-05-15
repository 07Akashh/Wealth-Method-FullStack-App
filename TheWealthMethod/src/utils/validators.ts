

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 7;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validatePhone = (phone: string): boolean => {
  const re = /^[0-9]{10}$/;
  return re.test(phone.replace(/[^0-9]/g, "").slice(-10));
};
