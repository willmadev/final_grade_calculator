import { Router } from "express";
import {
  createAssignment,
  createCourse,
  deleteAssignmentById,
  deleteCourseById,
  getAssignments,
  getCourseById,
  getCourses,
  updateAssignmentById,
  updateCourseById,
} from "./course.controller";
import { authenticate } from "../middleware/authenticate";

const courseRouter = Router();
courseRouter.use(authenticate);
courseRouter.get("/", getCourses);
courseRouter.post("/", createCourse);
courseRouter.get("/:courseId", getCourseById);
courseRouter.put("/:courseId", updateCourseById);
courseRouter.delete("/:courseId", deleteCourseById);
courseRouter.get("/:courseId/assignment", getAssignments);
courseRouter.post("/:courseId/assignment", createAssignment);
courseRouter.put("/:courseId/assignment/:assignmentId", updateAssignmentById);
courseRouter.delete(
  "/:courseId/assignment/:assignmentId",
  deleteAssignmentById
);

export default courseRouter;
