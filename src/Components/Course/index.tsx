import { FC, useState } from "react";
import styled from "styled-components";
import { Course } from "../../types/Assignment";
import CourseCalculator from "./CourseCalculator";
import CourseTitleEditor from "./CourseTitleEditor";
import courseContext from "./courseContext";

const StyledCourseLayout = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 25px;
  gap: 10px;
`;

const Heading = styled.h2`
  margin: 0px -10px;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 1.8rem;
  width: max-content;
  &:hover {
    background-color: #bdc4ca;
    cursor: pointer;
  }
`;

const CalculatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const AddAssignmentButton = styled.a`
  width: max-content;
  padding: 2px 8px 4px;
  margin-left: -8px;
  border-radius: 5px;
  &:hover {
    background-color: #bdc4ca;
    cursor: pointer;
  }
`;

interface CourseLayoutProps {
  course: Course;
  addAssignment: (courseId: number) => void;
  updateCourseName: (courseId: number, name: string) => void;
}

const CourseLayout: FC<CourseLayoutProps> = ({
  course,
  addAssignment,
  updateCourseName,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <courseContext.Provider value={course}>
      <StyledCourseLayout>
        {isEditing ? (
          <CourseTitleEditor
            setIsEditing={setIsEditing}
            updateCourseName={updateCourseName}
          />
        ) : (
          <Heading onClick={() => setIsEditing(true)}>{course.name}</Heading>
        )}
        <CalculatorContainer>
          <CourseCalculator assignments={course.assignments} />
          <AddAssignmentButton onClick={() => addAssignment(course.id)}>
            + Add Assignment
          </AddAssignmentButton>
        </CalculatorContainer>
        <p>Final Grade: 75%</p>
      </StyledCourseLayout>
    </courseContext.Provider>
  );
};

export default CourseLayout;