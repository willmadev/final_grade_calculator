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
import { authorize } from "../middleware/authorize";

const courseRouter = Router();
courseRouter.use(authorize);
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
