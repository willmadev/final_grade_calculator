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
  grid-template-columns: auto 100px 100px 50px;
  & h3 {
    margin: 0;
  }
`;

interface CourseCalculatorProps {
  assignments: Assignment[];
  updateAssignment: (assignment: Assignment) => void;
}
const CourseCalculator: FC<CourseCalculatorProps> = ({
  assignments,
  updateAssignment,
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
        />
      ))}
    </CalculatorContainer>
  );
};

export default CourseCalculator;
