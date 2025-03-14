const express = require("express");
const VendorModel = require("../../db/model");
const vendor_router = express.Router();

vendor_router.post("/follow", async (req, res) => {
  try {
    const { vendor, customer_email } = req.body;
    if (!vendor && !customer_email) {
      throw new Error("Vendor or customer is required");
    }

    const existingEmail = await VendorModel.findOne({
      customerEmail: customer_email,
      vendor: vendor.trim(),
    });

    if (existingEmail) {
      throw new Error("Already followed");
    }

    await VendorModel.create({ vendor: vendor, customerEmail: customer_email });
    return res.status(200).json({
      success: true,
      message: "Followed Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.response ? error.response.data : error.message,
    });
  }
});

vendor_router.delete("/unfollow", async (req, res) => {
  try {
    const { customer_email, vendor } = req.body;
    if (!customer_email || !vendor) {
      throw new Error("Vendor name and customer email is required");
    }

    const existingEmail = await VendorModel.findOne({
      customerEmail: customer_email,
      vendor: vendor,
    });

    if (!existingEmail) {
      throw new Error("Already Unfollowed");
    }

    await VendorModel.deleteOne({
      customerEmail: customer_email,
      vendor: vendor,
    });
    return res.status(200).json({
      success: true,
      message: "Successfully Unfollowed",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.response ? error.response.data : error.message,
    });
  }
});

vendor_router.get("/get-status", async (req, res) => {
  try {
    const { customer_email, vendor } = req.query;

    if (!vendor) {
      throw new Error("Vendor name is required");
    }

    const existingEmail = await VendorModel.findOne({
      customerEmail: customer_email,
      vendor: vendor,
    });

    const count = await VendorModel.countDocuments({
      vendor: vendor,
    });

    return res.status(200).json({
      followed: Boolean(existingEmail),
      followers: count
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.response ? error.response.data : error.message,
    });
  }
});

module.exports = vendor_router;
