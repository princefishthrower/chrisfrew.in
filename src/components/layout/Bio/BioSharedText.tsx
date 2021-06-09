import { Link } from "gatsby"
import * as React from "react"
import Sparkles from "../../utils/Sparkles"

// used for both the bio component and on the about page
export function BioSharedText() {
    return (
        <>
            <p>
                <strong>
                    Ah... 😌 I still remember opening up my very first Bash
                    terminal on Ubuntu... it was late summer, in Cornell's
                    Engineering Quad... in short...
                </strong>
            </p>
            <div className="text-center">
                <Sparkles wipeType="love">It was love</Sparkles>
            </div>
            <div className="text-center">
                <Sparkles wipeType="love">at first sight!</Sparkles>
            </div>
            <p>
                Ever since that first Ubuntu experience, I've been in love with
                writing software and{" "}
                <strong>
                    I've learned an extensive variety of frameworks, databases,
                    design patterns, and languages
                </strong>
                , including TypeScript, JavaScript, .NET, Python, React, Redux,
                ABAP, SAPUI5 UI5, C#, PHP7, Postgresql, Magento, and more. I
                love the challenge of building profitable SaaS products!
            </p>
            <p>
                <strong>I'm also a full stack software educator.</strong> I
                cherish teaching what I've learned over the years, because I
                think software development is especially difficult these days,
                with all the new tools and frameworks that seem to come out
                daily.
            </p>
            <p>
                My current teaching efforts are being poured into drafting my book and course,{" "}
                <Link to="/book">Full Stack SaaS Product Cookbook</Link>, which
                will be released soon. In this book, I take you step by step
                from boilerplate to finished product, on the entire software
                development lifecycle behind{" "}
                <a href="https://reduxplate.com">ReduxPlate</a>, a Redux code
                generator.
            </p>
            <p>
                With all my courses, I focus on both advanced and niche topics and
                in each course I always make considerations into the broader
                backdrop of the entire full stack software ecosystem. If such
                courses sound interesting to you, please checkout my{" "}
                <Link to="/courses">Full Stack Courses</Link>.
            </p>
            <p>
                I don't want anyone to be intimated by the noise of the software
                world - I too struggle and reach out from time to time for help
                and mentoring. To this end, I try to make my courses as clear as
                possible so you don't get lost or confused. I also avoid the
                theoretical - I offer real world examples far beyond the
                overused 'todo list' app example.
            </p>
        </>
    )
}
