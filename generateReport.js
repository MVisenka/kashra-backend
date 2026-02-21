// generateReport.js
const fetch = require('node-fetch'); // ak Node <18, inak stačí global fetch

const PDF_ENDPOINT = "https://kashra-backend-production-abfb.up.railway.app/generate-pdf"; // sem vlož URL tvojho PDF generátora
const TEMPLATE_URL = "https://raw.githubusercontent.com/USERNAME/REPO/main/template.html"; // sem vlož raw URL tvojej šablóny

/**
 * Funkcia na generovanie PDF
 * @param {string} reportId - unikátny ID reportu
 * @param {string} reportContent - celý obsah CFO reportu
 * @param {object} tier - informácie o type reportu
 */
async function generatePdf(reportId, reportContent, tier) {
  try {
    // 1️⃣ Stiahni HTML šablónu z GitHubu
    const templateHtml = await fetch(TEMPLATE_URL).then(res => res.text());

    // 2️⃣ Nahraď placeholder obsahom reportu
    const fullHtmlString = templateHtml.replace("{{REPORT_CONTENT}}", reportContent);

    // 3️⃣ Priprav payload pre PDF generátor
    const payload = {
      reportId: reportId,
      tier: JSON.stringify(tier),
      html: fullHtmlString
    };

    // 4️⃣ Pošli request na PDF generátor
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

    // 5️⃣ Vráť úspešnú odpoveď
    return await response.json();

  } catch (err) {
    console.error("Error generating PDF:", err);
    throw err;
  }
}

// Export funkcie
module.exports = { generatePdf };
