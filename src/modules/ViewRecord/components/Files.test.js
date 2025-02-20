import {journalArticle} from 'mock/data/testing/records';
import Files from "./Files";
import {FilesClass} from "./Files";

function setup(testProps, isShallow = true){
    const props = {
        theme: {},
        publication: journalArticle,
        hideCulturalSensitivityStatement: false,
        setHideCulturalSensitivityStatement: jest.fn(),
        classes: {header: 'header'},
        ...testProps
    };
    return getElement(FilesClass, props, isShallow);
}

describe('Files Component ', () => {

    const MockDate = require('mockdate');
    beforeEach(() => {
        MockDate.set('2020-01-01T00:00:00.000Z', 10);
    });

    afterEach(() => {
        MockDate.reset();
    });

    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component 2', () => {
        const wrapper = setup({
            hideCulturalSensitivityStatement: false,
            publication: {
                ...journalArticle,
                fez_record_search_key_advisory_statement: {
                    rek_advisory_statement: null
                }
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render component full mount', () => {
        const wrapper = getElement(Files, {theme: {},
            publication: journalArticle,
            hideCulturalSensitivityStatement: false,
            setHideCulturalSensitivityStatement: jest.fn(),
            classes: {header: 'header'}}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render cultural message', () => {
        const wrapper = setup({publication: {...journalArticle, fez_record_search_key_advisory_statement: {rek_advisory_statement: 'hello'}}, hideCulturalSensitivityStatement: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render cultural message', () => {
        const wrapper = setup({publication: {...journalArticle, fez_record_search_key_advisory_statement: {rek_advisory_statement: 'hello'}}, hideCulturalSensitivityStatement: false});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render component with no files', () => {
        const publication = Object.assign({}, journalArticle);
        delete publication.fez_datastream_info;
        const wrapper = setup({publication:publication});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render bytes correctly', () => {
        const wrapper = setup({});
        expect(wrapper.instance().formatBytes(0)).toEqual('0 Bytes');
        expect(wrapper.instance().formatBytes(1024)).toEqual('1 KB');
        expect(wrapper.instance().formatBytes(1048576)).toEqual('1 MB');
    });

    it('should render icon for mimeType', () => {
        const wrapper = setup({});

        wrapper.instance().renderFileIcon('UQ:1', 'blablabla');
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().renderFileIcon('UQ:1', 'image/jpg');
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().renderFileIcon('UQ:1', 'video/quicktime');
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().renderFileIcon('UQ:1', 'audio/mp3');
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().renderFileIcon('UQ:1', 'app/pdf');
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.instance().renderFileIcon('UQ:1', 'image/jpg', 'test.tiff', 'thumbnail_test.jpg', 'preview_test.jpg', true);
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set state on showPreview', () => {
        const wrapper = setup({});
        const mediaUrl = 'mediaUrl';
        const previewMediaUrl = 'previewMediaUrl';
        const mimeType = 'image/jpeg';
        wrapper.instance().showPreview(mediaUrl, previewMediaUrl, mimeType);
        expect(wrapper.state().preview.previewMediaUrl).toEqual(previewMediaUrl);
        expect(wrapper.state().preview.mediaUrl).toEqual(mediaUrl);
        expect(wrapper.state().preview.mimeType).toEqual(mimeType);
    });

    it('should calculate OA status of files', () => {
        const publicationEmbargoOAFile = {
            rek_created_date: '2019-12-01T00:00:00Z',
            rek_pid: 'pid:111',
            fez_record_search_key_oa_status: {
                rek_oa_status: 453695
            },
            fez_datastream_info: [
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "UQ357538_OA.pdf",
                    "dsi_embargo_date": "2021-12-01",
                    "dsi_open_access": null,
                    "dsi_label": "Full text (open access)",
                    "dsi_mimetype": "application\/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1526884
                },
                {
                    "dsi_pid": "UQ:1232313",
                    "dsi_dsid": "earlierFile.pdf",
                    "dsi_embargo_date": "2021-11-01",
                    "dsi_open_access": null,
                    "dsi_label": "Full text (open access)",
                    "dsi_mimetype": "application\/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1526884
                },
                {
                    "dsi_pid": "UQ:1232313",
                    "dsi_dsid": "earlierFile.pdf",
                    "dsi_embargo_date": "2019-12-02",
                    "dsi_open_access": null,
                    "dsi_label": "Full text (open access)",
                    "dsi_mimetype": "application\/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1526884
                },
                {
                    "dsi_pid": "UQ:1232313",
                    "dsi_dsid": "earlierFile.pdf",
                    "dsi_embargo_date": null,
                    "dsi_open_access": null,
                    "dsi_label": "Full text (open access)",
                    "dsi_mimetype": "application\/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1526884
                }],
        };
        const wrapper = setup({});
        expect(wrapper.instance().getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[0].dsi_embargo_date))
            .toEqual({"embargoDate": "1st December 2021", "isOpenAccess": false, "openAccessStatusId": 453695});
        expect(wrapper.instance().getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[1].dsi_embargo_date))
            .toEqual({"embargoDate": "1st November 2021", "isOpenAccess": false, "openAccessStatusId": 453695});
        expect(wrapper.instance().getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[2].dsi_embargo_date))
            .toEqual({"embargoDate": null, "isOpenAccess": true, "openAccessStatusId": 453695});
        expect(wrapper.instance().getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[3].dsi_embargo_date))
            .toEqual({"embargoDate": null, "isOpenAccess": true, "openAccessStatusId": 453695});

    });

    it('should clean up state on hidePreview', () => {
        const wrapper = setup({});
        const mediaUrl = 'mediaUrl';
        const previewMediaUrl = 'previewMediaUrl';
        const mimeType = 'image/jpeg';
        wrapper.instance().showPreview(mediaUrl, previewMediaUrl, mimeType);
        wrapper.instance().hidePreview();
        expect(wrapper.state().preview.previewMediaUrl).toEqual(null);
        expect(wrapper.state().preview.mediaUrl).toEqual(null);
        expect(wrapper.state().preview.mimeType).toEqual(null);
    });

    it('should not calculate OA of files if search key not present', () => {
        const publicationEmbargoOAFile = {
            rek_created_date: '2019-12-01T00:00:00Z',
            rek_pid: 'pid:111',
            fez_datastream_info: [
                {
                    "dsi_pid": "UQ:357538",
                    "dsi_dsid": "UQ357538_OA.pdf",
                    "dsi_embargo_date": "2021-12-01",
                    "dsi_open_access": null,
                    "dsi_label": "Full text (open access)",
                    "dsi_mimetype": "application\/pdf",
                    "dsi_copyright": null,
                    "dsi_state": "A",
                    "dsi_size": 1526884
                }],
        };
        const wrapper = setup({});
        expect(wrapper.instance().getFileOpenAccessStatus(publicationEmbargoOAFile, publicationEmbargoOAFile.fez_datastream_info[0].dsi_embargo_date))
            .toEqual({"embargoDate": null, "isOpenAccess": false, "openAccessStatusId": null});
    });

    it('should correctly get dataStream item for thumbnail and preview images', () => {
        const thumbnailFileName = 'thumbnail_AL_LH_01.jpg';
        const previewFileName = 'preview_AL_LH_01.jpg';
        const fez_datastream_info = [
            {
                "dsi_pid": "UQ:107683",
                "dsi_dsid": "AL_LH_01.tif",
                "dsi_embargo_date": null,
                "dsi_open_access": 1,
                "dsi_label": "",
                "dsi_mimetype": "image/tiff",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 27932352
            },
            {
                "dsi_pid": "UQ:107683",
                "dsi_dsid": "FezACML_AL_LH_01.tif.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "FezACML security for datastream - AL_LH_01.tif",
                "dsi_mimetype": "text/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 64
            },
            {
                "dsi_pid": "UQ:107683",
                "dsi_dsid": "FezACML_UQ_107683.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "FezACML security for PID - UQ:107683",
                "dsi_mimetype": "text/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3633
            },
            {
                "dsi_pid": "UQ:107683",
                "dsi_dsid": "presmd_AL_LH_01.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "application/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 239623
            },
            {
                "dsi_pid": "UQ:107683",
                "dsi_dsid": "preview_AL_LH_01.jpg",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "image/jpeg",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 95360
            },
            {
                "dsi_pid": "UQ:107683",
                "dsi_dsid": "thumbnail_AL_LH_01.jpg",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "image/jpeg",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3912
            },
            {
                "dsi_pid": "UQ:107683",
                "dsi_dsid": "web_AL_LH_01.jpg",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "image/jpeg",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 163244
            }
        ];

        const wrapper = setup({});
        expect(wrapper.instance().searchByKey(fez_datastream_info, 'dsi_dsid', thumbnailFileName)).toEqual({
            "dsi_pid": "UQ:107683",
            "dsi_dsid": "thumbnail_AL_LH_01.jpg",
            "dsi_embargo_date": null,
            "dsi_open_access": null,
            "dsi_label": "",
            "dsi_mimetype": "image/jpeg",
            "dsi_copyright": null,
            "dsi_state": "A",
            "dsi_size": 3912
        });

        expect(wrapper.instance().searchByKey(fez_datastream_info, 'dsi_dsid', previewFileName)).toEqual({
            "dsi_pid": "UQ:107683",
            "dsi_dsid": "preview_AL_LH_01.jpg",
            "dsi_embargo_date": null,
            "dsi_open_access": null,
            "dsi_label": "",
            "dsi_mimetype": "image/jpeg",
            "dsi_copyright": null,
            "dsi_state": "A",
            "dsi_size": 95360
        });
    });

    it('should render alert for video files and firefox', () => {
        const pub = {
            "rek_pid": "UQ:185044",
            "rek_title_xsdmf_id": 10766,
            "rek_title": "An experimental study of tidal bore propagation: The impact of bridge piers and channel constriction",
            "rek_description_xsdmf_id": 11455,
            "rek_description": "A tidal bore is an unsteady flow motion generated by the rapid water level rise at the river mouth during the early flood tide when the tidal range exceeds 4 to 6 m, the estuary bathymetry amplifies the tidal wave and the freshwater level is low. The tidal bore is an abrupt rise in water depth associated with a discontinuity in water depth and velocity at the bore front. The present study examines the turbulence and turbulent mixing generated by the passage of an undular tidal bore in a short channel constriction such as a set of bridge piers. Some new experiments were conducted in a large rectangular prismatic channel. Then a short channel constriction that was a 1/20 scale model of the Pont Aubaud on the Sélune River in the Baie du Mont Saint Michel was installed. The free-surface properties of undular tidal bores were carefully documented for both configurations. The analysis of the parametric relationship between momentum function and specific energy showed that the undular flow properties were restricted to the subcritical branch of the M-E diagram, while the quantitative results indicated that the effects of streamline curvature could not be ignored. The free-surface undulation profiles exhibited a quasi-periodic shape, but both field measurements and laboratory observations demonstrated that neither the linear wave theory nor the Boussinesq equation theory captured the fine details of the free-surface profiles. An analysis of the potential energy of the undular tidal bore showed that the potential energy of the free-surface undulations represented up to 30% of the potential energy of the tidal bore. The presence of the channel constriction had a major impact on the free-surface properties. In the channel throat, the wave motion was three-dimensional, pseudo-chaotic and energetic and the undular bore lost nearly one third of its potential energy per surface area as it propagated through the channel constriction. The velocity data sets suggested the upstream advection of energetic turbulent events and vorticity behind the bore front. It is proposed that these energetic turbulent events were some macro-turbulence generated by secondary currents. With the channel constriction, some intense large-scale turbulence was further produced by the constriction. The proposed mechanism was consistent with some field observations in the Daly River tidal bore in 2003. Overall the presence of a channel constriction (e.g. bridge piers) does impact onto the bore propagation. It is associated with some energy loss and the development of large-scale coherent structures, and these processes might induce some river bed scour on the vicinity of the bridge piers. The technical report is supported by a digital appendix (Appendix B) containing five movies available at the University of Queensland institutional open access repository UQeSpace {http://espace.library.uq.edu.au/}.",
            "rek_display_type_xsdmf_id": 3673,
            "rek_display_type": 181,
            "rek_status_xsdmf_id": 3680,
            "rek_status": 2,
            "rek_date_xsdmf_id": 6510,
            "rek_date": "2009-01-01T00:00:00Z",
            "rek_object_type_xsdmf_id": 3674,
            "rek_object_type": 3,
            "rek_depositor_xsdmf_id": 7578,
            "rek_depositor": 737,
            "rek_created_date_xsdmf_id": 3677,
            "rek_created_date": "2009-10-20T07:52:41Z",
            "rek_updated_date_xsdmf_id": 3678,
            "rek_updated_date": "2018-07-03T05:27:09Z",
            "rek_file_downloads": 1579,
            "rek_citation": "",
            "rek_genre_xsdmf_id": 7204,
            "rek_genre": "Department Technical Report",
            "rek_genre_type_xsdmf_id": null,
            "rek_genre_type": null,
            "rek_formatted_title_xsdmf_id": null,
            "rek_formatted_title": null,
            "rek_formatted_abstract_xsdmf_id": null,
            "rek_formatted_abstract": null,
            "rek_depositor_affiliation_xsdmf_id": 11881,
            "rek_depositor_affiliation": 891,
            "rek_thomson_citation_count": null,
            "rek_thomson_citation_count_xsdmf_id": null,
            "rek_subtype_xsdmf_id": null,
            "rek_subtype": null,
            "rek_scopus_citation_count": null,
            "rek_herdc_notes_xsdmf_id": null,
            "rek_herdc_notes": null,
            "rek_scopus_doc_type_xsdmf_id": null,
            "rek_scopus_doc_type": null,
            "rek_wok_doc_type_xsdmf_id": null,
            "rek_wok_doc_type": null,
            "rek_pubmed_doc_type_xsdmf_id": null,
            "rek_pubmed_doc_type": null,
            "rek_security_inherited": 1,
            "rek_altmetric_score": null,
            "rek_altmetric_score_xsdmf_id": null,
            "rek_altmetric_id": null,
            "rek_altmetric_id_xsdmf_id": null,
            "rek_copyright_xsdmf_id": 3679,
            "rek_copyright": "on",
            "fez_record_search_key_article_number": null,
            "fez_record_search_key_assigned_group_id": [],
            "fez_record_search_key_assigned_user_id": [],
            "fez_record_search_key_author": [{
                "rek_author_id": 28884294,
                "rek_author_pid": "UQ:185044",
                "rek_author_xsdmf_id": 6468,
                "rek_author": "Chanson, Hubert",
                "rek_author_order": 1
            }],
            "fez_record_search_key_author_affiliation_country": [],
            "fez_record_search_key_author_affiliation_full_address": [],
            "fez_record_search_key_author_affiliation_id": [],
            "fez_record_search_key_author_affiliation_name": [],
            "fez_record_search_key_author_id": [{
                "rek_author_id_id": 28256092,
                "rek_author_id_pid": "UQ:185044",
                "rek_author_id_xsdmf_id": 6463,
                "rek_author_id": 193,
                "rek_author_id_order": 1,
                "rek_author_id_lookup": "Chanson, Hubert"
            }],
            "fez_record_search_key_contributor": [],
            "fez_record_search_key_contributor_id": [],
            "fez_record_search_key_corresponding_country": [],
            "fez_record_search_key_corresponding_email": [],
            "fez_record_search_key_corresponding_name": [],
            "fez_record_search_key_corresponding_organisation": [],
            "fez_record_search_key_datastream_policy": null,
            "fez_record_search_key_end_page": {
                "rek_end_page_id": 5501977,
                "rek_end_page_pid": "UQ:185044",
                "rek_end_page_xsdmf_id": 10776,
                "rek_end_page": "104"
            },
            "fez_record_search_key_file_attachment_access_condition": [],
            "fez_record_search_key_file_attachment_embargo_date": [],
            "fez_record_search_key_file_attachment_name": [{
                "rek_file_attachment_name_id": 3880147,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "CH7409_movie_1.mov",
                "rek_file_attachment_name_order": 1
            }, {
                "rek_file_attachment_name_id": 3880148,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "CH7409_movie_2.mov",
                "rek_file_attachment_name_order": 2
            }, {
                "rek_file_attachment_name_id": 3880149,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "CH7409_movie_3.mov",
                "rek_file_attachment_name_order": 3
            }, {
                "rek_file_attachment_name_id": 3880150,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "CH7409_movie_4.mov",
                "rek_file_attachment_name_order": 4
            }, {
                "rek_file_attachment_name_id": 3880151,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "CH7409_movie_5.mov",
                "rek_file_attachment_name_order": 5
            }, {
                "rek_file_attachment_name_id": 3880152,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "ch7409_report.pdf",
                "rek_file_attachment_name_order": 6
            }, {
                "rek_file_attachment_name_id": 3880153,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "presmd_CH7409_movie_1.xml",
                "rek_file_attachment_name_order": 7
            }, {
                "rek_file_attachment_name_id": 3880154,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "presmd_CH7409_movie_2.xml",
                "rek_file_attachment_name_order": 8
            }, {
                "rek_file_attachment_name_id": 3880155,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "presmd_CH7409_movie_3.xml",
                "rek_file_attachment_name_order": 9
            }, {
                "rek_file_attachment_name_id": 3880156,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "presmd_CH7409_movie_4.xml",
                "rek_file_attachment_name_order": 10
            }, {
                "rek_file_attachment_name_id": 3880157,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "presmd_CH7409_movie_5.xml",
                "rek_file_attachment_name_order": 11
            }, {
                "rek_file_attachment_name_id": 3880158,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "presmd_ch7409_report.xml",
                "rek_file_attachment_name_order": 12
            }, {
                "rek_file_attachment_name_id": 3880159,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "stream_CH7409_movie_1.flv",
                "rek_file_attachment_name_order": 13
            }, {
                "rek_file_attachment_name_id": 3880160,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "stream_CH7409_movie_2.flv",
                "rek_file_attachment_name_order": 14
            }, {
                "rek_file_attachment_name_id": 3880161,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "stream_CH7409_movie_3.flv",
                "rek_file_attachment_name_order": 15
            }, {
                "rek_file_attachment_name_id": 3880162,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "stream_CH7409_movie_4.flv",
                "rek_file_attachment_name_order": 16
            }, {
                "rek_file_attachment_name_id": 3880163,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "stream_CH7409_movie_5.flv",
                "rek_file_attachment_name_order": 17
            }, {
                "rek_file_attachment_name_id": 3880164,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "thumbnail_CH7409_movie_1.jpg",
                "rek_file_attachment_name_order": 18
            }, {
                "rek_file_attachment_name_id": 3880165,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "thumbnail_CH7409_movie_2.jpg",
                "rek_file_attachment_name_order": 19
            }, {
                "rek_file_attachment_name_id": 3880166,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "thumbnail_CH7409_movie_3.jpg",
                "rek_file_attachment_name_order": 20
            }, {
                "rek_file_attachment_name_id": 3880167,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "thumbnail_CH7409_movie_4.jpg",
                "rek_file_attachment_name_order": 21
            }, {
                "rek_file_attachment_name_id": 3880168,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "thumbnail_CH7409_movie_5.jpg",
                "rek_file_attachment_name_order": 22
            }],
            "fez_record_search_key_grant_acronym": [],
            "fez_record_search_key_grant_agency": [],
            "fez_record_search_key_grant_agency_id": [],
            "fez_record_search_key_grant_text": [],
            "fez_record_search_key_herdc_code": null,
            "fez_record_search_key_herdc_status": null,
            "fez_record_search_key_institutional_status": null,
            "fez_record_search_key_isderivationof": [],
            "fez_record_search_key_isi_loc": null,
            "fez_record_search_key_ismemberof": [{
                "rek_ismemberof_id": 11517593,
                "rek_ismemberof_pid": "UQ:185044",
                "rek_ismemberof_xsdmf_id": 149,
                "rek_ismemberof": "UQ:195545",
                "rek_ismemberof_order": 1,
                "rek_ismemberof_lookup": "School of Civil Engineering Publications"
            }],
            "fez_record_search_key_keywords": [{
                "rek_keywords_id": 29165376,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Tidal bores",
                "rek_keywords_order": 1
            }, {
                "rek_keywords_id": 29165377,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Turbulence",
                "rek_keywords_order": 2
            }, {
                "rek_keywords_id": 29165378,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Positive surges",
                "rek_keywords_order": 3
            }, {
                "rek_keywords_id": 29165379,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Bridge piers",
                "rek_keywords_order": 4
            }, {
                "rek_keywords_id": 29165380,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Physical modelling",
                "rek_keywords_order": 5
            }, {
                "rek_keywords_id": 29165381,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Energy Dissipation",
                "rek_keywords_order": 6
            }, {
                "rek_keywords_id": 29165382,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Wave transformation",
                "rek_keywords_order": 7
            }, {
                "rek_keywords_id": 29165383,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Bore front",
                "rek_keywords_order": 8
            }, {
                "rek_keywords_id": 29165384,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Turbulent mixing",
                "rek_keywords_order": 9
            }, {
                "rek_keywords_id": 29165385,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Secondary currents",
                "rek_keywords_order": 10
            }, {
                "rek_keywords_id": 29165386,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Bridge structures",
                "rek_keywords_order": 11
            }],
            "fez_record_search_key_language": [{
                "rek_language_id": 5225705,
                "rek_language_pid": "UQ:185044",
                "rek_language_xsdmf_id": 10772,
                "rek_language": "eng",
                "rek_language_order": 1
            }],
            "fez_record_search_key_link": [],
            "fez_record_search_key_link_description": [],
            "fez_record_search_key_notes": {
                "rek_notes_id": 1110911,
                "rek_notes_pid": "UQ:185044",
                "rek_notes_xsdmf_id": 12446,
                "rek_notes": "The full bibliographic details are: CHANSON, H. (2009). \"An Experimental Study of Tidal Bore Propagation: the Impact of Bridge Piers and Channel Constriction.\" Hydraulic Model Report No. CH74/08, School of Civil Engineering, The University of Queensland, Brisbane, Australia, 110 pages & 5 movie files (ISBN 9781864999600). The technical report is supported by a digital appendix (Appendix B) containing five movies available at the University of Queensland institutional open access repository UQeSpace {http://espace.library.uq.edu.au/}. All the movies are Copyrights Hubert CHANSON 2009."
            },
            "fez_record_search_key_oa_status": {
                "rek_oa_status_id": 319686,
                "rek_oa_status_pid": "UQ:185044",
                "rek_oa_status_xsdmf_id": 16978,
                "rek_oa_status": 453697,
                "rek_oa_status_lookup": "Other"
            },
            "fez_record_search_key_org_name": {
                "rek_org_name_id": 349788,
                "rek_org_name_pid": "UQ:185044",
                "rek_org_name_xsdmf_id": 6512,
                "rek_org_name": "The University of Queensland"
            },
            "fez_record_search_key_org_unit_name": {
                "rek_org_unit_name_id": 339387,
                "rek_org_unit_name_pid": "UQ:185044",
                "rek_org_unit_name_xsdmf_id": 6505,
                "rek_org_unit_name": "Civil Engneering"
            },
            "fez_record_search_key_publisher": {
                "rek_publisher_id": 4431611,
                "rek_publisher_pid": "UQ:185044",
                "rek_publisher_xsdmf_id": 6508,
                "rek_publisher": "School of Civil Engineering, The University of Queensland"
            },
            "fez_record_search_key_refereed": null,
            "fez_record_search_key_refereed_source": {
                "rek_refereed_source_id": 1182183,
                "rek_refereed_source_pid": "UQ:185044",
                "rek_refereed_source_xsdmf_id": 16623,
                "rek_refereed_source": "453638",
                "rek_refereed_source_lookup": "Not yet assessed"
            },
            "fez_record_search_key_report_number": {
                "rek_report_number_id": 16061,
                "rek_report_number_pid": "UQ:185044",
                "rek_report_number_xsdmf_id": 6502,
                "rek_report_number": "CH74/09"
            },
            "fez_record_search_key_scopus_id": null,
            "fez_record_search_key_series": {
                "rek_series_id": 193574,
                "rek_series_pid": "UQ:185044",
                "rek_series_xsdmf_id": 6503,
                "rek_series": "Hydraulic Model Report CH"
            },
            "fez_record_search_key_start_page": {
                "rek_start_page_id": 5572241,
                "rek_start_page_pid": "UQ:185044",
                "rek_start_page_xsdmf_id": 10775,
                "rek_start_page": "1"
            },
            "fez_record_search_key_subject": [{
                "rek_subject_id": 9094390,
                "rek_subject_pid": "UQ:185044",
                "rek_subject_xsdmf_id": 6480,
                "rek_subject": 452292,
                "rek_subject_order": 1,
                "rek_subject_lookup": "09 Engineering"
            }, {
                "rek_subject_id": 9094391,
                "rek_subject_pid": "UQ:185044",
                "rek_subject_xsdmf_id": 6480,
                "rek_subject": 452329,
                "rek_subject_order": 2,
                "rek_subject_lookup": "0905 Civil Engineering"
            }, {
                "rek_subject_id": 9094392,
                "rek_subject_pid": "UQ:185044",
                "rek_subject_xsdmf_id": 6480,
                "rek_subject": 452338,
                "rek_subject_order": 3,
                "rek_subject_lookup": "090509 Water Resources Engineering"
            }],
            "fez_record_search_key_total_pages": {
                "rek_total_pages_id": 5481094,
                "rek_total_pages_pid": "UQ:185044",
                "rek_total_pages_xsdmf_id": 10777,
                "rek_total_pages": "110"
            },
            "fez_record_search_key_translated_title": null,
            "fez_record_search_key_wok_doc_types": [],
            "fez_record_search_key_issn": [],
            "fez_record_search_key_doi": null,
            "fez_datastream_info": [{
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "CH7409_movie_1.mov",
                "dsi_embargo_date": null,
                "dsi_open_access": 1,
                "dsi_label": "Movie 1",
                "dsi_mimetype": "video/quicktime",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3000090
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "CH7409_movie_2.mov",
                "dsi_embargo_date": null,
                "dsi_open_access": 1,
                "dsi_label": "Movie 2",
                "dsi_mimetype": "video/quicktime",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 2750166
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "CH7409_movie_3.mov",
                "dsi_embargo_date": null,
                "dsi_open_access": 1,
                "dsi_label": "Movie 3",
                "dsi_mimetype": "video/quicktime",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3000090
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "CH7409_movie_4.mov",
                "dsi_embargo_date": null,
                "dsi_open_access": 1,
                "dsi_label": "Movie 4",
                "dsi_mimetype": "video/quicktime",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 4500146
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "CH7409_movie_5.mov",
                "dsi_embargo_date": null,
                "dsi_open_access": 1,
                "dsi_label": "Movie 5",
                "dsi_mimetype": "video/quicktime",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 1175050
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "ch7409_report.pdf",
                "dsi_embargo_date": null,
                "dsi_open_access": 1,
                "dsi_label": "Technical report PDF file",
                "dsi_mimetype": "application/pdf",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 6998485
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "Chanson_movie_1.mov",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "Movie 1",
                "dsi_mimetype": "video/quicktime",
                "dsi_copyright": null,
                "dsi_state": "D",
                "dsi_size": 3000090
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "FezACML_CH7409_movie_1.mov.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "FezACML security for datastream - CH7409_movie_1.mov",
                "dsi_mimetype": "text/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3093
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "FezACML_CH7409_movie_2.mov.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "FezACML security for datastream - CH7409_movie_2.mov",
                "dsi_mimetype": "text/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3093
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "FezACML_CH7409_movie_3.mov.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "FezACML security for datastream - CH7409_movie_3.mov",
                "dsi_mimetype": "text/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3093
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "FezACML_CH7409_movie_4.mov.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "FezACML security for datastream - CH7409_movie_4.mov",
                "dsi_mimetype": "text/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3093
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "FezACML_CH7409_movie_5.mov.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "FezACML security for datastream - CH7409_movie_5.mov",
                "dsi_mimetype": "text/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3093
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "FezACML_UQ_185044.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "FezACML security for PID - UQ:185044",
                "dsi_mimetype": "text/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3705
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "presmd_CH7409_movie_1.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "application/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 1206
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "presmd_CH7409_movie_2.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "application/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 1206
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "presmd_CH7409_movie_3.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "application/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 1206
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "presmd_CH7409_movie_4.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "application/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 1206
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "presmd_CH7409_movie_5.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "application/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 1206
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "presmd_ch7409_report.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "application/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 277266
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "presmd_Chanson_movie_1.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "application/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 530
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "stream_CH7409_movie_1.flv",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "video/x-flv",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 340806
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "stream_CH7409_movie_2.flv",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "video/x-flv",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 357167
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "stream_CH7409_movie_3.flv",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "video/x-flv",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 371437
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "stream_CH7409_movie_4.flv",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "video/x-flv",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 551102
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "stream_CH7409_movie_5.flv",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "video/x-flv",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 286470
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "thumbnail_CH7409_movie_1.jpg",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "image/jpeg",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 5252
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "thumbnail_CH7409_movie_2.jpg",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "image/jpeg",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 6732
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "thumbnail_CH7409_movie_3.jpg",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "image/jpeg",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 5487
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "thumbnail_CH7409_movie_4.jpg",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "image/jpeg",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 9800
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "thumbnail_CH7409_movie_5.jpg",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "image/jpeg",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 7236
            }],
            "fez_matched_journals": [],
            "fez_record_search_key_has_datasets": [],
            "fez_record_search_key_has_related_datasets": [],
            "fez_record_search_key_has_derivations": [],
            "rek_status_lookup": "Published",
            "rek_object_type_lookup": "Record",
            "rek_wok_doc_type_lookup": null,
            "rek_display_type_lookup": "Department Technical Report",
            "rek_scopus_doc_type_lookup": null,
            "rek_pubmed_doc_type_lookup": null
        };
        Object.defineProperty(window.navigator, 'userAgent', {value: 'FireFox'});
        const wrapper = setup({publication: pub});
        // wrapper.instance().hasVideo === true;
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('getFileData{} branch 1', () => {
        const pub = {
            "rek_pid": "UQ:185044",
            "rek_title_xsdmf_id": 10766,
            "rek_title": "An experimental study of tidal bore propagation: The impact of bridge piers and channel constriction",
            "rek_description_xsdmf_id": 11455,
            "rek_description": "A tidal bore is an unsteady flow motion generated by the rapid water level rise at the river mouth during the early flood tide when the tidal range exceeds 4 to 6 m, the estuary bathymetry amplifies the tidal wave and the freshwater level is low. The tidal bore is an abrupt rise in water depth associated with a discontinuity in water depth and velocity at the bore front. The present study examines the turbulence and turbulent mixing generated by the passage of an undular tidal bore in a short channel constriction such as a set of bridge piers. Some new experiments were conducted in a large rectangular prismatic channel. Then a short channel constriction that was a 1/20 scale model of the Pont Aubaud on the Sélune River in the Baie du Mont Saint Michel was installed. The free-surface properties of undular tidal bores were carefully documented for both configurations. The analysis of the parametric relationship between momentum function and specific energy showed that the undular flow properties were restricted to the subcritical branch of the M-E diagram, while the quantitative results indicated that the effects of streamline curvature could not be ignored. The free-surface undulation profiles exhibited a quasi-periodic shape, but both field measurements and laboratory observations demonstrated that neither the linear wave theory nor the Boussinesq equation theory captured the fine details of the free-surface profiles. An analysis of the potential energy of the undular tidal bore showed that the potential energy of the free-surface undulations represented up to 30% of the potential energy of the tidal bore. The presence of the channel constriction had a major impact on the free-surface properties. In the channel throat, the wave motion was three-dimensional, pseudo-chaotic and energetic and the undular bore lost nearly one third of its potential energy per surface area as it propagated through the channel constriction. The velocity data sets suggested the upstream advection of energetic turbulent events and vorticity behind the bore front. It is proposed that these energetic turbulent events were some macro-turbulence generated by secondary currents. With the channel constriction, some intense large-scale turbulence was further produced by the constriction. The proposed mechanism was consistent with some field observations in the Daly River tidal bore in 2003. Overall the presence of a channel constriction (e.g. bridge piers) does impact onto the bore propagation. It is associated with some energy loss and the development of large-scale coherent structures, and these processes might induce some river bed scour on the vicinity of the bridge piers. The technical report is supported by a digital appendix (Appendix B) containing five movies available at the University of Queensland institutional open access repository UQeSpace {http://espace.library.uq.edu.au/}.",
            "rek_display_type_xsdmf_id": 3673,
            "rek_display_type": 181,
            "rek_status_xsdmf_id": 3680,
            "rek_status": 2,
            "rek_date_xsdmf_id": 6510,
            "rek_date": "2009-01-01T00:00:00Z",
            "rek_object_type_xsdmf_id": 3674,
            "rek_object_type": 3,
            "rek_depositor_xsdmf_id": 7578,
            "rek_depositor": 737,
            "rek_created_date_xsdmf_id": 3677,
            "rek_created_date": "2009-10-20T07:52:41Z",
            "rek_updated_date_xsdmf_id": 3678,
            "rek_updated_date": "2018-07-03T05:27:09Z",
            "rek_file_downloads": 1579,
            "rek_citation": "",
            "rek_genre_xsdmf_id": 7204,
            "rek_genre": "Department Technical Report",
            "rek_genre_type_xsdmf_id": null,
            "rek_genre_type": null,
            "rek_formatted_title_xsdmf_id": null,
            "rek_formatted_title": null,
            "rek_formatted_abstract_xsdmf_id": null,
            "rek_formatted_abstract": null,
            "rek_depositor_affiliation_xsdmf_id": 11881,
            "rek_depositor_affiliation": 891,
            "rek_thomson_citation_count": null,
            "rek_thomson_citation_count_xsdmf_id": null,
            "rek_subtype_xsdmf_id": null,
            "rek_subtype": null,
            "rek_scopus_citation_count": null,
            "rek_herdc_notes_xsdmf_id": null,
            "rek_herdc_notes": null,
            "rek_scopus_doc_type_xsdmf_id": null,
            "rek_scopus_doc_type": null,
            "rek_wok_doc_type_xsdmf_id": null,
            "rek_wok_doc_type": null,
            "rek_pubmed_doc_type_xsdmf_id": null,
            "rek_pubmed_doc_type": null,
            "rek_security_inherited": 1,
            "rek_altmetric_score": null,
            "rek_altmetric_score_xsdmf_id": null,
            "rek_altmetric_id": null,
            "rek_altmetric_id_xsdmf_id": null,
            "rek_copyright_xsdmf_id": 3679,
            "rek_copyright": "on",
            "fez_record_search_key_article_number": null,
            "fez_record_search_key_assigned_group_id": [],
            "fez_record_search_key_assigned_user_id": [],
            "fez_record_search_key_author": [{
                "rek_author_id": 28884294,
                "rek_author_pid": "UQ:185044",
                "rek_author_xsdmf_id": 6468,
                "rek_author": "Chanson, Hubert",
                "rek_author_order": 1
            }],
            "fez_record_search_key_author_affiliation_country": [],
            "fez_record_search_key_author_affiliation_full_address": [],
            "fez_record_search_key_author_affiliation_id": [],
            "fez_record_search_key_author_affiliation_name": [],
            "fez_record_search_key_author_id": [{
                "rek_author_id_id": 28256092,
                "rek_author_id_pid": "UQ:185044",
                "rek_author_id_xsdmf_id": 6463,
                "rek_author_id": 193,
                "rek_author_id_order": 1,
                "rek_author_id_lookup": "Chanson, Hubert"
            }],
            "fez_record_search_key_contributor": [],
            "fez_record_search_key_contributor_id": [],
            "fez_record_search_key_corresponding_country": [],
            "fez_record_search_key_corresponding_email": [],
            "fez_record_search_key_corresponding_name": [],
            "fez_record_search_key_corresponding_organisation": [],
            "fez_record_search_key_datastream_policy": null,
            "fez_record_search_key_end_page": {
                "rek_end_page_id": 5501977,
                "rek_end_page_pid": "UQ:185044",
                "rek_end_page_xsdmf_id": 10776,
                "rek_end_page": "104"
            },
            "fez_record_search_key_file_attachment_access_condition": [],
            "fez_record_search_key_file_attachment_embargo_date": [],
            "fez_record_search_key_file_attachment_name": [{
                "rek_file_attachment_name_id": 3880147,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "CH7409_movie_1.mov",
                "rek_file_attachment_name_order": 1
            }, {
                "rek_file_attachment_name_id": 3880148,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "CH7409_movie_2.mov",
                "rek_file_attachment_name_order": 2
            }, {
                "rek_file_attachment_name_id": 3880149,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "CH7409_movie_3.mov",
                "rek_file_attachment_name_order": 3
            }, {
                "rek_file_attachment_name_id": 3880150,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "CH7409_movie_4.mov",
                "rek_file_attachment_name_order": 4
            }, {
                "rek_file_attachment_name_id": 3880151,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "CH7409_movie_5.mov",
                "rek_file_attachment_name_order": 5
            }, {
                "rek_file_attachment_name_id": 3880152,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "ch7409_report.pdf",
                "rek_file_attachment_name_order": 6
            }, {
                "rek_file_attachment_name_id": 3880153,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "presmd_CH7409_movie_1.xml",
                "rek_file_attachment_name_order": 7
            }, {
                "rek_file_attachment_name_id": 3880154,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "presmd_CH7409_movie_2.xml",
                "rek_file_attachment_name_order": 8
            }, {
                "rek_file_attachment_name_id": 3880155,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "presmd_CH7409_movie_3.xml",
                "rek_file_attachment_name_order": 9
            }, {
                "rek_file_attachment_name_id": 3880156,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "presmd_CH7409_movie_4.xml",
                "rek_file_attachment_name_order": 10
            }, {
                "rek_file_attachment_name_id": 3880157,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "presmd_CH7409_movie_5.xml",
                "rek_file_attachment_name_order": 11
            }, {
                "rek_file_attachment_name_id": 3880158,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "presmd_ch7409_report.xml",
                "rek_file_attachment_name_order": 12
            }, {
                "rek_file_attachment_name_id": 3880159,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "stream_CH7409_movie_1.flv",
                "rek_file_attachment_name_order": 13
            }, {
                "rek_file_attachment_name_id": 3880160,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "stream_CH7409_movie_2.flv",
                "rek_file_attachment_name_order": 14
            }, {
                "rek_file_attachment_name_id": 3880161,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "stream_CH7409_movie_3.flv",
                "rek_file_attachment_name_order": 15
            }, {
                "rek_file_attachment_name_id": 3880162,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "stream_CH7409_movie_4.flv",
                "rek_file_attachment_name_order": 16
            }, {
                "rek_file_attachment_name_id": 3880163,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "stream_CH7409_movie_5.flv",
                "rek_file_attachment_name_order": 17
            }, {
                "rek_file_attachment_name_id": 3880164,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "thumbnail_CH7409_movie_1.jpg",
                "rek_file_attachment_name_order": 18
            }, {
                "rek_file_attachment_name_id": 3880165,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "thumbnail_CH7409_movie_2.jpg",
                "rek_file_attachment_name_order": 19
            }, {
                "rek_file_attachment_name_id": 3880166,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "thumbnail_CH7409_movie_3.jpg",
                "rek_file_attachment_name_order": 20
            }, {
                "rek_file_attachment_name_id": 3880167,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "thumbnail_CH7409_movie_4.jpg",
                "rek_file_attachment_name_order": 21
            }, {
                "rek_file_attachment_name_id": 3880168,
                "rek_file_attachment_name_pid": "UQ:185044",
                "rek_file_attachment_name_xsdmf_id": 6562,
                "rek_file_attachment_name": "thumbnail_CH7409_movie_5.jpg",
                "rek_file_attachment_name_order": 22
            }],
            "fez_record_search_key_grant_acronym": [],
            "fez_record_search_key_grant_agency": [],
            "fez_record_search_key_grant_agency_id": [],
            "fez_record_search_key_grant_text": [],
            "fez_record_search_key_herdc_code": null,
            "fez_record_search_key_herdc_status": null,
            "fez_record_search_key_institutional_status": null,
            "fez_record_search_key_isderivationof": [],
            "fez_record_search_key_isi_loc": null,
            "fez_record_search_key_ismemberof": [{
                "rek_ismemberof_id": 11517593,
                "rek_ismemberof_pid": "UQ:185044",
                "rek_ismemberof_xsdmf_id": 149,
                "rek_ismemberof": "UQ:195545",
                "rek_ismemberof_order": 1,
                "rek_ismemberof_lookup": "School of Civil Engineering Publications"
            }],
            "fez_record_search_key_keywords": [{
                "rek_keywords_id": 29165376,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Tidal bores",
                "rek_keywords_order": 1
            }, {
                "rek_keywords_id": 29165377,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Turbulence",
                "rek_keywords_order": 2
            }, {
                "rek_keywords_id": 29165378,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Positive surges",
                "rek_keywords_order": 3
            }, {
                "rek_keywords_id": 29165379,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Bridge piers",
                "rek_keywords_order": 4
            }, {
                "rek_keywords_id": 29165380,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Physical modelling",
                "rek_keywords_order": 5
            }, {
                "rek_keywords_id": 29165381,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Energy Dissipation",
                "rek_keywords_order": 6
            }, {
                "rek_keywords_id": 29165382,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Wave transformation",
                "rek_keywords_order": 7
            }, {
                "rek_keywords_id": 29165383,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Bore front",
                "rek_keywords_order": 8
            }, {
                "rek_keywords_id": 29165384,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Turbulent mixing",
                "rek_keywords_order": 9
            }, {
                "rek_keywords_id": 29165385,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Secondary currents",
                "rek_keywords_order": 10
            }, {
                "rek_keywords_id": 29165386,
                "rek_keywords_pid": "UQ:185044",
                "rek_keywords_xsdmf_id": 7952,
                "rek_keywords": "Bridge structures",
                "rek_keywords_order": 11
            }],
            "fez_record_search_key_language": [{
                "rek_language_id": 5225705,
                "rek_language_pid": "UQ:185044",
                "rek_language_xsdmf_id": 10772,
                "rek_language": "eng",
                "rek_language_order": 1
            }],
            "fez_record_search_key_link": [],
            "fez_record_search_key_link_description": [],
            "fez_record_search_key_notes": {
                "rek_notes_id": 1110911,
                "rek_notes_pid": "UQ:185044",
                "rek_notes_xsdmf_id": 12446,
                "rek_notes": "The full bibliographic details are: CHANSON, H. (2009). \"An Experimental Study of Tidal Bore Propagation: the Impact of Bridge Piers and Channel Constriction.\" Hydraulic Model Report No. CH74/08, School of Civil Engineering, The University of Queensland, Brisbane, Australia, 110 pages & 5 movie files (ISBN 9781864999600). The technical report is supported by a digital appendix (Appendix B) containing five movies available at the University of Queensland institutional open access repository UQeSpace {http://espace.library.uq.edu.au/}. All the movies are Copyrights Hubert CHANSON 2009."
            },
            "fez_record_search_key_oa_status": {
                "rek_oa_status_id": 319686,
                "rek_oa_status_pid": "UQ:185044",
                "rek_oa_status_xsdmf_id": 16978,
                "rek_oa_status": 453693,
                "rek_oa_status_lookup": "Other"
            },
            "fez_record_search_key_org_name": {
                "rek_org_name_id": 349788,
                "rek_org_name_pid": "UQ:185044",
                "rek_org_name_xsdmf_id": 6512,
                "rek_org_name": "The University of Queensland"
            },
            "fez_record_search_key_org_unit_name": {
                "rek_org_unit_name_id": 339387,
                "rek_org_unit_name_pid": "UQ:185044",
                "rek_org_unit_name_xsdmf_id": 6505,
                "rek_org_unit_name": "Civil Engneering"
            },
            "fez_record_search_key_publisher": {
                "rek_publisher_id": 4431611,
                "rek_publisher_pid": "UQ:185044",
                "rek_publisher_xsdmf_id": 6508,
                "rek_publisher": "School of Civil Engineering, The University of Queensland"
            },
            "fez_record_search_key_refereed": null,
            "fez_record_search_key_refereed_source": {
                "rek_refereed_source_id": 1182183,
                "rek_refereed_source_pid": "UQ:185044",
                "rek_refereed_source_xsdmf_id": 16623,
                "rek_refereed_source": "453638",
                "rek_refereed_source_lookup": "Not yet assessed"
            },
            "fez_record_search_key_report_number": {
                "rek_report_number_id": 16061,
                "rek_report_number_pid": "UQ:185044",
                "rek_report_number_xsdmf_id": 6502,
                "rek_report_number": "CH74/09"
            },
            "fez_record_search_key_scopus_id": null,
            "fez_record_search_key_series": {
                "rek_series_id": 193574,
                "rek_series_pid": "UQ:185044",
                "rek_series_xsdmf_id": 6503,
                "rek_series": "Hydraulic Model Report CH"
            },
            "fez_record_search_key_start_page": {
                "rek_start_page_id": 5572241,
                "rek_start_page_pid": "UQ:185044",
                "rek_start_page_xsdmf_id": 10775,
                "rek_start_page": "1"
            },
            "fez_record_search_key_subject": [{
                "rek_subject_id": 9094390,
                "rek_subject_pid": "UQ:185044",
                "rek_subject_xsdmf_id": 6480,
                "rek_subject": 452292,
                "rek_subject_order": 1,
                "rek_subject_lookup": "09 Engineering"
            }, {
                "rek_subject_id": 9094391,
                "rek_subject_pid": "UQ:185044",
                "rek_subject_xsdmf_id": 6480,
                "rek_subject": 452329,
                "rek_subject_order": 2,
                "rek_subject_lookup": "0905 Civil Engineering"
            }, {
                "rek_subject_id": 9094392,
                "rek_subject_pid": "UQ:185044",
                "rek_subject_xsdmf_id": 6480,
                "rek_subject": 452338,
                "rek_subject_order": 3,
                "rek_subject_lookup": "090509 Water Resources Engineering"
            }],
            "fez_record_search_key_total_pages": {
                "rek_total_pages_id": 5481094,
                "rek_total_pages_pid": "UQ:185044",
                "rek_total_pages_xsdmf_id": 10777,
                "rek_total_pages": "110"
            },
            "fez_record_search_key_translated_title": null,
            "fez_record_search_key_wok_doc_types": [],
            "fez_record_search_key_issn": [],
            "fez_record_search_key_doi": null,
            "fez_datastream_info": [{
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "CH7409_movie_1.mov",
                "dsi_embargo_date": '01-01-2001',
                "dsi_open_access": 1,
                "dsi_label": "Movie 1",
                "dsi_mimetype": null,
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3000090
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "CH7409_movie_2.mov",
                "dsi_embargo_date": '',
                "dsi_open_access": 1,
                "dsi_label": "Movie 2",
                "dsi_mimetype": "video/quicktime",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 2750166
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "CH7409_movie_3.mov",
                "dsi_embargo_date": null,
                "dsi_open_access": 1,
                "dsi_label": "Movie 3",
                "dsi_mimetype": "video/quicktime",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3000090
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "CH7409_movie_4.mov",
                "dsi_embargo_date": null,
                "dsi_open_access": 1,
                "dsi_label": "Movie 4",
                "dsi_mimetype": "video/quicktime",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 4500146
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "CH7409_movie_5.mov",
                "dsi_embargo_date": null,
                "dsi_open_access": 1,
                "dsi_label": "Movie 5",
                "dsi_mimetype": "video/quicktime",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 1175050
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "ch7409_report.pdf",
                "dsi_embargo_date": null,
                "dsi_open_access": 1,
                "dsi_label": "Technical report PDF file",
                "dsi_mimetype": "application/pdf",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 6998485
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "Chanson_movie_1.mov",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "Movie 1",
                "dsi_mimetype": "video/quicktime",
                "dsi_copyright": null,
                "dsi_state": "D",
                "dsi_size": 3000090
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "FezACML_CH7409_movie_1.mov.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "FezACML security for datastream - CH7409_movie_1.mov",
                "dsi_mimetype": "text/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3093
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "FezACML_CH7409_movie_2.mov.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "FezACML security for datastream - CH7409_movie_2.mov",
                "dsi_mimetype": "text/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3093
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "FezACML_CH7409_movie_3.mov.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "FezACML security for datastream - CH7409_movie_3.mov",
                "dsi_mimetype": "text/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3093
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "FezACML_CH7409_movie_4.mov.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "FezACML security for datastream - CH7409_movie_4.mov",
                "dsi_mimetype": "text/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3093
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "FezACML_CH7409_movie_5.mov.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "FezACML security for datastream - CH7409_movie_5.mov",
                "dsi_mimetype": "text/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3093
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "FezACML_UQ_185044.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "FezACML security for PID - UQ:185044",
                "dsi_mimetype": "text/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 3705
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "presmd_CH7409_movie_1.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "application/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 1206
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "presmd_CH7409_movie_2.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "application/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 1206
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "presmd_CH7409_movie_3.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "application/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 1206
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "presmd_CH7409_movie_4.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "application/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 1206
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "presmd_CH7409_movie_5.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "application/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 1206
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "presmd_ch7409_report.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "application/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 277266
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "presmd_Chanson_movie_1.xml",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "application/xml",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 530
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "stream_CH7409_movie_1.flv",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "video/x-flv",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 340806
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "stream_CH7409_movie_2.flv",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "video/x-flv",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 357167
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "stream_CH7409_movie_3.flv",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "video/x-flv",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 371437
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "stream_CH7409_movie_4.flv",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "video/x-flv",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 551102
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "stream_CH7409_movie_5.flv",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "video/x-flv",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 286470
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "thumbnail_CH7409_movie_1.jpg",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "image/jpeg",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 5252
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "thumbnail_CH7409_movie_2.jpg",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "image/jpeg",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 6732
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "thumbnail_CH7409_movie_3.jpg",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "image/jpeg",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 5487
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "thumbnail_CH7409_movie_4.jpg",
                "dsi_embargo_date": null,
                "dsi_open_access": null,
                "dsi_label": "",
                "dsi_mimetype": "image/jpeg",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 9800
            }, {
                "dsi_pid": "UQ:185044",
                "dsi_dsid": "thumbnail_CH7409_movie_5.jpg",
                "dsi_embargo_date": '2050-01-01T00:00:00.000Z',
                "dsi_open_access": 1,
                "dsi_label": "",
                "dsi_mimetype": "image/jpeg",
                "dsi_copyright": null,
                "dsi_state": "A",
                "dsi_size": 7236
            }],
            "fez_matched_journals": [],
            "fez_record_search_key_has_datasets": [],
            "fez_record_search_key_has_related_datasets": [],
            "fez_record_search_key_has_derivations": [],
            "rek_status_lookup": "Published",
            "rek_object_type_lookup": "Record",
            "rek_wok_doc_type_lookup": null,
            "rek_display_type_lookup": "Department Technical Report",
            "rek_scopus_doc_type_lookup": null,
            "rek_pubmed_doc_type_lookup": null
        };
        const wrapper = setup({publication: pub});
        expect(JSON.stringify(wrapper.instance().getFileData(pub))).toMatchSnapshot();
    });


});
