const multer = require("multer");
const xlsx = require("xlsx");
const upload = multer({ storage: multer.memoryStorage() });
const Company = require("../models/CompanyModel");
const Contact = require("../models/ContactModel");
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

      console.log("Excel file content:");

      for (let row of data) {
        const companyData = {
          name: row["Company Name"],
          address: row["Company Address"],
          phone: row["Company Phone"],
          email: row["Company Email"],
          website: row["Company Website"],
          numEmployees: row["Number of Employees"],
          foundedDate: new Date(row["Founded Date"]),
          industryType: row["Industry Type"],
        };

        const contactData = {
          name: row["Contact Name"],
          email: row["Contact Email"],
          phone: row["Contact Phone"],
          dateOfBirth: new Date(row["Date of Birth"]),
          contactType: row["Contact Type"],
        };

        const company = new Company(companyData);
        const contact = new Contact(contactData);
        console.log(company);
        console.log(contact);
      }
      return res
        .status(200)
        .json({ message: "File uploaded successfully.", file: req.file });
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ error: "Error uploading file." });
    }
  });
};

module.exports = {
  uploadFile,
};
