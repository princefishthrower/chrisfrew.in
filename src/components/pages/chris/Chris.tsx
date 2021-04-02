import { useStaticQuery, graphql } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import * as React from 'react';
import { BioLead } from '../../layout/Bio/BioLead';
import { SaaSPortfolio } from '../../layout/Bio/SaasPortfolio';
import { SitePortfolio } from '../../layout/Bio/SitePortfolio';
import { SocialsContainer } from '../../layout/Bio/SocialsContainer';
import { TeachingPortfolio } from '../../layout/Bio/TeachingPortfolio';
import Sparkles from '../../utils/Sparkles';

export interface IChrisProps {
}

export function Chris (props: IChrisProps) {
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
                marginBottom: `2.5rem`,
                position: `relative`, // for canvas issue
                zIndex: 10, // for canvas issue
            }}
        >
            <BioLead/>
            <TeachingPortfolio/>
            <SocialsContainer/>
            <p>
                You can also check out the homepage for
                <a
                    href="https://fullstackcraft.com"
                    target="_blank"
                    rel="noreferrer"
                >
                    {" "}
                    <Sparkles>Full Stack Craft</Sparkles>
                </a>
                , the company I put all my full stack educational content
                under!
            </p>

            <p>
                If I'm not building SaaS Products or teaching the full stack, I'll be
                found hiking, skiing, taking pictures, losing money on
                options, spoiling homebrew, or creating music and art. I
                (mostly) live in Austria.
            </p>
            <p>
                I'm a proud member of the{" "}
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://dev.to/frewinchristopher"
                >
                    DEV Community
                </a>
                , and{" "}
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://producthunt.com/@galt_"
                >
                    Product Hunt's Makers Community
                </a>
                <SaaSPortfolio />
                <SitePortfolio />
            </p>
        </div>
    </>
)
}
