import Joi from "joi";
import { v4 as uuidv4 } from "uuid";
import ImageModel from "../models/imageModels.js";

class CourseHelper {
  #Image

  constructor() {
    this.#Image = new ImageModel();
  }

  schema = Joi.object({
    id: Joi.string().allow(null),
    user_id: Joi.string().allow(null),
    title: Joi.string().required().max(1000),
    image: Joi.string().allow(null),
    status: Joi.boolean().required(),
    slug: Joi.string().allow(null),
    description: Joi.string().allow(null),
    questions: Joi.array().items(Joi.object()).allow(null),
    created_at: Joi.date().allow(null),
    updated_at: Joi.date().allow(null),
  });

  QuestionsSchema = Joi.object({
    id: Joi.string().allow(null),
    type: Joi.string().valid("radio", "select", "checkbox"),
    question: Joi.string().required().max(1000),
    description: Joi.string().allow(null),
    answer: Joi.string().required().max(1000).allow(null),
    data: Joi.object().allow(null),
  });

  questionDataSchema = Joi.object({
    options: Joi.array().items(
      Joi.object({
        id: Joi.string().allow(null),
        text: Joi.string().required().max(1000),
        isCorrect: Joi.boolean().required(),
      })
    ),
  });

  cleanCourse = (course) => {
    const cleanedCourse = { ...course };
    if (cleanedCourse.questions) {
      cleanedCourse.questions = cleanedCourse.questions.map((question) => {
        const { answer, data, ...rest } = question;
        if (data && data.options) {
          return {
            ...rest,
            data: {
              options: data.options.map(({ isCorrect, ...option }) => option),
            },
          };
        }
        return rest;
      });
    }
    return cleanedCourse;
  };

  validateQuestions(questions) {
    questions.map((q) => {
      const { error } = this.QuestionsSchema.validate(q);
      if (error) return { success: false, message: error.details[0].message };
      if (q.data) {
        const { error: err } = this.questionDataSchema.validate(q.data);
        if (err) return { success: false, message: err.details[0].message };
      }
    });
    return {
      success: true,
    };
  }

  async validateCourseData(data) {
    const { error } = this.schema.validate(data);
    return error
      ? { success: false, message: error.details[0].message }
      : { success: true };
  }

  async handleImageUpload(imageData) {
    if (!imageData) return null;
    const { success, imagePath } = await this.#Image.save(imageData);
    return success ? `http://localhost:${process.env.PORT}/api/v1/image/${imagePath}` : null;
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  createCourseObject({data, imagePath, id, userId}) {
    return {
      id: id || uuidv4(),
      user_id: userId,
      title: data.title,
      slug: data.slug || this.generateSlug(data.title),
      status: data.status,
      image_url: imagePath,
      description: data.description || null,
      created_at: data.created_at || new Date(),
      updated_at: new Date(),
      questions: data.questions || [],
    };
  }
}

export default CourseHelper;
