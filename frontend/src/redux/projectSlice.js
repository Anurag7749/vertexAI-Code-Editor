import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
    currentProject: null,
  },
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload; // Fixed casing from CurrentProject
    },
    addNewProject: (state, action) => {
      state.projects.unshift(action.payload);
    },
    starProject: (state, action) => {
      const project = state.projects.find((p) => p._id === action.payload); // Fixed to strict equality ===
      if (project) {
        project.starred = !project.starred;
      }
    },
    setDeleteProject: (state, action) => {
      state.projects = state.projects.filter((p) => p._id !== action.payload);
    },
  },
});

export const {
  setProjects,
  addNewProject,
  starProject,
  setDeleteProject,
  setCurrentProject,
} = projectSlice.actions;

export default projectSlice.reducer;