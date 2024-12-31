import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";

import {
  addAssignment,
  getCourse,
  getCourseAssignments,
  updateCourse,
} from "../../api/course";
import CourseTitleEditor from "../../Components/Course/CourseTitleEditor";
import CourseCalculator from "../../Components/Course/CourseCalculator";
import {
  calculateFinalGrade,
  calculateProjectedGrade,
} from "../../utils/calculateGrade";
import { Assignment } from "../../types/Course";

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

const Course = () => {
  const { courseId } = Route.useParams();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  const courseQuery = useQuery({
    queryKey: [`course/${courseId}`],
    queryFn: () => getCourse(courseId),
  });
  const assignmentsQuery = useQuery({
    queryKey: [`course/${courseId}/assignment`],
    queryFn: () => getCourseAssignments(courseId),
  });
  const addAssignmentMutation = useMutation({
    mutationFn: addAssignment,
    onMutate: async ({ courseId, grade, name, worth }) => {
      await queryClient.cancelQueries({
        queryKey: [`course/${courseId}/assignment`],
      });
      const previous = queryClient.getQueryData([
        `course/${courseId}/assignment`,
      ]);
      queryClient.setQueryData(
        [`course/${courseId}/assignment`],
        (old: Assignment[]) => [
          ...old,
          { id: -1, courseId, name, grade, worth },
        ]
      );
      return { previous };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [`course/${courseId}/assignment`],
      });
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(
        [`course/${courseId}/assignment`],
        context?.previous
      );
    },
  });

  if (courseQuery.isLoading || assignmentsQuery.isLoading) return "loading";
  if (courseQuery.isError || assignmentsQuery.isError) return "error";

  return (
    <StyledCourseLayout>
      {isEditing ? (
        <CourseTitleEditor setIsEditing={setIsEditing} courseId={courseId} />
      ) : (
        <Heading onClick={() => setIsEditing(true)}>
          {courseQuery.data.name}
        </Heading>
      )}
      <CalculatorContainer>
        <CourseCalculator courseId={courseId} />
        <AddAssignmentButton
          onClick={() =>
            addAssignmentMutation.mutate({
              courseId,
              name: "New Assignment",
              grade: 0,
              worth: 0,
            })
          }
        >
          + Add Assignment
        </AddAssignmentButton>
      </CalculatorContainer>
      <GradeContainer>
        <ProjectedGradeText>
          Projected Grade:{" "}
          {(calculateProjectedGrade(assignmentsQuery.data) * 100).toFixed(2)}%
        </ProjectedGradeText>
        <FinalGradeText>
          Final Grade:{" "}
          {(calculateFinalGrade(assignmentsQuery.data) * 100).toFixed(2)}%
        </FinalGradeText>
      </GradeContainer>
    </StyledCourseLayout>
  );
};

export const Route = createFileRoute("/course/_layout/$courseId")({
  component: Course,
});
