import * as React from 'react'
import { memo } from 'react'
import { Helmet } from 'react-helmet'

// TODO: get this to work like kent c dodds:
// https://github.com/kentcdodds/kentcdodds.com/blob/main/src/components/seo/index.js

// absolute everything should come from config or dynamically generated
export default memo(({ title, description, author, organization }) => {
  const baseSchema = [
    {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      url: 'https://wheelscreener.com',
      name: title,
      alternateName: title
    }
  ]

  // TODO: Fix!
  const schema = baseSchema
  // const schema = isBlogPost
  //   ? [
  //       ...baseSchema,
  //       {
  //         '@context': 'http://schema.org',
  //         '@type': 'BreadcrumbList',
  //         itemListElement: [
  //           {
  //             '@type': 'ListItem',
  //             position: 1,
  //             item: {
  //               '@id': url,
  //               name: title,
  //               image
  //             }
  //           }
  //         ]
  //       },
  //       {
  //         '@context': 'http://schema.org',
  //         '@type': 'BlogPosting',
  //         url,
  //         name: title,
  //         alternateName: defaultTitle,
  //         headline: title,
  //         image: {
  //           '@type': 'ImageObject',
  //           url: image
  //         },
  //         description,
  //         author: {
  //           '@type': 'Person',
  //           name: author.name
  //         },
  //         publisher: {
  //           '@type': 'Organization',
  //           url: organization.url,
  //           logo: organization.logo,
  //           name: organization.name
  //         },
  //         mainEntityOfPage: {
  //           '@type': 'WebSite',
  //           '@id': canonicalUrl
  //         },
  //         datePublished
  //       }
  //     ]
  //   : baseSchema

  return (
    <Helmet>
      {/* Schema.org tags */}
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
})
