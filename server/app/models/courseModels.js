import fs from "fs/promises";
import path from "path";
import { __dirname } from "../utils/common.js";
import { v4 as uuidv4 } from "uuid";

class CourseModel {
  #filePath;

  constructor() {
    this.#filePath = path.join(__dirname, "../database/courses.json");
  }

  async #readData() {
    try {
      const rawData = await fs.readFile(this.#filePath, "utf-8");
      return JSON.parse(rawData);
    } catch (error) {
      if (error.code === "ENOENT") {
        // File does not exist, return empty array
        return [];
      }
      throw error; // Other errors should be propagated
    }
  }

  async #writeData(data) {
    try {
      await fs.writeFile(
        this.#filePath,
        JSON.stringify(data, null, 2),
        "utf-8"
      );
      return true;
    } catch (error) {
      console.error("Error writing data:", error);
      return false;
    }
  }

  sortByCreatedAt(courses) {
    return [...courses].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async user(userId) {
    try {
      const courses = await this.#readData();
      const userCourses = courses.filter((course) => course.user_id === userId);
      return this.sortByCreatedAt(userCourses);
    } catch (error) {
      console.error("Error retrieving user courses:", error);
      return [];
    }
  }

  async bySlug(slug) {
    try {
      const courses = await this.#readData();
      const course = courses.find((course) => course.slug === slug);
      return course || null;
    } catch (error) {
      console.error("Error retrieving course by slug:", error);
      return null;
    }
  }

  async findOne(id) {
    try {
      const courses = await this.#readData();
      if (!courses) return null;
      const course = courses.find((c) => c.id === id);
      return course;
    } catch (error) {
      console.error("Error finding course by ID:", error);
      return null;
    }
  }

  async findAll() {
    try {
      const courses = await this.#readData();
      return this.sortByCreatedAt(courses);
    } catch (error) {
      console.error("Error finding all courses:", error);
      return [];
    }
  }

  async create(data) {
    try {
      const courses = await this.#readData();
      data.id = uuidv4();
      data.created_at = new Date().toISOString();
      data.updated_at = new Date().toISOString();
      courses.push(data);
      const success = await this.#writeData(courses);
      return success;
    } catch (error) {
      console.error("Error creating course:", error);
      return false;
    }
  }

  async update(updatedCourse) {
    try {
      const courses = await this.#readData();
      const index = courses.findIndex(
        (course) => course.id === updatedCourse.id
      );
      if (index === -1) return false;

      courses[index] = {
        ...courses[index],
        ...updatedCourse,
        updated_at: new Date().toISOString(),
      };
      const success = await this.#writeData(courses);
      return success;
    } catch (error) {
      console.error("Error updating course:", error);
      return false;
    }
  }

  async destroy(id) {
    try {
      const courses = await this.#readData();
      const index = courses.findIndex((course) => course.id === id);
      if (index === -1) return false;

      courses.splice(index, 1);
      const success = await this.#writeData(courses);
      return success;
    } catch (error) {
      console.error("Error deleting course:", error);
      return false;
    }
  }
}

export default CourseModel;
