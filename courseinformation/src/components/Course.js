import React from 'react'

const Total = (props) => {
  return (
    <p style={{fontWeight:"bold"}}>Total of {props.parts.reduce((accum, part) => accum+= part.exercises, 0)} exercises</p>
  );
};

const Header = (props) => {
  return (
    <h2>{props.course}</h2>
  );
};

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  );
};

const Content = (props) => {
  return (
    <ul style={{padding:0, margin:0}}>
      {props.parts.map((part, i) => (
        <Part key={i} part={part} />
        )
      )}
    </ul>
  );
};

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;