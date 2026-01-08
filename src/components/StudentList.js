// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { getAllStudents, deleteStudent } from "../api";

// export default function StudentList() {
//   const [students, setStudents] = useState([]);

//   const loadData = () => {
//     getAllStudents().then(setStudents);
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const remove = (id) => {
//     deleteStudent(id).then(loadData);
//   };

//   return (
//     <div>
//       <h2>Student List</h2>

//       <Link to="/add">Add Student</Link>

//       <table border="1" style={{}}>
//         <thead>
//           <tr>
//             <th>ID</th><th>Name</th><th>Course</th><th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {students.map(s => (
//             <tr key={s.id}>
//               <td>{s.id}</td>
//               <td>{s.name}</td>
//               <td>{s.course}</td>
//               <td>
//                 <Link to={`/edit/${s.id}`}>Edit</Link>
//                 <button onClick={() => remove(s.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllStudents, deleteStudent } from "../api";
import "./StudentList.css";

export default function StudentList() {
  const [students, setStudents] = useState([]);

  const loadData = () => {
    getAllStudents().then(data => {
      setStudents(Array.isArray(data) ? data : []);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const remove = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      deleteStudent(id).then(loadData);
    }
  };

  return (
    <div className="container" style={{backgroundColor:"lightgreen"}}>
      <div className="header">
        <h2>Student Managmentsystem</h2>
        <Link to="/add" className="btn add-btn">+ Add Student</Link>
      </div>

      <table className="student-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Course</th>
            {/* <th>mail</th> */}
           
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-data">No students found</td>
            </tr>
          ) : (
            students.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.course}</td>
                {/* <td>{s.email}</td> */}
               
                <td>
                  <Link to={`/edit/${s.id}`} className="btn edit-btn">
                    Edit
                  </Link>
                  <button onClick={() => remove(s.id)} className="btn delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
          <div>
<Link to="https://leetcode.com/u/krishna_vamsi_katta" className="btn add-btn">+ Add Student</Link>
          </div>
    </div>
  );
}
