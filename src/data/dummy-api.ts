export const dummyApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "GitHub REST API",
    version: "1.0.0",
    description: "API for managing and querying GitHub resources."
  },
  servers: [
    {
      url: "https://api.github.com"
    }
  ],
  paths: {
    "/users/{username}": {
      get: {
        summary: "Get a user",
        operationId: "getUser",
        tags: ["Users"],
        description: "Provides publicly available information about someone with a GitHub account.",
        parameters: [
          {
            name: "username",
            in: "path",
            required: true,
            description: "The handle for the GitHub user account.",
            schema: {
              type: "string",
              default: "octocat"
            }
          }
        ],
        responses: {
          "200": {
            description: "Public user profile information.",
            content: {
              "application/json": {
                example: {
                  login: "octocat",
                  id: 1,
                  avatar_url: "https://github.com/images/error/octocat_happy.gif",
                  html_url: "https://github.com/octocat",
                  name: "monalisa octocat",
                  company: "GitHub",
                  blog: "https://github.com/blog",
                  location: "San Francisco",
                  public_repos: 2,
                  followers: 20,
                  following: 0
                }
              }
            }
          }
        }
      }
    },
    "/users/{username}/repos": {
      get: {
        summary: "List repositories for a user",
        operationId: "listRepos",
        tags: ["Repositories"],
        description: "Lists public repositories for the specified user.",
        parameters: [
          {
            name: "username",
            in: "path",
            required: true,
            description: "The handle for the GitHub user account.",
            schema: {
              type: "string",
              default: "octocat"
            }
          },
          {
            name: "sort",
            in: "query",
            description: "The property to sort the results by.",
            required: false,
            schema: {
              type: "string",
              enum: ["created", "updated", "pushed", "full_name"],
              default: "full_name"
            }
          },
          {
            name: "per_page",
            in: "query",
            description: "The number of results per page (max 100).",
            required: false,
            schema: {
              type: "integer",
              default: 30
            }
          }
        ],
        responses: {
          "200": {
            description: "A list of repositories.",
            content: {
              "application/json": {
                example: [
                  {
                    id: 1296269,
                    name: "Hello-World",
                    full_name: "octocat/Hello-World",
                    html_url: "https://github.com/octocat/Hello-World",
                    description: "This your first repo!",
                    fork: false,
                    stargazers_count: 80,
                    language: null
                  }
                ]
              }
            }
          }
        }
      }
    }
  }
}
