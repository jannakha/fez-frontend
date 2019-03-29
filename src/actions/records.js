import {get, post, patch} from 'repositories/generic';
import {
    NEW_RECORD_API,
    EXISTING_RECORD_API,
    RECORDS_ISSUES_API,
    COMMUNITIES_SECURITY_POLICY_API,
    // COLLECTIONS_SECURITY_POLICY_API,
    // RECORDS_SECURITY_POLICY_API,
    // DATASTREAMS_SECURITY_POLICY_API
} from 'repositories/routes';
import {putUploadFiles} from 'repositories';
import * as transformers from './transformers';
import {NEW_RECORD_DEFAULT_VALUES} from 'config/general';
import * as actions from './actionTypes';

/**
 * Save a new record involves up to three steps: create a new record, upload files, update record with uploaded files.
 * If error occurs on any stage failed action is dispatched
 * @param {object} data to be posted, refer to backend API
 * @returns {promise} - this method is used by redux form onSubmit which requires Promise resolve/reject as a return
 */
export function createNewRecord(data) {
    return dispatch => {
        dispatch({type: actions.CREATE_RECORD_SAVING});
        // set default values, links
        const recordRequest = {
            ...NEW_RECORD_DEFAULT_VALUES,
            ...JSON.parse(JSON.stringify(data)),
            ...transformers.getRecordLinkSearchKey(data),
            ...transformers.getRecordAuthorsSearchKey(data.authors || data.currentAuthor && [data.currentAuthor[0]] || null),
            ...transformers.getRecordAuthorsIdSearchKey(data.authors || data.currentAuthor && [data.currentAuthor[0]] || null),
            ...transformers.getRecordContributorsSearchKey(data.editors),
            ...transformers.getRecordContributorsIdSearchKey(data.editors),
            ...transformers.getRecordSupervisorsSearchKey(data.supervisors),
            ...transformers.getRecordSubjectSearchKey(data.fieldOfResearch),
            ...transformers.getDatasetContactDetailSearchKeys(data.contact || null),
            ...transformers.getGeographicAreaSearchKey(data.geographicArea || null),
            ...transformers.getDatasetCreatorRolesSearchKey(data.authors || null),
            ...transformers.getRecordAuthorAffiliationSearchKey(data.isNtro && data.authors || null),
            ...transformers.getRecordAuthorAffiliationTypeSearchKey(data.isNtro && data.authors || null),
            ...transformers.getRecordAbstractDescriptionSearchKey(data.isNtro && data.ntroAbstract || null),
            ...transformers.getGrantsListSearchKey(data.isNtro && data.grants || null),
            ...transformers.getNtroMetadataSearchKeys(data.isNtro && data || null),
            ...transformers.getLanguageSearchKey(data.isNtro && data.languages || null)
        };

        // delete extra form values from request object
        if (recordRequest.authors) delete recordRequest.authors;
        if (recordRequest.editors) delete recordRequest.editors;
        if (recordRequest.files) delete recordRequest.files;
        if (recordRequest.currentAuthor) delete recordRequest.currentAuthor;
        if (recordRequest.supervisors) delete recordRequest.supervisors;
        if (recordRequest.fieldOfResearch) delete recordRequest.fieldOfResearch;
        if (recordRequest.comments) delete recordRequest.comments;
        if (recordRequest.contact) delete recordRequest.contact;
        if (recordRequest.geographicArea) delete recordRequest.geographicArea;
        if (recordRequest.ntroAbstract) delete recordRequest.ntroAbstract;
        if (recordRequest.grants) delete recordRequest.grants;
        if (recordRequest.significance) delete recordRequest.significance;
        if (recordRequest.impactStatement) delete recordRequest.impactStatement;
        if (recordRequest.languages) delete recordRequest.languages;
        if (recordRequest.qualityIndicators) delete recordRequest.qualityIndicators;

        let newRecord = null;
        const hasFilesToUpload = data.files && data.files.queue && data.files.queue.length > 0;
        const recordPatch = hasFilesToUpload ? {...transformers.getRecordFileAttachmentSearchKey(data.files.queue)} : null;

        return post(NEW_RECORD_API(), recordRequest)
            .then(response => {
                // save new record response
                newRecord = response.data;
                return response;
            })
            .then(() =>(hasFilesToUpload ? putUploadFiles(newRecord.rek_pid, data.files.queue, dispatch) : newRecord))
            .then(() => (hasFilesToUpload ? patch(EXISTING_RECORD_API({pid: newRecord.rek_pid}), recordPatch) : newRecord))
            .then(() => (data.comments ? post(RECORDS_ISSUES_API({pid: newRecord.rek_pid}), {issue: 'Notes from creator of the new record: ' +  data.comments}) : newRecord))
            .then((response) => {
                dispatch({
                    type: actions.CREATE_RECORD_SUCCESS,
                    payload: {
                        newRecord: response.data ? response.data : newRecord,
                        fileUploadOrIssueFailed: false
                    }
                });
                return Promise.resolve(response.data ? response.data : newRecord);
            })
            .catch(error => {
                // record was created, but file upload or record patch failed or issue post failed
                if (!!newRecord && !!newRecord.rek_pid) {
                    dispatch({
                        type: actions.CREATE_RECORD_SUCCESS,
                        payload: {
                            newRecord: newRecord,
                            fileUploadOrIssueFailed: true
                        }
                    });

                    return Promise.resolve(newRecord);
                }

                dispatch({
                    type: actions.CREATE_RECORD_FAILED,
                    payload: error.message
                });

                return Promise.reject(error);
            });
    };
}


