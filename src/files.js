// in src/files.js
import React from 'react';
import { List, Filter, Datagrid, DatagridBody, Responsive, SimpleList, SingleFieldList } from 'react-admin';
import { TextField, ImageField, FunctionField, DateField, ArrayField, ChipField, FileField } from 'react-admin';
import { TextInput, BooleanInput, AutocompleteArrayInput } from 'react-admin';
import Helper from './helper.js';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

const PostTitle = ({ record }) => {
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
};

export const FileList = props => (
    <List filters={<FileFilter />} {...props}>
        <Responsive
            small={
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => record.m_users}
                    tertiaryText={record => new Date(record.created).toLocaleDateString()}
                />
            }
            medium={
                <FileDatagrid>
                    <FileField label="File" source="url_private" src="url_private" title="title" target="_blank" />
                    <TextField label="User" source="m_users" />
                    <ArrayField label="Channel" source="m_channels" sortable={false} >
                        <SingleFieldList>
                            <ChipField source="name" />
                        </SingleFieldList>
                    </ArrayField>
                    <ImageField label="Thumbnail" source="thumb_80" sortable={false} />
                    <FunctionField source="size" render={record => Helper.toSizeString(record.size)} />
                    <DateField source="created" locales="fr-FR"/>
                </FileDatagrid>
            }
        />
    </List>
);

const FileFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="name" alwaysOn />
        <AutocompleteArrayInput source="user" choices={ JSON.parse(sessionStorage.getItem('users')) } allowEmpty />
        <AutocompleteArrayInput source="channels" choices={ JSON.parse(sessionStorage.getItem('channels')) } allowEmpty />
    </Filter>
);

const FileDatagridRow = ({ record, resource, id, onToggleItem, children, selected, basePath }) => (
    <TableRow key={id}>
        {/* first column: selection checkbox */}
        <TableCell padding="none">
            {record.user === JSON.parse(localStorage.getItem('auth')).user_id && <Checkbox
                checked={selected}
                onClick={() => onToggleItem(id)}
            />}
        </TableCell>
        {/* data columns based on children */}
        {React.Children.map(children, field => (
            <TableCell key={`${id}-${field.props.source}`}>
                {React.cloneElement(field, {
                    record,
                    basePath,
                    resource,
                })}
            </TableCell>
        ))}
    </TableRow>
)

const FileDatagridBody = props => <DatagridBody {...props} row={<FileDatagridRow />} />;
const FileDatagrid = props => <Datagrid {...props} body={<FileDatagridBody />} />;