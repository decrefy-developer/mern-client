import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Icon, Confirm } from 'semantic-ui-react'

import { FETCH_POSTS_QUERY } from '../utils/graphql'

function DeleteButton({ postId, commentId, callback }) {
    const [confirmOpen, setConfirmOpen] = useState(false)

    const notify = () => toast('The data has been deleted successfully!')

    const DELETE_MUTATION = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

    const [deletePostOrComments] = useMutation(DELETE_MUTATION, {
        update(proxy, result) {
            setConfirmOpen(false)
            if (!commentId) {
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                })

                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {
                        getPosts: data.getPosts.filter((post) => post.id !== postId)
                    }
                })
            }
            if (callback) callback()
            notify()
        },
        variables: {
            postId,
            commentId
        }
    })
    return (
        <>
            <Button color="google plus" onClick={() => setConfirmOpen(true)} floated="right">
                <Icon name="trash" style={{ margin: 0 }} />
            </Button>

            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrComments}
            />
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletPost($postId: ID!){
        deletePost(postId: $postId)
    }
`

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments{
                id
                username
                createdAt
                body
            }
            commentCount
        }
    }
`

export default DeleteButton
