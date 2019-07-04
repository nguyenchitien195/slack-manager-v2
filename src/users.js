// in src/users.js
import React from 'react';
import { List, Datagrid, TextField, EmailField, ImageField } from 'react-admin';
import MyUrlField from './MyUrlField';

export const UserList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <ImageField source="profile.image_72" label="Avatar" />
            <TextField source="name" label="user" />
            <TextField source="profile.display_name" label="Display name" />
        </Datagrid>
    </List>
);