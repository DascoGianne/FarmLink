const db = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.apiStatus = (req, res) => {
  res.json({ success: true, message: "FarmLink API is working" });
};

exports.getAllListings = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT listing_id, ngo_id, promo_id, crop_name, category, description,
             total_stocks, date_listed, status, image_1
      FROM crop_listings
      ORDER BY listing_id DESC
    `);

    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getListingById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT listing_id, ngo_id, promo_id, crop_name, category, description,
             total_stocks, date_listed, status, image_1, image_2, image_3, image_4, image_5, image_6
      FROM crop_listings
      WHERE listing_id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


exports.getPricingByListing = async (req, res) => {
  const { listing_id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT pricing_id, quantity, unit, price
      FROM crop_pricing
      WHERE listing_id = ?
      ORDER BY quantity ASC
      `,
      [listing_id]
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getTraceabilityByListing = async (req, res) => {
  const { listing_id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT trace_id, listing_id, farmer_name, farm_address, harvest_date,
             freshness_score, freshness_countdown
      FROM traceability
      WHERE listing_id = ?
      LIMIT 1
      `,
      [listing_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Traceability record not found for this listing",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getRescueAlertsByListing = async (req, res) => {
  const { listing_id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT rescue_id, listing_id, reason, detected_date, discount_applied, rescue_status
      FROM rescue_alerts
      WHERE listing_id = ?
      ORDER BY detected_date DESC
      `,
      [listing_id]
    );

    return res.status(200).json({
      success: true,
      data: rows, // can be empty array if no rescue alerts
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getRescueDealListings = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        cl.listing_id,
        cl.ngo_id,
        cl.crop_name,
        cl.category,
        cl.description,
        cl.total_stocks,
        cl.date_listed,
        cl.status,
        cl.image_1,
        ra.discount_applied,
        ra.reason,
        ra.detected_date,
        ra.rescue_status
      FROM crop_listings cl
      JOIN rescue_alerts ra
        ON ra.listing_id = cl.listing_id
      WHERE ra.rescue_status = 'Active'
      ORDER BY ra.detected_date DESC
      `
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createOrder = async (req, res) => {
  const {
    ngo_id,
    listing_id,
    quantity,
    subtotal,
    delivery_fee,
    total_amount,
    region,
    province,
    municipality_city,
    barangay,
    street_no
  } = req.body;

  const buyer_id = req.user?.id;

  // Basic validation
  if (!buyer_id || !ngo_id || !listing_id || !quantity) {
    return res.status(400).json({
      success: false,
      message: "buyer_id, ngo_id, listing_id, and quantity are required",
    });
  }

  try {
    const order_status = "Pending";
    const order_date = new Date();

    const [result] = await db.query(
      `
      INSERT INTO orders (
        buyer_id, ngo_id, listing_id, quantity,
        subtotal, delivery_fee, total_amount,
        region, province, municipality_city, barangay, street_no,
        order_date, order_status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        buyer_id, ngo_id, listing_id, quantity,
        subtotal || 0, delivery_fee || 0, total_amount || 0,
        region || "", province || "", municipality_city || "", barangay || "", street_no || "",
        order_date, order_status
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order_id: result.insertId,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getOrdersByBuyer = async (req, res) => {
  const { buyer_id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        o.order_id, o.buyer_id, o.ngo_id, o.listing_id,
        o.quantity, o.subtotal, o.delivery_fee, o.total_amount,
        o.region, o.province, o.municipality_city, o.barangay, o.street_no,
        o.order_date, o.order_status,
        cl.crop_name, cl.category, cl.image_1,
        n.ngo_name
      FROM orders o
      JOIN crop_listings cl ON cl.listing_id = o.listing_id
      JOIN ngos n ON n.ngo_id = o.ngo_id
      WHERE o.buyer_id = ?
      ORDER BY o.order_date DESC
      `,
      [buyer_id]
    );

    return res.status(200).json({
      success: true,
      data: rows, // can be empty []
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getOrdersByNgo = async (req, res) => {
  const { ngo_id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        o.order_id, o.buyer_id, o.ngo_id, o.listing_id,
        o.quantity, o.subtotal, o.delivery_fee, o.total_amount,
        o.region, o.province, o.municipality_city, o.barangay, o.street_no,
        o.order_date, o.order_status,
        cl.crop_name, cl.category, cl.image_1,
        b.username, b.contact_number
      FROM orders o
      JOIN crop_listings cl ON cl.listing_id = o.listing_id
      JOIN buyers b ON b.buyer_id = o.buyer_id
      WHERE o.ngo_id = ?
      ORDER BY o.order_date DESC
      `,
      [ngo_id]
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { order_id } = req.params;
  const { order_status } = req.body;

  const allowed = ["Pending", "Confirmed", "Delivering", "Completed", "Cancelled"];

  if (!order_status || !allowed.includes(order_status)) {
    return res.status(400).json({
      success: false,
      message: `order_status must be one of: ${allowed.join(", ")}`,
    });
  }

  try {
    const [result] = await db.query(
      `
      UPDATE orders
      SET order_status = ?
      WHERE order_id = ?
      `,
      [order_status, order_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      data: { order_id: Number(order_id), order_status },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createPayment = async (req, res) => {
  const { order_id, payment_method, amount_paid, payment_status } = req.body;

  if (!order_id || !payment_method || amount_paid === undefined) {
    return res.status(400).json({
      success: false,
      message: "order_id, payment_method, and amount_paid are required",
    });
  }

  try {
    const payment_date = new Date();
    const status = payment_status || "Unpaid";

    const [result] = await db.query(
      `
      INSERT INTO payments (order_id, payment_method, amount_paid, payment_date, payment_status)
      VALUES (?, ?, ?, ?, ?)
      `,
      [order_id, payment_method, amount_paid, payment_date, status]
    );

    return res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      data: {
        payment_id: result.insertId,
        order_id,
      },
    });
  } catch (err) {
    // Most likely error: duplicate payment for same order if you set UNIQUE(order_id)
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getPaymentByOrder = async (req, res) => {
  const { order_id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT p.payment_id, p.order_id, p.payment_method, p.amount_paid, p.payment_date, p.payment_status
      FROM payments p
      JOIN orders o ON o.order_id = p.order_id
      WHERE p.order_id = ? AND o.buyer_id = ?
      LIMIT 1
      `,
      [order_id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment not found for this order",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createLogistics = async (req, res) => {
  const { order_id, ngo_id, delivery_method, delivery_status, estimated_arrival, delivery_date } = req.body;

  if (!order_id || !ngo_id || !delivery_method) {
    return res.status(400).json({
      success: false,
      message: "order_id, ngo_id, and delivery_method are required",
    });
  }

  try {
    const status = delivery_status || "Preparing";
    const eta = estimated_arrival || null;
    const delivered = delivery_date || null;

    const [result] = await db.query(
      `
      INSERT INTO logistics (order_id, ngo_id, delivery_method, delivery_status, estimated_arrival, delivery_date)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [order_id, ngo_id, delivery_method, status, eta, delivered]
    );

    return res.status(201).json({
      success: true,
      message: "Logistics record created",
      data: {
        logistics_id: result.insertId,
        order_id,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getLogisticsByOrder = async (req, res) => {
  const { order_id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT logistics_id, order_id, ngo_id, delivery_method, delivery_status, estimated_arrival, delivery_date
      FROM logistics
      WHERE order_id = ?
      LIMIT 1
      `,
      [order_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Logistics record not found for this order",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateLogisticsByOrder = async (req, res) => {
  const { order_id } = req.params;
  const { delivery_status, estimated_arrival, delivery_date } = req.body;

  const allowed = ["Preparing", "Out for Delivery", "Delivered"];

  if (delivery_status && !allowed.includes(delivery_status)) {
    return res.status(400).json({
      success: false,
      message: `delivery_status must be one of: ${allowed.join(", ")}`,
    });
  }

  try {
    // Build dynamic update (only update fields provided)
    const fields = [];
    const values = [];

    if (delivery_status) {
      fields.push("delivery_status = ?");
      values.push(delivery_status);
    }

    if (estimated_arrival !== undefined) {
      fields.push("estimated_arrival = ?");
      values.push(estimated_arrival);
    }

    if (delivery_date !== undefined) {
      fields.push("delivery_date = ?");
      values.push(delivery_date);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
    }

    values.push(order_id);

    const [result] = await db.query(
      `
      UPDATE logistics
      SET ${fields.join(", ")}
      WHERE order_id = ?
      `,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Logistics record not found for this order",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logistics updated",
      data: { order_id: Number(order_id) },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===================== AUTH (bcrypt + JWT) =====================

exports.registerNgo = async (req, res) => {
  const {
    ngo_name, email, password, contact_number,
    region, province, municipality_city, barangay, street_no,
    delivery_method, delivery_method_other
  } = req.body;

  if (!ngo_name || !email || !password || !contact_number || !region || !province || !municipality_city || !barangay || !street_no || !delivery_method) {
    return res.status(400).json({ success: false, message: "Missing required fields for NGO registration" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `
      INSERT INTO ngos (
        ngo_name, email, password, contact_number,
        region, province, municipality_city, barangay, street_no,
        delivery_method, delivery_method_other, date_registered
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())
      `,
      [
        ngo_name, email, hashed, contact_number,
        region, province, municipality_city, barangay, street_no,
        delivery_method, delivery_method_other || null
      ]
    );

    return res.status(201).json({
      success: true,
      message: "NGO registered successfully",
      data: { ngo_id: result.insertId },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.registerBuyer = async (req, res) => {
  const {
    username, email, password, contact_number,
    region, province, municipality_city, barangay, street_no
  } = req.body;

  if (!username || !email || !password || !contact_number || !region || !province || !municipality_city || !barangay || !street_no) {
    return res.status(400).json({ success: false, message: "Missing required fields for Buyer registration" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `
      INSERT INTO buyers (
        username, email, password, contact_number,
        region, province, municipality_city, barangay, street_no,
        date_registered
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())
      `,
      [
        username, email, hashed, contact_number,
        region, province, municipality_city, barangay, street_no
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Buyer registered successfully",
      data: { buyer_id: result.insertId },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "email and password are required" });
  }

  try {
    // 1) Try NGO
    const [ngoRows] = await db.query(
      `SELECT ngo_id AS id, ngo_name AS name, email, password FROM ngos WHERE email = ? LIMIT 1`,
      [email]
    );

    if (ngoRows.length > 0) {
      const ngo = ngoRows[0];
      const match = await bcrypt.compare(password, ngo.password);
      if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

      const token = jwt.sign(
        { role: "NGO", id: ngo.id, email: ngo.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: { role: "NGO", ngo_id: ngo.id, ngo_name: ngo.name, email: ngo.email },
        token,
      });
    }

    // 2) Try Buyer
    const [buyerRows] = await db.query(
      `SELECT buyer_id AS id, username AS name, email, password FROM buyers WHERE email = ? LIMIT 1`,
      [email]
    );

    if (buyerRows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const buyer = buyerRows[0];
    const match = await bcrypt.compare(password, buyer.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { role: "BUYER", id: buyer.id, email: buyer.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { role: "BUYER", buyer_id: buyer.id, username: buyer.name, email: buyer.email },
      token,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNgoById = async (req, res) => {
  const { ngo_id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT ngo_id, ngo_name, email, contact_number,
             region, province, municipality_city, barangay, street_no,
             delivery_method, delivery_method_other, date_registered
      FROM ngos
      WHERE ngo_id = ?
      LIMIT 1
      `,
      [ngo_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "NGO not found" });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateNgoById = async (req, res) => {
  const { ngo_id } = req.params;

  const {
    ngo_name,
    contact_number,
    region,
    province,
    municipality_city,
    barangay,
    street_no,
    delivery_method,
    delivery_method_other,
  } = req.body;

  try {
    const fields = [];
    const values = [];

    if (ngo_name !== undefined) { fields.push("ngo_name = ?"); values.push(ngo_name); }
    if (contact_number !== undefined) { fields.push("contact_number = ?"); values.push(contact_number); }
    if (region !== undefined) { fields.push("region = ?"); values.push(region); }
    if (province !== undefined) { fields.push("province = ?"); values.push(province); }
    if (municipality_city !== undefined) { fields.push("municipality_city = ?"); values.push(municipality_city); }
    if (barangay !== undefined) { fields.push("barangay = ?"); values.push(barangay); }
    if (street_no !== undefined) { fields.push("street_no = ?"); values.push(street_no); }
    if (delivery_method !== undefined) { fields.push("delivery_method = ?"); values.push(delivery_method); }
    if (delivery_method_other !== undefined) { fields.push("delivery_method_other = ?"); values.push(delivery_method_other); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: "No fields provided to update" });
    }

    const dmIndex = fields.findIndex((f) => f.startsWith("delivery_method ="));
    if (dmIndex !== -1) {
      const dmValue = values[dmIndex];
      if (dmValue !== "Others") {
        fields.push("delivery_method_other = NULL");
      }
    }

    values.push(ngo_id);

    const [result] = await db.query(
      `
      UPDATE ngos
      SET ${fields.join(", ")}
      WHERE ngo_id = ?
      `,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "NGO not found" });
    }

    return res.status(200).json({
      success: true,
      message: "NGO profile updated",
      data: { ngo_id: Number(ngo_id) },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBuyerById = async (req, res) => {
  const { buyer_id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT buyer_id, username, email, contact_number,
             region, province, municipality_city, barangay, street_no,
             date_registered
      FROM buyers
      WHERE buyer_id = ?
      LIMIT 1
      `,
      [buyer_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Buyer not found" });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBuyerById = async (req, res) => {
  const { buyer_id } = req.params;

  const {
    username,
    contact_number,
    region,
    province,
    municipality_city,
    barangay,
    street_no,
  } = req.body;

  try {
    const fields = [];
    const values = [];

    if (username !== undefined) { fields.push("username = ?"); values.push(username); }
    if (contact_number !== undefined) { fields.push("contact_number = ?"); values.push(contact_number); }
    if (region !== undefined) { fields.push("region = ?"); values.push(region); }
    if (province !== undefined) { fields.push("province = ?"); values.push(province); }
    if (municipality_city !== undefined) { fields.push("municipality_city = ?"); values.push(municipality_city); }
    if (barangay !== undefined) { fields.push("barangay = ?"); values.push(barangay); }
    if (street_no !== undefined) { fields.push("street_no = ?"); values.push(street_no); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: "No fields provided to update" });
    }

    values.push(buyer_id);

    const [result] = await db.query(
      `
      UPDATE buyers
      SET ${fields.join(", ")}
      WHERE buyer_id = ?
      `,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Buyer not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Buyer profile updated",
      data: { buyer_id: Number(buyer_id) },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
