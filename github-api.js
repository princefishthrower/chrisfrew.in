exports.githubApiQuery = `
query($githubUsername: String!, $repositoryName: String!) {
    repository(owner:$githubUsername, name:$repositoryName) {
      object(expression:"master") {
        ... on Commit {
          history {
            totalCount
            edges {
              node {
                commitUrl
                committedDate
              }
            }
          } 
        }
      }
    }
  }
`
