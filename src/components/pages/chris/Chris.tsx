import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import * as React from "react"
import { Fade } from "react-awesome-reveal"
import { ThemeContext } from "../../../context/ThemeContext"
import { colorizeStringBySeparator } from "../../../utils/colorizeStringBySeparator"
import { BioLead } from "../../layout/Bio/BioLead"
import { BioSharedText } from "../../layout/Bio/BioSharedText"
import { CompanyPortfolio } from "../../layout/Bio/CompanyPortfolio"
import { ProductPortfolio } from "../../layout/Bio/ProductPortfolio"
import { SignatureText } from "../../layout/Bio/SignatureText"
import { SitePortfolio } from "../../layout/Bio/SitePortfolio"
import { SocialsContainer } from "../../layout/Bio/SocialsContainer"
import { TeachingPortfolio } from "../../layout/Bio/TeachingPortfolio"
import { AvatarPicture } from "../../utils/AvatarPicture"
export function Chris() {
    const data = useStaticQuery(graphql`
        query ChrisQuery {
            site {
                siteMetadata {
                    author
                }
            }
        }
    `)
    const { themeBodyClass } = React.useContext(ThemeContext)
    const titleContent = colorizeStringBySeparator(
        themeBodyClass,
        "👨‍💻 About Me",
        "",
        0,
        true
    )

    return (
        <>
            <h1 className="cooper big">
                <Fade
                    cascade={true}
                    damping={0.025}
                    duration={1000}
                    direction="up"
                    style={{ display: "inline" }}
                >
                    {titleContent}
                </Fade>
            </h1>
            <AvatarPicture
                style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    borderRadius: `100%`,
                    marginBottom: "1rem",
                    width: "200px",
                    height: "auto",
                }}
            />
            <div
                style={{
                    display: `flex`,
                    flexDirection: `column`,
                    textAlign: "center",
                    marginBottom: `2.5rem`,
                    position: `relative`, // for canvas issue
                    zIndex: 10, // for canvas issue
                }}
            >
                <BioLead />
                <BioSharedText />
                <p>
                    <strong>
                        If I'm not building SaaS Products or teaching full stack
                        software engineering, I'll can be found doing any or all
                        of the following:
                    </strong>
                </p>
                <ul>
                    <li>🚶‍♂️ hiking</li>
                    <li> ⛷️ skiing</li>
                    <li>📸 taking pictures</li>
                    <li>📉 losing money on options</li>
                    <li>🍺 spoiling homebrew</li>
                    <li>🎼 writing music</li>
                    <li>🎨 creating art</li>
                </ul>
                <p>
                    I'm from the 🇺🇸 United States, but (mostly) live in 🇦🇹
                    Austria.
                </p>
                <CompanyPortfolio />
                <TeachingPortfolio />
                <ProductPortfolio />
                <SitePortfolio />
                <SocialsContainer />
                <SignatureText />
            </div>
        </>
    )
}
