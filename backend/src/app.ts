import express from "express";
import propertyRoutes from "./routes/property.routes.js"; // Import your new routes

const app = express();

app.use(express.json());

app.use("/api/properties", propertyRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

export default app;
