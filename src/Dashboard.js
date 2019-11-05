// in src/Dashboard.js
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

export default () => (
    <Card>
        <CardHeader title="Welcome to the administration" />
        <CardContent>Go to this one to Delete unnecessary files <a href="https://nguyenchitien195.github.io/slack-manager-v2/#/files">File manager</a></CardContent>
    </Card>
);