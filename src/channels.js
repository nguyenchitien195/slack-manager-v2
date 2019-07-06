// in src/channels.js
import React from 'react';
import { List, Datagrid, TextField, FunctionField } from 'react-admin';
import Helper from './helper.js';

export const ChannelList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" label="Name" />
            <FunctionField source="created" label="Created" render={record => Helper.convertDate(record.created)}/>
        </Datagrid>
    </List>
);