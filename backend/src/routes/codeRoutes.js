import express from "express";
import { exec } from "child_process";
import fs from "fs";

const router = express.Router();

router.post("/run", async (req, res) => {
  try {
    const { code } = req.body;

    // create temp file
    const fileName = "temp_run.js";

    fs.writeFileSync(fileName, code);

    exec(`node ${fileName}`, (err, stdout, stderr) => {
      // delete file
      fs.unlinkSync(fileName);

      if (err) {
        console.error("EXEC ERROR:", err);

        return res.json({
          stdout: "",
          stderr: err.message,
        });
      }

      return res.json({
        stdout,
        stderr,
      });
    });
  } catch (e) {
    console.error("SERVER ERROR:", e);

    res.status(500).json({
      stderr: "Execution Failed",
    });
  }
});

export default router;