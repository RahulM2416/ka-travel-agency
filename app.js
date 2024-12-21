const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const PDFDocument = require("pdfkit"); // Import PDFKit

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Homepage Route
app.get("/", (req, res) => {
  res.render("index", { title: "Explore Karnataka" });
});

app.post("/book", (req, res) => {
  const { name, destination, date } = req.body;
  res.render("confirmation", { name, destination, date });
});

// Booking Route
app.get("/booking", (req, res) => {
  res.render("booking");
});

// Confirmation Route
app.post("/confirmation", (req, res) => {
  const { name, destination, date } = req.body;

  // Render confirmation page with details and ticket download option
  res.render("confirmation", { name, destination, date });
});

// PDF Generation Route
app.get("/download-ticket", (req, res) => {
  const { name, destination, date } = req.query; // Get ticket details from query params

  // Set headers to download the file
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=ticket_confirmation.pdf"
  );

  const doc = new PDFDocument(); // Create a new PDF document

  // Pipe the document to the response
  doc.pipe(res);

  // Add content to the PDF
  doc.fontSize(20).text("Karnataka Travel Agency", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Name: ${name}`);
  doc.text(`Destination: ${destination}`);
  doc.text(`Date: ${date}`);
  doc.text(`Status: Confirmed`);
  doc.moveDown();
  doc.text("Thank you for choosing Our Travel Agency!");
  
  // Finalize the PDF and end the stream
  doc.end();
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});