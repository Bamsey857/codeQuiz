import express from "express";
import ImageModel from "../models/imageModels.js";

const router = express.Router();

router.get("/image/:fileName", async (req, res) => {
  const { fileName } = req.params;
  const Image = new ImageModel();

  try {
    const filePath = await Image.get(fileName);

    if (!filePath) {
      return res.sendStatus(404);
    }

    const fileType = fileName.split(".").pop();

    res.set("Content-Type", fileType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    return res.sendFile(filePath);
  } catch (error) {
    return res.sendStatus(500);
  }
});

export default router;
