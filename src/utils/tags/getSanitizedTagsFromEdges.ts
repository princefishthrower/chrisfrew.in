import ISanitizedTag from "../../interfaces/ISanitizedTag"

// cleans any typos or laziness in my tag conventions - keep a reference to the original 
// for things like regex needed later
export const getSanitizedTagsFromEdges = (edges: any): Array<ISanitizedTag> => {
    const rawTags = edges.flatMap((x: any) => x.node.frontmatter.tags.split(","))

    return rawTags.map((rawTag: string) => {
        return {
            rawTag,
            sanitizedTag: sanitizeTag(rawTag)
        }
    })
}

export const sanitizeTag = (rawTag: string) => {
    if (rawTag === "javascript") {
        return "JavaScript"
    }
    if (rawTag === "typescript") {
        return "TypeScript"
    }
    if (rawTag === "dotnet") {
        return ".NET"
    }
    if (rawTag === "csharp") {
        return "C#"
    }
    if (rawTag === "nginx") {
        return "NGINX"
    }
    if (rawTag === "bitcoin") {
        return "Bitcoin"
    }
    if (rawTag === "react native") {
        return "React Native"
    }
    if (rawTag === "ssr") {
        return "Server Side Rendering"
    }
    if (rawTag === "react") {
        return "React"
    }
    if (rawTag === "redux") {
        return "Redux"
    }
    if (rawTag === "postgresql" || rawTag === "Postgresql") {
        return "PostgreSQL"
    }
    if (rawTag === "NPM") {
        return "npm"
    }
    if (rawTag === "Npm") {
        return "npm"
    }
    if (rawTag === "github") {
        return "GitHub"
    }
    if (rawTag === "blog") {
        return "Blog Meta"
    }
    if (rawTag === "orm") {
        return "Object-Relational Mapping"
    }
    if (rawTag === "Node.js") {
        return "Node"
    }
    if (rawTag === "devops") {
        return "DevOps"
    }
    if (rawTag === "saas") {
        return "SaaS"
    }
    if (rawTag === "gRPC") {
        return "gRPC"
    }
    if (rawTag === "latex") {
        return "LaTeX"
    }
    return rawTag.trim().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}