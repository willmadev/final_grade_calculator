import { Reducer, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { Assignment, Course } from "../../types/Assignment";
import CalculatorMenu from "../CalculatorMenu";
import CourseLayout from "../Course";
import { baseUrl } from "../../utils/config";

const StyledCalculatorLayout = styled.div`
  width: 800px;
  height: 100%;
  max-width: 80vw;
  display: grid;
  grid-template-columns: 1fr 3fr;
  background-color: #f5faff;
  border-radius: 20px;
  box-shadow: 4px 4px 15px rgba(80, 80, 80, 0.15);
`;

const DefaultPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 30px 25px;
  text-align: center;
`;

enum ActionTypes {
  addCourse = "addCourse",
  removeCourse = "removeCourse",
  updateCourse = "updateCorse",
  updateCourseName = "updateCourseName",
  addAssignment = "addAssignment",
  removeAssignment = "removeAssignment",
  updateAssignment = "updateAssignment",
  setCourses = "setCourses",
}

type Action =
  | { type: ActionTypes.addCourse; payload: { course: Course } }
  | { type: ActionTypes.removeCourse; payload: { courseId: number } }
  | {
      type: ActionTypes.updateCourse;
      payload: { courseId: number; course: Course };
    }
  | {
      type: ActionTypes.updateCourseName;
      payload: { courseId: number; name: string };
    }
  | { type: ActionTypes.addAssignment; payload: { assignment: Assignment } }
  | {
      type: ActionTypes.updateAssignment;
      payload: { assignment: Assignment };
    }
  | {
      type: ActionTypes.removeAssignment;
      payload: { courseId: number; assignmentId: number };
    }
  | { type: ActionTypes.setCourses; payload: { courses: Course[] } };

const reducer = (courses: Course[], action: Action): Course[] => {
  switch (action.type) {
    case ActionTypes.addCourse:
      return [...courses, action.payload.course];
    case ActionTypes.removeCourse:
      return courses.filter((course) => course.id !== action.payload.courseId);
    case ActionTypes.updateCourse:
      return courses.map((course) => {
        if (course.id === action.payload.courseId) {
          return action.payload.course;
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
        if (course.id === action.payload.assignment.courseId) {
          return {
            ...course,
            assignments: [...course.assignments, action.payload.assignment],
          };
        }
        return course;
      });
    case ActionTypes.removeAssignment:
      return courses.map((course) => {
        if (course.id === action.payload.courseId) {
          return {
            ...course,
            assignments: course.assignments.filter(
              (assignment) => assignment.id !== action.payload.assignmentId
            ),
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

  // get courses from server
  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(`${baseUrl}/course?archived=false`, {
        credentials: "include",
      });
      if (res.status === 200) {
        const jsonCourses = await res.json();
        dispatch({
          type: ActionTypes.setCourses,
          payload: { courses: jsonCourses },
        });
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setCurrentCourse(
      courses.find((course) => course.id === currentCourseId) || null
    );
  }, [currentCourseId, courses]);

  const addCourse = async () => {
    const res = await fetch(`${baseUrl}/course`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        name: "New Course",
        archived: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 201) {
      dispatch({
        type: ActionTypes.addCourse,
        payload: { course: await res.json() },
      });
    }
  };
  const updateCourse = async (courseId: number, course: Course) => {
    const res = await fetch(`${baseUrl}/course/${courseId}`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ name: course.name, archived: course.archived }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      dispatch({
        type: ActionTypes.updateCourse,
        payload: { courseId, course: await res.json() },
      });
    }
  };
  const removeCourse = async (courseId: number) => {
    const res = await fetch(`${baseUrl}/course/${courseId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 204) {
      dispatch({ type: ActionTypes.removeCourse, payload: { courseId } });
    }
  };
  const addAssignment = async (courseId: number) => {
    const res = await fetch(`${baseUrl}/course/${courseId}/assignment`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        name: "New Assignment",
        worth: 0,
        grade: 0,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 201) {
      dispatch({
        type: ActionTypes.addAssignment,
        payload: { assignment: await res.json() },
      });
    }
  };
  const updateAssignment = async (assignment: Assignment) => {
    const res = await fetch(
      `${baseUrl}/course/${assignment.courseId}/assignment/${assignment.id}`,
      {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({
          name: assignment.name,
          worth: assignment.worth,
          grade: assignment.grade,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      dispatch({
        type: ActionTypes.updateAssignment,
        payload: { assignment: await res.json() },
      });
    }
  };
  const removeAssignment = async (courseId: number, assignmentId: number) => {
    const res = await fetch(
      `${baseUrl}/course/${courseId}/assignment/${assignmentId}`,
      { method: "DELETE", credentials: "include" }
    );
    if (res.status === 204) {
      dispatch({
        type: ActionTypes.removeAssignment,
        payload: { assignmentId, courseId },
      });
    }
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
          updateCourse={updateCourse}
          updateAssignment={updateAssignment}
          removeAssignment={removeAssignment}
        />
      ) : (
        <DefaultPage>
          <h2>Final Grade Calculator</h2>
          <p>To begin, create or select a course from the side menu.</p>
        </DefaultPage>
      )}
    </StyledCalculatorLayout>
  );
};

export default CalculatorLayout;
