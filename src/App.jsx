import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Make sure to create this file

const fallbackStudents = [
  { full_name: "Laura", reason: "Edification" },
  { full_name: "Chris", reason: "Remedial" },
];

const fallbackInstructors = [
  { full_name: "Proust", bio: "I write and read", skills: [] },
  { full_name: "Desmond", bio: "", skills: ["bilingual", "written word"] },
  { full_name: "Hamilton", bio: "", skills: [] },
  { full_name: "Norton", bio: "", skills: [] },
];

const fallbackWorkshops = [
  { date: "2025-03-01", subject: "Hindi", instructors: [{ full_name: "Norton" }], students: [] },
  { date: "2025-03-02", subject: "PMBA", instructors: [{ full_name: "Desmond" }], students: [] },
  { date: "2025-03-03", subject: "RTP", instructors: [{ full_name: "Proust" }], students: [] },
  { date: "2025-03-04", subject: "Federalist", instructors: [{ full_name: "Hamilton" }], students: [] },
];

function App() {
  const [workshops, setWorkshops] = useState([]);
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [selectedWorkshopIndex, setSelectedWorkshopIndex] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/workshops")
      .then((res) => setWorkshops(res.data))
      .catch(() => setWorkshops(fallbackWorkshops));

    axios
      .get("http://127.0.0.1:8000/students")
      .then((res) => setStudents(res.data))
      .catch(() => setStudents(fallbackStudents));

    axios
      .get("http://127.0.0.1:8000/instructors")
      .then((res) => setInstructors(res.data))
      .catch(() => setInstructors(fallbackInstructors));
  }, []);

  const assignStudent = () => {
    if (!selectedStudent) return;
    const updated = [...workshops];
    const studentObj = students.find((s) => s.full_name === selectedStudent);
    if (studentObj) {
      updated[selectedWorkshopIndex].students.push(studentObj);
      setWorkshops(updated);
    }
    setSelectedStudent("");
  };

  const assignInstructor = () => {
    if (!selectedInstructor) return;
    const updated = [...workshops];
    const instructorObj = instructors.find((i) => i.full_name === selectedInstructor);
    if (instructorObj) {
      updated[selectedWorkshopIndex].instructors.push(instructorObj);
      setWorkshops(updated);
    }
    setSelectedInstructor("");
  };

  return (
    <div className="container">
      <h1>Codebar Workshops</h1>

      <div className="section">
        <label>Select Workshop:</label>
        <select
          value={selectedWorkshopIndex}
          onChange={(e) => setSelectedWorkshopIndex(Number(e.target.value))}
        >
          {workshops.map((ws, idx) => (
            <option key={idx} value={idx}>
              {ws.subject}
            </option>
          ))}
        </select>
      </div>

      <div className="section">
        <label>Assign Student:</label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">-- Select Student --</option>
          {students.map((s, i) => (
            <option key={i} value={s.full_name}>
              {s.full_name}
            </option>
          ))}
        </select>
        <button onClick={assignStudent}>Assign</button>
      </div>

      <div className="section">
        <label>Assign Instructor:</label>
        <select
          value={selectedInstructor}
          onChange={(e) => setSelectedInstructor(e.target.value)}
        >
          <option value="">-- Select Instructor --</option>
          {instructors.map((i, idx) => (
            <option key={idx} value={i.full_name}>
              {i.full_name}
            </option>
          ))}
        </select>
        <button onClick={assignInstructor}>Assign</button>
      </div>

      <div className="section">
        <h2>Workshop Details</h2>
        <ul className="workshop-list">
          {workshops.map((ws, idx) => (
            <li key={idx}>
              <strong>{ws.subject}</strong> ({ws.date})<br />
              <em>Instructors:</em> {ws.instructors?.map((i) => i.full_name).join(", ") || "None"}<br />
              <em>Students:</em> {ws.students?.map((s) => s.full_name).join(", ") || "None"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
