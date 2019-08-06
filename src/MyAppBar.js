import React from 'react';
import { AppBar } from 'react-admin';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import MyUserMenu from './MyUserMenu';

const styles = {
    title: {
        flex: 1,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    spacer: {
        flex: 1,
    },
};

const MyAppBar = withStyles(styles)(({ classes, ...props }) => (
    <AppBar {...props} userMenu={<MyUserMenu />}>
        <Typography
            variant="title"
            color="inherit"
            className={classes.title}
            id="react-admin-title"
        />
        <span id="react-admin-header" className={classes.spacer}>{(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).user.profile.display_name : ''}</span>
    </AppBar>
));

export default MyAppBar;