const db = require("../db/db");

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
