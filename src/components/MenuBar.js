import React, { useState, useContext } from 'react'
import { Icon, Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useSubscription } from '@apollo/client'

import { AuthContext } from '../context/auth'
import { COMMENT_SUBSCRIPTION } from '../utils/subscription'

function MenuBar() {
    const { logout, user } = useContext(AuthContext)
    const pathName = window.location.pathname
    const path = pathName === '/' ? 'home' : pathName.substr(1)
    const [activeItem, setActiveItem] = useState(path)
    const [notificationCount, setNotificationCount] = useState(0)
    const handleItemClick = (e, { name }) => setActiveItem(name)

    // const { loading, data } = useSubscription(COMMENT_SUBSCRIPTION)


    const menuBar = user ? (
        <div>
            <Menu pointing secondary size='massive' color='teal'>
                <Menu.Item
                    name={user.username}
                    active
                    as={Link}
                    to="/"
                />
                <Menu.Menu position='right'>
                    <Menu.Item
                        name='logout'
                        onClick={logout}
                    />
                    <Menu.Item>
                        <Icon name='bell outline' style={{ fontSize: '20px' }} />
                        {
                            (notificationCount === 0) ? "" : (<span className="badge">{notificationCount}</span>)
                        }
                    </Menu.Item>
                </Menu.Menu>
            </Menu>

        </div>
    ) : (
            <div>
                <Menu pointing secondary size='massive' color='teal'>
                    <Menu.Item
                        name='home'
                        active={activeItem === 'home'}
                        onClick={handleItemClick}
                        as={Link}
                        to="/"
                    />
                    <Menu.Menu position='right'>
                        <Menu.Item
                            name='login'
                            active={activeItem === 'login'}
                            onClick={handleItemClick}
                            as={Link}
                            to="/login"
                        />
                        <Menu.Item
                            name='register'
                            active={activeItem === 'register'}
                            onClick={handleItemClick}
                            as={Link}
                            to="/register"
                        />

                    </Menu.Menu>
                </Menu>
            </div>
        )
    return menuBar

}

export default MenuBar