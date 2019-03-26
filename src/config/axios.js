import axios from 'axios';
import Cookies from 'js-cookie';
import {setupCache} from 'axios-cache-adapter';
import {API_URL, SESSION_COOKIE_NAME, TOKEN_NAME, SESSION_USER_GROUP_COOKIE_NAME} from './general';
import {store} from 'config/store';
import {logout} from 'actions/account';
import {showAppAlert} from 'actions/app';
import locale from 'locale/global';
import Raven from 'raven-js';
import param from 'can-param';
import {pathConfig} from 'config/routes';

export const cache = setupCache({
    maxAge: 15 * 60 * 1000,
    key: (request) => {
        return request.url + JSON.stringify(request.params);
    },
    exclude: {
        query: false,
        paths: [
            'external/records/search',
            'records/search?rule=',
            'records/search?title=',
            'records/search?doi=',
            'records/search?id=pmid:',
            'orcid'
        ]
    },
});

export const api = axios.create({
    baseURL: API_URL,
    adapter: process.env.NODE_ENV === 'test' ? undefined : cache.adapter
});

export const sessionApi = axios.create({
    baseURL: API_URL,
});

// need to generate a new token for each request otherwise if you try a new request with the old token,
// axios will appear to cancel your request automatically
export const generateCancelToken = () => {
    const CancelToken = axios.CancelToken;
    return CancelToken.source();
};

// If there is a local cookie available, then set the api headers for x-uql-token
if(!!Cookies.get(SESSION_COOKIE_NAME) && !!Cookies.get(SESSION_USER_GROUP_COOKIE_NAME)) {
    api.defaults.headers.common[TOKEN_NAME] = Cookies.get(SESSION_COOKIE_NAME);
}

// allow us to safely force a given SESSION_COOKIE_NAME during development
if (process.env.NODE_ENV === 'development' && !!process.env.SESSION_COOKIE_NAME) {
    api.defaults.headers.common[TOKEN_NAME] = process.env.SESSION_COOKIE_NAME;
}

api.isCancel = axios.isCancel; // needed for cancelling requests and the instance created does not have this method

let isGet = null;
let requestUrl = '';
api.interceptors.request.use(request => {
    isGet = request.method === 'get';
    requestUrl = request.baseURL + request.url;
    if (
        (request.url.includes('records/search') || request.url.includes('records/export'))
        && !!request.params && !!request.params.mode && request.params.mode === 'advanced'
    ) {
        request.paramsSerializer = (params) => {
            return param(params);
        };
    }
    return request;
});

const reportToSentry = (error) => {
    let detailedError = 'Something happened in setting up the request that triggered an error, but no details were available';
    if (!!error.response && !!error.response.data && !!error.response.status && !!error.response.headers) {
        detailedError = 'Data: ' + error.response.data + '; Status: ' + error.response.status + '; Headers: ' + JSON.stringify(error.response.headers);
    } else if (!!error.message) {
        detailedError = 'Something happened in setting up the request that triggered an Error: ' + error.message;
    }
    Raven.captureException(error, {extra: {error: detailedError}});
};

api.interceptors.response.use(response => {
    if (!isGet) {
        return cache.store.clear().then(() => Promise.resolve(response.data));
    }
    return Promise.resolve(response.data);
}, error => {
    const thirdPartyLookupUrlRoot = API_URL + pathConfig.admin.thirdPartyTools.substring('/'.length);
    let errorMessage = null;
    if (requestUrl.startsWith(thirdPartyLookupUrlRoot)) {
        if (process.env.NODE_ENV !== 'test') { console.log('Skipping root error handling for 3rd party api'); } // errors for tool api lookup are handled in actions/thirdPartyLookupTool.js
    } else {
        if (!!error.response && (!!error.response.status || error.response.status === 0)) { // a completely bad response from api comes through as a http status code zero
            errorMessage = locale.global.errorMessages.generic;
            if (error.response.status === 403) {
                if (!!Cookies.get(SESSION_COOKIE_NAME)) {
                    Cookies.remove(SESSION_COOKIE_NAME, {path: '/', domain: '.library.uq.edu.au'});
                    delete api.defaults.headers.common[TOKEN_NAME];
                }

                if (process.env.NODE_ENV === 'test') {
                    global.mockActionsStore.dispatch(logout());
                } else {
                    store.dispatch(logout());
                }

                errorMessage = locale.global.errorMessages[error.response.status];
            } else if (!!error.message && error.response.status.toString().charAt(0) === '5') {
                errorMessage = ((error.response || {}).data || {}).message || locale.global.errorMessages[500];
            } else if (!!locale.global.errorMessages[error.response.status]) {
                errorMessage = ((error.response || {}).data || {}).message || locale.global.errorMessages[error.response.status];
            } else {
                errorMessage = ((error.response || {}).data || {}).message || locale.global.errorMessages[500];
            }

            if (error.response.status !== 403 && error.response.status !== 404 && error.response.status !== 410) {
                if (process.env.NODE_ENV === 'test') {
                    global.mockActionsStore.dispatch(showAppAlert(error.response.data));
                } else {
                    store.dispatch(showAppAlert(error.response.data));
                }
            }
        }
    }

    if (!!errorMessage) {
        return Promise.reject({...errorMessage});
    } else {
        reportToSentry(error);
        return Promise.reject(error);
    }
});
