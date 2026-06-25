import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Swapped to industry-standard jsonwebtoken
import { landlordRepository } from "../repositories/user.repository.js";

const userRepo = new landlordRepository();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export class AuthService {
  async registerLandlord(data: {
    name: string;
    email: string;
    passwordRaw: string;
    phoneNumber: string;
  }) {
    const existingUser = await userRepo.findByEmail(data.email);
    if (existingUser)
      throw new Error(
        "An account is already registered with this email address.",
      );

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.passwordRaw, salt);

    return await userRepo.createlandlord({
      name: data.name,
      email: data.email,
      passwordHash,
      phoneNumber: data.phoneNumber,
    });
  }

  async loginLandlord(email: string, passwordRaw: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error("Invalid email or password credentials.");

    const isMatch = await bcrypt.compare(passwordRaw, user.passwordHash);
    if (!isMatch) throw new Error("Invalid email or password credentials.");

    // Swapped to jsonwebtoken synchronous/asynchronous default signing structure
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
