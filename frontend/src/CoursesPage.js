import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import AllCoursesTable from './AllCoursesTable';
import EditCoursePopup from './EditCoursePopup';
import AddCoursePopup from './AddCoursePopup';

const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState('allCourses');
  const [myCourses, setMyCourses] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [editCourse, setEditCourse] = useState(null);
  const [showAddCoursePopup, setShowAddCoursePopup] = useState(false);

  const fetchCourses = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:5000/courses/', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setCoursesList(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error.response?.data?.error || error.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = (course) => {
    if (!myCourses.some((c) => c.id === course.id)) {
      course.enrollStatus = true;
      setMyCourses([...myCourses, course]);
    }
  };

  const handleUnenroll = (course) => {
    course.enrollStatus = false;
    setMyCourses(myCourses.filter((c) => c.id !== course.id));
  };

  const handleEditCourse = (course) => {
    setEditCourse(course);
  };
  // const handleEditCourse = async (courseId) => {
  //   try {
  //     const authToken = localStorage.getItem('authToken');
      
  //     const response = await axios.put(`http://localhost:5000/course/${courseId}`, {
  //       headers: {
  //         authorization: `Bearer ${authToken}`,
  //       },
  //     });
  
  //     // After successful update, update the local state to reflect the changes
  //     if (response.status === 200) {
  //       const updatedCourse = response.data;
  //       // Update the course list and myCourses with the updated course data
  //       setCoursesList(coursesList.map(c => c._id === updatedCourse._id ? updatedCourse : c));
  //       setMyCourses(myCourses.map(c => c._id === updatedCourse._id ? updatedCourse : c));
  //       setEditCourse(null); // Close the edit modal after saving
  //     }
  //   } catch (error) {
  //     console.error("Error updating course:", error.response?.data?.error || error.message);
  //     alert("Failed to update course: " + (error.response?.data?.error || error.message));
  //   }
  // };
  

  const handleSaveEdit = (updatedCourse) => {
    const updatedCoursesList = coursesList.map((course) =>
      course._id === updatedCourse._id ? updatedCourse : course
    );
    setCoursesList(updatedCoursesList);
  
    // Update only the course that has been edited in myCourses
    const updatedMyCourses = myCourses.map((course) =>
      course._id === updatedCourse._id ? updatedCourse : course
    );
    setMyCourses(updatedMyCourses);
  
    // Close the edit course popup
    setEditCourse(null);
  
  };

  const handleAddNewCourse = (newCourse) => {
    setCoursesList([...coursesList, newCourse]);
    setShowAddCoursePopup(false);
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      
      const response = await axios.delete(`http://localhost:5000/course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        setCoursesList(coursesList.filter((course) => course._id !== courseId));
        setMyCourses(myCourses.filter((course) => course._id !== courseId));
        console.log("Course deleted successfully:", response.data);
      }
    } catch (error) {
      console.error("Error deleting course:", error.response?.data?.error || error.message);
      alert("Failed to delete course: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto pt-24 px-10">
        <div className="tabs flex items-center justify-start gap-x-6 text border-b-2">
          <button
            className={`tab ${activeTab === 'allCourses' ? 'active' : 'inactive'}`}
            onClick={() => setActiveTab('allCourses')}
          >
            All Courses
          </button>
          <button
            className={`tab ${activeTab === 'myCourses' ? 'active' : 'inactive'}`}
            onClick={() => setActiveTab('myCourses')}
          >
            My Courses
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'allCourses' ? (
            <>
              <button
                className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded mb-4"
                onClick={() => setShowAddCoursePopup(true)}
              >
                Add New Course
              </button>
              <AllCoursesTable
                courses={coursesList}
                showActionButton={true}
                onActionClick={handleEnroll}
                onEditClick={handleEditCourse}
                showDeleteButton={true}
                actionText="Enroll"
                onDeleteClick={(courseId) => handleDeleteCourse(courseId)} 
              />
            </>
          ) : (
            <AllCoursesTable
              courses={myCourses}
              showActionButton={false}
              onUnenrollClick={handleUnenroll}
              onEditClick={handleEditCourse}
              showDeleteButton={false}
            />
          )}
        </div>

        {editCourse && (
          <EditCoursePopup
            course={editCourse}
            onClose={() => setEditCourse(null)}
            onSave={handleSaveEdit}
          />
        )}

        {showAddCoursePopup && (
          <AddCoursePopup
            onClose={() => setShowAddCoursePopup(false)}
            onSave={handleAddNewCourse}
          />
        )}
      </div>
    </div>
  );
};

export default CoursesPage;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Import axios for making requests
// import Navbar from './Navbar';
// import AllCoursesTable from './AllCoursesTable';
// import EditCoursePopup from './EditCoursePopup';
// import AddCoursePopup from './AddCoursePopup';

// const CoursesPage = () => {
//   const [activeTab, setActiveTab] = useState('allCourses');
//   const [myCourses, setMyCourses] = useState([]);
//   const [coursesList, setCoursesList] = useState([]); // Start with an empty list
//   const [editCourse, setEditCourse] = useState(null);
//   const [showAddCoursePopup, setShowAddCoursePopup] = useState(false);

//   // Fetch all courses from the backend
//   const fetchCourses = async () => {
//     try {
//       const authToken = localStorage.getItem('authToken');
//       const response = await axios.get('http://localhost:5000/courses/', {
//         headers: {
//           Authorization: `Bearer ${authToken}`, // Send token for authorization
//         }
//       });
//       setCoursesList(response.data); // Set the fetched courses in state
//     } catch (error) {
//       console.error("Error fetching courses:", error.response?.data?.error || error.message);
//     }
//   };

//   useEffect(() => {
//     fetchCourses(); // Fetch courses when the component mounts
//   }, []);

//   const handleEnroll = (course) => {
//     if (!myCourses.some((c) => c.id === course.id)) {
//       course.enrollStatus = true;
//       setMyCourses([...myCourses, course]);
//     }
//   };

//   const handleUnenroll = (course) => {
//     course.enrollStatus = false;
//     setMyCourses(myCourses.filter((c) => c.id !== course.id));
//   };

//   const handleEditCourse = (course) => {
//     setEditCourse(course);
//   };

//   const handleSaveEdit = (updatedCourse) => {
//     const updatedCoursesList = coursesList.map((c) =>
//       c.id === updatedCourse.id ? updatedCourse : c
//     );
//     setCoursesList(updatedCoursesList);

//     const updatedMyCourses = myCourses.map((c) =>
//       c.id === updatedCourse.id ? updatedCourse : c
//     );
//     setMyCourses(updatedMyCourses);

//     setEditCourse(null);
//   };

//   const handleAddNewCourse = (newCourse) => {
//     setCoursesList([...coursesList, newCourse]);
//     setShowAddCoursePopup(false);
//   };

//   const handleDeleteCourse = async (courseId) => {
//     try {
//       const authToken = localStorage.getItem('authToken');
      
//       // Make a DELETE request to the API to delete the course
//       const response = await axios.delete(`http://localhost:5000/course/${courseId}`, {
//         headers: {
//           Authorization: `Bearer ${authToken}`, // Include the auth token in the headers
//         }
//       });
  
//       // If the deletion was successful, update the courses state
//       if (response.status === 200) {
//         setCoursesList(coursesList.filter((course) => course.id !== courseId));
//         setMyCourses(myCourses.filter((course) => course.id !== courseId));
//         console.log("Course deleted successfully:", response.data);
//       }
//     } catch (error) {
//       console.error("Error deleting course:", error.response?.data?.error || error.message);
//       alert("Failed to delete course: " + (error.response?.data?.error || error.message));
//     }
//   };
//   // const handleDeleteCourse = (courseId) => {
//   //   setCoursesList(coursesList.filter((course) => course.id !== courseId));
//   //   setMyCourses(myCourses.filter((course) => course.id !== courseId));
//   // };

//   return (
//     <div>
//       <Navbar />
//       <div className="container mx-auto pt-24 px-10">

//         {/* Tabs */}
//         <div className="tabs flex items-center justify-start gap-x-6 text border-b-2">
//           <button
//             className={`tab ${activeTab === 'allCourses' ? 'active' : 'inactive'}`}
//             onClick={() => setActiveTab('allCourses')}
//           >
//             All Courses
//           </button>
//           <button
//             className={`tab ${activeTab === 'myCourses' ? 'active' : 'inactive'}`}
//             onClick={() => setActiveTab('myCourses')}
//           >
//             My Courses
//           </button>
//         </div>

//         <div className="mt-6">
//           {activeTab === 'allCourses' ? (
//             <>
//               <button
//                 className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded mb-4"
//                 onClick={() => setShowAddCoursePopup(true)}
//               >
//                 Add New Course
//               </button>
//               <AllCoursesTable
//                 courses={coursesList}
//                 showActionButton={true}
//                 onActionClick={handleEnroll}
//                 onEditClick={handleEditCourse}
//                 showDeleteButton={true}
//                 actionText="Enroll"
//                 onDeleteClick={(courseId) => handleDeleteCourse(courseId)} 
//               />
//             </>
//           ) : (
//             <AllCoursesTable
//               courses={myCourses}
//               showActionButton={false}
//               onUnenrollClick={handleUnenroll}
//               onEditClick={handleEditCourse}
//               showDeleteButton={false}
//             />
//           )}
//         </div>

//         {editCourse && (
//           <EditCoursePopup
//             course={editCourse}
//             onClose={() => setEditCourse(null)}
//             onSave={handleSaveEdit}
//           />
//         )}

//         {showAddCoursePopup && (
//           <AddCoursePopup
//             onClose={() => setShowAddCoursePopup(false)}
//             onSave={handleAddNewCourse}
//           />
//         )}

//       </div>
//     </div>
//   );
// };

// export default CoursesPage;



//------------------------------------------------------------------------------------------------------
// import React, { useState } from 'react'; 
// import Navbar from './Navbar';
// import AllCoursesTable from './AllCoursesTable';
// import EditCoursePopup from './EditCoursePopup';
// import AddCoursePopup from './AddCoursePopup';

// const initialCoursesList = [
//   { id: 1, title: "Math 101", details: "Basic Mathematics", semester: "Fall", enrollStatus: false },
//   { id: 2, title: "Physics 101", details: "Intro to Physics", semester: "Spring", enrollStatus: false },
//   { id: 3, title: "Chemistry 101", details: "Intro to Chemistry", semester: "Fall", enrollStatus: false },
// ];

// const CoursesPage = () => {
//   const [activeTab, setActiveTab] = useState('allCourses');
//   const [myCourses, setMyCourses] = useState([]);
//   const [coursesList, setCoursesList] = useState(initialCoursesList);
//   const [editCourse, setEditCourse] = useState(null);
//   const [showAddCoursePopup, setShowAddCoursePopup] = useState(false);

//   const handleEnroll = (course) => {
//     if (!myCourses.some((c) => c.id === course.id)) {
//       course.enrollStatus = true; 
//       setMyCourses([...myCourses, course]);
//     }
//   };

//   const handleUnenroll = (course) => {
//     course.enrollStatus = false;
//     setMyCourses(myCourses.filter((c) => c.id !== course.id));
//   };

//   const handleEditCourse = (course) => {
//     setEditCourse(course); 
//   };

//   const handleSaveEdit = (updatedCourse) => {
//     const updatedCoursesList = coursesList.map((c) =>
//       c.id === updatedCourse.id ? updatedCourse : c
//     );
//     setCoursesList(updatedCoursesList);

//     const updatedMyCourses = myCourses.map((c) =>
//       c.id === updatedCourse.id ? updatedCourse : c
//     );
//     setMyCourses(updatedMyCourses);

//     setEditCourse(null);
//   };

//   const handleAddNewCourse = (newCourse) => {
//     setCoursesList([...coursesList, newCourse]);
//     setShowAddCoursePopup(false);
//   };

//   const handleDeleteCourse = (courseId) => {
//     setCoursesList(coursesList.filter((course) => course.id !== courseId));
//     setMyCourses(myCourses.filter((course) => course.id !== courseId));
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className='container mx-auto pt-24 px-10 '>

//       {/* Tabs */}
//         <div className="tabs flex items-center justify-start gap-x-6 text border-b-2">
//           <button
//             className={`tab ${activeTab === 'allCourses' ? 'active' : 'inactive'}`}
//             onClick={() => setActiveTab('allCourses')}
//           >
//             All Courses
//           </button>
//           <button
//             className={`tab ${activeTab === 'myCourses' ? 'active' : 'inactive'}`}
//             onClick={() => setActiveTab('myCourses')}
//           >
//             My Courses
//           </button>
//         </div>

//         <div className="mt-6">
//           {activeTab === 'allCourses' ? (
//             <>
//             <button
//               className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded mb-4"
//               onClick={() => setShowAddCoursePopup(true)}
//             >
//               Add New Course
//             </button>
//             <AllCoursesTable
//               courses={coursesList}
//               showActionButton={true}
//               onActionClick={handleEnroll}
//               onEditClick={handleEditCourse}
//               showDeleteButton={true}
//               actionText="Enroll"
//               onDeleteClick={handleDeleteCourse}
//             />
//           </>
//           ) : (
//             <AllCoursesTable
//               courses={myCourses}
//               showActionButton={false} 
//               onUnenrollClick={handleUnenroll}
//               onEditClick={handleEditCourse}
//               showDeleteButton={false}
//             />
//           )}
//         </div>

//         {editCourse && (
//           <EditCoursePopup
//             course={editCourse}
//             onClose={() => setEditCourse(null)}
//             onSave={handleSaveEdit}
//           />
//         )}

//         {showAddCoursePopup && (
//           <AddCoursePopup
//             onClose={() => setShowAddCoursePopup(false)}
//             onSave={handleAddNewCourse}
//           />
//         )}

//       </div>
//     </div>
//   );
// };

// export default CoursesPage;
