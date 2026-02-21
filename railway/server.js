import express from "express";
import puppeteer from "puppeteer";

const app = express();
app.use(express.json({ limit: "10mb" }));

// health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "PDF service" });
});

// PDF generator
app.post("/generate-pdf", async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: "Missing html" });
    }

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=report.pdf",
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF error:", err);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port", process.env.PORT || 3000);
});
