import { Link } from "gatsby"
import * as React from "react"

// saved for nostalgia purposes
// update as you wish
// const stackOverflowCount = 652000
// const mediumCount = 362479 // stats are back on medium!
// const youtubeCount = 67566
// const blogCount = 27000 // from google search console, 25.7K in the past 16 months
// const udemyCount = 4725
// const skillshareCount = 708
// const substackCount = 792
// const codedamnCount = 193
// const tutorialspointCount = 19
// const newlineCount = 10 // had 6 here, not sure where the analytics on, going to bump to 10
// const totalSum =
//     stackOverflowCount +
//     mediumCount +
//     youtubeCount +
//     blogCount +
//     udemyCount +
//     skillshareCount +
//     substackCount +
//     codedamnCount +
//     tutorialspointCount +
//     newlineCount

export function MissionText() {
    return (
        <>
            <h3 style={{ color: "#F7D163", textAlign: "center" }}>
                ***NEW: I'm attempting to operate a total of *10* profitable solo SaaS products by the end of 2026! Join me on my journey!
            </h3>
            <Link to="/signup" style={{ textDecoration: "none", display: "block", textAlign: "center", marginTop: "1rem", cursor: "pointer" }}>
                <button style={{ display: "block", margin: "0 auto", backgroundColor: "#F7D163", padding: "0.5rem 1rem", border: "none", borderRadius: "4px", cursor: "pointer" }}>Join My Newsletter</button>
            </Link>
            <p style={{ color: "#F7D163", textAlign: "center" }}>Never Spam, Just-In-The-Weeds SaaS Posts!</p>
        </>
    )
}
