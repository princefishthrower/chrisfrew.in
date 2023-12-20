import React, { PropsWithChildren } from 'react'

export interface ISEOProps {
  title: string
  description: string
}

export default function SEO(props: PropsWithChildren<ISEOProps>) {
  const { title, description, children } = props
  return (
    <>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/*  Google / Search Engine Tags  */}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content="https://chrisfrew.in/meta.png" />

      <meta property="og:url" content="https://chrisfrew.in" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:image" content="https://chrisfrew.in/meta.png" />
      <meta property="og:description" content={description} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:title" content={"Chris' Full Stack Blog"} />
      <meta name="twitter:card" content="A professional full stack software engineering blog." />
      <meta name="twitter:creator" content="Chris Frewin" />
      <meta name="twitter:description" content={description} />

      {children}
    </>
  )
}
