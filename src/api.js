const BASE_URL = "https://emp1-jan1-2.onrender.com";

export const getAllStudents = () =>
  fetch(BASE_URL).then(res => res.json());

export const getStudentById = (id) =>
  fetch(`${BASE_URL}/${id}`).then(res => res.json());

export const addStudent = (student) =>
  fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });

export const updateStudent = (id, student) =>
  fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });

export const deleteStudent = (id) =>
  fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
