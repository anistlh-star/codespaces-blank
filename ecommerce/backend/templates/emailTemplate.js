export const welcomeTemplate = (name) => {
  return `
    <h1>Welcome ${name}</h1>

    <p>Thanks for joining our platform.</p>
  `;
};
export const otpTemplate = (otp) => {
  return `
    <h2>Your OTP Code</h2>

    <h1>${otp}</h1>
  `;
};
