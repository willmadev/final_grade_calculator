import { Request, Response } from "express";
import prisma from "../../config/prisma";
import { ZodError, z } from "zod";
import { decodePublicId, encodePublicId } from "../../config/sqid";

const courseSelection = {
  id: true,
  name: true,
  archived: true,
  assignments: {
    select: {
      id: true,
      name: true,
      courseId: true,
      worth: true,
      grade: true,
    },
  },
};

const archivedCourseSelection = {
  id: true,
  name: true,
  archived: true,
  archivedAt: true,
};

export const getCourses = async (req: Request, res: Response) => {
  const courses = await prisma.course.findMany({
    where: { userId: req.user.id, archived: false },
    select: courseSelection,
    orderBy: { createdAt: "asc" },
  });
  return res
    .status(200)
    .send(
      courses.map((course) => ({ ...course, id: encodePublicId(course.id) }))
    );
};

export const getArchivedCourses = async (req: Request, res: Response) => {
  const courses = await prisma.course.findMany({
    where: { userId: req.user.id, archived: true },
    select: archivedCourseSelection,
    orderBy: { archivedAt: "asc" },
  });
  console.log({ courses });
  return res
    .status(200)
    .send(
      courses.map((course) => ({ ...course, id: encodePublicId(course.id) }))
    );
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
    select: courseSelection,
  });
  return res.status(201).send({ ...course, id: encodePublicId(course.id) });
};

export const getCourseById = async (req: Request, res: Response) => {
  if (!req.params.courseId) return res.status(400).send();
  console.log({ publicCourseId: req.params.courseId });
  const course = await prisma.course.findUnique({
    where: {
      id: decodePublicId(req.params.courseId),
      archived: false,
      userId: req.user.id,
    },
    select: courseSelection,
  });
  if (!course) return res.status(404).send();
  return res.status(200).send({ ...course, id: encodePublicId(course.id) });
};

const updateCourseSchema = z.object({
  name: z.string().optional(),
  archived: z.boolean().optional(),
});

export const updateCourseById = async (req: Request, res: Response) => {
  if (!req.params.courseId) return res.status(400).send();
  let body;
  try {
    body = updateCourseSchema.parse(req.body);
  } catch (e) {
    if (e instanceof ZodError) return res.status(400).send(e.message);
    return res.status(500).send("An error occured");
  }
  if (body.archived !== undefined) {
    body = { ...body, archivedAt: body.archived ? new Date() : null };
  }
  const courseExists = await prisma.course.findUnique({
    where: { id: decodePublicId(req.params.courseId), userId: req.user.id },
  });
  if (!courseExists) return res.status(404).send();
  const course = await prisma.course.update({
    where: { id: decodePublicId(req.params.courseId), userId: req.user.id },
    data: body,
    include: { assignments: true },
  });
  return res.status(200).send({ ...course, id: encodePublicId(course.id) });
};

export const deleteCourseById = async (req: Request, res: Response) => {
  if (!req.params.courseId) return res.status(404).send();
  const courseExists = await prisma.course.findUnique({
    where: { id: decodePublicId(req.params.courseId), userId: req.user.id },
  });
  if (!courseExists) return res.status(404).send();
  await prisma.course.delete({
    where: { id: decodePublicId(req.params.courseId), userId: req.user.id },
  });
  return res.status(204).send();
};

const updateCoursesSchema = z.object({
  ids: z.array(z.string()),
  action: z.enum(["archive", "unarchive"]),
});

export const updateCoursesByIds = async (req: Request, res: Response) => {
  let body;
  try {
    body = updateCoursesSchema.parse(req.body);
  } catch (e) {
    if (e instanceof ZodError) return res.status(400).send(e.message);
    return res.status(500).send("An error occured");
  }
  let data;
  if (body.action === "archive")
    data = { archived: true, archivedAt: new Date() };
  else if (body.action === "unarchive")
    data = { archived: false, archivedAt: null };
  else return res.status(500).send("An error occured");
  await prisma.course.updateMany({
    data,
    where: {
      id: { in: body.ids.map((publicId) => decodePublicId(publicId)) },
      userId: req.user.id,
    },
  });
  return res.status(204).send();
};

const deleteCoursesSchema = z.object({ ids: z.array(z.string()) });
export const deleteCoursesByIds = async (req: Request, res: Response) => {
  let body;
  try {
    body = deleteCoursesSchema.parse(req.body);
  } catch (e) {
    if (e instanceof ZodError) return res.status(400).send(e.message);
    return res.status(500).send("An error occured");
  }
  await prisma.course.deleteMany({
    where: {
      id: { in: body.ids.map((publicId) => decodePublicId(publicId)) },
      userId: req.user.id,
    },
  });
  return res.status(204).send();
};

export const getAssignments = async (req: Request, res: Response) => {
  if (!req.params.courseId) return res.status(400).send();
  const assignments = await prisma.assignment.findMany({
    where: {
      courseId: decodePublicId(req.params.courseId),
      course: { userId: req.user.id },
    },
    orderBy: { createdAt: "asc" },
  });
  return res.status(200).send(
    assignments.map((assignment) => ({
      ...assignment,
      id: encodePublicId(assignment.id),
      courseId: encodePublicId(assignment.courseId),
    }))
  );
};

const createAssignmentSchema = z.object({
  name: z.string(),
  worth: z.number(),
  grade: z.number(),
});
export const createAssignment = async (req: Request, res: Response) => {
  if (!req.params.courseId) return res.status(400).send();
  const courseExists = await prisma.course.findUnique({
    where: { id: decodePublicId(req.params.courseId), userId: req.user.id },
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
    data: { ...body, courseId: decodePublicId(req.params.courseId) },
  });

  return res.status(201).send({
    ...assignment,
    id: encodePublicId(assignment.id),
    courseId: encodePublicId(assignment.courseId),
  });
};

const updateAssignmentSchema = z.object({
  name: z.string().optional(),
  worth: z.number().optional(),
  grade: z.number().optional(),
});

export const updateAssignmentById = async (req: Request, res: Response) => {
  if (!req.params.courseId) return res.status(400).send();
  const courseExists = await prisma.course.findUnique({
    where: { id: decodePublicId(req.params.courseId), userId: req.user.id },
  });
  if (!courseExists) return res.status(404).send();

  if (!req.params.assignmentId) return res.status(400).send();
  const assignmentExists = await prisma.assignment.findUnique({
    where: {
      id: decodePublicId(req.params.assignmentId),
      courseId: decodePublicId(req.params.courseId),
    },
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
    where: { id: decodePublicId(req.params.assignmentId) },
    data: body,
  });
  return res.status(200).send({
    ...assignment,
    id: encodePublicId(assignment.id),
    courseId: encodePublicId(assignment.courseId),
  });
};

export const deleteAssignmentById = async (req: Request, res: Response) => {
  if (!req.params.courseId) return res.status(400).send();
  const courseExists = await prisma.course.findUnique({
    where: { id: decodePublicId(req.params.courseId), userId: req.user.id },
  });
  if (!courseExists) return res.status(404).send();

  if (!req.params.assignmentId) return res.status(400).send();
  const assignmentExists = await prisma.assignment.findUnique({
    where: {
      id: decodePublicId(req.params.assignmentId),
      courseId: decodePublicId(req.params.courseId),
    },
  });
  if (!assignmentExists) return res.status(404).send();

  await prisma.assignment.delete({
    where: { id: decodePublicId(req.params.assignmentId) },
  });
  return res.status(204).send();
};
