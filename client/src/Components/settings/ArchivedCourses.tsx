import React, { useEffect, useState } from "react";
import {
  deleteCourses,
  getArchivedCourses,
  updateCourses,
} from "../../api/course";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArchivedCourse, Course } from "../../types/Course";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ArchivedTable = styled.table`
  text-align: left;

  & thead th:nth-child(1) {
    width: 30px;
  }
  & thead th:nth-child(2) {
    width: 200px;
  }

  & tbody tr:hover {
    cursor: pointer;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 5px;
  justify-content: end;
`;

const UnarchiveButton = styled.button`
  font-size: 1rem;
  height: min-content;
  padding: 6px 12px;
  border: none;
  border-radius: 10px;
  background-color: #d9d9d9;

  &:hover:enabled {
    cursor: pointer;
    background-color: #888;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  font-size: 1rem;
  height: min-content;
  padding: 6px 12px;
  border: none;
  border-radius: 10px;
  background-color: rgb(252, 77, 77);

  &:hover:enabled {
    cursor: pointer;
    background-color: rgb(184, 58, 58);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

interface RowProps {
  course: ArchivedCourse;
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
}
const Row = ({ course, selected, setSelected }: RowProps) => {
  const onChange = (e: any) => {
    setSelected((currSelected) => {
      if (selected.findIndex((id) => id === course.id) !== -1) {
        return currSelected.filter((id) => id !== course.id);
      } else {
        return [...currSelected, course.id];
      }
    });
  };
  return (
    <tr onClick={onChange}>
      <td>
        <input
          type="checkbox"
          checked={selected.findIndex((id) => id === course.id) !== -1}
          onChange={onChange}
        />
      </td>
      <td>{course.name}</td>
      <td>{new Date(course.archivedAt).toLocaleDateString()}</td>
    </tr>
  );
};

const ArchivedCourses = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["archivedCourse"],
    queryFn: getArchivedCourses,
  });
  const unarchiveMutation = useMutation({
    mutationFn: () => updateCourses(selected, "unarchive"),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["archivedCourse"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteCourses(selected),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["archivedCourse"] });
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
  });
  const handleUnarchive = () => {
    unarchiveMutation.mutate();
  };
  const handleDelete = () => {
    deleteMutation.mutate();
  };
  return (
    <Container>
      {query.isLoading && <div>Loading archived courses</div>}
      {query.isError && <div>Error loading archived courses</div>}
      {query.isSuccess && query.data?.length === 0 && (
        <div>No archived courses</div>
      )}
      {query.isSuccess && query.data?.length > 0 && (
        <>
          <ArchivedTable>
            <thead>
              <tr>
                <th />
                <th>Course</th>
                <th>Archive Date</th>
              </tr>
            </thead>
            <tbody>
              {query.data?.map((course: ArchivedCourse) => (
                <Row
                  course={course}
                  selected={selected}
                  setSelected={setSelected}
                  key={course.id}
                />
              ))}
            </tbody>
          </ArchivedTable>
          <ActionsContainer>
            <UnarchiveButton
              onClick={handleUnarchive}
              disabled={selected.length === 0}
            >
              Unarchive Course{query.data?.length > 1 && "s"}
            </UnarchiveButton>
            <DeleteButton
              onClick={handleDelete}
              disabled={selected.length === 0}
            >
              Permanently Delete Course{query.data?.length > 1 && "s"}
            </DeleteButton>
          </ActionsContainer>
        </>
      )}
    </Container>
  );
};

export default ArchivedCourses;
