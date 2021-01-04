import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Grid, Transition } from 'semantic-ui-react'
import ContentLoader from '../components/ContentLoader'
import PostCard from '../components/PostCard'

import { AuthContext } from '../context/auth'
import PostForm from './PostForm'

import { FETCH_POSTS_QUERY } from '../utils/graphql'

function Home() {
    const { user } = useContext(AuthContext)
    const { loading, data } = useQuery(FETCH_POSTS_QUERY)
    
    let postMarkup;

    if (loading) {
        postMarkup = (
            <div>
                <ContentLoader />
                <ContentLoader />
                <ContentLoader />
            </div>
        )
    } else {
        postMarkup = (
            <Grid stackable columns={3} style={{ marginTop: '10px' }}>
                <Grid.Row className="page-title">
                    <h1>Recent Posts</h1>
                </Grid.Row>

                <Grid.Row>
                    {user && (<Grid.Column><PostForm /></Grid.Column>)}


                    <Transition.Group>
                        {
                            data.getPosts && data.getPosts.map(post => (
                                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                                    <PostCard post={post} />
                                </Grid.Column>))
                        }
                    </Transition.Group>

                </Grid.Row>
            </Grid>
        )
    }

    return (
        <>
            {postMarkup}
        </>
    )
}

export default Home
