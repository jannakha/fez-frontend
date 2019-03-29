import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/lib/immutable';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { FormValuesContextConsumer } from 'context';

import SecurityCard from './SecurityCard';
import { renderPolicyDesc, renderPolicyItems } from './SecuritySelector';
import { securityAssignments } from './MockData';

import { validation } from 'config';
import { DATA_STREAM_SECURITY_POLICIES } from 'config/general';
import { locale } from 'locale';

const text = locale.components.securitySection;

export const SecuritySection = ({ disabled, handleSubmit }) => {
    const [collectionSecurity, setCollectionSecurity] = useState(false);
    const [overrideDatastreamSecurity, setOverrideDatastreamSecurity] = useState(false);
    const handleSecurity = (handler, security) => () => handler(!security);

    const securityCommunity = {
        ...securityAssignments[0]
    };

    const securityCollection = {
        ...securityAssignments[1]
    };

    return (
        <React.Fragment>
            <Grid container spacing={16}>
                <Grid item xs={12} sm={12}>
                    <Field
                        component={SelectField}
                        name="level"
                        label={text.admin.field.label}
                        disabled={disabled}
                        required
                        validation={[validation.required]}
                    >
                        <MenuItem value="Superadmin" >
                            {text.admin.field.menuItemText.superAdmin}
                        </MenuItem>
                        <MenuItem value="Admin" >
                            {text.admin.field.menuItemText.admin}
                        </MenuItem>
                    </Field>
                    <br /><br />
                    <Field
                        component={SelectField}
                        name="type"
                        label={text.admin.typeField.label}
                        disabled={disabled}
                        required
                        validation={[validation.required]}
                    >
                        <MenuItem value="Community" >
                            {text.admin.typeField.menuItemText.community}
                        </MenuItem>
                        <MenuItem value="Collection" >
                            {text.admin.typeField.menuItemText.collection}
                        </MenuItem>
                        <MenuItem value="Record" >
                            {text.admin.typeField.menuItemText.record}
                        </MenuItem>
                        <MenuItem value="DataStream" >
                            {text.admin.typeField.menuItemText.dataStream}
                        </MenuItem>
                    </Field>
                    <br /><br />
                    <Alert
                        type="warning"
                        title={text.admin.warning.title}
                        message={text.admin.warning.message}
                    />
                    <br /><br />
                </Grid>
            </Grid>
            <FormValuesContextConsumer>
                {({ formValues }) => {
                    return (
                        <React.Fragment>
                            {
                                formValues.get('level') === 'Superadmin' &&
                                formValues.get('type') === 'Community' &&
                                <Grid item xs={12}>
                                    <SecurityCard
                                        disabled={disabled}
                                        selectedPolicyKey={formValues.get('communitySecurity')}
                                        entity={securityCommunity}
                                        text={text.community}
                                        fieldID={'communitySecurity'}
                                    />
                                </Grid>
                            }
                            {
                                formValues.get('level') === 'Superadmin' &&
                                formValues.get('type') === 'Collection' &&
                                <Grid item xs={12}>
                                    <SecurityCard
                                        disabled={disabled}
                                        selectedPolicyKey={formValues.get('collectionSecurity')}
                                        selectedDataStreamPolicyKey={formValues.get('collectionDataStreamSecurity')}
                                        entity={securityCollection}
                                        text={text.collection}
                                        fieldID={'collectionSecurity'}
                                    />
                                </Grid>
                            }
                            {   formValues.get('level') &&
                                formValues.get('type') === 'Record' &&
                                <Grid item xs={12}>
                                    <StandardCard title={<span><b>Record</b> level security - UQ:12345</span>} accentHeader>
                                        {formValues.get('collectionSecurity') &&
                                            <Grid container spacing={8}>
                                                <Grid item xs={12}>
                                                    <FormControlLabel
                                                        control={<Checkbox
                                                            checked={collectionSecurity}
                                                            onChange={handleSecurity(setCollectionSecurity, collectionSecurity)}
                                                        />}
                                                        label="Override inherited security (detailed below)."
                                                    />
                                                </Grid>
                                            </Grid>
                                        }
                                        {!collectionSecurity && formValues.get('collectionSecurity')
                                            ?
                                            <Grid item xs={12} style={{
                                                padding: 24,
                                                backgroundColor: 'rgba(0,0,0,0.05)'
                                            }}>
                                                <Typography variant="h6" style={{ marginTop: -8 }}>
                                                    Inherited security policy details
                                                </Typography>
                                                <Grid container spacing={8} style={{ marginTop: 8 }}>
                                                    <Grid item xs={2}><b>Collection:</b></Grid>
                                                    <Grid item xs={5}>UQ:12345</Grid>
                                                    <Grid item xs={5}>UQ:67890</Grid>
                                                    <Grid item xs={2}><b>Policy:</b></Grid>
                                                    <Grid item xs={5}>{renderPolicyDesc(2)}</Grid>
                                                    <Grid item xs={5}>{renderPolicyDesc(3)}</Grid>
                                                </Grid>
                                            </Grid>
                                            :
                                            <React.Fragment>
                                                <Grid item xs={12}>
                                                    <Field
                                                        component={SelectField}
                                                        disabled={disabled}
                                                        name="overrideSecurity"
                                                        label="Policy to apply to override this PID`s inherited security"
                                                        required
                                                        validation={[validation.required]}
                                                    >
                                                        <MenuItem value="" disabled>
                                                            Select a security policy to apply
                                                        </MenuItem>
                                                        {renderPolicyItems({})}
                                                    </Field>
                                                </Grid>
                                                {
                                                    formValues.get('overrideSecurity') &&
                                                    <Grid item xs={12} style={{
                                                        padding: 24,
                                                        backgroundColor: 'rgba(0,0,0,0.05)'
                                                    }}>
                                                        <Typography variant="h6" style={{ marginTop: -8 }}>
                                                            Selected record level security policy details
                                                        </Typography>
                                                        <Grid container spacing={8} style={{ marginTop: 8 }}>
                                                            <Grid item xs={2}><b>Name (ID):</b></Grid>
                                                            <Grid item xs={10}>
                                                                {renderPolicyDesc(formValues.get('overrideSecurity'))}
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                }
                                                <Grid item>
                                                    <FormControlLabel
                                                        control={<Checkbox
                                                            checked={overrideDatastreamSecurity}
                                                            onChange={
                                                                handleSecurity(
                                                                    setOverrideDatastreamSecurity,
                                                                    overrideDatastreamSecurity
                                                                )
                                                            }
                                                        />}
                                                        label="Override inherited datastream security (detailed below)."
                                                    />
                                                    {
                                                        overrideDatastreamSecurity &&
                                                        <Field
                                                            component={SelectField}
                                                            name="overridePidDatastreamSecurity"
                                                            value={formValues.get('overridePidDatastreamSecurity')}
                                                            label="Datasteam policy"
                                                            required
                                                            validation={[validation.required]}
                                                        >
                                                            <MenuItem value="" disabled>
                                                                Select a security policy to apply to this PIDs datastream
                                                            </MenuItem>
                                                            {renderPolicyItems({
                                                                policyList: DATA_STREAM_SECURITY_POLICIES
                                                            })}
                                                        </Field>
                                                    }
                                                    {
                                                        formValues.get('overridePidDatastreamSecurity') &&
                                                        <Grid item xs={12} style={{
                                                            padding: 24,
                                                            backgroundColor: 'rgba(0,0,0,0.05)'
                                                        }}>
                                                            <Typography variant="h6" style={{ marginTop: -8 }}>
                                                                Selected record level datastream security policy details
                                                            </Typography>
                                                            <Grid container spacing={8} style={{ marginTop: 8 }}>
                                                                <Grid item xs={2}><b>Name (ID):</b></Grid>
                                                                <Grid item xs={10}>
                                                                    {renderPolicyDesc(
                                                                        formValues.get('overridePidDatastreamSecurity'),
                                                                        DATA_STREAM_SECURITY_POLICIES
                                                                    )}
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </React.Fragment>
                                        }
                                    </StandardCard>
                                </Grid>
                            }
                            {
                                formValues.get('level') &&
                                formValues.get('type') &&
                                <Grid item xs={12} sm="auto">
                                    <Button
                                        style={{whiteSpace: 'nowrap'}}
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        children={text.submit}
                                        onClick={handleSubmit}
                                    />
                                </Grid>
                            }
                        </React.Fragment>
                    );
                }}
            </FormValuesContextConsumer>
        </React.Fragment>
    );
};

SecuritySection.propTypes = {
    disabled: PropTypes.bool,
    handleSubmit: PropTypes.func
};

export default React.memo(SecuritySection);
