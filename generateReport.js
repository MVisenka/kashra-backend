// generateReport.js
const fetch = require('node-fetch'); // ak Node <18
const PDF_ENDPOINT = "https://your-railway-app.up.railway.app/generate-pdf"; // tvoj server endpoint
const TEMPLATE_URL = "https://raw.githubusercontent.com/USERNAME/REPO/main/template.html"; // raw URL template.html

/**
 * generatePdf - stiahne šablónu, vloží obsah a pošle na server
 * @param {string} reportId - unikátny ID reportu
 * @param {string} reportContent - obsah CFO reportu
 * @param {object} tier - info o tier-e (napr. FREE)
 */
async function generatePdf(reportId, reportContent, tier) {
  try {
    // 1️⃣ stiahni šablónu HTML z GitHubu
    const templateHtml = await fetch(TEMPLATE_URL).then(res => res.text());

    // 2️⃣ nahraď placeholder obsahom reportu
    const fullHtmlString = templateHtml.replace("{{REPORT_CONTENT}}", reportContent);

    // 3️⃣ priprav payload pre server
    const payload = {
      reportId,
      tier: JSON.stringify(tier),
      html: fullHtmlString
    };

    // 4️⃣ pošli request na server
    const response = await fetch(PDF_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ PDF generation failed:", error);
      throw new Error("PDF generation failed");
    }

    return await response.buffer(); // vráti PDF buffer

  } catch (err) {
    console.error("Error in generatePdf:", err);
    throw err;
  }
}

module.exports = { generatePdf };
