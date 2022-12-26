import React, { FC } from "react";
import styled from "styled-components";
import { Assignment } from "../../types/Assignment";
import AssignmentRow from "./AssignmentRow";

const CalculatorContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: auto 80px 80px 40px;
  margin-bottom: 4px;
  & h3 {
    margin: 0;
  }
`;

interface CourseCalculatorProps {
  assignments: Assignment[];
  updateAssignment: (assignment: Assignment) => void;
  removeAssignment: (courseId: number, assignmentId: number) => void;
}
const CourseCalculator: FC<CourseCalculatorProps> = ({
  assignments,
  updateAssignment,
  removeAssignment,
}) => {
  return (
    <CalculatorContainer>
      <HeaderContainer>
        <h3>Assignment</h3>
        <h3>Worth</h3>
        <h3>Grade</h3>
      </HeaderContainer>
      {assignments.map((assignment) => (
        <AssignmentRow
          key={assignment.id}
          assignment={assignment}
          updateAssignment={updateAssignment}
          removeAssignment={removeAssignment}
        />
      ))}
    </CalculatorContainer>
  );
};

export default CourseCalculator;