/**
 * Submit thesis involves two steps: upload files, create record with uploaded files.
 * This method has been deprecated - kept for posterity.
 * If error occurs on any stage failed action is dispatched
 * @param {object} data to be posted, refer to backend API
 * @returns {promise} - this method is used by redux form onSubmit which requires Promise resolve/reject as a return
 */
// export function submitThesisOld(data, author) {
//     return dispatch => {
//         const hasFilesToUpload = data.files && data.files.queue && data.files.queue.length > 0;
//         if (!hasFilesToUpload) {
//             // reject thesis submission, files are required
//             return Promise.reject('Please attach files to proceed with thesis submission');
//         }
//         // set default values, links
//         const recordRequest = {
//             ...JSON.parse(JSON.stringify(data)),
//             ...transformers.getRecordAuthorsSearchKey(data.currentAuthor),
//             ...transformers.getRecordAuthorsIdSearchKey(data.currentAuthor),
//             ...transformers.getRecordSupervisorsSearchKey(data.supervisors),
//             ...transformers.getRecordSubjectSearchKey(data.fieldOfResearch),
//             ...transformers.getRecordFileAttachmentSearchKey(data.files.queue),
//             rek_title: data.thesisTitle.plainText,
//             rek_formatted_title: data.thesisTitle.htmlText,
//             rek_description: data.thesisAbstract.plainText,
//             rek_formatted_abstract: data.thesisAbstract.htmlText
//         };
//
//         // delete extra form values from request object
//         if (recordRequest.authors) delete recordRequest.authors;
//         if (recordRequest.editors) delete recordRequest.editors;
//         if (recordRequest.files) delete recordRequest.files;
//         if (recordRequest.currentAuthor) delete recordRequest.currentAuthor;
//         if (recordRequest.supervisors) delete recordRequest.supervisors;
//         if (recordRequest.fieldOfResearch) delete recordRequest.fieldOfResearch;
//         if (recordRequest.thesisTitle) delete recordRequest.thesisTitle;
//         if (recordRequest.thesisAbstract) delete recordRequest.thesisAbstract;
//         let fileUploadSucceeded = false;
//         dispatch({type: actions.CREATE_RECORD_SAVING});
//         return putUploadFiles(`UQ:${author.aut_student_username}`, data.files.queue, dispatch)
//             .then((response) => {
//                 fileUploadSucceeded = !!response;
//                 return post(NEW_RECORD_API(), recordRequest);
//             })
//             .then(response => {
//                 // if(process.env.ENABLE_LOG) Raven.captureException('THESIS CREATED', {message: 'Thesis created successfully'});
//                 dispatch({
//                     type: actions.CREATE_RECORD_SUCCESS,
//                     payload: {
//                         newRecord: response
//                     }
//                 });
//                 return response;
//             })
//             .catch(error => {
//                 const specificError = !fileUploadSucceeded
//                     ? 'Submit Thesis: File upload failed. '
//                     : 'Submit Thesis: Error occurred while saving record to eSpace. ';
//                 const compositeError = `${specificError} ${ error.message ? `(${error.message})` : '' }`;
//
//                 if(process.env.ENABLE_LOG) Raven.captureException(error, {message: specificError});
//
//                 dispatch({
//                     type: actions.CREATE_RECORD_FAILED,
//                     payload: compositeError
//                 });
//
//                 return Promise.reject(compositeError);
//             });
//     };
// }

