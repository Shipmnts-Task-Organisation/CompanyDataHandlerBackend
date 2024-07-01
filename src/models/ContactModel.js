const mongoose = require("mongoose");
const Company = require("./CompanyModel");

const ContactType = ["Primary", "Secondary", "Other"];

// this is Model Contact Schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  dob: {
    type: Date,
    required: false,
  },
  contactType: {
    type: String,
    enum: ContactType,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
