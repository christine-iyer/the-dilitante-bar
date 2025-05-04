import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDrag, useDrop } from "react-dnd";
import "./App.css";

const ItemTypes = {
  STUDENT: "student",
};

const DraggableStudent = ({ student }) => {
  const emojis = ["🐶", "🐱", "🐻", "🐸", "🐽", "🐯"];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.STUDENT,
    item: { name: student.name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1, border: "1px solid black", padding: "10px", margin: "10px", cursor: "move" , borderRadius: "10px"}}>
       {randomEmoji}  {student.name}
    </div>
  );
};

const WorkshopCard = ({ workshop, onDropStudent }) => {
  const [, dropRef] = useDrop(() => ({
    accept: ItemTypes.STUDENT,
    drop: (item) => onDropStudent(workshop.subject, item.name),
  }));

  return (
    <div ref={dropRef} className="workshop-card">
      <strong>{workshop.subject}</strong><br />
      <small>Date: {workshop.date || "TBD"}</small><br />
      <strong>Instructors:</strong> {workshop.instructors?.join(", ") || "None"}<br />
      <strong>Students:</strong> {workshop.students?.join(", ") || "None"}
    </div>
  );
};


const DEFAULT_STUDENTS = [
  { name: "Laura", reasons: "Edification" },
  { name: "Chris", reasons: "Remedial" },
];

const DEFAULT_INSTRUCTORS = [
  { name: "Proust", bio: "I write and read", skills: [] },
  { name: "Desmond", bio: "", skills: ["bilingual", "written word"] },
  { name: "Hamilton", bio: "", skills: [] },
  { name: "Norton", bio: "", skills: [] },
];

const DEFAULT_WORKSHOPS = [
  { date: "", subject: "Hindi", instructors: ["Norton"], students: [], description: "Learn Somethibg New" },
  { date: "", subject: "PMBA", instructors: ["Desmond"], students: [], description: "Learn Somethibg New" },
  { date: "", subject: "RTP", instructors: ["Proust"], students: [], description: "Learn Somethibg New" },
  { date: "", subject: "Federalist", instructors: ["Hamilton"], students: [], description: "Learn Somethibg New" },
];

function App() {
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: "", reasons: "" });
  const [newInstructor, setNewInstructor] = useState({ name: "", bio: "", skills: [] });
  const [newWorkshop, setNewWorkshop] = useState({ date: "", subject: "" });
  const [skillInput, setSkillInput] = useState("");
  const [selectedWorkshop, setSelectedWorkshop] = useState("");
  const [assignedStudent, setAssignedStudent] = useState("");
  const [assignedInstructor, setAssignedInstructor] = useState("");

  const handleDropStudent = async (subject, studentName) => {
    const workshop = workshops.find((w) => w.subject === subject);
    if (!workshop) return;

    if (workshop.students.includes(studentName)) return;

    if (workshop.students.length >= 10) {
      alert("This workshop is full. Maximum 10 students allowed.");
      return;
    }

    const updatedWorkshop = {
      ...workshop,
      students: [...workshop.students, studentName],
    };

    await updateWorkshop(updatedWorkshop);
  };


  const fallback = () => {
    setStudents(DEFAULT_STUDENTS);
    setInstructors(DEFAULT_INSTRUCTORS);
    setWorkshops(DEFAULT_WORKSHOPS);
  };

  const fetchData = async () => {
    try {
      console.log("Fetching data...");
      const [ws, st, inst] = await Promise.all([
        axios.get("http://127.0.0.1:8000/workshops/"),
        axios.get("http://127.0.0.1:8000/students/"),
        axios.get("http://127.0.0.1:8000/instructors/"),
      ]);
      console.log("Workshops:", ws.data);
      console.log("Students:", st.data);
      console.log("Instructors:", inst.data);
      setWorkshops(ws.data);
      setStudents(st.data);
      setInstructors(inst.data);
    } catch (err) {
      console.error("Error fetching data:", err);
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

    const found = workshops.find((w) => w.subject === selectedWorkshop);
    if (!found) return;

    if (found.students.includes(assignedStudent)) return;

    if (found.students.length >= 10) {
      alert("This workshop is full. Maximum 10 students allowed.");
      return;
    }

    const updated = {
      ...found,
      students: [...found.students, assignedStudent],
      instructors: [...new Set([...found.instructors, assignedInstructor])],
    };

    updateWorkshop(updated);
  };

  return (
    <div className="container">
      <h1>Codebar Management</h1>

      <div className="section">
        <h2>Create Workshop</h2>
        <input placeholder="Date" value={newWorkshop.date} onChange={(e) => setNewWorkshop({ ...newWorkshop, date: e.target.value })} />
        <input placeholder="Subject" value={newWorkshop.subject} onChange={(e) => setNewWorkshop({ ...newWorkshop, subject: e.target.value })} />
        <button onClick={() => postAndRefresh("http://127.0.0.1:8000/workshops", newWorkshop, fetchData)}>Add Workshop</button>
      </div>

      <div className="section">
        <h2>Create Student</h2>
        <input placeholder="Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
        <input placeholder="Reason" value={newStudent.reasons} onChange={(e) => setNewStudent({ ...newStudent, reasons: e.target.value })} />
        <button onClick={() => postAndRefresh("http://127.0.0.1:8000/students", newStudent, fetchData)}>Add Student</button>
      </div>

      <div className="section">
        <h2>Create Instructor</h2>
        <input placeholder="Name" value={newInstructor.name} onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })} />
        <input placeholder="Bio" value={newInstructor.bio} onChange={(e) => setNewInstructor({ ...newInstructor, bio: e.target.value })} />
        <input placeholder="Skill" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} />
        <button onClick={() => {
          if (skillInput.trim()) {
            setNewInstructor({ ...newInstructor, skills: [...newInstructor.skills, skillInput.trim()] });
            setSkillInput("");
          }
        }}>Add Skill</button>
        <button onClick={() => postAndRefresh("http://127.0.0.1:8000/instructors", newInstructor, fetchData)}>Add Instructor</button>
      </div>

      <div className="section">
        <h2>Assign to Workshop</h2>
        <select onChange={(e) => setSelectedWorkshop(e.target.value)} defaultValue="">
          <option value="" disabled>Select Workshop</option>
          {workshops.map((w, i) => <option key={i} value={w.subject}>{w.subject}</option>)}
        </select>
        <select onChange={(e) => setAssignedStudent(e.target.value)} defaultValue="">
          <option value="" disabled>Select Student</option>
          {students.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
        </select>
        <select onChange={(e) => setAssignedInstructor(e.target.value)} defaultValue="">
          <option value="" disabled>Select Instructor</option>
          {instructors.map((inst, i) => <option key={i} value={inst.name}>{inst.name}</option>)}
        </select>
        <button onClick={handleAssign}>Assign</button>
      </div>

      <div className="section">
        <h2>Workshops</h2>
        <ul>
          {workshops.map((w, i) => (
            <li key={i}>
              <strong>{w.subject}</strong> ({w.date || "TBD"})<br />
              Instructors: {w.instructors?.join(", ") || "None"}<br />
              Students: {w.students?.join(", ") || "None"}
            </li>
          ))}
        </ul>
      </div>
      <div className="section">
        <h2>Drag Students</h2>
        {students.map((student, i) => (
          <DraggableStudent key={i} student={student} />
        ))}
      </div>

      <div className="section">
        <h2>Workshops (Drop Students Here)</h2>
        <div className="workshop-grid">
          {workshops.map((w, i) => (
            <WorkshopCard key={i} workshop={w} onDropStudent={handleDropStudent} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;