import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { Admin, Resource } from 'react-admin';
import { UserList } from './users';
import { ChannelList } from './channels';
import { GroupList } from './groups';
import { FileList } from './files';
import UserIcon from '@material-ui/icons/Group';
import FileIcon from '@material-ui/icons/FileUpload';
import Dashboard from './Dashboard';
import authProvider from './authProvider';
import dataProvider from './dataProvider';
import MyLoginPage from './MyLoginPage';

const App = () => (
  <Admin loginPage={MyLoginPage} dashboard={Dashboard} authProvider={authProvider} dataProvider={dataProvider}>
    <Resource name="files" list={FileList} icon={FileIcon} />
    <Resource name="users" list={UserList} icon={UserIcon} />
    <Resource name="channels" list={ChannelList} icon={UserIcon} />
    <Resource name="groups" list={GroupList} icon={UserIcon} />
  </Admin>
);

export default App;
