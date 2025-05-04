import React, { useState, useEffect } from "react";
import StudentsList from "./components/StudentsList";
import CreateStudent from "./components/CreateStudent";
import api from "./api/axios";

function App() {
    const [students, setStudents] = useState([]);

    const fetchStudents = async () => {
        try {
            const response = await api.get("/students/");
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="container">
            <h1>Codebar Management</h1>

            {/* Create Student Section */}
            <div className="section">
                <CreateStudent refreshStudents={fetchStudents} />
            </div>

            {/* Students List Section */}
            <div className="section">
                <StudentsList />
            </div>
        </div>
    );
}

export default App;