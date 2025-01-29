import React, { FC } from "react";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";

import AssignmentRow from "./AssignmentRow";
import { Assignment } from "../../types/Course";
import { getCourseAssignments } from "../../api/course";

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

const CourseCalculator = ({ courseId }: { courseId: string }) => {
  const query = useQuery({
    queryKey: [`course/${courseId}/assignment`],
    queryFn: () => getCourseAssignments(courseId),
  });
  if (query.isLoading) return <p>"loading"</p>;
  if (query.isError) return <p>"error"</p>;
  return (
    <CalculatorContainer>
      <HeaderContainer>
        <h3>Assignment</h3>
        <h3>Worth</h3>
        <h3>Grade</h3>
      </HeaderContainer>
      {query.data.map((assignment: Assignment) => (
        <AssignmentRow key={assignment.id} assignment={assignment} />
      ))}
    </CalculatorContainer>
  );
};

export default CourseCalculator;
