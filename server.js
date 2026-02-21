import express from "express";
import cors from "cors";
import { generatePdf } from "./generateReport.js";
import { createClient } from "@supabase/supabase-js";

const app = express();
const PORT = process.env.PORT || 3000;

// 🔍 debug env
if (!process.env.SUPABASE_URL) {
  console.error("❌ SUPABASE_URL missing");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY missing");
}

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ✅ HEALTH CHECK (test v browseri)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ✅ PDF endpoint
app.post("/generate-pdf", async (req, res) => {
  try {
    const { html, filename } = req.body;

    if (!html) {
      return res.status(400).json({ error: "No HTML provided" });
    }

    const safeFilename = filename || `report-${Date.now()}.pdf`;

    // Generate PDF
    const pdfBuffer = await generatePdf(html);

    // Upload to Supabase
    const { error: storageError } = await supabase.storage
      .from("reports")
      .upload(safeFilename, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (storageError) throw storageError;

    // Public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("reports").getPublicUrl(safeFilename);

    res.json({ url: publicUrl });
  } catch (err) {
    console.error("❌ PDF ERROR:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ PDF service running on port ${PORT}`);
});
