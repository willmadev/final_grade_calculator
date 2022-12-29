import React, { FC } from "react";
import styled from "styled-components";
import { Course } from "../../types/Assignment";
import CourseLink from "./CourseLink";

const StyledCalculatorMenu = styled.div`
  background-color: #a9b7ff;
  border-radius: 20px 0px 0px 20px;
  box-shadow: 2px 0px 2px 1px rgba(80, 80, 80, 0.15);
  padding: 10px;
  display: grid;
  grid-template-rows: min-content auto min-content;
  gap: 10px;
`;

const Heading = styled.h2`
  margin: 5px 15px;
  font-size: 1.8rem;
`;

const CourseList = styled.div`
  display: flex;
  flex-direction: column;
`;

const CreateCourseButton = styled.a`
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  margin: 10px;
  padding: 5px;
  border-radius: 8px;
  background-color: #7a90ff;

  &:hover {
    background-color: #6a7ee0;
    cursor: pointer;
  }
`;

interface CalculatorMenuProps {
  courses: Course[];
  addCourse: () => void;
  removeCourse: (courseId: number) => void;
  setCurrentCourseId: React.Dispatch<React.SetStateAction<number | null>>;
}

const CalculatorMenu: FC<CalculatorMenuProps> = ({
  courses,
  addCourse,
  setCurrentCourseId,
  removeCourse,
}) => {
  return (
    <StyledCalculatorMenu>
      <Heading>Courses</Heading>
      <CourseList>
        {courses.map((course) => (
          <CourseLink
            key={course.id}
            course={course}
            setCurrentCourseId={setCurrentCourseId}
            removeCourse={removeCourse}
          />
        ))}
      </CourseList>
      <CreateCourseButton onClick={() => addCourse()}>
        Add Course
      </CreateCourseButton>
    </StyledCalculatorMenu>
  );
};

export default CalculatorMenu;
