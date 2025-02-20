import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

// forms & custom components
import {PublicationsList, PublicationsListPaging, PublicationsListSorting, FacetsFilter} from 'modules/SharedComponents/PublicationsList';

import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {ConfirmDialogBox} from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import {StandardRighthandCard} from 'modules/SharedComponents/Toolbox/StandardRighthandCard';
import {pathConfig} from 'config/routes';
import {locale} from 'locale';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

export default class PossiblyMyRecords extends PureComponent {
    static propTypes = {
        possiblePublicationsList: PropTypes.array,
        publicationsClaimedInProgress: PropTypes.array,
        loadingPossiblePublicationsList: PropTypes.bool,
        possiblePublicationsFacets: PropTypes.object,
        possiblePublicationsPagingData: PropTypes.object,

        accountLoading: PropTypes.bool,
        canUseExport: PropTypes.bool,

        possibleCounts: PropTypes.number,
        loadingPossibleCounts: PropTypes.bool,

        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object,

        hidePublicationFailed: PropTypes.bool,
        hidePublicationFailedErrorMessage: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.initState = {
            page: 1,
            pageSize: 20,
            sortBy: locale.components.sorting.sortBy[1].value,
            sortDirection: locale.components.sorting.sortDirection[0],
            activeFacets: {
                filters: {},
                ranges: {}
            }
        };
        this.state = {
            // check if user has publications, once true always true
            // facets filtering might return no results, but facets should still be visible
            hasPublications: !props.loadingPossiblePublicationsList && props.possiblePublicationsList.length > 0,
            publicationToHide: null,
            ...(!!props.location.state ? props.location.state : this.initState)
        };
    }

    componentDidMount() {
        if (!this.props.accountLoading) {
            this.props.actions.searchPossiblyYourPublications({...this.state});
        }
    }

    componentWillReceiveProps(newProps) {
        // handle browser back button - set state from location/dispatch action for this state
        if (this.props.location !== newProps.location
            && newProps.history.action === 'POP'
            && newProps.location.pathname === pathConfig.records.possible) {
            this.setState({...(!!newProps.location.state ? newProps.location.state : this.initState)}, () => {
                // only will be called when user clicks back on my records page
                this.props.actions.searchPossiblyYourPublications({...this.state});
            });
        }
        // set forever-true flag if user has publications
        if (!this.state.hasPublications && !newProps.loadingPossiblePublicationsList
            && !!newProps.possiblePublicationsList && newProps.possiblePublicationsList.length > 0) {
            this.setState({ hasPublications: true });
        }
    }

    componentWillUnmount() {
        this.props.actions.hideRecordErrorReset();
    }

    pushPageHistory = () => {
        this.props.history.push({
            pathname: `${pathConfig.records.possible}`,
            search: `?ts=${Date.now()}`,
            state: {...this.state}
        });
        this.props.actions.searchPossiblyYourPublications({...this.state});
    };

    _hidePublication = () => {
        if (this.state.publicationToHide) {
            this.props.actions.hideRecord({
                record: this.state.publicationToHide,
                facets: this.state.activeFacets
            });
            this.setState({publicationToHide: null});
        }
    };

    _confirmHidePublication = (item) => {
        // temporary keep which publication to hide in the state
        this.setState({publicationToHide: item});
        this.hideConfirmationBox.showConfirmation();
    };

    _claimPublication = (item) => {
        this.props.history.push(pathConfig.records.claim);
        this.props.actions.setClaimPublication(item);
    };

    _facetsChanged = (activeFacets) => {
        this.setState({
            activeFacets: activeFacets,
            page: 1
        }, this.pushPageHistory);
    };

    sortByChanged = (sortBy, sortDirection) => {
        this.setState(
            {
                sortBy: sortBy,
                sortDirection: sortDirection
            }, this.pushPageHistory
        );
    };

    pageSizeChanged = (pageSize) => {
        this.setState(
            {
                pageSize: pageSize,
                page: 1
            }, this.pushPageHistory
        );
    };

    _setHideConfirmationBox = (ref) => (this.hideConfirmationBox = ref);

    getAlert = (alertLocale, hasFailed = false, error = null) => {
        return hasFailed ? (<Alert {...{
            ...alertLocale,
            message: alertLocale.message ? alertLocale.message(error) : error
        }} />) : null;
    };

    pageChanged = (page) => {
        this.setState(
            {
                page: page
            }, this.pushPageHistory
        );
    };

