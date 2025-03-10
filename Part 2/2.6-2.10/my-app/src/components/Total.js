import React from "react";

const Total = ({ parts }) => {
  const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0); // Calculate total exercises

  return (
    <div>
      <p>
        <strong>Total of {totalExercises} exercises</strong>
      </p>
    </div>
  );
};

export default Total;
