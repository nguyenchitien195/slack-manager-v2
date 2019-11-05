import React from 'react';
import { List, Datagrid, TextField, ImageField, FileField, FunctionField } from 'react-admin';
import Helper from './helper.js';

export const UserList = props => (
    <List {...props} bulkActionButtons={false} >
        <Datagrid rowClick="edit">
            <FileField label="File" source="profile.image_original" title="avatar" target="_blank" />
            <TextField source="id" label="Id" />
            <ImageField source="profile.image_72" label="Avatar" />
            <TextField source="name" label="user" />
            <TextField source="profile.display_name" label="Display name" />
            <TextField source="profile.phone" label="Phone" />
            <FunctionField source="is_admin" render={user => user.is_admin ? 'Admin' : 'Member'} label="Role" />
            <FunctionField source="deleted" render={user => user.deleted ? 'Deleted' : ''} label="Deleted" />
        </Datagrid>
    </List>
);