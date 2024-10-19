import React from "react";
import Part from "./Part"; // Import the Part component

const Course = ({ course }) => {
  return (
    <div>
      <h2>{course.name}</h2>
      {course.parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  );
};

export default Course;
