import React from 'react';
import { List, Datagrid, TextField, ImageField, FileField } from 'react-admin';

export const UserList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <FileField label="File" source="profile.image_original" title="avatar" target="_blank" />
            <TextField source="id" label="Id" />
            <ImageField source="profile.image_72" label="Avatar" />
            <TextField source="name" label="user" />
            <TextField source="profile.display_name" label="Display name" />
        </Datagrid>
    </List>
);