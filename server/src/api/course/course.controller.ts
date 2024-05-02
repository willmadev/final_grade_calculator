import { Request, Response } from "express";
import prisma from "../../config/prisma";
import { ZodError, z } from "zod";

const getCoursesSchema = z.object({
  archived: z
    .string()
    .toLowerCase()
    .transform((x) => x === "true")
    .pipe(z.boolean())
    .optional(),
  // string to boolean
});

export const getCourses = async (req: Request, res: Response) => {
  let query;
  try {
    query = getCoursesSchema.parse(req.query);
  } catch (e) {
    console.error(e);
    if (e instanceof ZodError) return res.status(400).send(e.message);
    return res.status(500).send("An error occured");
  }
  const courses = await prisma.course.findMany({
    where: { ...query, userId: req.user.id },
    select: { id: true, name: true, archived: true },
  });
  return res.status(200).send(courses);
};

const createCourseSchema = z.object({
  name: z.string(),
});
export const createCourse = async (req: Request, res: Response) => {
  let body;
  try {
    body = createCourseSchema.parse(req.body);
  } catch (e) {
    if (e instanceof ZodError) {
      return res.status(400).send(e.message);
    }
    return res.status(500).send("An error occured");
  }
  const course = await prisma.course.create({
    data: { ...body, archived: false, userId: req.user.id },
    select: { id: true, name: true, archived: true },
  });
  return res.status(201).send(course);
};

export const getCourseById = async (req: Request, res: Response) => {
  const courseId = parseInt(req.params.courseId);
  if (isNaN(courseId)) return res.status(404).send();
  const course = await prisma.course.findUnique({
    where: { id: courseId, userId: req.user.id },
    select: { id: true, name: true, archived: true },
  });
  if (!course) return res.status(404).send();
  return res.status(200).send(course);
};

const updateCourseSchema = z.object({
  name: z.string().optional(),
  archived: z.boolean().optional(),
});

export const updateCourseById = async (req: Request, res: Response) => {
  const courseId = parseInt(req.params.courseId);
  if (isNaN(courseId)) return res.status(404).send();
  let body;
  try {
    body = updateCourseSchema.parse(req.body);
  } catch (e) {
    if (e instanceof ZodError) return res.status(400).send(e.message);
    return res.status(500).send("An error occured");
  }
  const courseExists = await prisma.course.findUnique({
    where: { id: courseId, userId: req.user.id },
  });
  if (!courseExists) return res.status(404).send();
  const course = await prisma.course.update({
    where: { id: courseId, userId: req.user.id },
    data: body,
    select: { id: true, name: true, archived: true },
  });
  return res.status(200).send(course);
};

export const deleteCourseById = async (req: Request, res: Response) => {
  const courseId = parseInt(req.params.courseId);
  if (isNaN(courseId)) return res.status(404).send();
  const courseExists = await prisma.course.findUnique({
    where: { id: courseId, userId: req.user.id },
  });
  if (!courseExists) return res.status(404).send();
  await prisma.course.delete({ where: { id: courseId, userId: req.user.id } });
  return res.status(204).send();
};

export const getAssignments = async (req: Request, res: Response) => {
  const courseId = parseInt(req.params.courseId);
  if (isNaN(courseId)) return res.status(404).send();
  const assignments = await prisma.assignment.findMany({
    where: { courseId, course: { userId: req.user.id } },
  });
  return res.status(200).send(assignments);
};

const createAssignmentSchema = z.object({
  name: z.string(),
  worth: z.number(),
  grade: z.number(),
});
export const createAssignment = async (req: Request, res: Response) => {
  const courseId = parseInt(req.params.courseId);
  if (isNaN(courseId)) return res.status(404).send();
  const courseExists = await prisma.course.findUnique({
    where: { id: courseId, userId: req.user.id },
  });
  if (!courseExists) return res.status(404).send();

  let body;
  try {
    body = createAssignmentSchema.parse(req.body);
  } catch (e) {
    if (e instanceof ZodError) return res.status(400).send(e.message);
    return res.status(500).send("An error occured");
  }

  const assignment = await prisma.assignment.create({
    data: { ...body, courseId },
  });

  return res.status(201).send(assignment);
};

const updateAssignmentSchema = z.object({
  name: z.string().optional(),
  worth: z.number().optional(),
  grade: z.number().optional(),
});

export const updateAssignmentById = async (req: Request, res: Response) => {
  const courseId = parseInt(req.params.courseId);
  if (isNaN(courseId)) return res.status(404).send();
  const courseExists = await prisma.course.findUnique({
    where: { id: courseId, userId: req.user.id },
  });
  if (!courseExists) return res.status(404).send();

  const assignmentId = parseInt(req.params.assignmentId);
  if (isNaN(assignmentId)) return res.status(404).send();
  const assignmentExists = await prisma.assignment.findUnique({
    where: { id: assignmentId, courseId },
  });
  if (!assignmentExists) return res.status(404).send();

  let body;
  try {
    body = updateAssignmentSchema.parse(req.body);
  } catch (e) {
    if (e instanceof ZodError) return res.status(400).send(e.message);
    return res.status(500).send("An error occured");
  }

  const assignment = await prisma.assignment.update({
    where: { id: assignmentId },
    data: body,
  });
  return res.status(200).send(assignment);
};

export const deleteAssignmentById = async (req: Request, res: Response) => {
  const courseId = parseInt(req.params.courseId);
  if (isNaN(courseId)) return res.status(404).send();
  const courseExists = await prisma.course.findUnique({
    where: { id: courseId, userId: req.user.id },
  });
  if (!courseExists) return res.status(404).send();

  const assignmentId = parseInt(req.params.assignmentId);
  if (isNaN(assignmentId)) return res.status(404).send();
  const assignmentExists = await prisma.assignment.findUnique({
    where: { id: assignmentId, courseId },
  });
  if (!assignmentExists) return res.status(404).send();

  await prisma.assignment.delete({
    where: { id: assignmentId },
  });
  return res.status(204).send();
};
