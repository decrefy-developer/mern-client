import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import React, { useContext, useRef, useState } from 'react'
import { Button, Card, Form, Grid, Icon, Image, Label, Transition } from 'semantic-ui-react'
import moment from 'moment'

import ContentLoader from '../components/ContentLoader'
import { AuthContext } from '../context/auth'
import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton'


function SinglePost(props) {
    const [comment, setComment] = useState('')
    const commentInputRef = useRef(null)
    const { user } = useContext(AuthContext)
    const postId = props.match.params.postId
    const { loading, data } = useQuery(FETCH_POST_QUERY, {
        variables: { postId }
    })

    function deletePostCallback() {
        props.history.push('/')
    }

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update() {
            setComment('')
            commentInputRef.current.blur()
        },
        variables: {
            postId,
            body: comment
        }
    })

    let postMarkup;

    if (loading) {
        postMarkup = (
            <Grid padded>
                <Grid.Row>
                    <Grid.Column>
                        <ContentLoader />
                    </Grid.Column>
                </Grid.Row>
            </Grid>)

    } else {
        const { id, likeCount, likes, username, createdAt, body, comments, commentCount } = data.getPost

        postMarkup = (
            <Grid padded>
                <Grid.Row>
                    <Grid.Column width={2} >
                        <Image src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                            size="small"
                            float="right"
                        />
                    </Grid.Column>
                    <Grid.Column width={12} >
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />

                            <Card.Content extra>
                                <LikeButton post={{ id, likeCount, likes, user }} />
                                <Button as="div"
                                    labelPosition="right"
                                    onClick={() => console.log('comment on post')}>
                                    <Button color="blue" basic>
                                        <Icon name="comments" />
                                    </Button>

                                    <Label color="blue" basic pointing='left'>
                                        {commentCount}
                                    </Label>
                                </Button>

                                {
                                    user && user.username === username && (
                                        <DeleteButton postId={id} callback={deletePostCallback} />
                                    )
                                }
                            </Card.Content>
                        </Card>

                        {
                            user && (
                                <Card fluid>
                                    <Card.Content>
                                        <p>Post a comment</p>
                                        <Form>
                                            <div className="ui action input fluid">
                                                <input
                                                    type="text"
                                                    placeholder="Comment..."
                                                    name="comment"
                                                    value={comment}
                                                    onChange={(event) => setComment(event.target.value)}
                                                    ref={commentInputRef}
                                                />
                                                <button
                                                    type="submit"
                                                    className="ui button teal"
                                                    disabled={comment.trim() === ''}
                                                    onClick={submitComment}
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </Form>
                                    </Card.Content>
                                </Card>
                            )
                        }

                        <Transition.Group>
                            {
                                comments.map((comment) => (
                                    <Card key={comment.id} fluid>
                                        <Card.Content>
                                            {
                                                user && user.username === comment.username && (
                                                    <DeleteButton postId={id} commentId={comment.id} />
                                                )
                                            }
                                            <Card.Header>{comment.username}</Card.Header>
                                            <Card.Meta>{moment(comment.createdAt).fromNow(true)}</Card.Meta>
                                            <Card.Description>{comment.body}</Card.Description>
                                        </Card.Content>
                                    </Card>
                                ))
                            }
                        </Transition.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }



    return (
        <div>
            {postMarkup}
        </div>
    )
}

const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postId: ID!, $body: String!){
        createComment(postId: $postId, body: $body){
            id
            comments{
                id
                body
                createdAt
                username
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id 
            body 
            username 
            likeCount
            likes{
                username
            }
            commentCount
            comments{
                id
                username
                createdAt
                body
            }
        }
    }
`

export default SinglePost
