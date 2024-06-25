import React, { FC, useContext, useState } from "react";
import styled from "styled-components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaCheck, FaTimes } from "react-icons/fa";

import { getCourse, updateCourse } from "../../api/course";
import { Course } from "../../types/Course";

const StyledTitleEditor = styled.form`
  display: flex;
  justify-content: space-between;
  position: relative;
`;

const TitleInput = styled.input`
  margin: 0px -10px;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 1.8rem;
  font-weight: bolder;
  width: 100%;
  border: none;
  border-bottom: 2px solid black;
  border-radius: 0px;
  background-color: rgba(0, 0, 0, 0);
  &:focus {
    outline: none;
  }
`;

const ButtonsContainer = styled.div`
  position: absolute;
  right: 0px;
  bottom: 5px;
  display: flex;
  gap: 5px;
`;

const ButtonWrapper = styled.button`
  width: 35px;
  height: 35px;

  &:hover {
    cursor: pointer;
  }
`;

interface CourseTitleEditorProps {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  courseId: number;
}

const CourseTitleEditor: FC<CourseTitleEditorProps> = ({
  setIsEditing,
  courseId,
}) => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: [`course/${courseId}`],
    queryFn: () => getCourse(courseId),
  });
  const mutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      queryClient.invalidateQueries({ queryKey: [`course/${courseId}`] });
    },
    onMutate: async ({ courseId, course }) => {
      await queryClient.cancelQueries({
        queryKey: [`course`],
      });
      await queryClient.cancelQueries({
        queryKey: [`course/${courseId}`],
      });
      const previousCourses = queryClient.getQueryData([`course`]);
      const previousCourse = queryClient.getQueryData([`course/${courseId}`]);
      queryClient.setQueryData([`course`], (old: Course[]) =>
        old.map((val) => {
          if (val.id !== courseId) return val;
          else return { ...val, ...course };
        })
      );
      queryClient.setQueryData([`course/${courseId}`], (old: Course) => ({
        ...old,
        ...course,
      }));
      return { previousCourse, previousCourses };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      queryClient.invalidateQueries({
        queryKey: [`course/${courseId}`],
      });
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData([`course`], context?.previousCourses);
      queryClient.setQueryData([`course/${courseId}`], context?.previousCourse);
    },
  });
  const [title, setTitle] = useState(query.data.name);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ courseId, course: { name: title } });
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsEditing(false);
  };
  return (
    <StyledTitleEditor onSubmit={handleSubmit}>
      <TitleInput
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ButtonsContainer>
        <ButtonWrapper type="submit">
          <FaCheck />
        </ButtonWrapper>
        <ButtonWrapper type="button" onClick={handleCancel}>
          <FaTimes />
        </ButtonWrapper>
      </ButtonsContainer>
    </StyledTitleEditor>
  );
};

export default CourseTitleEditor;
