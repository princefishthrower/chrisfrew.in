import * as React from "react"
import { BioLead } from "../../layout/Bio/BioLead"
import { BioSharedText } from "../../layout/Bio/BioSharedText"
import { CompanyPortfolio } from "../../layout/Bio/CompanyPortfolio"
import { PackagePortfolio } from "../../layout/Bio/PackagePortfolio"
import { ProductPortfolio } from "../../layout/Bio/ProductPortfolio"
import { RepoPortfolio } from "../../layout/Bio/RepoPortfolio"
import { SignatureText } from "../../layout/Bio/SignatureText"
import { SitePortfolio } from "../../layout/Bio/SitePortfolio"
import { SocialsContainer } from "../../layout/Bio/SocialsContainer"
import { TeachingPortfolio } from "../../layout/Bio/TeachingPortfolio"
import { AvatarPicture } from "../../utils/AvatarPicture"
import { ColoredTitle } from "../../utils/ColoredTitle"
export function Chris() {
    return (
        <>
            <ColoredTitle title="👨‍💻 About Me"/>
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
                <PackagePortfolio />
                <RepoPortfolio />
                <SocialsContainer />
                <SignatureText />
            </div>
        </>
    )
}
