import express from "express";
import cors from "cors";
import propertyRoutes from "./routes/property.routes.js";
import tenantAppRoutes from "./routes/tenantApplication.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import { requireAuth } from "./middlewares/auth.middleware.js";
import expenseRoutes from "./routes/expense.routes.js";

import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/properties", requireAuth, propertyRoutes);
app.use("/api/applications", tenantAppRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

export default app;
