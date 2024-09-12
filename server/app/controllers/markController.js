import CourseModel from "../models/courseModels.js";

class MarkQuestions {

  #extractOptions(question) {
    return question.data.options;
  }

  #markCheckboxQuestion(question, userAnswer) {
    const options = this.#extractOptions(question);
    const correctOptions = options.filter((option) => option.isCorrect);
    const selectedOptions = Object.keys(userAnswer).filter(
      (key) => userAnswer[key]
    );

    if (
      correctOptions.length === selectedOptions.length &&
      correctOptions.every((option) => selectedOptions.includes(option.id))
    ) {
      return [correctOptions.length, null];
    } else {
      return [
        0,
        {
          questionId: question.id,
          correctOptions: correctOptions.map((option) => ({
            id: option.id,
            text: option.text,
          })),
        },
      ];
    }
  }

  #markRadioOrSelectQuestion(question, userAnswer) {
    const options = this.#extractOptions(question);
    const correctOption = options.find((option) => option.isCorrect);

    if (correctOption && userAnswer === correctOption.id) {
      return [1, null];
    } else {
      return [
        0,
        {
          questionId: question.id,
          correctOptions: correctOption
            ? [
                {
                  id: correctOption.id,
                  text: correctOption.text,
                },
              ]
            : [],
        },
      ];
    }
  }

  async markQuestions(req, res) {
    const { id } = req.params;
    const { courseId, answers } = req.body;
    const Course = new CourseModel();

    if (courseId.toString() !== id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "Course not found" });
    }

    const courses = await Course.findAll();
    const course = courses.find((course) => course.id === courseId.toString());
    if (!course) {
      return res
        .status(400)
        .json({ success: false, message: "Course not found" });
    }

    let score = 0;
    const correctAnswers = [];

    for (const question of course.questions) {
      const userAnswer = answers[question.id];

      if (!userAnswer) {
        correctAnswers.push({
          questionId: question.id,
          correctOptions: this.#extractOptions(question)
            .filter((option) => option.isCorrect)
            .map((option) => ({ id: option.id, text: option.text })),
        });
        continue;
      }

      let questionScore;
      let questionCorrectAnswer;

      if (question.type === "checkbox") {
        [questionScore, questionCorrectAnswer] = this.#markCheckboxQuestion(
          question,
          userAnswer
        );
      } else if (question.type === "radio" || question.type === "select") {
        [questionScore, questionCorrectAnswer] =
          this.#markRadioOrSelectQuestion(question, userAnswer);
      } else {
        console.warn(`Unsupported question type: ${question.type}`);
        continue;
      }

      score += questionScore;
      if (questionCorrectAnswer) {
        correctAnswers.push(questionCorrectAnswer);
      }
    }

    return res.status(200).json({
      success: true,
      score,
      correctAnswers,
    });
  }
}

export default MarkQuestions;
