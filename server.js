import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());
cors();
// app.use(bodyParser.urlencoded({ extended: true }));

// POST /submit-report
app.post("/submit-report", async (req, res) => {
    const { name, email, comment } = req.body;
    console.log("Received comment:", { name, email, comment });
    if(!name || !email || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const filePath = path.join(__dirname, "data", "comments.txt");

    try {
      await fs.appendFile(filePath, `${name}, ${email}, ${comment}\n`);
      console.log(`comment submitted by ${name}`);
      res.status(201).json({ message: "comment submitted successfully" });
    } catch (error) {
      console.error("Error writing to file:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Ensure the data directory exists
(async () => {
  const dataDir = path.join(__dirname, "data");
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir);
  }
})();

app.get("/", (req, res) => {
  res.status(201).json({name: "webflux", sex: "male", height: 5.6})
})

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
