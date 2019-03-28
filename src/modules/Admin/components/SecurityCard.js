import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import SecuritySelector from './SecuritySelector';

export const SecurityCard = ({ disabled, entity, fieldID, text, selectedPolicyKey = 0, selectedDataStreamPolicyKey = 0 }) => {
    const title = (
        <span>
            <b>{entity.type}</b> level security - {entity.pid}
        </span>
    );
    return (
        <StandardCard title={title} accentHeader>
            <Grid container spacing={8}>
                <Grid item xs={12}>
                    <Typography variant="body2" component="p">
                        {text.description}
                    </Typography>
                </Grid>
                <SecuritySelector
                    disabled={disabled}
                    selectedPolicyKey={selectedPolicyKey}
                    text={text}
                    fieldID={fieldID}
                />
            </Grid>
            {
                entity.dataStreamPolicyID &&
                <Grid container spacing={8}>
                    <SecuritySelector
                        disabled={disabled}
                        selectedPolicyKey={selectedDataStreamPolicyKey}
                        text={{
                            ...text,
                            fieldLabel: text.dataStreamFieldLabel,
                            selectedTitle: text.dataStreamSelectedTitle
                        }}
                        fieldID={fieldID.replace('Security', 'DataStreamSecurity')}
                    />
                </Grid>
            }
        </StandardCard>
    );
};

SecurityCard.propTypes = {
    disabled: PropTypes.bool,
    entity: PropTypes.object,
    selectedPolicyKey: PropTypes.number,
    selectedDataStreamPolicyKey: PropTypes.number,
    text: PropTypes.object,
    fieldID: PropTypes.string,
};

export default React.memo(SecurityCard);
