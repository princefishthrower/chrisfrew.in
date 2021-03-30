import * as React from "react"

export interface ITeachingPortfolioProps {}

export function TeachingPortfolio(props: ITeachingPortfolioProps) {
    return (
        <>
            <p>
                Ha! I can prove that I'm a{" "}
                <span style={{ fontWeight: "bold" }}>COURSE MASTER</span> now!
                Check out all my courses and content on:
            </p>
            <p>
                <a href="https://www.skillshare.com/user/christopherfrewin">
                    Skillshare
                </a>
            </p>
            <p>
                <a href="https://www.udemy.com/user/chris-frewin">Udemy</a>
            </p>
            <p>
                <a href="https://www.tutorialspoint.com/videotutorials/profile/christopher_frewin">
                    Tutorialspoint
                </a>
            </p>
            <p>
                <a href="https://www.youtube.com/channel/UCLaNEXFBI1wpGtxvGVjfHKw">
                    YouTube
                </a>
            </p>
        </>
    )
}
