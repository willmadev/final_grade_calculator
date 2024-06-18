import React, { FC, useContext } from "react";
import styled from "styled-components";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContextMenuContext } from "../ContextMenu/ContextMenuProvider";
import { Course } from "../../types/Course";
import { MenuItem } from "../../types/Menu";
import { deleteCourse } from "../../api/course";

const StyledCourseLink = styled(Link)`
  font-size: 1.4rem;
  font-weight: 600;
  padding: 5px 15px;
  border-radius: 5px;
  color: black;
  text-decoration: none;

  &:hover {
    background-color: #91a3ff;
    cursor: pointer;
  }
`;

interface CourseLinkProps {
  course: Course;
}

const CourseLink: FC<CourseLinkProps> = ({ course }) => {
  const pathParams = useParams({ strict: false });
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => deleteCourse(course.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      queryClient.invalidateQueries({ queryKey: [`course/${course.id}`] });
      queryClient.invalidateQueries({
        queryKey: [`course/${course.id}/assignment`],
      });
      if (pathParams.courseId && pathParams.courseId === course.id) {
        navigate({ to: "/course" });
      }
    },
  });

  const { setContextMenu } = useContext(ContextMenuContext);
  const menuItems: MenuItem[] = [
    {
      text: "Delete Course",
      onClick() {
        mutation.mutate();
      },
    },
  ];
  return (
    <StyledCourseLink
      onContextMenu={(e) => setContextMenu(e, menuItems)}
      to={`/course/${course.id}`}
    >
      {course.name}
    </StyledCourseLink>
  );
};

export default CourseLink;
