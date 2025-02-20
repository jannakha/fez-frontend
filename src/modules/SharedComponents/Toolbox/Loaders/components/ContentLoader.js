import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import InlineLoader from './InlineLoader';

export default function ContentLoader({message}) {
    return (
        <StandardPage>
            <Grid container={16}>
                <Grid item xs={12}>
                    <InlineLoader message={message} />
                </Grid>
            </Grid>
        </StandardPage>
    );
}

ContentLoader.propTypes = {
    message: PropTypes.string
};
