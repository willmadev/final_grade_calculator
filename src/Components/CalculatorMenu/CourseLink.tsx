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
}

const CourseLink: FC<CourseLinkProps> = ({ course, setCurrentCourseId }) => {
  const { setContextMenu } = useContext(ContextMenuContext);
  const handleContextMenu = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const menuItems: MenuItem[] = [
      {
        text: "test",
        onClick() {
          console.log("test clicked");
        },
      },
    ];
    setContextMenu(e, menuItems);
  };
  return (
    <StyledCourseLink
      onClick={() => setCurrentCourseId(course.id)}
      onContextMenu={handleContextMenu}
    >
      {course.name}
    </StyledCourseLink>
  );
};

export default CourseLink;
