// in src/dataProvider
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
    fetchUtils,
} from 'react-admin';

import { get, post, put, del } from 'fetchutils';
import Helper from './helper.js';

const API_URL = 'https://slack.com/api';
const TOKEN = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).access_token : '';
const PREFIX = 'm_';

/**
 * @param {string} type Request type, e.g GET_LIST, GET_MANY
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for response
 */
export default (type, resource, params) => {
    if (!TOKEN) return;
    console.group("============== dataProvider =============");
    console.log(type);
    console.log(resource);
    console.log(params);
    console.groupEnd();

    switch(type) {
        case GET_LIST:
            switch(resource) {
                case "files":
                    if (sessionStorage.getItem('files')) {
                        let storageObject = JSON.parse(sessionStorage.getItem('files'));
                        return handleData(params, storageObject);
                    }
                    return Promise.all([getAllChannels(), getAllUsers()]).then(values => {
                        let allChannels = values[0];
                        let allUsers = values[1];
                        return getAllFiles(allChannels, allUsers).then(allFiles => {
                            return handleData(params, allFiles);
                        });
                    })
                case "users":
                    return getAllUsers().then(users => {
                        return handleData(params, users);
                    });
                case "channels":
                    return getAllChannels().then(channels => {
                        return handleData(params, channels);
                    });
                case "groups":
                    return getAllGroups().then(groups => {
                        return handleData(params, groups);
                    });
            }
            break;
        // case GET_MANY:
        default:
            return;
    }
};

/*
 * handleData: filter and sort data
 * params:
 * 
 * output: { data: {Record[]}, total: {int} }
 */

const handleData = (params, data) => {
    // Sort
    let list = Helper.stableSort(
        data,
        Helper.getSorting(params.sort.order, params.sort.field)
    );
    // Pagination
    let {page, perPage} = params.pagination;
    return {
        data: pagination(page, perPage, list),
        total: list.length
    };
}

const pagination = (page, perPage, data) => {
    page = page - 1;
    let startSlice = page * perPage;
    let endSlice = startSlice + perPage;
    return data.slice(startSlice, endSlice);
}

function getAllChannels() {
    return new Promise(function(resolve, reject) {
        get(`${API_URL}/channels.list?token=${TOKEN}&count=1000`).then(response => {
            sessionStorage.setItem('channels', JSON.stringify(response.channels));
            resolve(response.channels);
        });
    })
}

function getAllGroups() {
    return new Promise(function(resolve, reject) {
        get(`${API_URL}/groups.list?token=${TOKEN}`).then(response => {
            sessionStorage.setItem('groups', JSON.stringify(response.groups));
            resolve(response.groups);
        });
    })
}

function getAllUsers() {
    return new Promise(function(resolve, reject) {
        get(`${API_URL}/users.list?token=${TOKEN}&count=1000`).then(response => {
            sessionStorage.setItem('users', JSON.stringify(response.members));
            resolve(response.members);
        });
    })
}


function getAllFiles(listChannels, listUsers) {
    return new Promise(function(resolve, reject) {
        get(`${API_URL}/files.list?token=${TOKEN}&count=1000`).then(response => {
            let listFiles = response.files;
            let result = [];
            for (let i = 0; i < listFiles.length; i++) {
                result[i] = listFiles[i];
                result[i][PREFIX + 'users'] = getUserNameByFile(listUsers, listFiles[i]);
                result[i][PREFIX + 'channels'] = getChannelNamesByFile(listChannels, listFiles[i]);
            }
            sessionStorage.setItem('files', JSON.stringify(result));
            resolve(result);
        });
    })
}

/**
 * get Name of User of File
 * 
 * @param listUsers array
 * @param file object
 * @return string
 */
function getUserNameByFile(listUsers, file) {
    let result = 'no name';
    for (let j = 0; j < listUsers.length; j++) {
        if (file['user'] === listUsers[j]['id']) {
            result = listUsers[j]['name'];
            break;
        }
    }

    return result;
}

/**
 * 
 * @param {array} listChannels 
 * @param {object} file 
 * 
 * @return array
 */

function getChannelNamesByFile(listChannels, file) {
    let uniqueChannels = file.channels.filter(function(item, pos) {
        return file.channels.indexOf(item) == pos;
    })
    let result = [];

    for (let i = 0; i < uniqueChannels.length; i++) {
        for (let j = 0; j < listChannels.length; j++) {
            if (uniqueChannels[i] === listChannels[j].id) {
                if (result.find(obj => obj.id === listChannels[j].id)) {
                    console.error(file);
                }
                result.push({
                    id: listChannels[j].id,
                    name: listChannels[j].name
                });
            }
        }
    }

    return result;
}