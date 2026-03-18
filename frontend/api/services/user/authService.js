import client from "../../axios/client.js";
import { userEndpoints } from "../../endpoints/user.js";

const { users: e } = userEndpoints;

export const authService = {
  login: (email, password) =>
    client.post(e.login, { email, password }).then((res) => res.data),

  register: (name, email, password) =>
    client.post(e.register, { name, email, password }).then((res) => res.data),

  getProfile: () =>
    client.get(e.profile).then((res) => res.data),

  updateProfile: (data) =>
    client.put(e.profile, data).then((res) => res.data),
  
  sendOTP: (phone) =>
    client.post(e.sendOTP, { phone }).then((res) => res.data),

  verifyOTP: (phone, otp) =>
    client.post(e.verifyOTP, { phone, otp }).then((res) => res.data),
};

export default authService;
