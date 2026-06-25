import { Router } from "express";
import { PropertyController } from "../controllers/property.controller.js";

const router = Router();
const propertyController = new PropertyController();

// 1. Fetch all property assets belonging to the authenticated landlord session
router.get("/", propertyController.getLandlordProperties);

// 2. Fetch dynamic deeply nested floorplan rows for a target asset parameter
router.get("/:id", propertyController.getPropertyStructureDetails);

// Your existing generation route
router.post("/setup-layout", propertyController.registerAndSetupLayout);

export default router;
