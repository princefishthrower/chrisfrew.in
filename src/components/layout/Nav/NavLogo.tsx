import { Link } from "gatsby"
import * as React from "react"
import Sparkles from "../../utils/Sparkles"
import Size from "../../../enums/Size"
export interface INavLogoProps {
    size: Size
}

export function NavLogo(props: INavLogoProps) {
    const { size } = props
    const isBlogPage =
        typeof window !== "undefined" &&
        window.location.pathname.includes("/blog/")

    if (size === Size.SMALL) {
        return (
            <>
                <Link
                    style={{
                        boxShadow: `none`,
                        textDecoration: `none`,
                        color: `inherit`,
                    }}
                    to={`/`}
                >
                    {isBlogPage ? (
                        <>Home</>
                    ) : (
                        <>
                            <Sparkles wipeType="alternate">Home</Sparkles>{" "}
                        </>
                    )}
                </Link>
            </>
        )
    }

    return (
        <Link
            style={{
                boxShadow: `none`,
                textDecoration: `none`,
                color: `inherit`,
            }}
            to={`/`}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: size === Size.MEDIUM ? "column" : "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <h3
                    className="whiteFont"
                    style={{
                        display:
                            size === Size.MEDIUM ? "block" : "inline-block",
                        margin: 0,
                        textAlign: size === Size.MEDIUM ? "center" : "left",
                    }}
                >
                    <>Chris' Full Stack Blog</>
                </h3>
                {size === Size.LARGE && (
                    <div className="tiny">
                        • chrisfrew.in • chrisfrewin.com • chrisfrewin.eu •
                    </div>
                )}
            </div>
        </Link>
    )
}
