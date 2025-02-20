import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {default as global} from 'locale/global';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {general} from 'config';
import ReactHtmlParser from 'react-html-parser';
import {pathConfig} from 'config/routes';
import {Link} from 'react-router-dom';
import {
    NTRO_SUBTYPE_CW_TEXTUAL_WORK,
    DOCUMENT_TYPE_JOURNAL_ARTICLE,
    DOCUMENT_TYPE_BOOK_CHAPTER,
    DOCUMENT_TYPE_BOOK,
    DOCUMENT_TYPE_RESEARCH_REPORT
} from 'config/general';

const styles = (theme) => ({
    gridRow: {
        borderBottom: `1px solid ${theme.palette.secondary.light}`
    },
    richTextParagraphFix: {
        '& p:first-of-type': {
            marginTop: 0
        }
    }
});

export class NtroDetailsClass extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        classes: PropTypes.object,
        account: PropTypes.object
    };

    ViewNtroRow = ({heading, subheading, className, data}) => (
        <div style={{padding: 8}}>
            <Grid container spacing={16} className={this.props.classes.gridRow} alignItems="flex-start">
                <Grid item xs={12} sm={3}>
                    <Typography variant="body2" component={'span'} classes={{root: this.props.classes.header}}>{heading}</Typography>
                    {!!subheading && <Typography variant="caption" component={'span'} classes={{root: this.props.classes.header}}>{subheading}</Typography>}
                </Grid>
                <Grid item xs={12} sm={9} className={this.props.classes.data}>
                    <Typography variant="body2" component={'span'} className={className}>{data}</Typography></Grid>
            </Grid>
        </div>
    );

    render() {
        const {publication} = this.props;
        const docType = publication.rek_display_type_lookup;
        const subType = publication.rek_subtype;
        if (!general.NTRO_SUBTYPES.includes(subType)) {
            return null;
        }
        return (
            <Grid item xs={12}>
                <StandardCard title={locale.viewRecord.sections.ntro.title}>
                    {/* Significance */}
                    {
                        publication.fez_record_search_key_significance &&
                        publication.fez_record_search_key_significance.length > 0 &&
                        publication.fez_record_search_key_significance.map((item, index) => {
                            if (
                                (this.props.account && this.props.account.canMasquerade) ||
                                item.rek_significance && item.rek_significance !== '' || item.rek_significance === 0
                            ) {
                                return (
                                    <this.ViewNtroRow
                                        key={index}
                                        heading={`${locale.viewRecord.headings.NTRO.significance}`}
                                        subheading={`(${publication.fez_record_search_key_author[item.rek_significance_order - 1].rek_author})`}
                                        data={(item.rek_significance !== 0 && item.rek_significance !== '0' && !!item.rek_significance && item.rek_significance_lookup) || global.global.defaultAuthorDataPlaceholder}
                                    />
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                    {/* Contribution statement */}
                    {
                        publication.fez_record_search_key_creator_contribution_statement &&
                        publication.fez_record_search_key_creator_contribution_statement.length > 0 &&
                        publication.fez_record_search_key_creator_contribution_statement.map((item, index) => {
                            if (
                                (this.props.account && this.props.account.canMasquerade) ||
                                (
                                    item.rek_creator_contribution_statement &&
                                    (item.rek_creator_contribution_statement !== '' &&
                                    item.rek_creator_contribution_statement.length > 0 &&
                                    item.rek_creator_contribution_statement.trim().length !== 0) ||
                                item.rek_creator_contribution_statement === null)
                            ) {
                                return (
                                    <this.ViewNtroRow
                                        className={this.props.classes.richTextParagraphFix}
                                        key={index}
                                        heading={locale.viewRecord.headings.NTRO.impactStatement}
                                        subheading={publication.fez_record_search_key_author[item.rek_creator_contribution_statement_order - 1].rek_author ? `(${publication.fez_record_search_key_author[item.rek_creator_contribution_statement_order - 1].rek_author})` : ''}
                                        data={item.rek_creator_contribution_statement && item.rek_creator_contribution_statement.trim().length !== 0 && ReactHtmlParser(item.rek_creator_contribution_statement) || global.global.defaultAuthorDataPlaceholder}
                                    />
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                    {/* NTRO Abstract */}
                    {
                        publication.rek_formatted_abstract ?
                            <this.ViewNtroRow
                                className={this.props.classes.richTextParagraphFix}
                                heading={locale.viewRecord.headings.NTRO.ntroAbstract}
                                data={ReactHtmlParser(publication.rek_formatted_abstract)}
                            />
                            :
                            <this.ViewNtroRow
                                heading={locale.viewRecord.headings.NTRO.ntroAbstract}
                                data={publication.rek_description}
                            />
                    }
                    {/* ISMN */}
                    {
                        publication.fez_record_search_key_ismn && publication.fez_record_search_key_ismn.length > 0 &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.fez_record_search_key_ismn}
                            data={publication.fez_record_search_key_ismn.map((item, index) => {
                                return (
                                    <span key={index}>
                                        {item.rek_ismn}
                                        {publication.fez_record_search_key_ismn.length > 1 && index < publication.fez_record_search_key_ismn.length - 1 && <br/>}
                                    </span>
                                );
                            })
                            }
                        />
                    }
                    {/* ISRC */}
                    {
                        publication.fez_record_search_key_isrc && publication.fez_record_search_key_isrc.length > 0 &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.fez_record_search_key_isrc}
                            data={publication.fez_record_search_key_isrc.map((item, index) => {
                                return (
                                    <span key={index}>
                                        {item.rek_isrc}
                                        {publication.fez_record_search_key_isrc.length > 1 && index < publication.fez_record_search_key_isrc.length - 1 && <br/>}
                                    </span>
                                );
                            })
                            }
                        />
                    }
                    {/* Series */}
                    {/* getSearchUrl({searchQuery: {'rek_series': {'value': series}}}) */}
                    {
                        publication.fez_record_search_key_series && publication.fez_record_search_key_series.rek_series &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.rek_series}
                            data={
                                <Link to={pathConfig.list.series(publication.fez_record_search_key_series.rek_series)}>
                                    {publication.fez_record_search_key_series.rek_series}
                                </Link>
                            }
                        />
                    }
                    {/* Volume number */}
                    {
                        docType !== DOCUMENT_TYPE_JOURNAL_ARTICLE && subType !== NTRO_SUBTYPE_CW_TEXTUAL_WORK
                        && publication.fez_record_search_key_volume_number && publication.fez_record_search_key_volume_number.rek_volume_number &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.rek_volume_number}
                            data={publication.fez_record_search_key_volume_number.rek_volume_number}
                        />
                    }
                    {/* Issue number */}
                    {
                        docType !== DOCUMENT_TYPE_JOURNAL_ARTICLE && subType !== NTRO_SUBTYPE_CW_TEXTUAL_WORK
                        && publication.fez_record_search_key_issue_number && publication.fez_record_search_key_issue_number.rek_issue_number &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.rek_issue_number}
                            data={publication.fez_record_search_key_issue_number.rek_issue_number}
                        />
                    }
                    {/* Start page */}
                    {
                        docType !== DOCUMENT_TYPE_JOURNAL_ARTICLE && subType !== NTRO_SUBTYPE_CW_TEXTUAL_WORK && docType !== DOCUMENT_TYPE_BOOK_CHAPTER
                        && publication.fez_record_search_key_start_page && publication.fez_record_search_key_start_page.rek_start_page &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.rek_start_page}
                            data={publication.fez_record_search_key_start_page.rek_start_page}
                        />
                    }
                    {/* End page */}
                    {
                        docType !== DOCUMENT_TYPE_JOURNAL_ARTICLE && subType !== NTRO_SUBTYPE_CW_TEXTUAL_WORK
                        && docType !== DOCUMENT_TYPE_BOOK_CHAPTER && publication.fez_record_search_key_end_page && publication.fez_record_search_key_end_page.rek_end_page &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.rek_end_page}
                            data={publication.fez_record_search_key_end_page.rek_end_page}
                        />
                    }
                    {/* Total pages */}
                    {
                        docType !== DOCUMENT_TYPE_BOOK_CHAPTER
                        && (docType !== DOCUMENT_TYPE_BOOK && subType !== NTRO_SUBTYPE_CW_TEXTUAL_WORK)
                        && docType !== DOCUMENT_TYPE_RESEARCH_REPORT
                        && publication.fez_record_search_key_total_pages && publication.fez_record_search_key_total_pages.rek_total_pages &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.rek_total_pages}
                            data={publication.fez_record_search_key_total_pages.rek_total_pages}
                        />
                    }

                    {/* Language */}
                    {
                        publication.fez_record_search_key_language && publication.fez_record_search_key_language.length > 0 &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.rek_language}
                            data={publication.fez_record_search_key_language.map((item, index) => {
                                return (<span key={index}>
                                    {
                                        general.LANGUAGE
                                            .filter(language => { return item.rek_language === language.value; })
                                            .map(language => { return language.text; })
                                    }
                                    {publication.fez_record_search_key_language.length > 1 && index < publication.fez_record_search_key_language.length - 1 && ', '}
                                </span>);
                            })
                            }
                        />
                    }

                    {/* Original format */}
                    {
                        publication.fez_record_search_key_original_format && publication.fez_record_search_key_original_format.rek_original_format &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.rek_original_format}
                            data={publication.fez_record_search_key_original_format.rek_original_format}
                        />
                    }
                    {/* Audience size */}
                    {
                        publication.fez_record_search_key_audience_size && publication.fez_record_search_key_audience_size.rek_audience_size &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.rek_audience_size}
                            data={publication.fez_record_search_key_audience_size.rek_audience_size_lookup || 'Not set'}
                        />
                    }
                    {/* Quality indicators */}
                    {
                        publication.fez_record_search_key_quality_indicator && publication.fez_record_search_key_quality_indicator.length > 0 &&
                        <this.ViewNtroRow
                            heading={locale.viewRecord.headings.NTRO.qualityIndicators}
                            data={publication.fez_record_search_key_quality_indicator.map((item, index) => {
                                return (
                                    <span key={index}>
                                        {item.rek_quality_indicator_lookup || 'Not set'}
                                        {publication.fez_record_search_key_quality_indicator.length > 1 && index < publication.fez_record_search_key_quality_indicator.length - 1 && ', '}
                                    </span>
                                );
                            })}

                        />
                    }
                </StandardCard>
            </Grid>
        );
    }
}

const StyledNtroDetailsClass = withStyles(styles, {withTheme: true})(NtroDetailsClass);
const NtroDetails = (props) => <StyledNtroDetailsClass {...props}/>;
export default NtroDetails;
