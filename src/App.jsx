import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

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
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [newStudent, setNewStudent] = useState({ full_name: "", reason: "" });
  const [newInstructor, setNewInstructor] = useState({ full_name: "", bio: "", skills: [] });
  const [newWorkshop, setNewWorkshop] = useState({ date: "", subject: "" });
  const [skillInput, setSkillInput] = useState("");
  const [selectedWorkshop, setSelectedWorkshop] = useState("");
  const [assignedStudent, setAssignedStudent] = useState("");
  const [assignedInstructor, setAssignedInstructor] = useState("");

  const fallback = () => {
    setStudents(DEFAULT_STUDENTS);
    setInstructors(DEFAULT_INSTRUCTORS);
    setWorkshops(DEFAULT_WORKSHOPS);
  };

  const fetchData = async () => {
    try {
      const [ws, st, inst] = await Promise.all([
        axios.get("http://127.0.0.1:8000/workshops"),
        axios.get("http://127.0.0.1:8000/students"),
        axios.get("http://127.0.0.1:8000/instructors"),
      ]);
      setWorkshops(ws.data);
      setStudents(st.data);
      setInstructors(inst.data);
    } catch {
      fallback();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const postAndRefresh = async (url, data, refresh) => {
    try {
      await axios.post(url, data);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const updateWorkshop = async (workshop) => {
    try {
      await axios.put(`http://127.0.0.1:8000/workshops/${workshop.subject}`, workshop);
      fetchData();
    } catch (err) {
      console.error("Failed to update workshop:", err);
    }
  };

  const handleAssign = () => {
    if (!selectedWorkshop) return;

    const updated = workshops.map((w) => {
      if (w.subject === selectedWorkshop) {
        const updatedWorkshop = {
          ...w,
          students: [...new Set([...w.students, assignedStudent])],
          instructors: [...new Set([...w.instructors, assignedInstructor])],
        };
        updateWorkshop(updatedWorkshop);
        return updatedWorkshop;
      }
      return w;
    });

    setWorkshops(updated);
  };

  return (
    <div className="container">
      <h1>Codebar Management</h1>

      {/* Workshop Form */}
      <div className="section">
        <h2>Create Workshop</h2>
        <input name="date" value={newWorkshop.date} onChange={(e) => setNewWorkshop({ ...newWorkshop, date: e.target.value })} placeholder="Date" />
        <input name="subject" value={newWorkshop.subject} onChange={(e) => setNewWorkshop({ ...newWorkshop, subject: e.target.value })} placeholder="Subject" />
        <button onClick={() => postAndRefresh("http://127.0.0.1:8000/workshops", newWorkshop, fetchData)}>Add Workshop</button>
      </div>

      {/* Student Form */}
      <div className="section">
        <h2>Create Student</h2>
        <input name="full_name" value={newStudent.full_name} onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })} placeholder="Name" />
        <input name="reason" value={newStudent.reason} onChange={(e) => setNewStudent({ ...newStudent, reason: e.target.value })} placeholder="Reason" />
        <button onClick={() => postAndRefresh("http://127.0.0.1:8000/students", newStudent, fetchData)}>Add Student</button>
      </div>

      {/* Instructor Form */}
      <div className="section">
        <h2>Create Instructor</h2>
        <input name="full_name" value={newInstructor.full_name} onChange={(e) => setNewInstructor({ ...newInstructor, full_name: e.target.value })} placeholder="Name" />
        <input name="bio" value={newInstructor.bio} onChange={(e) => setNewInstructor({ ...newInstructor, bio: e.target.value })} placeholder="Bio" />
        <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Skill" />
        <button onClick={() => {
          if (skillInput.trim()) {
            setNewInstructor({
              ...newInstructor,
              skills: [...newInstructor.skills, skillInput.trim()],
            });
            setSkillInput("");
          }
        }}>Add Skill</button>
        <button onClick={() => postAndRefresh("http://127.0.0.1:8000/instructors", newInstructor, fetchData)}>Add Instructor</button>
      </div>

      {/* Assignment Section */}
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

      {/* Display Workshops */}
      <div className="section">
        <h2>Workshop Overview</h2>
        <ul>
          {workshops.map((w, i) => (
            <li key={i}>
              <strong>{w.subject}</strong><br />
              <small>Date: {w.date || "TBD"}</small><br />
              <strong>Instructors:</strong> {w.instructors?.join(", ") || "None"}<br />
              <strong>Students:</strong> {w.students?.join(", ") || "None"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
