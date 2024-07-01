const mongoose = require("mongoose");

const ContactType = ["Primary", "Secondary", "Other"];
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
  industryType: {
    type: String,
    enum: ContactType,
    required: true,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