/**
 * Submit thesis involves two steps: create record - get signed url to upload files - upload files - patch record.
 * @param {object} data to be posted, refer to backend API
 * @returns {promise} - this method is used by redux form onSubmit which requires Promise resolve/reject as a return
 */
export function submitThesis(data) {
    return dispatch => {
        dispatch({type: actions.CREATE_RECORD_SAVING});
        // set default values, links
        const recordRequest = {
            ...JSON.parse(JSON.stringify(data)),
            ...transformers.getRecordAuthorsSearchKey(data.currentAuthor),
            ...transformers.getRecordAuthorsIdSearchKey(data.currentAuthor),
            ...transformers.getRecordSupervisorsSearchKey(data.supervisors),
            ...transformers.getRecordSubjectSearchKey(data.fieldOfResearch),
            ...transformers.getRecordFileAttachmentSearchKey(data.files.queue),
            rek_title: data.thesisTitle.plainText,
            rek_formatted_title: data.thesisTitle.htmlText,
            rek_description: data.thesisAbstract.plainText,
            rek_formatted_abstract: data.thesisAbstract.htmlText
        };

        // delete extra form values from request object
        recordRequest.authors && (delete recordRequest.authors);
        recordRequest.editors && (delete recordRequest.editors);
        recordRequest.currentAuthor && (delete recordRequest.currentAuthor);
        recordRequest.supervisors && (delete recordRequest.supervisors);
        recordRequest.fieldOfResearch && (delete recordRequest.fieldOfResearch);
        recordRequest.files && (delete recordRequest.files);
        recordRequest.thesisTitle && (delete recordRequest.thesisTitle);
        recordRequest.thesisAbstract && (delete recordRequest.thesisAbstract);

        let newRecord = null;
        const hasFilesToUpload = data.files && data.files.queue && data.files.queue.length > 0;
        const recordPatch = hasFilesToUpload ? {...transformers.getRecordFileAttachmentSearchKey(data.files.queue)} : null;

        return post(NEW_RECORD_API(), recordRequest)
            .then(response => {
                // save new record response
                newRecord = response.data;
                return response;
            })
            .then(() =>(hasFilesToUpload ? putUploadFiles(newRecord.rek_pid, data.files.queue, dispatch) : newRecord))
            // .then(() =>(hasFilesToUpload ?  putUploadFiles(`UQ:${author.aut_student_username}`, data.files.queue, dispatch) // to upload files renamed to student ID
            .then(() => (hasFilesToUpload ? patch(EXISTING_RECORD_API({pid: newRecord.rek_pid}), recordPatch) : newRecord))
            .then(() => (data.comments ? post(RECORDS_ISSUES_API({pid: newRecord.rek_pid}), {issue: 'Notes from creator of the new record: ' +  data.comments}) : newRecord))
            .then((response) => {
                dispatch({
                    type: actions.CREATE_RECORD_SUCCESS,
                    payload: {
                        newRecord: response.data ? response.data : newRecord,
                        fileUploadOrIssueFailed: false
                    }
                });
                return Promise.resolve(response.data ? response.data : newRecord);
            })
            .catch(error => {
                // record was created, but file upload or record patch failed or issue post failed
                if (!!newRecord && !!newRecord.rek_pid) {
                    dispatch({
                        type: actions.CREATE_RECORD_SUCCESS,
                        payload: {
                            newRecord: newRecord,
                            fileUploadOrIssueFailed: true
                        }
                    });

                    return Promise.resolve(newRecord);
                }

                dispatch({
                    type: actions.CREATE_RECORD_FAILED,
                    payload: error.message
                });

                return Promise.reject(error);
            });
    };
}

