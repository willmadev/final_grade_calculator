import React, { FC, useContext } from "react";
import styled from "styled-components";
import { Course } from "../../types/Assignment";
import { MenuItem } from "../../types/Menu";
import { ContextMenuContext } from "../ContextMenu/ContextMenuProvider";

const StyledCourseLink = styled.a`
  font-size: 1.4rem;
  font-weight: 600;
  padding: 5px 15px;
  border-radius: 5px;

  &:hover {
    background-color: #91a3ff;
    cursor: pointer;
  }
`;

interface CourseLinkProps {
  course: Course;
  setCurrentCourseId: React.Dispatch<React.SetStateAction<number | null>>;
  removeCourse: (courseId: number) => void;
}

const CourseLink: FC<CourseLinkProps> = ({
  course,
  setCurrentCourseId,
  removeCourse,
}) => {
  const { setContextMenu } = useContext(ContextMenuContext);
  const menuItems: MenuItem[] = [
    {
      text: "Delete Course",
      onClick() {
        removeCourse(course.id);
      },
    },
  ];
  return (
    <StyledCourseLink
      onClick={() => setCurrentCourseId(course.id)}
      onContextMenu={(e) => setContextMenu(e, menuItems)}
    >
      {course.name}
    </StyledCourseLink>
  );
};

export default CourseLink;
