import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentById, updateStudent } from "../api";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");

  useEffect(() => {
    getStudentById(id).then(s => {
      setName(s.name);
      setCourse(s.course);
    });
  }, [id]);

  const update = () => {
    updateStudent(id, { name, course }).then(() => navigate("/"));
  };

  return (
    <div style={{textAlign:"center", backgroundColor:"lightgrey",padding:"10px"}}>
      <h2>Edit Student</h2>

      Name:
      <input value={name} onChange={e => setName(e.target.value)} />
      <br /><br />
      

      Course:
      <input value={course} onChange={e => setCourse(e.target.value)} />
      <br /><br />
      

      <button onClick={update}>Update</button>
    </div>
  );
}
