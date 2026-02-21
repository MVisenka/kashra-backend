import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "PDF service" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
