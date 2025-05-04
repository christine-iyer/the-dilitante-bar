import React, { useState } from "react";
import api from "../api/axios";

const CreateStudent = ({ refreshStudents }) => {
    const [name, setName] = useState("");
    const [reasons, setReasons] = useState([]);
    const [picture, setPicture] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/students/", {
                name,
                reasons,
                picture,
            });
            console.log("Student added successfully");
            setName("");
            setReasons([]);
            setPicture("");
            if (refreshStudents) refreshStudents(); // Refresh the students list
        } catch (error) {
            console.error("Error adding student:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create Student</h2>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label>Reasons:</label>
                <input
                    type="text"
                    value={reasons}
                    onChange={(e) => setReasons(e.target.value.split(","))}
                />
            </div>
            <div>
                <label>Picture URL:</label>
                <input
                    type="text"
                    value={picture}
                    onChange={(e) => setPicture(e.target.value)}
                />
            </div>
            <button type="submit">Add Student</button>
        </form>
    );
};

export default CreateStudent;