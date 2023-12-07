import * as React from "react"

// update once per month :)
const stackOverflowCount = 576000
const mediumCount = 325559 + 4808 // was 315559, going to bump 10000 because mediums stats page is broken right now, added 4808 for nov 2023
const youtubeCount = 50300
const blogCount = 26300 // from google search console, 25.7K in the past 16 months
const udemyCount = 3913
const skillshareCount = 695
const substackCount = 738
const codedamnCount = 155
const tutorialspointCount = 18
const newlineCount = 10 // had 6 here, not sure where the analytics on, going to bump to 10
const totalSum =
stackOverflowCount +
    mediumCount +
    youtubeCount +
    blogCount +
    udemyCount +
    skillshareCount +
    substackCount +
    codedamnCount +
    tutorialspointCount +
    newlineCount
// round to one decimal place
const roundedPercentage = Math.round((totalSum / 1000000) * 1000) / 10
// and the last updated string... ex. "June 2023" or "July 2023"
const lastUpdated = "December 2023"

export function MissionText() {
    return (
        <>
            <div>
                <h3
                    style={{
                        margin: "2rem",
                        marginBottom: "1rem",
                        textAlign: "center",
                    }}
                >
                    I'm on a mission to educate{" "}
                    <span className="monokaiRedUnderline">1,000,000</span>
                    <sup><span className="monokaiRedFont">*</span></sup> full stack
                    software engineers around the world. Build your skills with
                    hundreds of hours of video content, hundreds of pages of
                    tutorials, and more.
                </h3>
            </div>
            <div style={{ margin: "1rem", textAlign: "center" }}>
                <sup><span className="monokaiRedFont">*</span></sup>
                {stackOverflowCount.toLocaleString("en-US")}{" "}
                <a
                    className="monokaiRedFont"
                    href="https://stackoverflow.com/users/2805387/fullstackchris"
                >
                    Stack Overflow
                </a>{" "}
                + {mediumCount.toLocaleString("en-US")}{" "}
                <a
                    className="monokaiRedFont"
                    href="https://chrisfrewin.medium.com/"
                >
                    Medium
                </a>{" "}
                + {youtubeCount.toLocaleString("en-US")}{" "}
                <a
                    className="monokaiRedFont"
                    href="https://www.youtube.com/channel/UCLaNEXFBI1wpGtxvGVjfHKw"
                >
                    YouTube
                </a>{" "}
                + {blogCount.toLocaleString("en-US")}{" "}
                <a
                    className="monokaiRedFont"
                    href="https://chrisfrew.in/"
                >
                    This Blog :)
                </a>{" "}
                + {udemyCount.toLocaleString("en-US")}{" "}
                <a
                    className="monokaiRedFont"
                    href="https://www.udemy.com/user/chris-frewin/"
                >
                    Udemy
                </a>{" "}
                + {skillshareCount.toLocaleString("en-US")}{" "}
                <a
                    className="monokaiRedFont"
                    href="https://www.skillshare.com/en/user/christopherfrewin"
                >
                    Skillshare
                </a>{" "}
                + {substackCount.toLocaleString("en-US")}{" "}
                <a
                    className="monokaiRedFont"
                    href="https://amtjoy.substack.com"
                >
                    Substack
                </a>{" "}
                + {codedamnCount.toLocaleString("en-US")}{" "}
                <a
                    className="monokaiRedFont"
                    href="https://codedamn.com/user/chrisfrewin"
                >
                    codedamn
                </a>{" "}
                + {tutorialspointCount.toLocaleString("en-US")}{" "}
                <a
                    className="monokaiRedFont"
                    href="https://www.tutorialspoint.com/profile/christopher_frewin"
                >
                    tutorialspoint
                </a>{" "}
                + {newlineCount.toLocaleString("en-US")}{" "}
                <a
                    className="monokaiRedFont"
                    href="https://www.newline.co/courses/react-use-please-stay-with-react-and-typescript"
                >
                    Newline
                </a>{" "}
                = {totalSum.toLocaleString("en-US")}/1,000,000 = {roundedPercentage}%
                <sup><span className="monokaiRedFont">✞</span></sup>
            </div>
            <div style={{ margin: "1rem", textAlign: "center" }}>
                <small>
                <i><sup><span className="monokaiRedFont">✞</span></sup>Numbers last updated
                {" "}{lastUpdated}</i>
                </small>
            </div>
        </>
    )
}
