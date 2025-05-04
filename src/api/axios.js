import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // FastAPI backend URL
});

// Fetch all workshops
export const fetchWorkshops = () => api.get("/workshops/");

// Fetch all students
export const fetchStudents = () => api.get("/students/");

// Fetch all instructors
export const fetchInstructors = () => api.get("/instructors/");

// Create a new workshop
export const createWorkshop = (data) => api.post("/workshops/", data);

// Update a workshop
export const updateWorkshop = (subject, data) => api.put(`/workshops/${subject}`, data);

// Create a new student
export const createStudent = (data) => api.post("/students/", data);

// Create a new instructor
export const createInstructor = (data) => api.post("/instructors/", data);