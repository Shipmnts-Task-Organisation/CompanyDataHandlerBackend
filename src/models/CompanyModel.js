const mongoose = require("mongoose");

const IndustryType = ["Technology", "Finance", "Healthcare", "Retail", "Other"];

// this is the Model Company Schema
const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
  totalEmployees: {
    type: Number,
    required: false,
  },
  foundedDate: {
    type: Date,
    required: false,
  },
  industryType: {
    type: String,
    enum: IndustryType,
    required: true,
  },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
