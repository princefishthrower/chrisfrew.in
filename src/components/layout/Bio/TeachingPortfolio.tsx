import * as React from "react"

export function TeachingPortfolio() {
    return (
        <>
            <p>
                Ha! I can prove that I'm a{" "}
                <span style={{ fontWeight: "bold" }}>COURSE MASTER</span> now!
                Check out all my courses, content, and socials on:
            </p>
            <div className="course-profile-container">
                <a href="https://www.skillshare.com/user/christopherfrewin">
                    Skillshare
                </a>
                &nbsp; | &nbsp;
                <a href="https://www.udemy.com/user/chris-frewin">Udemy</a>
                &nbsp; | &nbsp;
                <a href="https://www.tutorialspoint.com/videotutorials/profile/christopher_frewin">
                    Tutorialspoint
                </a>
                &nbsp; | &nbsp;
                <a href="https://www.youtube.com/channel/UCLaNEXFBI1wpGtxvGVjfHKw">
                    YouTube
                </a>
            </div>
        </>
    )
}
