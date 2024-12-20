import React, { useState } from 'react';
import axios from 'axios';

const EditCoursePopup = ({ course, onClose, onSave }) => {
  const [editedCourse, setEditedCourse] = useState(course);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCourse({ ...editedCourse, [name]: value });
  };

  const handleSave = async (editedCourse) => {
    try {
      const authToken = localStorage.getItem('authToken');
      
      const response = await axios.put(`http://localhost:5000/course/${editedCourse._id}`, 
        {
          title: editedCourse.title,
          details: editedCourse.details,
          semester: editedCourse.semester
        }, 
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        onSave(editedCourse); // Trigger onSave callback to update course list or UI
        alert('Course updated successfully');
        onClose(); // Close the popup after saving
      } else {
        throw new Error('Failed to update course');
      }
    } catch (error) {
      console.error('Error updating course:', error.response?.data?.error || error.message);
      alert('Error updating course: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="popup bg-white p-6 rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h3 className="text-xl mb-4">Edit Course</h3>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(editedCourse); }}>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={editedCourse.title}
              onChange={handleChange}
              className="block border p-2 rounded mb-4"
            />
          </label>
          <label>
            Details:
            <input
              type="text"
              name="details"
              value={editedCourse.details}
              onChange={handleChange}
              className="block border p-2 rounded mb-4"
            />
          </label>
          <label>
            Semester:
            <input
              type="text"
              name="semester"
              value={editedCourse.semester}
              onChange={handleChange}
              className="block border p-2 rounded mb-4"
            />
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCoursePopup;



// import React, { useState } from 'react';

// const EditCoursePopup = ({ course, onClose, onSave }) => {
//   const [editedCourse, setEditedCourse] = useState(course);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditedCourse({ ...editedCourse, [name]: value });
//   };

//   const handleSave = async (editedCourse) => {
//     try {
//       const authToken = localStorage.getItem('authToken');
      
//       const response = await axios.put(`http://localhost:5000/course/${editedCourse.id}`, 
//         {
//           title: editedCourse.title,
//           details: editedCourse.details,
//           semester: editedCourse.semester
//         }, 
//         {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         onSave(editedCourse); // Trigger onSave callback to update course list or UI
//         alert('Course updated successfully');
//         onClose(); // Close the popup after saving
//       } else {
//         throw new Error('Failed to update course');
//       }
//     } catch (error) {
//       console.error('Error updating course:', error.response?.data?.error || error.message);
//       alert('Error updating course: ' + (error.response?.data?.error || error.message));
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//     <div className="popup bg-white p-6 rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//       <h3 className="text-xl mb-4">Edit Course</h3>
//       <form onSubmit={(e) => { e.preventDefault(); onSave(editedCourse); }}>
//         <label>
//           Title:
//           <input type="text" name="title" value={editedCourse.title} onChange={handleChange} className="block border p-2 rounded mb-4"/>
//         </label>
//         <label>
//           Details:
//           <input type="text" name="details" value={editedCourse.details} onChange={handleChange} className="block border p-2 rounded mb-4"/>
//         </label>
//         <label>
//           Semester:
//           <input type="text" name="semester" value={editedCourse.semester} onChange={handleChange} className="block border p-2 rounded mb-4"/>
//         </label>
//         <div className="flex gap-4">
//           <button type="button" className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>Cancel</button>
//           <button type="submit" className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded">Save</button>
//         </div>
//       </form>
//     </div>
//     </div>
//   );
// };

// export default EditCoursePopup;
