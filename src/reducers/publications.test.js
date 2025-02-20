import * as actions from 'actions/actionTypes';
import publicationsReducer from './publications';


const initialState = {
    publicationsList: [],
    publicationsListPagingData: {},
    publicationsListFacets: {},
    loadingPublicationsList: true
};

const getInitialState = () => ({
    'mine': initialState,
    'incomplete': initialState
});

const authorPubsPayload = {
    "total": 1,
    "per_page": 20,
    "current_page": 1,
    "from": 1,
    "to": 1,
    "data": [{
        "rek_pid": "UQ:792110",
        "rek_title_xsdmf_id": null,
        "rek_title": "Testing book with cache",
        "rek_description_xsdmf_id": null,
        "rek_description": null,
        "rek_display_type_xsdmf_id": null,
        "rek_display_type": 174,
        "rek_status_xsdmf_id": null,
        "rek_status": 2,
        "rek_date_xsdmf_id": null,
        "rek_date": "2017-01-01T00:00:00Z",
        "rek_object_type_xsdmf_id": null,
        "rek_object_type": 3,
        "rek_depositor_xsdmf_id": null,
        "rek_depositor": null,
        "rek_created_date_xsdmf_id": null,
        "rek_created_date": "2017-11-15T01:55:58Z",
        "rek_updated_date_xsdmf_id": null,
        "rek_updated_date": "2017-11-15T01:55:58Z",
        "rek_file_downloads": 0,
        "rek_citation": "<a class=\"citation_author_name\" title=\"Browse by Author Name for V. Asai\" href=\"/list/author/V.+Asai/\">V. Asai</a> and <a class=\"author_id_link\" title=\"Browse by Author ID for M Brown\" href=\"/list/author_id/1671/\">M Brown</a> <i><a class=\"citation_title\" title=\"Click to view Book: Testing book with cache\" href=\"/view/UQ:792110\">Testing book with cache</a></i>.   <span class=\"citation_place_of_publication\">Testing book with cache</span>: <span class=\"citation_publisher\">UQ</span>, <span class=\"citation_date\">2017</span>.",
        "rek_genre_xsdmf_id": null,
        "rek_genre": null,
        "rek_genre_type_xsdmf_id": null,
        "rek_genre_type": null,
        "rek_formatted_title_xsdmf_id": null,
        "rek_formatted_title": null,
        "rek_formatted_abstract_xsdmf_id": null,
        "rek_formatted_abstract": null,
        "rek_depositor_affiliation_xsdmf_id": null,
        "rek_depositor_affiliation": null,
        "rek_thomson_citation_count": null,
        "rek_thomson_citation_count_xsdmf_id": null,
        "rek_subtype_xsdmf_id": null,
        "rek_subtype": "Research book (original research)",
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
        "rek_copyright_xsdmf_id": null,
        "rek_copyright": null,
        "fez_record_search_key_access_conditions": null,
        "fez_record_search_key_acknowledgements": null,
        "fez_record_search_key_additional_notes": null,
        "fez_record_search_key_advisory_statement": null,
        "fez_record_search_key_alternate_genre": [],
        "fez_record_search_key_alternative_title": [],
        "fez_record_search_key_ands_collection_type": null,
        "fez_record_search_key_architectural_features": [],
        "fez_record_search_key_article_number": null,
        "fez_record_search_key_assigned_group_id": [],
        "fez_record_search_key_assigned_user_id": [],
        "fez_record_search_key_author": [{
            "rek_author_id": 30395087,
            "rek_author_pid": "UQ:792110",
            "rek_author_xsdmf_id": null,
            "rek_author": "V. Asai",
            "rek_author_order": 1
        }, {
            "rek_author_id": 30395088,
            "rek_author_pid": "UQ:792110",
            "rek_author_xsdmf_id": null,
            "rek_author": "M Brown",
            "rek_author_order": 2
        }],
        "fez_record_search_key_author_affiliation_id": [],
        "fez_record_search_key_author_affiliation_country": [],
        "fez_record_search_key_author_affiliation_full_address": [],
        "fez_record_search_key_author_affiliation_name": [],
        "fez_record_search_key_author_id": [{
            "rek_author_id_id": 29672780,
            "rek_author_id_pid": "UQ:792110",
            "rek_author_id_xsdmf_id": null,
            "rek_author_id": null,
            "rek_author_id_order": 1
        }, {
            "rek_author_id_id": 29672781,
            "rek_author_id_pid": "UQ:792110",
            "rek_author_id_xsdmf_id": null,
            "rek_author_id": 1671,
            "rek_author_id_order": 2,
            "rek_author_id_lookup": "Brown, Melissa Anne"
        }],
        "fez_record_search_key_author_role": [],
        "fez_record_search_key_book_title": null,
        "fez_record_search_key_building_materials": [],
        "fez_record_search_key_category": [],
        "fez_record_search_key_chapter_number": null,
        "fez_record_search_key_condition": [],
        "fez_record_search_key_conference_dates": null,
        "fez_record_search_key_conference_id": null,
        "fez_record_search_key_conference_location": null,
        "fez_record_search_key_conference_name": null,
        "fez_record_search_key_construction_date": null,
        "fez_record_search_key_contact_details_email": [],
        "fez_record_search_key_contributor": [],
        "fez_record_search_key_contributor_id": [],
        "fez_record_search_key_convener": null,
        "fez_record_search_key_corresponding_email": [],
        "fez_record_search_key_corresponding_name": [],
        "fez_record_search_key_corresponding_country": [],
        "fez_record_search_key_corresponding_organisation": [],
        "fez_record_search_key_country_of_issue": null,
        "fez_record_search_key_coverage_period": [],
        "fez_record_search_key_creator_id": [],
        "fez_record_search_key_creator_name": [],
        "fez_record_search_key_datastream_policy": null,
        "fez_record_search_key_data_volume": null,
        "fez_record_search_key_date_available": null,
        "fez_record_search_key_date_photo_taken": null,
        "fez_record_search_key_date_recorded": null,
        "fez_record_search_key_date_scanned": null,
        "fez_record_search_key_doi": null,
        "fez_record_search_key_edition": null,
        "fez_record_search_key_end_date": null,
        "fez_record_search_key_end_page": null,
        "fez_record_search_key_file_attachment_access_condition": [],
        "fez_record_search_key_file_attachment_embargo_date": [],
        "fez_record_search_key_file_attachment_name": [],
        "fez_record_search_key_geographic_area": [],
        "fez_record_search_key_grant_acronym": [],
        "fez_record_search_key_grant_agency": [],
        "fez_record_search_key_grant_agency_id": [],
        "fez_record_search_key_grant_id": [],
        "fez_record_search_key_grant_text": [],
        "fez_record_search_key_herdc_code": {
            "rek_herdc_code_id": 4924161,
            "rek_herdc_code_pid": "UQ:792110",
            "rek_herdc_code_xsdmf_id": null,
            "rek_herdc_code": 450001,
            "rek_herdc_code_lookup": "A1"
        },
        "fez_record_search_key_herdc_status": {
            "rek_herdc_status_id": 3788925,
            "rek_herdc_status_pid": "UQ:792110",
            "rek_herdc_status_xsdmf_id": null,
            "rek_herdc_status": 453220,
            "rek_herdc_status_lookup": "Provisional Code"
        },
        "fez_record_search_key_identifier": [],
        "fez_record_search_key_institutional_status": null,
        "fez_record_search_key_interior_features": [],
        "fez_record_search_key_isbn": [],
        "fez_record_search_key_isdatasetof": [],
        "fez_record_search_key_isderivationof": [],
        "fez_record_search_key_isi_loc": null,
        "fez_record_search_key_ismemberof": [{
            "rek_ismemberof_id": 12229320,
            "rek_ismemberof_pid": "UQ:792110",
            "rek_ismemberof_xsdmf_id": null,
            "rek_ismemberof": "UQ:218198",
            "rek_ismemberof_order": 1,
            "rek_ismemberof_lookup": "Unprocessed Records"
        }],
        "fez_record_search_key_issn": [],
        "fez_record_search_key_issue_number": null,
        "fez_record_search_key_job_number": null,
        "fez_record_search_key_journal_name": null,
        "fez_record_search_key_keywords": [],
        "fez_record_search_key_language": [],
        "fez_record_search_key_language_of_book_title": [],
        "fez_record_search_key_language_of_journal_name": [],
        "fez_record_search_key_language_of_proceedings_title": [],
        "fez_record_search_key_language_of_title": [],
        "fez_record_search_key_length": null,
        "fez_record_search_key_license": null,
        "fez_record_search_key_link": [],
        "fez_record_search_key_link_description": [],
        "fez_record_search_key_location": [],
        "fez_record_search_key_native_script_book_title": null,
        "fez_record_search_key_native_script_conference_name": null,
        "fez_record_search_key_native_script_journal_name": null,
        "fez_record_search_key_native_script_proceedings_title": null,
        "fez_record_search_key_native_script_title": null,
        "fez_record_search_key_newspaper": null,
        "fez_record_search_key_notes": null,
        "fez_record_search_key_oa_embargo_days": null,
        "fez_record_search_key_oa_notes": null,
        "fez_record_search_key_oa_status": {
            "rek_oa_status_id": 519905,
            "rek_oa_status_pid": "UQ:792110",
            "rek_oa_status_xsdmf_id": null,
            "rek_oa_status": 453692,
            "rek_oa_status_lookup": "Not yet assessed"
        },
        "fez_record_search_key_org_name": null,
        "fez_record_search_key_org_unit_name": null,
        "fez_record_search_key_original_format": null,
        "fez_record_search_key_parent_publication": null,
        "fez_record_search_key_patent_number": null,
        "fez_record_search_key_period": [],
        "fez_record_search_key_place_of_publication": {
            "rek_place_of_publication_id": 4367434,
            "rek_place_of_publication_pid": "UQ:792110",
            "rek_place_of_publication_xsdmf_id": null,
            "rek_place_of_publication": "Testing book with cache"
        },
        "fez_record_search_key_proceedings_title": null,
        "fez_record_search_key_project_description": null,
        "fez_record_search_key_project_id": null,
        "fez_record_search_key_project_name": null,
        "fez_record_search_key_project_start_date": null,
        "fez_record_search_key_publisher": {
            "rek_publisher_id": 4676277,
            "rek_publisher_pid": "UQ:792110",
            "rek_publisher_xsdmf_id": null,
            "rek_publisher": "UQ"
        },
        "fez_record_search_key_pubmed_id": null,
        "fez_record_search_key_pubmed_central_id": null,
        "fez_record_search_key_refereed": null,
        "fez_record_search_key_refereed_source": null,
        "fez_record_search_key_related_datasets": null,
        "fez_record_search_key_related_publications": null,
        "fez_record_search_key_report_number": null,
        "fez_record_search_key_retracted": null,
        "fez_record_search_key_rights": null,
        "fez_record_search_key_roman_script_book_title": null,
        "fez_record_search_key_roman_script_conference_name": null,
        "fez_record_search_key_roman_script_journal_name": null,
        "fez_record_search_key_roman_script_proceedings_title": null,
        "fez_record_search_key_roman_script_title": null,
        "fez_record_search_key_scale": null,
        "fez_record_search_key_scopus_id": null,
        "fez_record_search_key_section": null,
        "fez_record_search_key_seo_code": [],
        "fez_record_search_key_series": null,
        "fez_record_search_key_software_required": [],
        "fez_record_search_key_source": null,
        "fez_record_search_key_start_date": null,
        "fez_record_search_key_start_page": null,
        "fez_record_search_key_structural_systems": [],
        "fez_record_search_key_style": [],
        "fez_record_search_key_subcategory": [],
        "fez_record_search_key_subject": [],
        "fez_record_search_key_supervisor": [],
        "fez_record_search_key_supervisor_id": [],
        "fez_record_search_key_surrounding_features": [],
        "fez_record_search_key_time_period_end_date": null,
        "fez_record_search_key_time_period_start_date": null,
        "fez_record_search_key_total_chapters": null,
        "fez_record_search_key_total_pages": null,
        "fez_record_search_key_transcript": null,
        "fez_record_search_key_translated_book_title": null,
        "fez_record_search_key_translated_conference_name": null,
        "fez_record_search_key_translated_journal_name": null,
        "fez_record_search_key_translated_newspaper": null,
        "fez_record_search_key_translated_proceedings_title": null,
        "fez_record_search_key_translated_title": null,
        "fez_record_search_key_type_of_data": [],
        "fez_record_search_key_volume_number": null,
        "rek_status_lookup": "Published",
        "rek_object_type_lookup": "Record",
        "rek_wok_doc_type_lookup": null,
        "rek_display_type_lookup": "Book",
        "rek_scopus_doc_type_lookup": null,
        "rek_pubmed_doc_type_lookup": null
    }],
    "filters": {
        "facets": {
            "Scopus document type": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": []
            },
            "Display type": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [{"key": 174, "doc_count": 1}]
            },
            "Keywords": {"doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": []},
            "Scopus document type (lookup)": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": []
            },
            "Subject (lookup)": {"doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": []},
            "Collection (lookup)": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [{"key": "Unprocessed Records", "doc_count": 1}]
            },
            "Year published": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [{"key": "2017", "doc_count": 1}]
            },
            "Author (lookup)": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [{"key": "Brown, Melissa Anne", "doc_count": 1}]
            },
            "Subject": {"doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": []},
            "Journal name": {"doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": []},
            "Collection": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [{"key": "UQ:218198", "doc_count": 1}]
            },
            "Author": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [{"key": 1671, "doc_count": 1}]
            },
            "Genre": {"doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": []},
            "Subtype": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [{"key": "Research book (original research)", "doc_count": 1}]
            },
            "Display type (lookup)": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [{"key": "Book", "doc_count": 1}]
            }
        }
    }
};

