import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {NavigationDialogBox} from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {ListEditorField} from 'modules/SharedComponents/Toolbox/ListEditor';
import {validation} from 'config';
import {default as formLocale} from 'locale/publicationForm';
import {CommunitiesSelectField} from 'modules/SharedComponents/PublicationSubtype';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {pathConfig} from 'config/routes';

export default class CollectionForm extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props
        author: PropTypes.object,
        account: PropTypes.bool,
        disableSubmit: PropTypes.bool,
        fileAccessId: PropTypes.number,
        actions: PropTypes.object,
        isSessionValid: PropTypes.bool,
        formValues: PropTypes.object,
        formErrors: PropTypes.object,

        newCollectionSaving: PropTypes.bool,
        newCollectionError: PropTypes.bool,
        newRecord: PropTypes.object
    };

    static contextTypes = {
        selectFieldMobileOverrides: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    cancelSubmit = () => {
        window.location.assign(pathConfig.index);
    }

    afterSubmit = () => {
        window.location.assign(pathConfig.index);
    }

    reloadForm = () => {
        location.reload();
    }

    render() {
        const txt = formLocale.addACollection;
        if (this.props.submitSucceeded && this.props.newRecord) {
            return (
                <StandardPage title={txt.title}>
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <StandardCard title={txt.afterSubmitTitle}>
                                <Typography>{txt.afterSubmitText}</Typography>
                            </StandardCard>
                        </Grid>
                    </Grid>
                    <Grid container spacing={16}>
                        <Grid item xs/>
                        <Grid item>
                            <Button
                                variant={'contained'}
                                fullWidth
                                onClick={this.reloadForm}>
                                {txt.reloadFormButton}
                            </Button>
                        </Grid><Grid item>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                fullWidth
                                onClick={this.afterSubmit}>
                                {txt.afterSubmitButton}
                            </Button>
                        </Grid>
                    </Grid>
                </StandardPage>
            );
        }
        // customise error for thesis submission
        const alertProps = validation.getErrorAlertProps({
            ...this.props,
            alertLocale: {
                validationAlert: {...formLocale.validationAlert},
                progressAlert: {...formLocale.progressAlert},
                successAlert: {...formLocale.successAlert},
                errorAlert: {
                    ...formLocale.errorAlert,
                    message: formLocale.addACollection.addFailedMessage
                }
            }});
        return (
            <StandardPage title={txt.title}>
                <form>
                    <NavigationDialogBox
                        when={this.props.dirty && !this.props.submitSucceeded}
                        txt={txt.cancelWorkflowConfirmation}/>
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <StandardCard title={txt.title} help={txt.help}>
                                <Grid container spacing={24}>
                                    <Grid item xs={12}>
                                        <Field
                                            component={CommunitiesSelectField}
                                            disabled={this.props.submitting}
                                            name="fez_record_search_key_ismemberof"
                                            locale={txt.formLabels.ismemberof}
                                            required
                                            validate={[validation.required]}
                                        />
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                        {
                            this.props.formValues.get('fez_record_search_key_ismemberof') && this.props.formValues.get('fez_record_search_key_ismemberof').length > 0 &&
                            <Grid item xs={12}>
                                <StandardCard title={txt.details.title} help={txt.details.help}>
                                    <Grid container spacing={24}>
                                        <Grid item xs={12}>
                                            <Field
                                                component={TextField}
                                                disabled={this.props.submitting}
                                                autoFocus
                                                name="rek_title"
                                                type="text"
                                                fullWidth
                                                {...txt.formLabels.title}
                                                required
                                                validate={[validation.required]}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Field
                                                component={TextField}
                                                disabled={this.props.submitting}
                                                name="rek_description"
                                                fullWidth
                                                multiline
                                                rows={5}
                                                {...txt.formLabels.description}
                                                validate={[validation.required]}
                                                required
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography>{txt.formLabels.keywords.description}</Typography>
                                            <Field
                                                component={ListEditorField}
                                                name="fez_record_search_key_keywords"
                                                maxCount={10}
                                                // validate={[validation.requiredList]}
                                                maxInputLength={111}
                                                searchKey={{value: 'rek_keywords', order: 'rek_keywords_order'}}
                                                locale={txt.formLabels.keywords.field}
                                                disabled={this.props.submitting}/>
                                        </Grid>
                                    </Grid>
                                </StandardCard>
                            </Grid>
                        }
                        {
                            alertProps &&
                            <Grid item xs={12}>
                                <Alert {...alertProps} />
                            </Grid>
                        }
                    </Grid>
                    <Grid container spacing={16}>
                        <Grid item xs={false} sm />
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                variant={'contained'}
                                fullWidth
                                disabled={this.props.submitting}
                                onClick={this.cancelSubmit}>
                                {txt.cancel}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                variant={'contained'}
                                color={'primary'}
                                fullWidth
                                onClick={this.props.handleSubmit}
                                disabled={this.props.submitting || this.props.disableSubmit}>
                                {txt.submit}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </StandardPage>
        );
    }
}
