import React, { useEffect, useState } from "react";
import api from "../api/axios";

const StudentsList = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get("/students/");
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        fetchStudents();
    }, []);

    return (
        <div>
            <h2>Students List</h2>
            <ul>
                {students.map((student) => (
                    <li key={student.id}>
                        <strong>{student.name}</strong> - {student.picture || "No picture"}<br />
                        Reasons: {student.reasons?.join(", ") || "No reasons provided"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentsList;