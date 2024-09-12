import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { __dirname } from "../utils/common.js";

class ImageModel {
  #filePath;
  #allowedExtensions;

  constructor() {
    this.#filePath = path.resolve(__dirname, "../../storage/uploads/");
    this.#allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  }

  async #ensureDirectoryExists() {
    await fs.mkdir(this.#filePath, { recursive: true });
  }

  #validateImageExtension(extension) {
    return this.#allowedExtensions.includes(extension);
  }

  #extractImageInfo(image) {
    const [header, base64Data] = image.split(";base64,");
    const extension = header.split("/")[1];
    return { extension, base64Data };
  }

  async #saveImageFile(filename, base64Data) {
    const filePath = path.join(this.#filePath, filename);
    await fs.writeFile(filePath, base64Data, "base64");
  }

  async save(image) {
    try {
      await this.#ensureDirectoryExists();

      const { extension, base64Data } = this.#extractImageInfo(image);

      if (!this.#validateImageExtension(extension)) {
        return { success: false, message: "Invalid image format" };
      }

      const filename = `${uuidv4()}.${extension}`;
      await this.#saveImageFile(filename, base64Data);

      return {
        success: true,
        message: "Image uploaded successfully",
        imagePath: filename,
      };
    } catch (err) {
      console.error("Error saving image:", err);
      return { success: false, message: "Failed to upload image" };
    }
  }

  async get(imageUrl) {
    const filePath = path.resolve(this.#filePath, imageUrl);
    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      console.log("File not found:", filePath);
      return null;
    }
  }

  async update(imageUrl, base64Image) {
    const oldFilePath = path.resolve(this.#filePath, imageUrl);
    try {
      await fs.access(oldFilePath);
      await fs.unlink(oldFilePath);

      const { extension, base64Data } = this.#extractImageInfo(base64Image);
      const newFilename = `${uuidv4()}.${extension}`;
      await this.#saveImageFile(newFilename, base64Data);

      return {
        success: true,
        message: "Image updated successfully",
        imagePath: `/uploads/${newFilename}`,
      };
    } catch (err) {
      console.error("Error updating image:", err);
      return { success: false, message: "Failed to update image" };
    }
  }

  async delete(imageUrl) {
    const imagePath = imageUrl.split("/").pop() || "";
    const filePath = path.resolve(this.#filePath, imagePath);
    try {
      await fs.unlink(filePath);
      return { success: true, message: "Image deleted successfully" };
    } catch (err) {
      console.error("Error deleting image:", err);
      return {
        success: false,
        message: "Image not found or could not be deleted",
      };
    }
  }
}

export default ImageModel;