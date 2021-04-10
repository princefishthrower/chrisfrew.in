import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import * as React from "react"
import { BioLead } from "../../layout/Bio/BioLead"
import { CompanyPortfolio } from "../../layout/Bio/CompanyPortfolio"
import { ProductPortfolio } from "../../layout/Bio/ProductPortfolio"
import { SitePortfolio } from "../../layout/Bio/SitePortfolio"
import { SocialsContainer } from "../../layout/Bio/SocialsContainer"
import { TeachingPortfolio } from "../../layout/Bio/TeachingPortfolio"

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

    return (
        <>
            <StaticImage
                src={"../../../images/avatar.jpg"}
                alt={data.site.siteMetadata.author}
                width={260}
                height={260}
                layout="fixed"
                placeholder="blurred"
                style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    borderRadius: `100%`,
                    marginBottom: "1rem",
                }}
            />
            <div
                style={{
                    display: `flex`,
                    flexDirection: `column`,
                    textAlign: 'center',
                    marginBottom: `2.5rem`,
                    position: `relative`, // for canvas issue
                    zIndex: 10, // for canvas issue
                }}
            >
                <BioLead />
                <p>
                    If I'm not building SaaS Products or teaching full stack
                    software engineering, I'll can be found doing any or all of the following:
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
            </div>
        </>
    )
}
