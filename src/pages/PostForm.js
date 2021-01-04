import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { Button, Form, FormInput } from 'semantic-ui-react'
import { useForm } from '../utils/hooks'
import { FETCH_POSTS_QUERY } from '../utils/graphql'

const PostForm = () => {
    const [isError, setIsError] = useState()
    const { onSubmit, onChange, values } = useForm(createPostCallback, { body: '' })


    const [createPost] = useMutation(CREATE_POST, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })

            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    getPosts: [result.data.createPost, ...data.getPosts],
                }
            })
            values.body = ''

        },
        onError(err) {
            setIsError(err.graphQLErrors[0].message)
        }

    })

    function createPostCallback() {
        createPost()
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a post:</h2>
                <Form.Field>

                    <FormInput
                        placeholder={isError ? isError : "Enter Post"}
                        name="body"
                        onChange={onChange}
                        value={values.body}
                        error={isError ? true : false}
                    />
                    <Button type="submit" color="teal">Submit</Button>
                </Form.Field>
            </Form>
        </>
    )
}

const CREATE_POST = gql`
    mutation createPost($body: String!){
        createPost(body: $body){
            id
            body
            createdAt
            username
            likes{
                id
                username
                createdAt
            }
            likeCount
            comments{
                id
                body
                username
                createdAt
            }
            commentCount
        }
    }
`

export default PostForm
