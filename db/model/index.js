const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const vendorSchema = new Schema({
  vendor: {
    type: String,
    required: [true, "Vendor is Required"],
  },
  customerEmail: {
    type: String,
    required: [true, "Customer email is Required"],
    match: [/.+\@.+\..+/, "Enter valid email address"],
  },
});

const VendorModel = mongoose.model("vendors_customers_details", vendorSchema);

module.exports = VendorModel;
