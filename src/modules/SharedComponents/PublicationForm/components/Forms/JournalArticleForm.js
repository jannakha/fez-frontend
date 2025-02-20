import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form/immutable';
import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {PartialDateField} from 'modules/SharedComponents/Toolbox/PartialDate';
import {NtroFields} from 'modules/SharedComponents/Toolbox/NtroFields';
import {ContributorsEditorField} from 'modules/SharedComponents/ContributorsEditor';
import {validation} from 'config';
import {default as formLocale} from 'locale/publicationForm';
import {NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION} from 'config/general';
import {locale} from 'locale';
import {ListEditorField} from 'modules/SharedComponents/Toolbox/ListEditor';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default class JournalArticleForm extends Component {
    static propTypes = {
        submitting: PropTypes.bool,
        subtype: PropTypes.string,
        isNtro: PropTypes.bool,
        isAuthorSelected: PropTypes.bool
    };

    constructor(props) {
        super(props);
    }

    render() {
        // path to the locale data for each of the sections
        const txt = formLocale.journalArticle;
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <StandardCard title={txt.information.title} help={txt.information.help}>
                        <Grid container spacing={16}>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    autoFocus={!this.props.isNtro}
                                    name="rek_title"
                                    type="text"
                                    rows={1}
                                    multiline
                                    fullWidth
                                    {...txt.information.fieldLabels.documentTitle}
                                    required
                                    validate={[validation.required]}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="fez_record_search_key_journal_name.rek_journal_name"
                                    type="text"
                                    required
                                    fullWidth
                                    {...txt.information.fieldLabels.journalTitle}
                                    validate={[validation.required]}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    component={PartialDateField}
                                    disabled={this.props.submitting}
                                    name="rek_date"
                                    allowPartial required
                                    required
                                    className="requiredHintField"
                                    validate={[validation.required]}
                                    floatingTitle={txt.information.fieldLabels.date.title}
                                    floatingTitleRequired
                                />
                            </Grid>
                        </Grid>
                    </StandardCard>
                </Grid>
                <Grid item xs={12}>
                    <StandardCard title={txt.authors.title} help={txt.authors.help}>
                        <Grid container spacing={16}>
                            <Grid item xs={12}>
                                <Typography>{txt.authors.description}</Typography>
                                <Field
                                    component={ContributorsEditorField}
                                    showContributorAssignment
                                    name="authors"
                                    locale={txt.authors.field}
                                    disabled={this.props.submitting}
                                    validate={[validation.authorRequired]}
                                    isNtro={this.props.isNtro}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </StandardCard>
                </Grid>
                {
                    this.props.isNtro &&
                    <NtroFields
                        submitting={this.props.submitting}
                        showContributionStatement={this.props.isAuthorSelected}
                        hideIsmn={this.props.subtype !== NTRO_SUBTYPE_CW_MUSICAL_COMPOSITION}
                        hideIsrc
                        hideVolume
                        hideIssue
                        hideStartPage
                        hideEndPage
                        hideExtent
                        hideOriginalFormat
                        hideAudienceSize
                    />
                }
                <Grid item xs={12}>
                    <StandardCard title={locale.components.issnForm.title} help={locale.components.issnForm.title.help}>
                        <Typography>{locale.components.issnForm.text}</Typography>
                        <Field
                            component={ListEditorField}
                            remindToAdd
                            isValid={validation.isValidIssn}
                            name="fez_record_search_key_issn"
                            maxCount={5}
                            locale={locale.components.issnForm.field}
                            searchKey={{value: 'rek_issn', order: 'rek_issn_order'}}
                            disabled={this.props.submitting}
                        />
                    </StandardCard>
                </Grid>
                <Grid item xs={12}>
                    <StandardCard title={txt.optional.title} help={txt.optional.help}>
                        <Grid container spacing={16}>
                            <Grid item xs={6} sm={3}>
                                <Field
                                    component={TextField}
                                    name="fez_record_search_key_volume_number.rek_volume_number"
                                    type="text"
                                    fullWidth
                                    disabled={this.props.submitting}
                                    label={txt.optional.fieldLabels.volume}/>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Field
                                    component={TextField}
                                    name="fez_record_search_key_issue_number.rek_issue_number"
                                    type="text" fullWidth
                                    disabled={this.props.submitting}
                                    label={txt.optional.fieldLabels.issue}/>
                            </Grid>

                            <Grid item xs={6} sm={3}>
                                <Field
                                    component={TextField}
                                    name="fez_record_search_key_start_page.rek_start_page"
                                    type="text"
                                    fullWidth
                                    disabled={this.props.submitting}
                                    label={txt.optional.fieldLabels.startPage}/>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Field
                                    component={TextField}
                                    name="fez_record_search_key_end_page.rek_end_page"
                                    type="text"
                                    fullWidth
                                    disabled={this.props.submitting}
                                    label={txt.optional.fieldLabels.endPage}/>
                            </Grid>
                            <Grid item  xs={12}>
                                <Field
                                    component={TextField}
                                    name="fez_record_search_key_article_number.rek_article_number"
                                    type="text"
                                    fullWidth
                                    disabled={this.props.submitting}
                                    label={txt.optional.fieldLabels.articleNumber}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    name="comments"
                                    type="text"
                                    disabled={this.props.submitting}
                                    fullWidth
                                    multiline
                                    rows={1}
                                    label={txt.optional.fieldLabels.notes}/>
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={TextField}
                                    name="rek_link"
                                    type="text"
                                    disabled={this.props.submitting}
                                    fullWidth
                                    label={txt.optional.fieldLabels.url}
                                    validate={[validation.url]}
                                />
                            </Grid>
                        </Grid>
                    </StandardCard>
                </Grid>
            </Grid>
        );
    }
}
