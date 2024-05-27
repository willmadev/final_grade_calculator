import { FC, useMemo, useState } from "react";
import styled from "styled-components";
import { Assignment, Course } from "../../types/Assignment";
import CourseCalculator from "./CourseCalculator";
import CourseTitleEditor from "./CourseTitleEditor";
import courseContext from "./courseContext";
import {
  calculateFinalGrade,
  calculateProjectedGrade,
} from "../../utils/calculateGrade";

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

const GradeContainer = styled.div`
  width: max-content;
  margin-left: auto;
  margin-right: 40px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FinalGradeText = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 1.25rem;
  text-align: right;
`;

const ProjectedGradeText = styled.p`
  margin: 0;
  font-size: 1.15rem;
  text-align: right;
`;

interface CourseLayoutProps {
  course: Course;
  addAssignment: (courseId: number) => void;
  updateCourse: (courseId: number, course: Course) => void;
  updateAssignment: (assignment: Assignment) => void;
  removeAssignment: (courseId: number, assignmentId: number) => void;
}

const CourseLayout: FC<CourseLayoutProps> = ({
  course,
  addAssignment,
  updateCourse,
  updateAssignment,
  removeAssignment,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const finalGrade = useMemo(
    () => calculateFinalGrade(course.assignments),
    [course]
  );
  const projectedGrade = useMemo(
    () => calculateProjectedGrade(course.assignments),
    [course]
  );
  return (
    <courseContext.Provider value={course}>
      <StyledCourseLayout>
        {isEditing ? (
          <CourseTitleEditor
            setIsEditing={setIsEditing}
            updateCourse={updateCourse}
          />
        ) : (
          <Heading onClick={() => setIsEditing(true)}>{course.name}</Heading>
        )}
        <CalculatorContainer>
          <CourseCalculator
            assignments={course.assignments}
            updateAssignment={updateAssignment}
            removeAssignment={removeAssignment}
          />
          <AddAssignmentButton onClick={() => addAssignment(course.id)}>
            + Add Assignment
          </AddAssignmentButton>
        </CalculatorContainer>
        <GradeContainer>
          <ProjectedGradeText>
            Projected Grade: {(projectedGrade * 100).toFixed(2)}%
          </ProjectedGradeText>
          <FinalGradeText>
            Final Grade: {(finalGrade * 100).toFixed(2)}%
          </FinalGradeText>
        </GradeContainer>
      </StyledCourseLayout>
    </courseContext.Provider>
  );
};

export default CourseLayout;
