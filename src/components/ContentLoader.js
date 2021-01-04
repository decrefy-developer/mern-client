import React from 'react'
import Loader from 'react-content-loader'
import { Card, Grid } from 'semantic-ui-react'

function ContentLoader() {
    return (
        <Grid.Column style={{ marginBottom: 20 }}>
            <Card fluid>
                <Card.Content>
                    <Loader
                        speed={2}
                        width={340}
                        viewBox="0 0 400 160"
                        backgroundColor="#f3f3f3"
                        foregroundColor="#bcbec0"
                    // {...props}
                    >
                        <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
                        <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
                        <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
                        <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
                        <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
                        <circle cx="20" cy="20" r="20" />
                    </Loader>
                </Card.Content>
            </Card>
        </Grid.Column>


    )
}

export default ContentLoader
