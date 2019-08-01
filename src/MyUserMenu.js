import React from 'react';
import { AppBar, UserMenu, MenuItemLink } from 'react-admin';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import SettingsIcon from '@material-ui/icons/Settings';

const myCustomIconStyle = {
    avatar: {
        height: 30,
        width: 30,
    },
};

const MyCustomIcon = withStyles(myCustomIconStyle)(
    ({ classes }) => (
        <div>
            <Avatar
                id="avatar"
                className={classes.avatar}
                src={localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).user.profile.image_32 : ''}
            />
        </div>
    )
);

const MyUserMenu = props => (
    <UserMenu {...props} icon={<MyCustomIcon />}>
        <MenuItemLink
            to="/configuration"
            primaryText="Configuration"
            leftIcon={<SettingsIcon />}
        />
    </UserMenu>
);

export default MyUserMenu;