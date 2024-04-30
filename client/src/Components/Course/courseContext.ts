import { createContext } from "react";
import { Course } from "../../types/Assignment";

const courseContext = createContext<Course>({
  id: 0,
  assignments: [],
  name: "",
});

export default courseContext;
