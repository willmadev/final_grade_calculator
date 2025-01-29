import { Assignment, Course } from "../types/Course";
import { fetchApi } from "../utils/fetchApi";

export const addCourse = (courseName: string) =>
  fetchApi("/course", "POST", { name: courseName });

export const getCourses = () => fetchApi("/course");

export const getArchivedCourses = () => fetchApi("/course/archived");

export type CourseAction = "archive" | "unarchive";
export const updateCourses = (courseIds: string[], action: CourseAction) =>
  fetchApi("/course", "PUT", { ids: courseIds, action });

export const deleteCourses = (courseIds: string[]) =>
  fetchApi("/course", "DELETE", { ids: courseIds });

export const getCourse = (courseId: string) => fetchApi(`/course/${courseId}`);

export const updateCourse = ({
  courseId,
  course,
}: {
  courseId: string;
  course: Partial<Course>;
}) => fetchApi(`/course/${courseId}`, "PUT", course);

export const deleteCourse = (courseId: string) =>
  fetchApi(`/course/${courseId}`, "DELETE");

export const getCourseAssignments = (courseId: string) =>
  fetchApi(`/course/${courseId}/assignment`);

export const addAssignment = ({
  courseId,
  name,
  worth,
  grade,
}: {
  courseId: string;
  name: string;
  worth: number;
  grade: number;
}) =>
  fetchApi(`/course/${courseId}/assignment`, "POST", { name, worth, grade });

export const updateAssignment = ({
  courseId,
  assignment,
}: {
  courseId: string;
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
  courseId: string;
  assignmentId: string;
}) => fetchApi(`/course/${courseId}/assignment/${assignmentId}`, "DELETE");
