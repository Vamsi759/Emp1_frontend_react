import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addStudent } from "../api";

export default function AddStudent() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const navigate = useNavigate();

  const save = () => {
    addStudent({ name, course }).then(() => navigate("/"));
  };

  return (
    <div style={{textAlign:"center",backgroundColor:"lightcyan",padding:"10px"}}>
      <h2>Add Student</h2>

      Name:
      <input value={name} onChange={e => setName(e.target.value)} />
      <br /><br />

      Course:
      <input value={course} onChange={e => setCourse(e.target.value)} />
      <br /><br />

      <button onClick={save}>Save</button>
    </div>
  );
}
