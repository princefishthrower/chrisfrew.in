module.exports = {
    siteTitle: "Chris' Full Stack Blog", // Navigation and Site Title
    subtitle: 'A professional full stack software engineering blog.', // Alternative Site title for SEO
    subsubtitle: 'Detailed - and working! - full stack software tutorials, walk-throughs, and more - battle-tested and directly from the front lines of industrial, startup, and SaaS product full stack software development.',
    description: 'A professional, high-quality, full stack software engineering blog. Featuring JavaScript, TypeScript, React, C#, ABAP, and everything in between.',
    siteTitleShort: 'chrisfrew.in', // short_name for manifest
    siteUrl: process.env.ROOT_URL || 'https://chrisfrew.in', // Domain of your site. No trailing slash!
    lang: 'en', // Language Tag on <html> element
    pathPrefix: '/',
    siteLogo: 'images/maskable_icon.png', // Used for SEO and manifest, path to your image you placed in the 'static' folder
    siteDescription:
      "Become a better full stack software engineer. Check out Chris' Full Stack Blog!",
    minibio: `
      <strong>Chris Frewin</strong> is a senior full stack software engineer and
      educator. He's taught hundreds of people topics from Advanced TypeScript techniques, to Gatsby JS and React. If he's not building SaaS Products or teaching full stack software engineering, he can be found hiking, skiing, taking pictures, losing money on options, spoiling homebrew, writing music, or creating art. He's from the United States, but (mostly) lives in Austria. 
    `,
    author: 'Chris Frewin', // Author for schemaORGJSONLD
    organization: 'Full Stack Craft LLC',
    subscriptionUrl: 'https://chrisfrew.us19.list-manage.com/subscribe/post?u=5f7289fbe97df30f673068826&amp;id=b1729bbdce',
  
    // siteFBAppID: '123456789', // Facebook App ID - Optional
    userTwitter: '@fullStackChris_', // Twitter Username
    ogSiteName: "Chris' Full Stack Blog", // Facebook Site Name
    ogLanguage: 'en_US',
  
    // Manifest and Progress color
    themeColor: '#F92672',
    backgroundColor: '#191919',
  
    // Social component
    twitter: 'https://twitter.com/fullStackChris_',
    twitterHandle: '@fullStackChris_',
    github: 'https://github.com/princefishthrower/',
    linkedin: 'https://www.linkedin.com/in/frewinchristopher/',
    youtube: 'https://www.youtube.com/channel/UCLaNEXFBI1wpGtxvGVjfHKw',
    rss: 'https://chrisfrew.in/rss.xml',
  }