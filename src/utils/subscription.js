
import gql from "graphql-tag";

export const COMMENT_SUBSCRIPTION = gql`
subscription GET_POSTS{
    newPost{
    id
    body
    username
    createdAt
  }
}
`
