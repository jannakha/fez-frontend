import * as actions from './actionTypes';
import * as repositories from 'repositories';
import * as recordActions from './records';
import {record} from "mock/data";

describe('Record action creators', () => {
    // extend expect to check actions
    expect.extend({toHaveDispatchedActions});

    beforeEach(() => {
        mockActionsStore = setupStoreForActions();
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    describe('createNewRecord()', () => {

        it('dispatches expected actions on successful save', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save on alternate data format', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {data: {...record}}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {data: {...record}}});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save with files', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files":  {
                    "queue": [
                        {
                            "name": "test.txt",
                            "fileData": {
                                "name": "test.txt"
                            }
                        }
                    ],
                    "isValid": true},
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}})
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: pidRequest.pid, fileName: "test.txt"}).apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
                .reply(200, {});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOAD_PROGRESS@test.txt',
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save with files api failure', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files":  {
                    "queue": [
                        {
                            "name": "test.txt",
                            "fileData": {
                                "name": "test.txt"
                            }
                        }
                    ],
                    "isValid": true},
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}})
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: pidRequest.pid, fileName: "test.txt"}).apiUrl)
                .reply(500)
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
                .reply(200, {});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                actions.APP_ALERT_SHOW,
                'FILE_UPLOADED_FAILED@test.txt',
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onAny()
                .reply(403, {});

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.CREATE_RECORD_FAILED
            ];

            try {
                await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions if patch record fails', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)",
                "files": {
                    "queue": [
                        {
                            "name": "test.txt",
                            "fileData": {
                                "name": "test.txt"
                            }
                        }
                    ]
                }
            };
            const testPid = 'UQ:396321';
            const pidRequest = {pid: testPid};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: testPid, fileName: "test.txt"}).apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
                .reply(200, {})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(500);

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOAD_PROGRESS@test.txt',
                actions.APP_ALERT_SHOW,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on issues api posts comments successfully', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)",
                "comments": 'This is a test'
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.RECORDS_ISSUES_API(pidRequest).apiUrl)
                .reply(200, {data: {}});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on issues api failure to post comments', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)",
                "comments": 'This is a test'
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.RECORDS_ISSUES_API(pidRequest).apiUrl)
                .reply(500);


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('correctly creates a record that needs no data deletions', async () => {
            const testInput = {
                "rek_title": "test",
                "rek_display_type": 179,
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions when authors list is not provided (just author)', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save of an NTRO record', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)",
                "isNtro": true,
                "ntroAbstract": {
                    "rek_description": "blah blah blah",
                    "rek_formatted_abstract": "<p>blah blah blah</p>"
                },
                "grants": [{
                    "rek_grant_agency_type": 7,
                    "rek_grant_agency_type_order": 1
                }],
                "languages": [{
                    "rek_language": "english",
                    "rek_language_order": 1
                }]

            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save of record with various obscure fields', async () => {
            const testInput = {
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)",
                "isNtro": true,
                "contact": {
                    "contactName": "Test Contact",
                    "contactNameId": {
                        "id": 121212,
                        "value": "Test, Contact"
                    },
                    "contactEmail": "test@example.com"
                },
                "geographicArea": "lat long string for some place somewhere",
                "significance": "454026",
                "impactStatement": {
                    "htmlText": "<p>more blah</p>"
                },
                "fieldOfResearch": [{
                    "rek_value": {
                        "key": 7
                    },
                    "rek_order": 1
                }],
                "qualityIndicators": [{
                    "rek_quality_indicator": 454035,
                    "rek_quality_indicator_order": 1
                }],

            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.createNewRecord(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

    });

    describe('submitThesis()', () => {

        it('dispatches expected actions on successful save', async () => {
            const testInput = {
                "thesisTitle": {
                    planText: 'Title',
                    htmlText: 'Title'
                },
                "thesisAbstract": {
                    plainText: 'Abstract',
                    htmlText: 'Abstract'
                },
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save with files', async () => {
            const testInput = {
                "thesisTitle": {
                    planText: 'Title',
                    htmlText: 'Title'
                },
                "thesisAbstract": {
                    plainText: 'Abstract',
                    htmlText: 'Abstract'
                },
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files":  {
                    "queue": [
                        {
                            "name": "test.txt",
                            "fileData": {
                                "name": "test.txt"
                            }
                        }
                    ],
                    "isValid": true},
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}})
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: pidRequest.pid, fileName: "test.txt"}).apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
                .reply(200, {});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOAD_PROGRESS@test.txt',
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save with files api failure', async () => {
            const testInput = {
                "thesisTitle": {
                    planText: 'Title',
                    htmlText: 'Title'
                },
                "thesisAbstract": {
                    plainText: 'Abstract',
                    htmlText: 'Abstract'
                },
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files":  {
                    "queue": [
                        {
                            "name": "test.txt",
                            "fileData": {
                                "name": "test.txt"
                            }
                        }
                    ],
                    "isValid": true},
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}})
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: pidRequest.pid, fileName: "test.txt"}).apiUrl)
                .reply(500)
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
                .reply(200, {});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                actions.APP_ALERT_SHOW,
                'FILE_UPLOADED_FAILED@test.txt',
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for anon user', async () => {
            const testInput = {
                "thesisTitle": {
                    planText: 'Title',
                    htmlText: 'Title'
                },
                "thesisAbstract": {
                    plainText: 'Abstract',
                    htmlText: 'Abstract'
                },
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onAny()
                .reply(403, {});

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CURRENT_ACCOUNT_ANONYMOUS,
                actions.CREATE_RECORD_FAILED
            ];

            try {
                await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            } catch (e) {
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
            }
        });

        it('dispatches expected actions if patch record fails', async () => {
            const testInput = {
                "thesisTitle": {
                    planText: 'Title',
                    htmlText: 'Title'
                },
                "thesisAbstract": {
                    plainText: 'Abstract',
                    htmlText: 'Abstract'
                },
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)",
                "files": {
                    "queue": [
                        {
                            "name": "test.txt",
                            "fileData": {
                                "name": "test.txt"
                            }
                        }
                    ]
                }
            };
            const testPid = 'UQ:396321';
            const pidRequest = {pid: testPid};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onGet(repositories.routes.FILE_UPLOAD_API({pid: testPid, fileName: "test.txt"}).apiUrl)
                .reply(200, 's3-ap-southeast-2.amazonaws.com')
                .onPut('s3-ap-southeast-2.amazonaws.com', {"name": "test.txt"})
                .reply(200, {})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(500);

            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                'FILE_UPLOAD_STARTED',
                'FILE_UPLOAD_PROGRESS@test.txt',
                actions.APP_ALERT_SHOW,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on issues api posts comments successfully', async () => {
            const testInput = {
                "thesisTitle": {
                    planText: 'Title',
                    htmlText: 'Title'
                },
                "thesisAbstract": {
                    plainText: 'Abstract',
                    htmlText: 'Abstract'
                },
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)",
                "comments": 'This is a test'
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.RECORDS_ISSUES_API(pidRequest).apiUrl)
                .reply(200, {data: {}});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on issues api failure to post comments', async () => {
            const testInput = {
                "thesisTitle": {
                    planText: 'Title',
                    htmlText: 'Title'
                },
                "thesisAbstract": {
                    plainText: 'Abstract',
                    htmlText: 'Abstract'
                },
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)",
                "comments": 'This is a test'
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.RECORDS_ISSUES_API(pidRequest).apiUrl)
                .reply(500);


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions for action with only the basic fields', async () => {
            const testInput = {
                "thesisTitle": {
                    planText: 'Title',
                    htmlText: 'Title'
                },
                "thesisAbstract": {
                    plainText: 'Abstract',
                    htmlText: 'Abstract'
                },
                "rek_title": "test",
                "rek_display_type": 179,
                "editors": [],
                "supervisors": [],
                "files": [],
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)",
                "fieldOfResearch": [{
                    "rek_value": {
                        "key": 7
                    },
                    "rek_order": 1
                }],
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {...record}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {...record}});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on successful save with alternate record format', async () => {
            const testInput = {
                "thesisTitle": {
                    planText: 'Title',
                    htmlText: 'Title'
                },
                "thesisAbstract": {
                    plainText: 'Abstract',
                    htmlText: 'Abstract'
                },
                "currentAuthor": [
                    {
                        "nameAsPublished": "Researcher, J",
                        "authorId": 410
                    }
                ],
                "rek_title": "test",
                "rek_display_type": 179,
                "authors": [
                    {
                        "nameAsPublished": "test",
                        "disabled": false,
                        "selected": true,
                        "authorId": 410
                    }
                ],
                "editors": [],
                "files": [],
                "supervisors": [],
                "fieldOfResearch": "",
                "fez_record_search_key_journal_name": {
                    "rek_journal_name": "test"
                },
                "rek_date": "2017-01-01",
                "rek_subtype": "Article (original research)"
            };
            const pidRequest = {pid: 'UQ:396321'};

            mockApi
                .onPost(repositories.routes.NEW_RECORD_API().apiUrl)
                .reply(200, {data: {data: {...record}}})
                .onPatch(repositories.routes.EXISTING_RECORD_API(pidRequest).apiUrl)
                .reply(200, {data: {data: {...record}}});


            const expectedActions = [
                actions.CREATE_RECORD_SAVING,
                actions.CREATE_RECORD_SUCCESS
            ];

            await mockActionsStore.dispatch(recordActions.submitThesis(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('clearNewRecord()', () => {
        it('dispatches expected actions', async () => {
            const expectedActions = [
                actions.CREATE_RECORD_RESET
            ];

            await mockActionsStore.dispatch(recordActions.clearNewRecord());
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });
    });

    describe('getSecurity()', () => {
        it('dispatches expected actions on successful get of community', async () => {

            const testInput = {
                pid: 'UQ:396321',
                type: 'Community'
            };

            const recordWithSecurityPolicy = {
                ...record,
                rek_security_policy: 5,
                rek_object_type_lookup: 'Community'
            };

            mockApi
                .onGet(repositories.routes.COMMUNITIES_SECURITY_POLICY_API({ id: testInput.pid }).apiUrl)
                .reply(200, {data: recordWithSecurityPolicy});

            const expectedActions = [
                actions.SECURITY_POLICY_LOADING,
                actions.SECURITY_POLICY_LOADED
            ];

            const test = await mockActionsStore.dispatch(recordActions.getSecurity(testInput));
            expect(test).toEqual({
                pid: testInput.pid,
                type: recordWithSecurityPolicy.rek_object_type_lookup,
                communitySecurity: recordWithSecurityPolicy.rek_security_policy
            });
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);

        });

        it('dispatches expected actions on missing data in response', async () => {
            const testInput = {
                pid: 'UQ:123456',
                type: 'Community'
            };

            mockApi
                .onGet(repositories.routes.COMMUNITIES_SECURITY_POLICY_API({ id: testInput.pid }).apiUrl)
                .reply(200, {data: {}});

            const expectedActions = [
                actions.SECURITY_POLICY_LOADING,
                actions.SECURITY_POLICY_LOADED
            ];

            await mockActionsStore.dispatch(recordActions.getSecurity(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on missing request data', async () => {
            const testInput = {
                type: 'Collection'
            };

            mockApi
                .onGet(repositories.routes.COLLECTIONS_SECURITY_POLICY_API({}).apiUrl)
                .reply(500);

            const expectedActions = [
                actions.SECURITY_POLICY_LOADING,
                actions.APP_ALERT_SHOW,
                actions.SECURITY_POLICY_LOAD_FAILED
            ];

            let requestFailed = false;
            try {
                await mockActionsStore.dispatch(recordActions.getSecurity(testInput));
            } catch(exception) {
                expect(exception.status).toBe(500);
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                requestFailed = true;
            }
            expect(requestFailed).toBe(true);
        });

        it('dispatches expected actions on unspecified type', async () => {
            const testInput = {};

            const expectedActions = [
                actions.SECURITY_POLICY_LOAD_CANCELLED
            ];

            let requestFailed = false;
            try {
                await mockActionsStore.dispatch(recordActions.getSecurity(testInput));
            } catch(exception) {
                expect(exception.status).toBe(400);
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                requestFailed = true;
            }
            expect(requestFailed).toBe(true);
        });
    });

    describe('updateSecurity()', () => {
        it('dispatches expected actions on successful update', async () => {
            const testInput = {
                pid: 'UQ:396321',
                type: 'Community',
                communitySecurity: 2
            };

            mockApi
                .onPatch(repositories.routes.COMMUNITIES_SECURITY_POLICY_API({ id: testInput.pid }).apiUrl)
                .reply(200, {data: record});

            const expectedActions = [
                actions.SECURITY_POLICY_SAVING,
                actions.SECURITY_POLICY_SAVED
            ];

            const test = await mockActionsStore.dispatch(recordActions.updateSecurity(testInput));
            expect(test).toEqual(record);
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);

        });

        it('dispatches expected actions on missing data in response', async () => {
            const testInput = {
                pid: 'UQ:123456',
                type: 'Community'
            };

            mockApi
                .onPatch(repositories.routes.COMMUNITIES_SECURITY_POLICY_API({ id: testInput.pid }).apiUrl)
                .reply(200, {});

            const expectedActions = [
                actions.SECURITY_POLICY_SAVING,
                actions.SECURITY_POLICY_SAVED
            ];

            await mockActionsStore.dispatch(recordActions.updateSecurity(testInput));
            expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
        });

        it('dispatches expected actions on missing request data', async () => {
            const testInput = {
                type: 'Collection'
            };

            mockApi
                .onPatch(repositories.routes.COLLECTIONS_SECURITY_POLICY_API({}).apiUrl)
                .reply(500);

            const expectedActions = [
                actions.SECURITY_POLICY_SAVING,
                actions.APP_ALERT_SHOW,
                actions.SECURITY_POLICY_SAVE_FAILED
            ];

            let requestFailed = false;
            try {
                await mockActionsStore.dispatch(recordActions.updateSecurity(testInput));
            } catch(exception) {
                expect(exception.status).toBe(500);
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                requestFailed = true;
            }
            expect(requestFailed).toBe(true);
        });

        it('dispatches expected actions on unspecified type', async () => {
            const testInput = {};

            const expectedActions = [
                actions.SECURITY_POLICY_SAVE_CANCELLED
            ];

            let requestFailed = false;
            try {
                await mockActionsStore.dispatch(recordActions.updateSecurity(testInput));
            } catch(exception) {
                expect(exception.status).toBe(400);
                expect(mockActionsStore.getActions()).toHaveDispatchedActions(expectedActions);
                requestFailed = true;
            }
            expect(requestFailed).toBe(true);
        });

    });

});
