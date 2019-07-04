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

const API_URL = 'https://slack.com/api';
const TOKEN = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).access_token : '';
// const LIST_OBJECT_DEPENDENT = {
//     'channels': [],
//     'users': ['channels'],
//     'files': ['channels', 'users']
// };
const MAPPING_RESOURCE_NAME_API = {
    'files': 'files',
    'users': 'members',
    'channels': 'channels'
};

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
                        // let allChannels = values[0];
                        let allUsers = values[1];
                        return getAllFiles(allUsers).then(allFiles => {
                            let result = handleData(params, allFiles);
                            return result;
                        });
                    })
            }
            break;
        // case GET_MANY:
        //     if (sessionStorage.getItem(resource)) {
        //         return filterByListId(
        //             params.ids,
        //             JSON.parse(sessionStorage.getItem(resource)),
        //             resource
        //         );
        //     } else {
        //         get(`${API_URL}/${resource}.list?token=${TOKEN}&count=1000`).then(response => {
        //             sessionStorage.setItem(resource, JSON.stringify(response), resource);
        //             return filterByListId(params.ids, response);
        //         });
        //     }
        //     break;
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
    let list = data;

    // Sort
    list = sortData(params.sort.field, params.sort.order, list);
    // Pagination
    let {page, perPage} = params.pagination;
    return {
        data: pagination(page, perPage, list),
        total: list.length
    };
}

const sortData = (field, order, data) => {
    return stableSort(data, getSorting(order, field));
}

const pagination = (page, perPage, data) => {
    page = page - 1;
    let startSlice = page * perPage;
    let endSlice = startSlice + perPage;
    return data.slice(startSlice, endSlice);
}

function desc(a, b, field) {
    let valA = a[field];
    let valB = b[field];
    let tempArray = field.split('.');
    if (tempArray.length === 2) {
        valA = a[tempArray[0]][tempArray[1]];
        valB = b[tempArray[0]][tempArray[1]];
    }
    if (valB < valA) {
      return -1;
    }
    if (valB > valA) {
      return 1;
    }
    return 0;
  }
  
function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, field) {
    return order == 'DESC' ? (a, b) => desc(a, b, field) : (a, b) => -(desc(a, b, field));
}

/**
 * type
 * resource
 * params
 */

function getListData(type, resource, params) {
    if (sessionStorage.getItem(resource)) {
        return handleData(type, resource, params, JSON.parse(sessionStorage.getItem(resource)));
    } else {
        get(`${API_URL}/${resource}.list?token=${TOKEN}&count=1000`).then(response => {
            sessionStorage.setItem(resource, JSON.stringify(response));
            return handleData(type, resource, params, response);
        });
    }
}

const defaultParam = {
    filter: {},
    pagination: {page: 1, perPage: 10},
    sort: {field: "id", order: "DESC"}
};

function getAllChannels() {
    return new Promise(function(resolve, reject) {
        get(`${API_URL}/channels.list?token=${TOKEN}&count=1000`).then(response => {
            sessionStorage.setItem('channels', JSON.stringify(response));
            resolve(response.channels);
        });
    })
}

function getAllUsers() {
    return new Promise(function(resolve, reject) {
        get(`${API_URL}/users.list?token=${TOKEN}&count=1000`).then(response => {
            sessionStorage.setItem('users', JSON.stringify(response));
            resolve(response.members);
        });
    })
}


function getAllFiles(listUsers, listChannels) {
    return new Promise(function(resolve, reject) {
        get(`${API_URL}/files.list?token=${TOKEN}&count=1000`).then(response => {
            let listFiles = response.files;
            let result = [];
            for (let i = 0; i < listFiles.length; i++) {
                result[i] = listFiles[i];
                result[i][PREFIX + 'users'] = getNameOfUserByFile(listUsers, listFiles[i]);
                for (let j = 0; j < listChannels; j++) {

                }
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
function getNameOfUserByFile(listUsers, file) {
    let result = 'no name';
    for (let j = 0; j < listUsers.length; j++) {
        if (file['user'] === listUsers[j]['id']) {
            result = listUsers[j]['name'];
            break;
        }
    }

    return result;
}

