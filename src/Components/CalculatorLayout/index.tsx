import { Reducer, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { Assignment, Course } from "../../types/Assignment";
import CalculatorMenu from "../CalculatorMenu";
import CourseLayout from "../Course";

const StyledCalculatorLayout = styled.div`
  width: 800px;
  max-width: 80vw;
  display: grid;
  grid-template-columns: 1fr 3fr;
  background-color: #f5faff;
  border-radius: 20px;
  box-shadow: 4px 4px 15px rgba(80, 80, 80, 0.15);
`;

enum ActionTypes {
  addCourse = "addCourse",
  removeCourse = "removeCourse",
  updateCourse = "updateCorse",
  updateCourseName = "updateCourseName",
  addAssignment = "addAssignment",
  updateAssignment = "updateAssignment",
  setCourses = "setCourses",
}

type Action =
  | { type: ActionTypes.addCourse }
  | { type: ActionTypes.removeCourse; payload: { courseId: number } }
  | {
      type: ActionTypes.updateCourse;
      payload: { courseId: number; newCourse: Course };
    }
  | {
      type: ActionTypes.updateCourseName;
      payload: { courseId: number; name: string };
    }
  | { type: ActionTypes.addAssignment; payload: { courseId: number } }
  | {
      type: ActionTypes.updateAssignment;
      payload: { assignment: Assignment };
    }
  | { type: ActionTypes.setCourses; payload: { courses: Course[] } };

const reducer = (courses: Course[], action: Action): Course[] => {
  switch (action.type) {
    case ActionTypes.addCourse:
      const nextCourse = courses.reduce(
        (prev, curr) => {
          if (prev.id > curr.id)
            return { id: prev.id, assignments: [], name: "New Course" };
          else return { id: curr.id + 1, assignments: [], name: "New Course" };
        },
        { id: 0, assignments: [], name: "New Course" }
      );
      return [...courses, nextCourse];
    case ActionTypes.removeCourse:
      return courses.filter((course) => course.id !== action.payload.courseId);
    case ActionTypes.updateCourse:
      return courses.map((course) => {
        if (course.id === action.payload.courseId) {
          return action.payload.newCourse;
        }
        return course;
      });
    case ActionTypes.updateCourseName:
      return courses.map((course) => {
        if (course.id === action.payload.courseId) {
          return { ...course, name: action.payload.name };
        }
        return course;
      });

    case ActionTypes.addAssignment:
      return courses.map((course) => {
        if (course.id === action.payload.courseId) {
          const nextAssignment = course.assignments.reduce(
            (prev, curr) => {
              if (prev.id > curr.id)
                return {
                  id: prev.id,
                  courseId: course.id,
                  name: "New assignment",
                  grade: 0,
                  worth: 0,
                };
              else
                return {
                  id: curr.id + 1,
                  courseId: course.id,
                  name: "New assignment",
                  grade: 0,
                  worth: 0,
                };
            },
            {
              id: 0,
              courseId: course.id,
              name: "New assignment",
              grade: 0,
              worth: 0,
            }
          );
          return {
            ...course,
            assignments: [...course.assignments, nextAssignment],
          };
        }
        return course;
      });
    case ActionTypes.updateAssignment:
      return courses.map((course) => {
        if (course.id === action.payload.assignment.courseId) {
          return {
            ...course,
            assignments: course.assignments.map((assignment) => {
              if (assignment.id === action.payload.assignment.id) {
                return action.payload.assignment;
              }
              return assignment;
            }),
          };
        }
        return course;
      });

    case ActionTypes.setCourses:
      return action.payload.courses;

    default:
      return courses;
  }
};

const CalculatorLayout = () => {
  const [courses, dispatch] = useReducer<Reducer<Course[], Action>>(
    reducer,
    []
  );
  const [currentCourseId, setCurrentCourseId] = useState<null | number>(null);
  const [currentCourse, setCurrentCourse] = useState<null | Course>(null);
  const [loading, setLoading] = useState(true);

  // get courses from storage
  useEffect(() => {
    const jsonCourses = localStorage.getItem("courses");
    if (jsonCourses) {
      dispatch({
        type: ActionTypes.setCourses,
        payload: { courses: JSON.parse(jsonCourses) },
      });
      console.info("Courses retrieved from storage");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setCurrentCourse(
      courses.find((course) => course.id === currentCourseId) || null
    );
  }, [currentCourseId, courses]);

  // save courses to storage
  useEffect(() => {
    if (!loading) {
      console.log("Saving courses to storage", courses);
      localStorage.setItem("courses", JSON.stringify(courses));
    }
  }, [courses, loading]);

  const addCourse = () => dispatch({ type: ActionTypes.addCourse });
  const updateCourseName = (courseId: number, name: string) =>
    dispatch({
      type: ActionTypes.updateCourseName,
      payload: { courseId, name },
    });
  const removeCourse = (courseId: number) =>
    dispatch({ type: ActionTypes.removeCourse, payload: { courseId } });
  const addAssignment = (courseId: number) =>
    dispatch({ type: ActionTypes.addAssignment, payload: { courseId } });
  const updateAssignment = (assignment: Assignment) => {
    dispatch({
      type: ActionTypes.updateAssignment,
      payload: { assignment },
    });
  };

  return (
    <StyledCalculatorLayout>
      <CalculatorMenu
        courses={courses}
        addCourse={addCourse}
        removeCourse={removeCourse}
        setCurrentCourseId={setCurrentCourseId}
      />
      {currentCourse ? (
        <CourseLayout
          course={currentCourse}
          addAssignment={addAssignment}
          updateCourseName={updateCourseName}
          updateAssignment={updateAssignment}
        />
      ) : (
        <p>Select a course</p>
      )}
    </StyledCalculatorLayout>
  );
};

export default CalculatorLayout;
