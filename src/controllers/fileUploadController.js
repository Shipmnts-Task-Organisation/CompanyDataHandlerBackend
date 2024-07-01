const multer = require("multer");
const xlsx = require("xlsx");
const upload = multer({ storage: multer.memoryStorage() });
const Company = require("../models/CompanyModel");
const Contact = require("../models/ContactModel");

const validateString = (value) => {
  return typeof value === "string" && value.trim() !== "";
};

const validateNumeric = (value) => {
  return /^\d+$/.test(value) || /^\d{3}-\d{4}$/.test(value);
};

const validateDate = (value) => {
  return !isNaN(Date.parse(value));
};

const uploadFile = (req, res) => {
  upload.single("file")(req, res, (err) => {
    try {
      if (err instanceof multer.MulterError) {
        console.log("Multer error:", err);
        return res.status(500).json({ error: "Multer error occurred." });
      } else if (err) {
        console.log("Unknown error:", err);
        return res.status(500).json({ error: "Unknown error occurred." });
      }

      const fileBuffer = req.file.buffer;

      const workbook = xlsx.read(fileBuffer, { type: "buffer" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const data = xlsx.utils.sheet_to_json(sheet);
      const processedData = [];

      for (let row of data) {
        const companyData = {
          name: row["Company Name"],
          address: row["Company Address"],
          phone: row["Company Phone"],
          email: row["Company Email"],
          website: row["Company Website"],
          totalEmployees: row["Number of Employees"],
          foundedDate: new Date(row["Founded Date"]),
          industryType: row["Industry Type"],
        };

        const isValid =
          validateString(companyData.name) &&
          validateString(companyData.address) &&
          validateNumeric(companyData.phone) &&
          validateString(companyData.email) &&
          validateString(companyData.website) &&
          validateNumeric(companyData.totalEmployees) &&
          validateDate(companyData.foundedDate) &&
          validateString(companyData.industryType);
        if (!isValid) {
          console.error("Invalid data found in row:", row);
          return res.status(200).json({ error: "Invalid values in the table" });
        }
        const contactData = {
          name: row["Contact Name"],
          email: row["Contact Email"],
          phone: row["Contact Phone"],
          dateOfBirth: new Date(row["Date of Birth"]),
          contactType: row["Contact Type"],
        };

        processedData.push({ companyData, contactData });
      }
      return res
        .status(200)
        .json({ message: "File uploaded successfully.", data: processedData });
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ error: "Error uploading file." });
    }
  });
};

const storeFile = async (req, res) => {
  const fileData = req.body.data;
  try {
    for (const entry of fileData) {
      const { companyData, contactData } = entry;

      const company = await Company.findOne({ name: companyData.name });

      if (!company) {
        company = new Company(companyData);
        await company.save();
      }

      const contact = await Contact.findOne({
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
      });
      if (!contact) {
        const newContact = new Contact({
          ...contactData,
          company: company._id,
        });
        await newContact.save();
      }
    }

    res.status(201).json({ message: "Data stored successfully" });
  } catch (error) {
    console.error("Error storing data:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  uploadFile,
  storeFile,
};
