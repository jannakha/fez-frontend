import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

// forms & custom components
import {PublicationSearchForm} from 'modules/SharedComponents/PublicationSearchForm';
import {pathConfig} from 'config/routes';
import locale from 'locale/pages';

export default class FindRecords extends PureComponent {
    static propTypes = {
        actions: PropTypes.object,
        history: PropTypes.object.isRequired
    };

    _performSearch = (values) => {
        this.props.actions.searchPublications(values.get('searchQuery'));
        this.props.history.push(pathConfig.records.add.results);
    };

    _handleSkipSearch = () => {
        this.props.history.push(pathConfig.records.add.new);
    };

    render() {
        const txt = locale.pages.addRecord;
        return (
            <PublicationSearchForm locale={txt.step1} onSubmit={this._performSearch} onSkipSearch={this._handleSkipSearch}/>
        );
    }
}
