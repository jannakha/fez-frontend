import * as actions from 'actions/actionTypes';
import createRecordReducer from './createRecord';

describe('createRecord reducer', () => {

    const initialState = {
        newRecord: null,
        newRecordSaving: false,
        newRecordError: false,
        newRecordErrorMessage: null,
        newRecordFileUploadingOrIssueError: false
    };

    const aRecordToCreate = {
        "rek_title": "This is a title",
        "rek_description": "This is a description."
    };

    it('clears the state of a new record and returns the initialState', () => {
        const test = createRecordReducer(initialState, {type: actions.CREATE_RECORD_RESET});
        expect(test).toEqual(initialState);
    });

    it('returns the payload of the created record, and whether the file upload was successful', () => {
        const test = createRecordReducer(initialState, {type: actions.CREATE_RECORD_SUCCESS, payload: {newRecord: aRecordToCreate, fileUploadOrIssueFailed: false}});
        expect(test).toEqual({...initialState, newRecord: aRecordToCreate, newRecordFileUploadingOrIssueError: false});
    });

    it('returns the payload of the failed record and that there was an error', () => {
        const test = createRecordReducer(initialState, {type: actions.CREATE_RECORD_FAILED, payload: aRecordToCreate});
        expect(test).toEqual({...initialState, newRecordError: true, newRecordErrorMessage: aRecordToCreate});
    });

    it('returns that the new record is currently being saved', () => {
        const test = createRecordReducer(initialState, {type: actions.CREATE_RECORD_SAVING, payload: aRecordToCreate});
        expect(test).toEqual({...initialState, newRecordSaving: true});
    });

    it('returns the initialState when an invalid action hander is supplied', () => {
        const test = createRecordReducer(initialState, {type: 'INVALID_ACTION_TYPE'});
        expect(test).toEqual(initialState);
    });
});
