import { graphql, Link, useStaticQuery } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import * as React from "react"
import Sparkles from "../../utils/Sparkles"
import Size from "../../../enums/Size"

export interface INavLogoProps {
    size: Size
}

export function NavLogo(props: INavLogoProps) {
    const { size } = props
    const data = useStaticQuery(graphql`
        query NavLogoQuery {
            site {
                siteMetadata {
                    author
                    subtitle
                }
            }
        }
    `)
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
                            <Sparkles
                                wipeType="alternate"
                            >
                                Home
                            </Sparkles>{" "}
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
                    flexDirection: size === Size.MEDIUM ? "column" : "row",
                    alignItems: "center",
                }}
            >
                <StaticImage
                    src="../../images/avatar.jpg"
                    alt={data.site.siteMetadata.author}
                    height={50}
                    width={50}
                    placeholder="blurred"
                    style={{
                        display:
                            size === Size.MEDIUM ? "block" : "inline-block",
                        borderRadius: `100%`,
                        marginRight: size === Size.MEDIUM ? "0" : "1rem",
                        
                    }}
                />
                <h3
                    style={{
                        display:
                            size === Size.MEDIUM ? "block" : "inline-block",
                        fontFamily: `Montserrat, sans-serif`,
                        margin: 0,
                        textAlign: size === Size.MEDIUM ? "center" : "left"
                    }}
                >
                    {isBlogPage ? (
                        <>Chris' Full Stack Blog</>
                    ) : (
                        <>
                            Chris'{" "}
                            <Sparkles
                                wipeType="default"
                            >
                                Full Stack
                            </Sparkles>{" "}
                            Blog
                        </>
                    )}
                    {size === Size.LARGE && (
                        <div className="tiny">
                            • chrisfrew.in • chrisfrewin.com • chrisfrewin.eu •
                        </div>
                    )}
                </h3>
            </div>
        </Link>
    )
}