describe('Authors publications reducer', () => {
    it('returns the correct state while authors publications are loading', () => {
        const test = publicationsReducer(getInitialState(), {type: `${actions.AUTHOR_PUBLICATIONS_LOADING}@mine`});
        expect(test.mine.publicationsList).toEqual([]);
        expect(test.mine.publicationsListPagingData).toEqual({});
        expect(test.mine.loadingPublicationsList).toBeTruthy();
    });

    it('returns the correct state when authors publications have loaded with expected filters and facets', () => {
        const test = publicationsReducer(getInitialState(), {
            type: `${actions.AUTHOR_PUBLICATIONS_LOADED}@mine`,
            payload: authorPubsPayload
        });

        expect(test.mine.publicationsList).toEqual(authorPubsPayload.data);
        expect(test.mine.publicationsListPagingData).toEqual({
            total: authorPubsPayload.total,
            current_page: authorPubsPayload.current_page,
            from: authorPubsPayload.from,
            to: authorPubsPayload.to,
            per_page: authorPubsPayload.per_page
        });
        const pubListFacets = authorPubsPayload.filters.facets || {};
        expect(test.mine.publicationsListFacets).toEqual(pubListFacets);
        expect(test.mine.loadingPublicationsList).toBeFalsy();
    });


    it('returns the correct state when authors publications have loaded without expected filters and facets', () => {
        delete authorPubsPayload['filters'];
        const test = publicationsReducer(getInitialState(), {
            type: `${actions.AUTHOR_PUBLICATIONS_LOADED}@mine`,
            payload: authorPubsPayload
        });
        expect(test.mine.publicationsListFacets).toEqual({});
    });

    it('returns the correct state when authors publications fails to load data', () => {
        const test = publicationsReducer(getInitialState(), {type: `${actions.AUTHOR_PUBLICATIONS_FAILED}@mine`});
        expect(test.mine.publicationsList).toEqual([]);
        expect(test.mine.publicationsListPagingData).toEqual({});
        expect(test.mine.publicationsListFacets).toEqual({});
        expect(test.mine.loadingPublicationsList).toBeFalsy();
    });
});

