import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/lib/immutable';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';

import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';

import { validation } from 'config';
import { TOP_LEVEL_SECURITY_POLICIES } from 'config/general';

export const renderPolicyDesc = ({ selectedKey, policyArray = TOP_LEVEL_SECURITY_POLICIES }) => {
    if (!selectedKey) {
        return '';
    }

    const policyDesc = policyArray.find(
        policy => policy.value === selectedKey
    );

    return (
        !!policyDesc ?
            <React.Fragment>
                {policyDesc.name} ({policyDesc.id})
            </React.Fragment>
            : ''
    );
};

renderPolicyDesc.propTypes = {
    selectedKey: PropTypes.number,
    policyArray: PropTypes.array
};

export const renderPolicyItems = ({ selectedKey = null, policyArray = TOP_LEVEL_SECURITY_POLICIES }) => {
    return policyArray.map((policy, index) => {
        return (
            <MenuItem key={index} value={policy.value} selected={selectedKey === policy.value} >
                {policy.label}
            </MenuItem>
        );
    });
};

renderPolicyItems.propTypes = {
    selectedKey: PropTypes.number,
    policyArray: PropTypes.array
};

export const SecuritySelector = ({ disabled, fieldID, text, selectedPolicyKey = 0 }) => (
    <React.Fragment>
        <Grid item xs={12}>
            <Field
                component={SelectField}
                disabled={disabled}
                name={fieldID}
                label={text.fieldLabel}
                required
                validation={[validation.required]}
            >
                <MenuItem value={0} disabled>
                    {text.prompt}
                </MenuItem>
                {renderPolicyItems({
                    selectedKey: selectedPolicyKey
                })}
            </Field>
        </Grid>
        {
            selectedPolicyKey &&
            <Grid item xs={12} style={{
                padding: 24,
                backgroundColor: 'rgba(0,0,0,0.05)'
            }}>
                <Typography variant="h6" style={{ marginTop: -8 }}>
                    {text.selectedTitle}
                </Typography>
                <Grid container spacing={8} style={{ marginTop: 8 }}>
                    <Grid item xs={2}><b>Name (ID):</b></Grid>
                    <Grid item xs={10}>
                        {renderPolicyDesc({ selectedKey: selectedPolicyKey })}
                    </Grid>
                </Grid>
            </Grid>
        }
    </React.Fragment>
);

SecuritySelector.propTypes = {
    disabled: PropTypes.bool,
    selectedPolicyKey: PropTypes.number,
    text: PropTypes.object,
    fieldID: PropTypes.string,
};

export default React.memo(SecuritySelector);
