// in src/files.js
import React, {Fragment} from 'react';
import { List, Filter, Datagrid, DatagridBody, Responsive, SimpleList, SingleFieldList } from 'react-admin';
import { TextField, ImageField, FunctionField, DateField, ArrayField, ChipField, FileField } from 'react-admin';
import { TextInput, SelectArrayInput, AutocompleteArrayInput, BulkDeleteButton } from 'react-admin';
import Helper from './helper.js';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { CardActions, CreateButton, ExportButton, RefreshButton } from 'react-admin';

export const FileList = props => (
    <List filters={<FileFilter />} actions={<PostActions />} {...props} bulkActionButtons={<FileBulkActionButtons />}>
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
                    <FunctionField source="created" label="Created" render={record => Helper.convertDate(record.created)}/>
                </FileDatagrid>
            }
        />
    </List>
);

const PostActions = ({
    bulkActions,
    basePath,
    currentSort,
    displayedFilters,
    exporter,
    filters,
    filterValues,
    onUnselectItems,
    resource,
    selectedIds,
    showFilter,
    total
}) => (
    <CardActions>
        {bulkActions && React.cloneElement(bulkActions, {
            basePath,
            filterValues,
            resource,
            selectedIds,
            onUnselectItems,
        })}
        {filters && React.cloneElement(filters, {
            resource,
            showFilter,
            displayedFilters,
            filterValues,
            context: 'button',
        }) }
        <ExportButton
            disabled={total === 0}
            resource={resource}
            sort={currentSort}
            filter={filterValues}
            exporter={exporter}
        />
    </CardActions>
);

const FileBulkActionButtons = props => (
    <Fragment>
        {/* Add the default bulk delete action */}
        <BulkDeleteButton {...props} />
    </Fragment>
);

const FileFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="name" alwaysOn />
        <AutocompleteArrayInput source="user" choices={ JSON.parse(sessionStorage.getItem('users')) } allowEmpty />
        <AutocompleteArrayInput source="channels" choices={ JSON.parse(sessionStorage.getItem('channels')) } allowEmpty />
        <AutocompleteArrayInput source="filetype" choices={ Helper.getFileTypes() } allowEmpty/>
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