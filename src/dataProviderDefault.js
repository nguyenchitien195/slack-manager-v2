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
import { stringify } from 'query-string';
import { get, post, put, del } from 'fetchutils';
import Helper from './helper.js';

const API_URL = 'https://slack.com/api';
const TOKEN = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).access_token : '';
const ADD_MORE_FIELD_FOR_RESOURCE = {
    'files': 'a'
};
const LIST_OBJECT_DEPENDENT = {
    'channels': [],
    'users': ['channels'],
    'files': ['channels', 'users']
};
const MAPPING_RESOURCE_NAME_API = {
    'files': 'files',
    'users': 'members',
    'channels': 'channels'
};


/**
 * @param {String} type One of the constants appearing at the top of this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The Data Provider request params, depending on the type
 * @returns {Object} { url, options } The HTTP request parameters
 */
const convertDataProviderRequestToHTTP = (type, resource, params) => {
    switch (type) {
    case GET_LIST: {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            count: 5,
            // sort: JSON.stringify([field, order]),
            // range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            // filter: JSON.stringify(params.filter),
            token: TOKEN
        };
        return { 
            url: `${API_URL}/${resource}.list?${stringify(query)}`
        };
    }
    case GET_ONE:
        return { url: `${API_URL}/${resource}/${params.id}` };
    case GET_MANY: {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return { url: `${API_URL}/${resource}?${stringify(query)}` };
    }
    case GET_MANY_REFERENCE: {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, (page * perPage) - 1]),
            filter: JSON.stringify({ ...params.filter, [params.target]: params.id }),
        };
        return { url: `${API_URL}/${resource}?${stringify(query)}` };
    }
    case UPDATE:
        return {
            url: `${API_URL}/${resource}/${params.id}`,
            options: { method: 'PUT', body: JSON.stringify(params.data) },
        };
    case CREATE:
        return {
            url: `${API_URL}/${resource}`,
            options: { method: 'POST', body: JSON.stringify(params.data) },
        };
    case DELETE:
        return {
            url: `${API_URL}/${resource}/${params.id}`,
            options: { method: 'DELETE' },
        };
    default:
        throw new Error(`Unsupported fetch action type ${type}`);
    }
};

/**
 * @param {Object} response HTTP response from fetch()
 * @param {String} type One of the constants appearing at the top of this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The Data Provider request params, depending on the type
 * @returns {Object} Data Provider response
 */
const convertHTTPResponseToDataProvider = (response, type, resource, params) => {
    console.log(response);
    response['json'] = response.files;
    const { headers, json } = response;
    switch (type) {
    case GET_LIST:
        console.log(json);
        return {
            data: json.map(x => x),
            // total: parseInt(headers.get('content-range').split('/').pop(), 10),
            total: 20,
        };
    case CREATE:
        return { data: { ...params.data, id: json.id } };
    default:
        return { data: json };
    }
};

/**
 * @param {string} type Request type, e.g GET_LIST, GET_MANY
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for response
 */
export default (type, resource, params) => {
    console.group("============== dataProvider =============");
    console.log(type);
    console.log(resource);
    console.log(params);
    console.groupEnd();
    switch(type) {
        case GET_LIST:
            switch(resource) {
                case "files":
                    let getChannels = getAllChannels();
                    getChannels
                        .then(function(channels) {
                            return getAllUsers();
                        })
                        .then(function(users) {
                            return getAllFiles(users);
                        });
            }
            break;
        case GET_MANY:
            if (sessionStorage.getItem(resource)) {
                return filterByListId(
                    params.ids,
                    JSON.parse(sessionStorage.getItem(resource)),
                    resource
                );
            } else {
                get(`${API_URL}/${resource}.list?token=${TOKEN}&count=1000`).then(response => {
                    sessionStorage.setItem(resource, JSON.stringify(response), resource);
                    return filterByListId(params.ids, response);
                });
            }
            break;
        default:
            return;
    }
    const { fetchJson } = fetchUtils;
    const { url, options } = convertDataProviderRequestToHTTP(type, resource, params);
    console.error(options);
    return get(url, options)
        .then(response => convertHTTPResponseToDataProvider(response, type, resource, params));
};

/*
 * type: GET_LIST, GET_ONE, UPDATE
 * resource (type): files, users
 * params:
 */

const handleData = (type, resource, params, data) => {
    switch(type) {
        case GET_LIST:
            let storageData = data;
            let total = 0;
            let list = [];
            if (storageData[MAPPING_RESOURCE_NAME_API[resource]]) {
                list = storageData[MAPPING_RESOURCE_NAME_API[resource]];
                list = storageData;
            }

            // Check paging is not available will count total by size of array
            if (storageData.paging !== undefined && storageData.paging.total !== undefined) {
                total = storageData.paging.total;
            } else {
                total = list.length;
            }
            list = sortData(params.sort.field, params.sort.order, list);
            let {page, perPage} = params.pagination;
            return {
                data: pagination(page, perPage, list),
                total: total
            };
            break;
        case UPDATE:
            break;
        default:
            break;
    }
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
ids: array
data: array
*/

function filterByListId(ids, data, resource) {
    let mapingResource = {
        'files': 'files',
        'users': 'members'
    };
    data = data[mapingResource[resource]];
    if (Array.isArray(data)) {
        let result = [];
        ids.forEach(id => {
            data.forEach(element => {
                if (id === element.id) {
                    result.push(element);
                    return;
                }
            });
        })
        return {
            data: result
        };
    } else {
        console.error('Not array');
    }
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
            resolve(handleData('GET_LIST', 'channels', defaultParam, response));
        });
    })
}

function getAllUsers() {
    return new Promise(function(resolve, reject) {
        get(`${API_URL}/users.list?token=${TOKEN}&count=1000`).then(response => {
            sessionStorage.setItem('users', JSON.stringify(response));
            resolve(handleData('GET_LIST', 'users', defaultParam, response));
        });
    })
}

function getAllFiles(listUsers) {
    return new Promise(function(resolve, reject) {
        get(`${API_URL}/files.list?token=${TOKEN}&count=1000`).then(response => {
            let listFiles = response.files;
            let result = [];
            for (let i = 0; i < listFiles.length; i++) {
                result[i] = listFiles[i];
                result[i]['name_of_user'] = 'no name';
                for (let j = 0; j < listUsers.length; j++) {
                    if (listFiles[i]['user'] === listUsers[j]['id']) {
                        result[i]['name_of_user'] = listUsers[j]['name'];
                    }
                }
            }
            sessionStorage.setItem('files', JSON.stringify(result));
            let a = handleData('GET_LIST', 'files', defaultParam, result);
            resolve(handleData('GET_LIST', 'files', defaultParam, result));
        });
    })
}

