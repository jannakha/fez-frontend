import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { ConfirmDialogBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { PublicationForm } from 'modules/SharedComponents/PublicationForm';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

// forms & custom components
import { routes } from 'config';
import locale from 'locale/pages';
import Grid from '@material-ui/core/Grid';

export default class NewRecord extends PureComponent {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        rawSearchQuery: PropTypes.string,
        newRecordFileUploadingOrIssueError: PropTypes.bool,
        author: PropTypes.object
    };

    static defaultProps = {
        rawSearchQuery: '',
    };

    _recordSaved = () => {
        // show record save successfully confirmation box
        this.confirmationBox.showConfirmation();
    };

    _restartWorkflow = () => {
        this.props.actions.clearNewRecord();
        this.props.history.push(routes.pathConfig.records.add.find);
    };

    _navigateToMyResearch = () => {
        this.props.actions.clearNewRecord();
        this.props.history.push(routes.pathConfig.records.mine);
    }

    render() {
        // wait for author to load before rendering
        if (!this.props.author) {
            return (<span />);
        }

        const txt = locale.pages.addRecord;
        const {rawSearchQuery} = this.props;

        // set initial value only if it's a title (not pubmed/DOI)
        const initialValues = {
            currentAuthor: [
                {
                    'nameAsPublished': this.props.author.aut_display_name ? this.props.author.aut_display_name : '',
                    'authorId': this.props.author.aut_id ? this.props.author.aut_id : ''
                }
            ],
            rek_title: rawSearchQuery || ''
        };

        // set confirmation message depending on file upload status
        const saveConfirmationLocale = {...txt.successWorkflowConfirmation};
        saveConfirmationLocale.confirmationMessage = (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    {this.props.newRecordFileUploadingOrIssueError && <Alert {...saveConfirmationLocale.fileFailConfirmationAlert} />}
                    {saveConfirmationLocale.recordSuccessConfirmationMessage}
                </Grid>
            </Grid>
        );
        return (
            <React.Fragment>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={this._navigateToMyResearch}
                    onCancelAction={this._restartWorkflow}
                    locale={saveConfirmationLocale}
                />
                <PublicationForm
                    onFormSubmitSuccess={this._recordSaved}
                    onFormCancel={this._restartWorkflow}
                    initialValues={initialValues}
                />
            </React.Fragment>
        );
    }
}
