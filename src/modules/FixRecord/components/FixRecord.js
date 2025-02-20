import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';

import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';

import {SelectField} from 'modules/SharedComponents/Toolbox/SelectField';
import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {ConfirmDialogBox} from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import {NavigationDialogBox} from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import {FileUploadField} from 'modules/SharedComponents/Toolbox/FileUploader';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';

import {PublicationCitation} from 'modules/SharedComponents/PublicationCitation';
import {validation, routes} from 'config';
import {default as pagesLocale} from 'locale/pages';
import {default as formsLocale} from 'locale/forms';

export default class FixRecord extends PureComponent {
    static propTypes = {
        ...propTypes, // all redux-form props
        disableSubmit: PropTypes.bool,

        recordToFix: PropTypes.object,
        loadingRecordToFix: PropTypes.bool,

        author: PropTypes.object,
        accountAuthorLoading: PropTypes.bool,

        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,

        publicationToFixFileUploadingError: PropTypes.bool,

        errors: PropTypes.object,
    };

    static contextTypes = {
        selectFieldMobileOverrides: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedRecordAction: ''
        };
    }

    componentDidMount() {
        if (this.props.actions &&
            !this.props.recordToFix &&
            this.props.match.params &&
            this.props.match.params.pid) {
            this.props.actions.loadRecordToFix(this.props.match.params.pid);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitSucceeded !== this.props.submitSucceeded) {
            this.successConfirmationBox.showConfirmation();
        }
    }

    componentWillUnmount() {
        // clear previously selected recordToFix for a fix
        this.props.actions.clearFixRecord();
    }

    isLoggedInUserLinked = (author, recordToFix, searchKey, subkey) => {
        return !!author && !!recordToFix && recordToFix[searchKey] && recordToFix[searchKey].length > 0
            && recordToFix[searchKey].filter(authorId => authorId[subkey] === author.aut_id).length > 0;
    };

    isAuthorLinked = () => {
        const isAuthorLinked = this.isLoggedInUserLinked(this.props.author, this.props.recordToFix, 'fez_record_search_key_author_id', 'rek_author_id');
        const isContributorLinked = this.isLoggedInUserLinked(this.props.author, this.props.recordToFix, 'fez_record_search_key_contributor_id', 'rek_contributor_id');

        return isAuthorLinked || isContributorLinked;
    };

    _navigateToMyResearch = () => {
        this.props.history.push(routes.pathConfig.records.mine);
    };

    _navigateToDashboard = () => {
        this.props.history.push(routes.pathConfig.dashboard);
    };

    _cancelFix = () => {
        this.props.history.goBack();
    };

    _actionSelected = (event, value) => {
        this.setState({
            selectedRecordAction: value
        });
    };

    _setSuccessConfirmation = (ref) => {
        this.successConfirmationBox = ref;
    };

    _handleDefaultSubmit = (event) => {
        if(event) event.preventDefault();
    };

    render() {
        // if author is not linked to this record, abandon form
        if (!(this.props.accountAuthorLoading || this.props.loadingRecordToFix) && !this.isAuthorLinked()) {
            this.props.history.go(-1);
            return <div />;
        }

        const txt = pagesLocale.pages.fixRecord;
        const txtFixForm = formsLocale.forms.fixPublicationForm;
        const txtUnclaimForm = formsLocale.forms.unclaimPublicationForm;

        if(this.props.accountAuthorLoading || this.props.loadingRecordToFix) {
            return (
                <React.Fragment>
                    <InlineLoader message={txt.loadingMessage}/>
                </React.Fragment>
            );
        }

        const fixOptions = txt.actionsOptions.map((item, index) => (
            <MenuItem
                value={item.action}
                children={item.title}
                key={`fix_record_action_${index}`} />
        ));

        // set confirmation message depending on file upload status
        const saveConfirmationLocale = {...txtFixForm.successWorkflowConfirmation};
        saveConfirmationLocale.confirmationMessage = (
            <React.Fragment>
                {this.props.publicationToFixFileUploadingError && <Alert {...saveConfirmationLocale.fileFailConfirmationAlert} />}
                {saveConfirmationLocale.confirmationMessage}
            </React.Fragment>
        );
        const alertProps = validation.getErrorAlertProps({...this.props, alertLocale: txtFixForm});
        return (
            <StandardPage title={txt.title}>
                <form onSubmit={this._handleDefaultSubmit}>
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <StandardCard title={txt.subTitle} help={txt.help}>
                                <PublicationCitation publication={this.props.recordToFix}/>
                                <Field
                                    component={SelectField}
                                    disabled={this.props.submitting}
                                    name="fixAction"
                                    label={txt.fieldLabels.action}
                                    validate={[validation.required]}
                                    onChange={this._actionSelected}
                                    required >
                                    {fixOptions}
                                </Field>
                            </StandardCard>
                        </Grid>
                        {
                            this.state.selectedRecordAction === 'fix' &&
                            <React.Fragment>
                                <NavigationDialogBox when={this.props.dirty && !this.props.submitSucceeded} txt={txtFixForm.cancelWorkflowConfirmation} />
                                <ConfirmDialogBox
                                    onRef={this._setSuccessConfirmation}
                                    onAction={this._navigateToMyResearch}
                                    onCancelAction={this._navigateToDashboard}
                                    locale={saveConfirmationLocale}
                                />
                                <Grid item xs={12}>
                                    <StandardCard title={txtFixForm.comments.title} help={txtFixForm.comments.help}>
                                        <Grid container spacing={16}>
                                            <Grid item xs={12}>
                                                <Field
                                                    component={TextField}
                                                    disabled={this.props.submitting}
                                                    name="comments"
                                                    type="text"
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    label={txtFixForm.comments.fieldLabels.comments}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Field
                                                    component={TextField}
                                                    disabled={this.props.submitting}
                                                    name="rek_link"
                                                    type="text"
                                                    fullWidth
                                                    label={txtFixForm.comments.fieldLabels.url}
                                                    validate={[validation.url]}
                                                />
                                            </Grid>
                                        </Grid>
                                    </StandardCard>
                                </Grid>
                                <Grid item xs={12}>
                                    <StandardCard title={txtFixForm.fileUpload.title} help={txtFixForm.fileUpload.help}>
                                        {txtFixForm.fileUpload.description}
                                        <Field
                                            name="files"
                                            component={FileUploadField}
                                            disabled={this.props.submitting}
                                            requireOpenAccessStatus
                                            validate={[validation.validFileUpload]}
                                        />
                                    </StandardCard>
                                </Grid>
                            </React.Fragment>
                        }
                        {
                            this.state.selectedRecordAction === 'unclaim' &&
                            <Grid item xs={12}>
                                <StandardCard title={txtUnclaimForm.title} help={txtUnclaimForm.help}>
                                    <Alert {...txtUnclaimForm.alert}/>
                                    {txtUnclaimForm.description}
                                    <ConfirmDialogBox
                                        onRef={this._setSuccessConfirmation}
                                        onAction={this._navigateToMyResearch}
                                        onCancelAction={this._cancelFix}
                                        locale={txtUnclaimForm.successWorkflowConfirmation}/>
                                </StandardCard>
                            </Grid>
                        }

                        {
                            alertProps &&
                            <Grid item xs={12}>
                                <Alert pushToTop {...alertProps} />
                            </Grid>
                        }
                    </Grid>
                    <Grid container spacing={24}>
                        <Grid item xs />
                        <Grid item>
                            <Button
                                variant={'contained'}
                                fullWidth
                                children={txt.cancel}
                                disabled={this.props.submitting}
                                onClick={this._cancelFix}/>
                        </Grid>
                        {
                            this.state.selectedRecordAction &&
                            <Grid item>
                                <Button
                                    variant={'contained'}
                                    color={'primary'}
                                    fullWidth
                                    children={txt.submit}
                                    onClick={this.props.handleSubmit}
                                    disabled={this.props.submitting || this.props.disableSubmit}/>
                            </Grid>
                        }
                    </Grid>
                </form>
            </StandardPage>
        );
    }
}
