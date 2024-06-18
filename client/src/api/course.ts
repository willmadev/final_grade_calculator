import { Assignment, Course } from "../types/Course";
import { fetchApi } from "../utils/fetchApi";

export const addCourse = (courseName: string) =>
  fetchApi("/course", "POST", { name: courseName });

export const getCourses = () => fetchApi("/course");

export const getCourse = (courseId: number) => fetchApi(`/course/${courseId}`);

export const updateCourse = ({
  courseId,
  course,
}: {
  courseId: number;
  course: Partial<Course>;
}) => fetchApi(`/course/${courseId}`, "PUT", course);

export const deleteCourse = (courseId: number) =>
  fetchApi(`/course/${courseId}`, "DELETE");

export const getCourseAssignments = (courseId: number) =>
  fetchApi(`/course/${courseId}/assignment`);

export const addAssignment = ({
  courseId,
  name,
  worth,
  grade,
}: {
  courseId: number;
  name: string;
  worth: number;
  grade: number;
}) =>
  fetchApi(`/course/${courseId}/assignment`, "POST", { name, worth, grade });

export const updateAssignment = ({
  courseId,
  assignment,
}: {
  courseId: number;
  assignment: Assignment;
}) =>
  fetchApi(
    `/course/${courseId}/assignment/${assignment.id}`,
    "PUT",
    assignment
  );

export const deleteAssignment = ({
  courseId,
  assignmentId,
}: {
  courseId: number;
  assignmentId: number;
}) => fetchApi(`/course/${courseId}/assignment/${assignmentId}`, "DELETE");
