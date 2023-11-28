import * as React from "react"
import { BioLead } from "../../layout/Bio/BioLead"
import { BioSharedText } from "../../layout/Bio/BioSharedText"
import { CompanyPortfolio } from "../../layout/Bio/Portfolios/CompanyPortfolio"
import { PackagePortfolio } from "../../layout/Bio/Portfolios/PackagePortfolio"
import { ProductPortfolio } from "../../layout/Bio/Portfolios/ProductPortfolio"
import { RepoPortfolio } from "../../layout/Bio/Portfolios/RepoPortfolio"
import { SignatureText } from "../../layout/Bio/SignatureText"
import { SitePortfolio } from "../../layout/Bio/Portfolios/SitePortfolio"
import { SocialsContainer } from "../../layout/Bio/Portfolios/SocialsContainer"
import { TeachingPortfolio } from "../../layout/Bio/Portfolios/TeachingPortfolio"
import { ColoredTitle } from "../../utils/ColoredTitle"
import { BookPortfolio } from "../../layout/Bio/Portfolios/BookPortfolio"

export function Chris() {
    return (
        <>
            <ColoredTitle title="👨‍💻 About Me" />
            <div
                style={{
                    display: `flex`,
                    flexDirection: `column`,
                    marginBottom: `2.5rem`,
                    position: `relative`, // for canvas issue
                    zIndex: 10, // for canvas issue
                }}
            >
                <BioLead />
                <BioSharedText />
                <CompanyPortfolio />
                <BookPortfolio />
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
