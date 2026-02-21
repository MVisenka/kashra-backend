import express from "express";
import cors from "cors";
import { generatePdf } from "./generateReport.js";
import { createClient } from "@supabase/supabase-js";

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/generate-pdf", async (req, res) => {
  try {
    const { html, filename } = req.body;
    if (!html) return res.status(400).json({ error: "No HTML provided" });

    // Generate PDF buffer
    const pdfBuffer = await generatePdf(html);

    // Upload to Supabase storage
    const { error: storageError } = await supabase.storage
      .from("reports")
      .upload(filename, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (storageError) throw storageError;

    // Get public URL
    const url = supabase.storage.from("reports").getPublicUrl(filename).publicUrl;

    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

app.listen(PORT, () => console.log(`PDF service running on port ${PORT}`));
