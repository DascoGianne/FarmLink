const express = require("express");
const router = express.Router();

const mainController = require("../controllers/mainController");
const { verifyToken } = require("../middleware/authMiddleware");
const { requireBuyer, requireNgo } = require("../middleware/roleMiddleware");

/* ===================== PUBLIC ROUTES ===================== */

// API status
router.get("/", mainController.apiStatus);

// Listings (public browsing)
router.get("/listings", mainController.getAllListings);
router.get("/listings/rescue", mainController.getRescueDealListings);
router.get("/listings/:id", mainController.getListingById);

// Pricing, traceability, rescue alerts (public)
router.get("/pricing/listing/:listing_id", mainController.getPricingByListing);
router.get("/traceability/listing/:listing_id", mainController.getTraceabilityByListing);
router.get("/rescue-alerts/listing/:listing_id", mainController.getRescueAlertsByListing);

// Auth (public)
router.post("/auth/register/ngo", mainController.registerNgo);
router.post("/auth/register/buyer", mainController.registerBuyer);
router.post("/auth/login", mainController.login);

/* ===================== PROTECTED ROUTES ===================== */

// Auth check (any logged-in user)
router.get("/auth/me", verifyToken, (req, res) => {
  return res.json({ success: true, user: req.user });
});

// Orders (BUYER only)
router.post("/orders", verifyToken, requireBuyer, mainController.createOrder);
router.get("/orders/buyer/:buyer_id", verifyToken, requireBuyer, mainController.getOrdersByBuyer);

// Orders (NGO only)
router.get("/orders/ngo/:ngo_id", verifyToken, requireNgo, mainController.getOrdersByNgo);
router.put("/orders/:order_id/status", verifyToken, requireNgo, mainController.updateOrderStatus);

// Payments (BUYER only)
router.post("/payments", verifyToken, requireBuyer, mainController.createPayment);
router.get("/payments/order/:order_id", verifyToken, requireBuyer, mainController.getPaymentByOrder);

// Logistics (NGO only)
router.post("/logistics", verifyToken, requireNgo, mainController.createLogistics);
router.get("/logistics/order/:order_id", verifyToken, requireNgo, mainController.getLogisticsByOrder);
router.put("/logistics/order/:order_id", verifyToken, requireNgo, mainController.updateLogisticsByOrder);

// Buyer Profile (BUYER only)
router.get("/buyers/:buyer_id", verifyToken, requireBuyer, (req, res, next) => {
  if (Number(req.params.buyer_id) !== Number(req.user.id)) {
    return res.status(403).json({ success: false, message: "Forbidden (not your account)" });
  }
  next();
}, mainController.getBuyerById);

router.put("/buyers/:buyer_id", verifyToken, requireBuyer, (req, res, next) => {
  if (Number(req.params.buyer_id) !== Number(req.user.id)) {
    return res.status(403).json({ success: false, message: "Forbidden (not your account)" });
  }
  next();
}, mainController.updateBuyerById);


// NGO Profile (NGO only)
router.get("/ngos/:ngo_id", verifyToken, requireNgo, (req, res, next) => {
  if (Number(req.params.ngo_id) !== Number(req.user.id)) {
    return res.status(403).json({ success: false, message: "Forbidden (not your account)" });
  }
  next();
}, mainController.getNgoById);

router.put("/ngos/:ngo_id", verifyToken, requireNgo, (req, res, next) => {
  if (Number(req.params.ngo_id) !== Number(req.user.id)) {
    return res.status(403).json({ success: false, message: "Forbidden (not your account)" });
  }
  next();
}, mainController.updateNgoById);

module.exports = router;
