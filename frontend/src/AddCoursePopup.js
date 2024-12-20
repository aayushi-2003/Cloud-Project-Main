import React, { useState } from 'react';
import axios from 'axios';

const AddCoursePopup = ({ onClose, onSave }) => {
  const [newCourse, setNewCourse] = useState({
    id: Math.random(),
    title: "",
    details: "",
    semester: "",
    enrollStatus: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  // const handleSave = () => {
  //   if (newCourse.title && newCourse.details && newCourse.semester) {
  //     onSave(newCourse);
  //   }
  // };

  const handleSave = async () => {
    if (newCourse.title && newCourse.details && newCourse.semester) {
      try {
        // Get the auth token from localStorage
        const authToken = localStorage.getItem('authToken');
  
        // Make a POST request to the API to create the course, adding the auth token in the headers
        const response = await axios.post(
          'http://localhost:5000/course',
          {
            title: newCourse.title,
            details: newCourse.details,
            semester: newCourse.semester,
            enrollstatus: newCourse.enrollStatus,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Add the token to the headers
            },
          }
        );
  
        console.log("Course created successfully:", response.data);
        onSave(response.data); // Call onSave with the newly created course
        onClose(); // Close the popup after saving
      } catch (error) {
        console.error("Failed to create course:", error.response?.data?.error || error.message);
        alert("Failed to create course: " + (error.response?.data?.error || error.message));
      }
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Add New Course</h2>
        <input
          name="title"
          placeholder="Course Title"
          value={newCourse.title}
          onChange={handleChange}
          className="mb-2 w-full p-2 border rounded"
        />
        <input
          name="details"
          placeholder="Course Details"
          value={newCourse.details}
          onChange={handleChange}
          className="mb-2 w-full p-2 border rounded"
        />
        <input
          name="semester"
          placeholder="Semester"
          value={newCourse.semester}
          onChange={handleChange}
          className="mb-4 w-full p-2 border rounded"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCoursePopup;
