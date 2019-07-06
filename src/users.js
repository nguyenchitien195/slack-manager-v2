// in src/users.js
import React from 'react';
import { List, Datagrid, TextField, EmailField, ImageField, FunctionField } from 'react-admin';
import Helper from './helper.js';

export const UserList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" label="Id" />
            <ImageField source="profile.image_72" label="Avatar" />
            <TextField source="name" label="user" />
            <TextField source="profile.display_name" label="Display name" />
        </Datagrid>
    </List>
);