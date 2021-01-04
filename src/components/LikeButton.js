import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Icon, Label, Popup } from 'semantic-ui-react'


function LikeButton({ post: { id, likeCount, likes, user } }) {
    const [liked, setLiked] = useState(false)

    const notify = () => toast.error('You need to log in first!');

    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true)
        } else setLiked(false)
    }, [user, likes])


    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id },
        onError(err) {
            notify()
        }
    })

    const likeButton = user ? (
        liked ? (
            <Button color='teal' >
                <Icon name='heart' />
            </Button>
        ) : (
                <Button color='teal' basic>
                    <Icon name='heart' />
                </Button>
            )
    ) : (
            <Button as={Link} to="/login" color='teal' basic>
                <Icon name='heart' />
            </Button>
        )

    return (
        <Button as='div' labelPosition='right' onClick={likePost} >
            <Popup
                content={liked ? 'Unlike' : 'Like'}
                inverted
                trigger={likeButton}
            />
            <Label basic color='teal' pointing='left'>{likeCount}</Label>
        </Button>
    )
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{
                id username
            }
            likeCount
        }
    }
`

export default LikeButton