describe('Authors incomplete publications reducer', () => {
    const payload = {
        "total": 1,
        "per_page": 20,
        "current_page": 1,
        "from": 1,
        "to": 1,
        "data": [{
            "rek_pid": "UQ:792110",
            "rek_title_xsdmf_id": null,
            "rek_title": "Testing book with cache",
            "rek_description_xsdmf_id": null,
            "rek_description": null,
            "rek_display_type_xsdmf_id": null,
            "rek_display_type": 174,
            "rek_status_xsdmf_id": null,
            "rek_status": 2,
            "rek_date_xsdmf_id": null,
            "rek_date": "2017-01-01T00:00:00Z",
            "rek_object_type_xsdmf_id": null,
            "rek_object_type": 3,
            "rek_depositor_xsdmf_id": null,
            "rek_depositor": null,
            "rek_created_date_xsdmf_id": null,
            "rek_created_date": "2017-11-15T01:55:58Z",
            "rek_updated_date_xsdmf_id": null,
            "rek_updated_date": "2017-11-15T01:55:58Z",
            "rek_file_downloads": 0,
            "rek_citation": "<a class=\"citation_author_name\" title=\"Browse by Author Name for V. Asai\" href=\"/list/author/V.+Asai/\">V. Asai</a> and <a class=\"author_id_link\" title=\"Browse by Author ID for M Brown\" href=\"/list/author_id/1671/\">M Brown</a> <i><a class=\"citation_title\" title=\"Click to view Book: Testing book with cache\" href=\"/view/UQ:792110\">Testing book with cache</a></i>.   <span class=\"citation_place_of_publication\">Testing book with cache</span>: <span class=\"citation_publisher\">UQ</span>, <span class=\"citation_date\">2017</span>.",
            "rek_genre_xsdmf_id": null,
            "rek_genre": null,
            "rek_genre_type_xsdmf_id": null,
            "rek_genre_type": null,
            "rek_formatted_title_xsdmf_id": null,
            "rek_formatted_title": null,
            "rek_formatted_abstract_xsdmf_id": null,
            "rek_formatted_abstract": null,
            "rek_depositor_affiliation_xsdmf_id": null,
            "rek_depositor_affiliation": null,
            "rek_thomson_citation_count": null,
            "rek_thomson_citation_count_xsdmf_id": null,
            "rek_subtype_xsdmf_id": null,
            "rek_subtype": "Research book (original research)",
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
            "rek_copyright_xsdmf_id": null,
            "rek_copyright": null,
            "fez_record_search_key_access_conditions": null,
            "fez_record_search_key_acknowledgements": null,
            "fez_record_search_key_additional_notes": null,
            "fez_record_search_key_advisory_statement": null,
            "fez_record_search_key_alternate_genre": [],
            "fez_record_search_key_alternative_title": [],
            "fez_record_search_key_ands_collection_type": null,
            "fez_record_search_key_architectural_features": [],
            "fez_record_search_key_article_number": null,
            "fez_record_search_key_assigned_group_id": [],
            "fez_record_search_key_assigned_user_id": [],
            "fez_record_search_key_author": [{
                "rek_author_id": 30395087,
                "rek_author_pid": "UQ:792110",
                "rek_author_xsdmf_id": null,
                "rek_author": "V. Asai",
                "rek_author_order": 1
            }, {
                "rek_author_id": 30395088,
                "rek_author_pid": "UQ:792110",
                "rek_author_xsdmf_id": null,
                "rek_author": "M Brown",
                "rek_author_order": 2
            }],
            "fez_record_search_key_author_affiliation_id": [],
            "fez_record_search_key_author_affiliation_country": [],
            "fez_record_search_key_author_affiliation_full_address": [],
            "fez_record_search_key_author_affiliation_name": [],
            "fez_record_search_key_author_id": [{
                "rek_author_id_id": 29672780,
                "rek_author_id_pid": "UQ:792110",
                "rek_author_id_xsdmf_id": null,
                "rek_author_id": null,
                "rek_author_id_order": 1
            }, {
                "rek_author_id_id": 29672781,
                "rek_author_id_pid": "UQ:792110",
                "rek_author_id_xsdmf_id": null,
                "rek_author_id": 1671,
                "rek_author_id_order": 2,
                "rek_author_id_lookup": "Brown, Melissa Anne"
            }],
            "fez_record_search_key_author_role": [],
            "fez_record_search_key_book_title": null,
            "fez_record_search_key_building_materials": [],
            "fez_record_search_key_category": [],
            "fez_record_search_key_chapter_number": null,
            "fez_record_search_key_condition": [],
            "fez_record_search_key_conference_dates": null,
            "fez_record_search_key_conference_id": null,
            "fez_record_search_key_conference_location": null,
            "fez_record_search_key_conference_name": null,
            "fez_record_search_key_construction_date": null,
            "fez_record_search_key_contact_details_email": [],
            "fez_record_search_key_contributor": [],
            "fez_record_search_key_contributor_id": [],
            "fez_record_search_key_convener": null,
            "fez_record_search_key_corresponding_email": [],
            "fez_record_search_key_corresponding_name": [],
            "fez_record_search_key_corresponding_country": [],
            "fez_record_search_key_corresponding_organisation": [],
            "fez_record_search_key_country_of_issue": null,
            "fez_record_search_key_coverage_period": [],
            "fez_record_search_key_creator_id": [],
            "fez_record_search_key_creator_name": [],
            "fez_record_search_key_datastream_policy": null,
            "fez_record_search_key_data_volume": null,
            "fez_record_search_key_date_available": null,
            "fez_record_search_key_date_photo_taken": null,
            "fez_record_search_key_date_recorded": null,
            "fez_record_search_key_date_scanned": null,
            "fez_record_search_key_doi": null,
            "fez_record_search_key_edition": null,
            "fez_record_search_key_end_date": null,
            "fez_record_search_key_end_page": null,
            "fez_record_search_key_file_attachment_access_condition": [],
            "fez_record_search_key_file_attachment_embargo_date": [],
            "fez_record_search_key_file_attachment_name": [],
            "fez_record_search_key_geographic_area": [],
            "fez_record_search_key_grant_acronym": [],
            "fez_record_search_key_grant_agency": [],
            "fez_record_search_key_grant_agency_id": [],
            "fez_record_search_key_grant_id": [],
            "fez_record_search_key_grant_text": [],
            "fez_record_search_key_herdc_code": {
                "rek_herdc_code_id": 4924161,
                "rek_herdc_code_pid": "UQ:792110",
                "rek_herdc_code_xsdmf_id": null,
                "rek_herdc_code": 450001,
                "rek_herdc_code_lookup": "A1"
            },
            "fez_record_search_key_herdc_status": {
                "rek_herdc_status_id": 3788925,
                "rek_herdc_status_pid": "UQ:792110",
                "rek_herdc_status_xsdmf_id": null,
                "rek_herdc_status": 453220,
                "rek_herdc_status_lookup": "Provisional Code"
            },
            "fez_record_search_key_identifier": [],
            "fez_record_search_key_institutional_status": null,
            "fez_record_search_key_interior_features": [],
            "fez_record_search_key_isbn": [],
            "fez_record_search_key_isdatasetof": [],
            "fez_record_search_key_isderivationof": [],
            "fez_record_search_key_isi_loc": null,
            "fez_record_search_key_ismemberof": [{
                "rek_ismemberof_id": 12229320,
                "rek_ismemberof_pid": "UQ:792110",
                "rek_ismemberof_xsdmf_id": null,
                "rek_ismemberof": "UQ:218198",
                "rek_ismemberof_order": 1,
                "rek_ismemberof_lookup": "Unprocessed Records"
            }],
            "fez_record_search_key_issn": [],
            "fez_record_search_key_issue_number": null,
            "fez_record_search_key_job_number": null,
            "fez_record_search_key_journal_name": null,
            "fez_record_search_key_keywords": [],
            "fez_record_search_key_language": [],
            "fez_record_search_key_language_of_book_title": [],
            "fez_record_search_key_language_of_journal_name": [],
            "fez_record_search_key_language_of_proceedings_title": [],
            "fez_record_search_key_language_of_title": [],
            "fez_record_search_key_length": null,
            "fez_record_search_key_license": null,
            "fez_record_search_key_link": [],
            "fez_record_search_key_link_description": [],
            "fez_record_search_key_location": [],
            "fez_record_search_key_native_script_book_title": null,
            "fez_record_search_key_native_script_conference_name": null,
            "fez_record_search_key_native_script_journal_name": null,
            "fez_record_search_key_native_script_proceedings_title": null,
            "fez_record_search_key_native_script_title": null,
            "fez_record_search_key_newspaper": null,
            "fez_record_search_key_notes": null,
            "fez_record_search_key_oa_embargo_days": null,
            "fez_record_search_key_oa_notes": null,
            "fez_record_search_key_oa_status": {
                "rek_oa_status_id": 519905,
                "rek_oa_status_pid": "UQ:792110",
                "rek_oa_status_xsdmf_id": null,
                "rek_oa_status": 453692,
                "rek_oa_status_lookup": "Not yet assessed"
            },
            "fez_record_search_key_org_name": null,
            "fez_record_search_key_org_unit_name": null,
            "fez_record_search_key_original_format": null,
            "fez_record_search_key_parent_publication": null,
            "fez_record_search_key_patent_number": null,
            "fez_record_search_key_period": [],
            "fez_record_search_key_place_of_publication": {
                "rek_place_of_publication_id": 4367434,
                "rek_place_of_publication_pid": "UQ:792110",
                "rek_place_of_publication_xsdmf_id": null,
                "rek_place_of_publication": "Testing book with cache"
            },
            "fez_record_search_key_proceedings_title": null,
            "fez_record_search_key_project_description": null,
            "fez_record_search_key_project_id": null,
            "fez_record_search_key_project_name": null,
            "fez_record_search_key_project_start_date": null,
            "fez_record_search_key_publisher": {
                "rek_publisher_id": 4676277,
                "rek_publisher_pid": "UQ:792110",
                "rek_publisher_xsdmf_id": null,
                "rek_publisher": "UQ"
            },
            "fez_record_search_key_pubmed_id": null,
            "fez_record_search_key_pubmed_central_id": null,
            "fez_record_search_key_refereed": null,
            "fez_record_search_key_refereed_source": null,
            "fez_record_search_key_related_datasets": null,
            "fez_record_search_key_related_publications": null,
            "fez_record_search_key_report_number": null,
            "fez_record_search_key_retracted": null,
            "fez_record_search_key_rights": null,
            "fez_record_search_key_roman_script_book_title": null,
            "fez_record_search_key_roman_script_conference_name": null,
            "fez_record_search_key_roman_script_journal_name": null,
            "fez_record_search_key_roman_script_proceedings_title": null,
            "fez_record_search_key_roman_script_title": null,
            "fez_record_search_key_scale": null,
            "fez_record_search_key_scopus_id": null,
            "fez_record_search_key_section": null,
            "fez_record_search_key_seo_code": [],
            "fez_record_search_key_series": null,
            "fez_record_search_key_software_required": [],
            "fez_record_search_key_source": null,
            "fez_record_search_key_start_date": null,
            "fez_record_search_key_start_page": null,
            "fez_record_search_key_structural_systems": [],
            "fez_record_search_key_style": [],
            "fez_record_search_key_subcategory": [],
            "fez_record_search_key_subject": [],
            "fez_record_search_key_supervisor": [],
            "fez_record_search_key_supervisor_id": [],
            "fez_record_search_key_surrounding_features": [],
            "fez_record_search_key_time_period_end_date": null,
            "fez_record_search_key_time_period_start_date": null,
            "fez_record_search_key_total_chapters": null,
            "fez_record_search_key_total_pages": null,
            "fez_record_search_key_transcript": null,
            "fez_record_search_key_translated_book_title": null,
            "fez_record_search_key_translated_conference_name": null,
            "fez_record_search_key_translated_journal_name": null,
            "fez_record_search_key_translated_newspaper": null,
            "fez_record_search_key_translated_proceedings_title": null,
            "fez_record_search_key_translated_title": null,
            "fez_record_search_key_type_of_data": [],
            "fez_record_search_key_volume_number": null,
            "rek_status_lookup": "Published",
            "rek_object_type_lookup": "Record",
            "rek_wok_doc_type_lookup": null,
            "rek_display_type_lookup": "Book",
            "rek_scopus_doc_type_lookup": null,
            "rek_pubmed_doc_type_lookup": null
        }],
        "filters": {
            "facets": {
                "Scopus document type": {
                    "doc_count_error_upper_bound": 0,
                    "sum_other_doc_count": 0,
                    "buckets": []
                },
                "Display type": {
                    "doc_count_error_upper_bound": 0,
                    "sum_other_doc_count": 0,
                    "buckets": [{"key": 174, "doc_count": 1}]
                },
                "Keywords": {"doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": []},
                "Scopus document type (lookup)": {
                    "doc_count_error_upper_bound": 0,
                    "sum_other_doc_count": 0,
                    "buckets": []
                },
                "Subject (lookup)": {"doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": []},
                "Collection (lookup)": {
                    "doc_count_error_upper_bound": 0,
                    "sum_other_doc_count": 0,
                    "buckets": [{"key": "Unprocessed Records", "doc_count": 1}]
                },
                "Year published": {
                    "doc_count_error_upper_bound": 0,
                    "sum_other_doc_count": 0,
                    "buckets": [{"key": "2017", "doc_count": 1}]
                },
                "Author (lookup)": {
                    "doc_count_error_upper_bound": 0,
                    "sum_other_doc_count": 0,
                    "buckets": [{"key": "Brown, Melissa Anne", "doc_count": 1}]
                },
                "Subject": {"doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": []},
                "Journal name": {"doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": []},
                "Collection": {
                    "doc_count_error_upper_bound": 0,
                    "sum_other_doc_count": 0,
                    "buckets": [{"key": "UQ:218198", "doc_count": 1}]
                },
                "Author": {
                    "doc_count_error_upper_bound": 0,
                    "sum_other_doc_count": 0,
                    "buckets": [{"key": 1671, "doc_count": 1}]
                },
                "Genre": {"doc_count_error_upper_bound": 0, "sum_other_doc_count": 0, "buckets": []},
                "Subtype": {
                    "doc_count_error_upper_bound": 0,
                    "sum_other_doc_count": 0,
                    "buckets": [{"key": "Research book (original research)", "doc_count": 1}]
                },
                "Display type (lookup)": {
                    "doc_count_error_upper_bound": 0,
                    "sum_other_doc_count": 0,
                    "buckets": [{"key": "Book", "doc_count": 1}]
                }
            }
        }
    };

    it('returns the correct state while authors publications are loading', () => {
        const test = publicationsReducer(getInitialState(), {type: `${actions.AUTHOR_PUBLICATIONS_LOADING}@incomplete`});
        expect(test.incomplete.publicationsList).toEqual([]);
        expect(test.incomplete.publicationsListPagingData).toEqual({});
        expect(test.incomplete.loadingPublicationsList).toBeTruthy();
    });

    it('returns the correct state when authors publications have loaded with expected filters and facets', () => {
        const test = publicationsReducer(getInitialState(), {
            type: `${actions.AUTHOR_PUBLICATIONS_LOADED}@incomplete`,
            payload: payload
        });

        expect(test.incomplete.publicationsList).toEqual(payload.data);
        expect(test.incomplete.publicationsListPagingData).toEqual({
            total: payload.total,
            current_page: payload.current_page,
            from: payload.from,
            to: payload.to,
            per_page: payload.per_page
        });
        expect(test.incomplete.publicationsListFacets).toEqual(payload.filters.facets);
        expect(test.incomplete.loadingPublicationsList).toBeFalsy();
    });


    it('returns the correct state when authors publications have loaded without expected filters and facets', () => {
        delete payload['filters'];
        const test = publicationsReducer(getInitialState(), {
            type: `${actions.AUTHOR_PUBLICATIONS_LOADED}@incomplete`,
            payload: payload
        });
        expect(test.incomplete.publicationsListFacets).toEqual({});
    });

    it('returns the correct state when authors publications fails to load data', () => {
        const test = publicationsReducer(getInitialState(), {type: `${actions.AUTHOR_PUBLICATIONS_FAILED}@incomplete`});
        expect(test.incomplete.publicationsList).toEqual([]);
        expect(test.incomplete.publicationsListPagingData).toEqual({});
        expect(test.incomplete.publicationsListFacets).toEqual({});
        expect(test.incomplete.loadingPublicationsList).toBeFalsy();
    });
});

describe('General publications reducer', () => {
    it('returns the state when an invalid action type is supplied', () => {
        const test = publicationsReducer(getInitialState(), {type: 'INVALID_ACTION_TYPE'});
        expect(test).toEqual(getInitialState());
    });
});
