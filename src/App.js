import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { Admin, Resource } from 'react-admin';
import { UserList } from './users';
import { FileList, FileEdit, FileCreate } from './files';
import UserIcon from '@material-ui/icons/Group';
import FileIcon from '@material-ui/icons/FileUpload';
import Dashboard from './Dashboard';
import authProvider from './authProvider';
import dataProvider from './dataProvider';
import MyLoginPage from './MyLoginPage';

const App = () => (
  <Admin loginPage={MyLoginPage} dashboard={Dashboard} authProvider={authProvider} dataProvider={dataProvider}>
    <Resource name="files" list={FileList} edit={FileEdit} create={FileCreate}  icon={FileIcon} />
    <Resource name="users" list={UserList} icon={UserIcon} />
  </Admin>
);

export default App;
