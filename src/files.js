// in src/files.js
import React from 'react';
import { List, Edit, Create, Filter, Datagrid, DatagridBody, Responsive, SimpleList, SingleFieldList } from 'react-admin';
import { TextField, ImageField, ReferenceField, EditButton, SimpleForm, FunctionField, ArrayField, ChipField  } from 'react-admin';
import { ReferenceInput, SelectInput, TextInput, LongTextInput, ArrayInput } from 'react-admin';
import Helper from './helper.js';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

const PostTitle = ({ record }) => {
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
};

const disableRow = (record, index) => ({
    pointerEvents: record.id === 'FKH82KMF0' ? 'none' : 'auto',
    background: record.id === 'FKH82KMF0' ? 'lightgray': ''
});
export const FileList = props => (
    <List filters={<FileFilter />} {...props}>
        <Responsive
            small={
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => `${record.views} views`}
                    tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
                />
            }
            medium={
                <FileDatagrid rowStyle={disableRow}>
                    <TextField source="title" />
                    <TextField label="User" source="m_users" />
                    <ArrayField label="Channel" source="m_channels">
                        <SingleFieldList>
                            <ChipField source="name" />
                        </SingleFieldList>
                    </ArrayField>
                    <ImageField source="thumb_80" />
                    <FunctionField source="size" render={record => Helper.toSizeString(record.size)} />
                    <FunctionField source="created" render={record => Helper.convertDate(record.created)} />
                    <EditButton />
                </FileDatagrid>
            }
        />
    </List>
);

export const FileCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput source="userId" reference="users">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="title" />
            <LongTextInput source="body" />
        </SimpleForm>
    </Create>
);

export const FileEdit = props => (
    <Edit title={<PostTitle />} {...props}>
        <SimpleForm>
            <ReferenceInput source="userId" reference="users">
               <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="title" />
           <LongTextInput source="body" />
        </SimpleForm>
    </Edit>
);

const FileFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <ReferenceInput label="User" source="name_of_user" reference="users" allowEmpty>
            <SelectInput optionText="User" />
        </ReferenceInput>
        <ReferenceInput label="Channels" source="userId" reference="channels" allowEmpty>
            <SelectInput optionText="Channels" />
        </ReferenceInput>
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