import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

export class AuthController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, phoneNumber } = req.body;
      if (!name || !email || !password || !phoneNumber) {
        res.status(400).json({ error: "Missing registration fields." });
        return;
      }
      const user = await authService.registerLandlord({
        name,
        email,
        passwordRaw: password,
        phoneNumber,
      });
      res
        .status(201)
        .json({ message: "Landlord registration complete!", user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const session = await authService.loginLandlord(email, password);
      res.status(200).json({ message: "Login successful!", ...session });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
