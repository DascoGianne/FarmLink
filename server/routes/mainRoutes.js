const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const router = express.Router();

const mainController = require("../controllers/mainController");
const { verifyToken } = require("../middleware/authMiddleware");
const { requireBuyer, requireNgo } = require("../middleware/roleMiddleware");

const uploadsDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  },
});

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
router.get("/orders/buyer/:buyer_id", verifyToken, requireBuyer, (req, res, next) => {
  if (Number(req.params.buyer_id) !== Number(req.user.id)) {
    return res.status(403).json({ success: false, message: "Forbidden (not your account)" });
  }
  next();
}, mainController.getOrdersByBuyer);

// Orders (NGO only)
router.get("/orders/ngo/:ngo_id", verifyToken, requireNgo, (req, res, next) => {
  if (Number(req.params.ngo_id) !== Number(req.user.id)) {
    return res.status(403).json({ success: false, message: "Forbidden (not your account)" });
  }
  next();
}, mainController.getOrdersByNgo);
router.put("/orders/:order_id/status", verifyToken, requireNgo, mainController.updateOrderStatus);

// Payments (BUYER only)
router.post("/payments", verifyToken, requireBuyer, mainController.createPayment);
router.get("/payments/order/:order_id", verifyToken, requireBuyer, mainController.getPaymentByOrder);

// Logistics (NGO only for create/update, buyer can read own)
router.post("/logistics", verifyToken, requireNgo, mainController.createLogistics);
router.get("/logistics/order/:order_id", verifyToken, mainController.getLogisticsByOrder);
router.put("/logistics/order/:order_id", verifyToken, requireNgo, mainController.updateLogisticsByOrder);

// Listing image upload (NGO only)
router.post(
  "/uploads/listing-image",
  verifyToken,
  requireNgo,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file required" });
    }
    return res.status(201).json({
      success: true,
      url: `/uploads/${req.file.filename}`,
    });
  }
);

// Listings management (NGO only)
router.get("/listings/ngo/:ngo_id", verifyToken, requireNgo, (req, res, next) => {
  if (Number(req.params.ngo_id) !== Number(req.user.id)) {
    return res.status(403).json({ success: false, message: "Forbidden (not your account)" });
  }
  next();
}, mainController.getListingsByNgo);
router.post("/listings", verifyToken, requireNgo, mainController.createListing);
router.put("/listings/:listing_id", verifyToken, requireNgo, mainController.updateListing);
router.delete("/listings/:listing_id", verifyToken, requireNgo, mainController.deleteListing);
router.put("/pricing/listing/:listing_id", verifyToken, requireNgo, mainController.replacePricingByListing);
router.delete("/pricing/listing/:listing_id", verifyToken, requireNgo, mainController.deletePricingByListing);
router.put("/traceability/listing/:listing_id", verifyToken, requireNgo, mainController.upsertTraceabilityByListing);
router.delete("/traceability/listing/:listing_id", verifyToken, requireNgo, mainController.deleteTraceabilityByListing);

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
