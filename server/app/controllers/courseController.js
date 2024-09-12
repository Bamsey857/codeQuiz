import dotenv from "dotenv";
import CourseHelper from "../helpers/courseHelper.js";
import ImageModel from "../models/imageModels.js";
import CourseModel from "../models/courseModels.js";

dotenv.config();

class CourseController {
  #User;
  #Image;
  #Courses;
  #Helpers;

  constructor(req) {
    this.#User = req.user;
    this.#Image = new ImageModel();
    this.#Courses = new CourseModel();
    this.#Helpers = new CourseHelper();
  }

  async #handleCourseOperation(req, res, operation) {
    try {
      const data = req.body;
      const { success, message } = await this.#Helpers.validateCourseData(data);

      if (!success) {
        return res.status(400).json({ success: false, message });
      }

      const { success: qSuccess, message: msg } =
        this.#Helpers.validateQuestions(data.questions);

      if (!qSuccess) {
        return res.status(400).json({ success: false, message: msg });
      }

      let imagePath;
      let existingCourse;

      if (operation === "update") {
        if (data.user_id !== this.#User.id) {
          return res
            .status(403)
            .json({ success: false, message: "Unauthorized" });
        }

        existingCourse = await this.#Courses.findOne(data.id);
        if (!existingCourse) {
          return res
            .status(404)
            .json({ success: false, message: "Course not found" });
        }
        imagePath =
          data.image === null
            ? existingCourse.image_url
            : await this.#Helpers.handleImageUpload(data.image);
        if (data.image !== null && existingCourse.image_url) {
          await this.#Image.delete(existingCourse.image_url);
        }
      } else {
        imagePath = await this.#Helpers.handleImageUpload(data.image);
      }

      const courseObject = this.#Helpers.createCourseObject({
        data,
        imagePath,
        id: operation === "update" ? data.id : undefined,
        userId: this.#User.id,
      });
      const result =
        operation === "create"
          ? this.#Courses.create(courseObject)
          : this.#Courses.update(courseObject);

      if (!result) {
        return res
          .status(500)
          .json({ success: false, message: `Failed to ${operation} course` });
      }

      const updatedCourse = await this.#Courses.findOne(courseObject.id);
      if (!updatedCourse) {
        return res.status(404).json({
          success: false,
          message: "Course not found after operation",
        });
      }

      const sanitized = this.#Helpers.cleanCourse(updatedCourse);

      return res.status(operation === "create" ? 201 : 200).json({
        success: true,
        message: `Course ${operation}d successfully`,
        course: sanitized,
      });
    } catch (error) {
      console.error(`Error ${operation}ing course:`, error);
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  store = async (req, res) => this.#handleCourseOperation(req, res, "create");

  update = async (req, res) => this.#handleCourseOperation(req, res, "update");

  findOne = async (req, res) => {
    const { id } = req.params;
    const courses = await this.#Courses.findAll();
    const foundCourse = courses.find((course) => course.id === id.toString());
    if (!foundCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    console.log("Found course:", foundCourse.id);

    let course;

    if (this.#User.id !== foundCourse.user_id) {
      course = await this.#Helpers.cleanCourse(foundCourse);
    } else {
      course = foundCourse;
    }

    return res.status(200).json({ success: true, course: course });
  };

  destroy = async (req, res) => {
    const { id } = req.params;
    const Courses = await this.#Courses.findAll();
    const foundCourse = Courses.find((course) => course.id === id.toString());
    if (!foundCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    const deletedCourse = await this.#Courses.destroy(id);
    if (!deletedCourse) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete course" });
    }
    await this.#Image.delete(foundCourse.image_url);
    return res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  };

  async findAll(req, res) {
    try {
      const courses = await this.#Courses.findAll();
      return res.status(200).json({ success: true, courses: courses });
    } catch (error) {
      console.error("Error finding all courses:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch courses",
      });
    }
  }

  foruser = async (req, res) => {
    try {
      let courses = await this.#Courses.findAll();
      courses = courses.filter((course) => course.user_id === this.#User.id);
      const sanitizedCourses = courses.map(this.#Helpers.cleanCourse);
      return res.status(200).json({ success: true, courses: sanitizedCourses });
    } catch (error) {
      console.error("Error fetching courses:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch courses" });
    }
  };

  async bySlug(req, res) {
    const course = await this.#Courses.bySlug(req.params.slug);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    const sanitized = this.#Helpers.cleanCourse(course);
    return res.status(200).json({ success: true, course: sanitized });
  }
}

export default CourseController;
