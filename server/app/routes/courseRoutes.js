import express from "express";
import authenticate from "../middlewares/authenticate.js";
import MarkQuestions from "../controllers/markController.js";
import CourseController from "../controllers/courseController.js";

const router = express.Router();

router.use(authenticate);

router.delete("/course/:id", async (req, res) => {
  const Controller = new CourseController(req);

  return await Controller.destroy(req, res);
});

router.get("/course/bySlug/:slug", async (req, res) => {
  const Controller = new CourseController(req);

  return await Controller.bySlug(req, res);
});

router.get("/course/:id", async (req, res) => {
  const Controller = new CourseController(req);

  return await Controller.findOne(req, res);
});

router.get("/courses/user", async (req, res) => {
  const Controller = new CourseController(req);
  return await Controller.foruser(req, res);
})

router.post("/course/mark/:id", async (req, res) => {
  const Controller = new MarkQuestions();

  return await Controller.markQuestions(req, res);
});

router
  .route("/courses")
  .post(async (req, res) => {
    const Controller = new CourseController(req);
    return await Controller.store(req, res);
  })
  .put(async (req, res) => {
    const Controller = new CourseController(req);
    return await Controller.update(req, res);
  })
  .get(async (req, res) => {
    const Controller = new CourseController(req);

    return await Controller.findAll(req, res);
  });

export default router;
