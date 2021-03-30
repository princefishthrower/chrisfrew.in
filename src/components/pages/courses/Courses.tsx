import * as React from 'react';
import { colorizeStringBySeparator } from '../../../utils/colorizeStringBySeparator';
import { CourseTiles } from './CourseTiles';

export interface ICoursesProps {
}

export function Courses (props: ICoursesProps) {
  return (
    <>
      <h1 className="cooper">{colorizeStringBySeparator("Full Stack Courses.","")}</h1>
      <h2>Courses for software developers who want to launch their skills beyond the basics.</h2>
      <p>I got tired of seeing the same React todo list app or simple SPA refactoring courses over and over again all over the web. That's why I started my series of Full Stack Courses.</p><p>In each course, I take a deep dive on a specific topic that I've actually used in at least one, but often multiple, production products. In each course, you'll gain insights and wisdom I've gathered over the years as a professional full stack developer.</p>
      <p>Sound interesting? Here are all of the Full Stack Courses I offer:</p>
      <CourseTiles/>
      <p><i>While selling these Full Stack Courses is a primary source of my income and enables me make <b> even more</b> of these courses, I understand if you can't afford a course at any time. Reach out to me at frewin.christopher@gmail.com or hi@fullstackcraft.com and I can grant you access to the full course for free.</i></p>
      <p><i>Additionally, please don't hesitate to get in touch if you have a request for a Full Stack Course in any language or framework - I'll see what I can do.</i></p>
    </>
  );
}
