import React, { FC } from "react";
import styled from "styled-components";
import { Assignment } from "../../types/Assignment";
import AssignmentRow from "./AssignmentRow";

const Table = styled.table`
  & th {
    text-align: left;
  }
`;

interface CourseCalculatorProps {
  assignments: Assignment[];
}
const CourseCalculator: FC<CourseCalculatorProps> = ({ assignments }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Assignment</th>
          <th>Worth</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        {assignments.map((assignment) => (
          <AssignmentRow
            key={assignment.id}
            assignmentName={assignment.name}
            grade={assignment.grade}
            worth={assignment.worth}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default CourseCalculator;
