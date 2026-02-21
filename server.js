import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "PDF service" });
});

// PDF generator
app.post("/generate-pdf", async (req, res) => {
  let browser;

  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ error: "Missing html" });
    }

    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-first-run",
        "--no-zygote",
        "--single-process"
      ]
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 30000
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=report.pdf"
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF error:", err);

    if (browser) {
      try {
        await browser.close();
      } catch {}
    }

    res.status(500).json({ error: "PDF generation failed" });
  }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});
