import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Assuming you have a CSS file

const DEFAULT_STUDENTS = [
  { full_name: "Laura", reason: "Edification" },
  { full_name: "Chris", reason: "Remedial" },
];

const DEFAULT_INSTRUCTORS = [
  { full_name: "Proust", bio: "I write and read", skills: [] },
  { full_name: "Desmond", bio: "", skills: ["bilingual", "written word"] },
  { full_name: "Hamilton", bio: "", skills: [] },
  { full_name: "Norton", bio: "", skills: [] },
];

const DEFAULT_WORKSHOPS = [
  { date: "", subject: "Hindi", instructors: ["Norton"], students: [] },
  { date: "", subject: "PMBA", instructors: ["Desmond"], students: [] },
  { date: "", subject: "RTP", instructors: ["Proust"], students: [] },
  { date: "", subject: "Federalist", instructors: ["Hamilton"], students: [] },
];

function App() {
  const [students, setStudents] = useState(DEFAULT_STUDENTS);
  const [instructors, setInstructors] = useState(DEFAULT_INSTRUCTORS);
  const [workshops, setWorkshops] = useState(DEFAULT_WORKSHOPS);
  const [newStudent, setNewStudent] = useState({ full_name: "", reason: "" });
  const [newInstructor, setNewInstructor] = useState({ full_name: "", bio: "", skills: [] });
  const [newWorkshop, setNewWorkshop] = useState({ date: "", subject: "" });
  const [skillInput, setSkillInput] = useState("");
  const [selectedWorkshop, setSelectedWorkshop] = useState("");
  const [assignedStudent, setAssignedStudent] = useState("");
  const [assignedInstructor, setAssignedInstructor] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/workshops").then((res) => setWorkshops(res.data)).catch(() => {});
    axios.get("http://127.0.0.1:8000/students").then((res) => setStudents(res.data)).catch(() => {});
    axios.get("http://127.0.0.1:8000/instructors").then((res) => setInstructors(res.data)).catch(() => {});
  }, []);

  const postAndRefresh = async (url, data, refresh) => {
    try {
      await axios.post(url, data);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = () => axios.get("http://127.0.0.1:8000/students").then((res) => setStudents(res.data));
  const fetchInstructors = () => axios.get("http://127.0.0.1:8000/instructors").then((res) => setInstructors(res.data));
  const fetchWorkshops = () => axios.get("http://127.0.0.1:8000/workshops").then((res) => setWorkshops(res.data));

  const handleAssign = () => {
    if (!selectedWorkshop) return;
    const updatedWorkshops = workshops.map((w) => {
      if (w.subject === selectedWorkshop) {
        return {
          ...w,
          students: [...new Set([...w.students, assignedStudent])],
          instructors: [...new Set([...w.instructors, assignedInstructor])],
        };
      }
      return w;
    });
    setWorkshops(updatedWorkshops);
  };

  return (
    <div className="container">
      <h1>Codebar Management</h1>

      <div className="section">
        <h2>Create Workshop</h2>
        <input name="date" value={newWorkshop.date} onChange={(e) => setNewWorkshop({ ...newWorkshop, date: e.target.value })} placeholder="Date" />
        <input name="subject" value={newWorkshop.subject} onChange={(e) => setNewWorkshop({ ...newWorkshop, subject: e.target.value })} placeholder="Subject" />
        <button onClick={() => postAndRefresh("http://127.0.0.1:8000/workshops", newWorkshop, fetchWorkshops)}>Add Workshop</button>
      </div>

      <div className="section">
        <h2>Create Student</h2>
        <input name="full_name" value={newStudent.full_name} onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })} placeholder="Name" />
        <input name="reason" value={newStudent.reason} onChange={(e) => setNewStudent({ ...newStudent, reason: e.target.value })} placeholder="Reason" />
        <button onClick={() => postAndRefresh("http://127.0.0.1:8000/students", newStudent, fetchStudents)}>Add Student</button>
      </div>

      <div className="section">
        <h2>Create Instructor</h2>
        <input name="full_name" value={newInstructor.full_name} onChange={(e) => setNewInstructor({ ...newInstructor, full_name: e.target.value })} placeholder="Name" />
        <input name="bio" value={newInstructor.bio} onChange={(e) => setNewInstructor({ ...newInstructor, bio: e.target.value })} placeholder="Bio" />
        <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Skill" />
        <button onClick={() => {
          setNewInstructor({
            ...newInstructor,
            skills: [...newInstructor.skills, skillInput.trim()],
          });
          setSkillInput("");
        }}>Add Skill</button>
        <button onClick={() => postAndRefresh("http://127.0.0.1:8000/instructors", newInstructor, fetchInstructors)}>Add Instructor</button>
      </div>

      <div className="section">
        <h2>Assign to Workshop</h2>
        <select onChange={(e) => setSelectedWorkshop(e.target.value)} defaultValue="">
          <option value="" disabled>Select Workshop</option>
          {workshops.map((w, i) => <option key={i} value={w.subject}>{w.subject}</option>)}
        </select>

        <select onChange={(e) => setAssignedStudent(e.target.value)} defaultValue="">
          <option value="" disabled>Select Student</option>
          {students.map((s, i) => <option key={i} value={s.full_name}>{s.full_name}</option>)}
        </select>

        <select onChange={(e) => setAssignedInstructor(e.target.value)} defaultValue="">
          <option value="" disabled>Select Instructor</option>
          {instructors.map((inst, i) => <option key={i} value={inst.full_name}>{inst.full_name}</option>)}
        </select>
        <button onClick={handleAssign}>Assign</button>
      </div>

      <div className="section">
        <h2>Workshop Overview</h2>
        <ul>
          {workshops.map((w, i) => (
            <li key={i}>
              <strong>{w.subject}</strong><br />
              Instructors: {w.instructors?.join(", ") || "None"}<br />
              Students: {w.students?.join(", ") || "None"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