    render() {
        if (this.props.accountLoading) return null;
        const totalPossiblePubs = this.props.possibleCounts;
        const pagingData = this.props.possiblePublicationsPagingData;
        const txt = locale.pages.claimPublications;
        const inProgress = [
            {
                label: txt.searchResults.inProgress,
                disabled: true,
                primary: false
            }
        ];

        const actions = [
            {
                label: txt.searchResults.claim,
                handleAction: this._claimPublication,
                primary: true
            },
            {
                label: txt.searchResults.hide,
                handleAction: this._confirmHidePublication
            }
        ];
        return (
            <StandardPage title={txt.title}>
                {
                    this.getAlert(
                        txt.hidePublicationFailedAlert,
                        this.props.hidePublicationFailed,
                        this.props.hidePublicationFailedErrorMessage
                    )
                }

                {
                    // first time loading my possible publications - account hasn't been loaded or any my publications haven't been loaded
                    !this.state.hasPublications && (this.props.loadingPossiblePublicationsList || this.props.loadingPossibleCounts) &&
                    <Grid container>
                        <Grid item xs/>
                        <Grid item><InlineLoader message={txt.loadingMessage}/></Grid>
                        <Grid item xs/>
                    </Grid>
                }
                {
                    this.props.possiblePublicationsList.length > 0 &&
                    <ConfirmDialogBox
                        onRef={this._setHideConfirmationBox}
                        onAction={this._hidePublication}
                        locale={txt.hidePublicationConfirmation}/>
                }
                <Grid container spacing={24}>
                    {
                        // no results to display
                        !this.props.loadingPossibleCounts &&
                        !this.props.loadingPossiblePublicationsList &&
                        this.props.possiblePublicationsList.length === 0 &&
                        <Grid item xs={12}>
                            <StandardCard {...txt.noResultsFound}>
                                {txt.noResultsFound.text}
                            </StandardCard>
                        </Grid>
                    }
                    {
                        // results to display or loading if user is filtering/paging
                        this.state.hasPublications && (
                            this.props.loadingPossiblePublicationsList ||
                            this.props.possiblePublicationsList.length > 0
                        ) &&
                        <Grid item xs={12} md={9}>
                            <StandardCard noHeader>
                                {
                                    this.props.loadingPossiblePublicationsList &&
                                    <Grid container>
                                        <Grid item xs/>
                                        <Grid item><InlineLoader message={txt.loadingMessage}/></Grid>
                                        <Grid item xs/>
                                    </Grid>
                                }
                                {
                                    !this.props.loadingPossiblePublicationsList &&
                                    this.props.possiblePublicationsList.length > 0 &&
                                        <React.Fragment>
                                            <Grid item xs>
                                                <Typography>
                                                    {
                                                        txt.searchResults.text
                                                            .replace('[resultsCount]', this.props.possiblePublicationsList.length)
                                                            .replace('[totalCount]', totalPossiblePubs)
                                                    }
                                                </Typography>
                                            </Grid>
                                            <Grid item xs style={{marginTop: 16}}>
                                                {
                                                    totalPossiblePubs > this.initState.pageSize &&
                                                        <React.Fragment>
                                                            <Grid item xs>
                                                                <PublicationsListSorting
                                                                    initPageLength={this.initState.pageSize}
                                                                    sortBy={this.state.sortBy}
                                                                    sortDirection={this.state.sortDirection}
                                                                    pageSize={this.state.pageSize}
                                                                    pagingData={pagingData}
                                                                    onSortByChanged={this.sortByChanged}
                                                                    onPageSizeChanged={this.pageSizeChanged}
                                                                    onExportPublications={this.handleExportPublications}
                                                                    disabled={this.props.loadingPossiblePublicationsList}
                                                                    canUseExport={this.props.canUseExport}
                                                                />
                                                            </Grid>
                                                            <Grid item xs>
                                                                <PublicationsListPaging
                                                                    loading={this.props.loadingPossiblePublicationsList}
                                                                    pagingData={pagingData}
                                                                    onPageChanged={this.pageChanged}
                                                                    disabled={this.props.loadingPossiblePublicationsList} />
                                                            </Grid>
                                                        </React.Fragment>
                                                }
                                                <Grid item xs>
                                                    <PublicationsList
                                                        publicationsList={this.props.possiblePublicationsList}
                                                        publicationsListSubset={this.props.publicationsClaimedInProgress}
                                                        subsetCustomActions={inProgress}
                                                        customActions={actions} />
                                                </Grid>
                                                {
                                                    totalPossiblePubs > this.initState.pageSize &&
                                                    <Grid item xs>
                                                        <PublicationsListPaging
                                                            loading={this.props.loadingPossiblePublicationsList}
                                                            pagingData={pagingData}
                                                            onPageChanged={this.pageChanged}
                                                            disabled={this.props.loadingPossiblePublicationsList}/>
                                                    </Grid>
                                                }
                                            </Grid>
                                        </React.Fragment>
                                }
                            </StandardCard>
                        </Grid>
                    }
                    {
                        // show available filters or selected filters (even if there are no results)
                        ((this.props.possiblePublicationsFacets && Object.keys(this.props.possiblePublicationsFacets).length > 0)
                        || (this.state.activeFacets && this.state.activeFacets.filters && Object.keys(this.state.activeFacets.filters).length > 0)
                        || (this.state.activeFacets && this.state.activeFacets.ranges && Object.keys(this.state.activeFacets.ranges).length > 0)) &&
                        <Hidden smDown>
                            <Grid item sm={3}>
                                <StandardRighthandCard title={txt.facetsFilter.title} help={txt.facetsFilter.help}>
                                    <FacetsFilter
                                        facetsData={this.props.possiblePublicationsFacets}
                                        onFacetsChanged={this._facetsChanged}
                                        activeFacets={this.state.activeFacets}
                                        disabled={this.props.loadingPossiblePublicationsList}
                                        excludeFacetsList={txt.facetsFilter.excludeFacetsList}
                                        renameFacetsList={txt.facetsFilter.renameFacetsList}
                                        lookupFacetsList={txt.facetsFilter.lookupFacetsList} />
                                </StandardRighthandCard>
                            </Grid>
                        </Hidden>
                    }
                </Grid>
            </StandardPage>
        );
    }
}