/**
 * Clear new record
 * @returns {action}
 */
export function clearNewRecord() {
    return dispatch => {
        dispatch({
            type: actions.CREATE_RECORD_RESET
        });
    };
}

export function getSecurity({ pid, type }) {
    let API = null;

    switch (type) {
        case 'Community':
            API = (request) => COMMUNITIES_SECURITY_POLICY_API(request);
            break;
        default:
            break;
    }

    return dispatch => {
        if(!API) {
            dispatch({
                type: actions.SECURITY_POLICY_LOAD_CANCELLED,
                payload: 'Unknown type'
            });
            return Promise.reject({message: 'Unknown type', status: 400});
        }
        dispatch({type: actions.SECURITY_POLICY_LOADING});
        return get(API({ pid }))
            .then(response => {
                const data = {};
                const pidSearchKey = Object.keys(transformers.getPidSearchKey())[0];
                if (response.data[pidSearchKey]) {
                    data.pid = response.data[pidSearchKey];
                }
                const securityPolicySearchKey = Object.keys(transformers.getSecurityPolicySearchKey())[0];
                if (response.data[securityPolicySearchKey]) {
                    data.communitySecurity = response.data[securityPolicySearchKey];
                }
                const objectTypeLookup = Object.keys(transformers.getObjectTypeLookupSearchKey())[0];
                if (response.data[objectTypeLookup]) {
                    data.type = response.data[objectTypeLookup];
                }
                dispatch({
                    type: actions.SECURITY_POLICY_LOADED,
                    payload: data
                });
                return Promise.resolve(data);
            })
            .catch(error => {
                dispatch({
                    type: actions.SECURITY_POLICY_LOAD_FAILED,
                    payload: error.message
                });
                return Promise.reject(error);
            })
        ;
    };
}

export function updateSecurity({ pid, security, type }) {
    let API = null;

    switch (type) {
        case 'Community':
            API = (request) => COMMUNITIES_SECURITY_POLICY_API(request);
            break;
        default:
            break;
    }

    const request = {
        ...transformers.getPidSearchKey(pid),
        ...transformers.getSecurityPolicySearchKey(security)
    };
    return dispatch => {
        if(!API) {
            dispatch({
                type: actions.SECURITY_POLICY_SAVE_CANCELLED,
                payload: 'Unknown type'
            });
            return Promise.reject({message: 'Unknown type', status: 400});
        }
        dispatch({type: actions.SECURITY_POLICY_SAVING});
        return patch(API(request))
            .then((response) => {
                dispatch({
                    type: actions.SECURITY_POLICY_SAVED,
                    payload: {
                        policy: response.data ? response.data : {}
                    }
                });
                return Promise.resolve(response.data ? response.data : {});
            })
            .catch(error => {
                dispatch({
                    type: actions.SECURITY_POLICY_SAVE_FAILED,
                    payload: error.message
                });
                return Promise.reject(error);
            })
        ;
    };
}

