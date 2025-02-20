import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import OpenAccessIcon from 'modules/SharedComponents/Partials/OpenAccessIcon';
import * as Partials from './partials';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
    statsLink: {
        ...theme.typography.caption
    }
});

export class CitationCounts extends PureComponent {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        hideViewFullStatisticsLink: PropTypes.bool,
        classes: PropTypes.object
    };

    getTitle = (title) => (locale.components.publicationCitation.linkWillOpenInNewWindow.replace('[destination]', title));

    render() {
        const txt = locale.components.publicationCitation.citationCounts;
        const { sources } = locale.global;
        const {
            publication,
            hideViewFullStatisticsLink,
            classes
        } = this.props;
        const counts = {
            wos: publication.hasOwnProperty('rek_thomson_citation_count') ? publication.rek_thomson_citation_count : null,
            scopus: publication.hasOwnProperty('rek_scopus_citation_count') ? publication.rek_scopus_citation_count : null,
            google: publication.hasOwnProperty('rek_gs_citation_count') ? publication.rek_gs_citation_count : null,
            altmetric: publication.hasOwnProperty('rek_altmetric_score') ? publication.rek_altmetric_score : null
        };

        return (
            <Grid container spacing={0}>
                <Grid item xs={12} sm={'auto'}>
                    {
                        !!publication.fez_record_search_key_isi_loc &&
                        !!publication.fez_record_search_key_isi_loc.rek_isi_loc &&
                        <Partials.CitationCountView
                            source="wos"
                            count={counts.wos}
                            link={sources.wos.externalUrl.replace(
                                '[id]',
                                publication.fez_record_search_key_isi_loc.rek_isi_loc
                            )}
                            title={this.getTitle(sources.wos.title)}
                        />
                    }
                    {
                        !!publication.fez_record_search_key_scopus_id &&
                        !!publication.fez_record_search_key_scopus_id.rek_scopus_id &&
                        <Partials.CitationCountView
                            source="scopus"
                            count={counts.scopus}
                            link={sources.scopus.externalUrl.replace(
                                '[id]',
                                publication.fez_record_search_key_scopus_id.rek_scopus_id
                            )}
                            title={this.getTitle(sources.scopus.title)}
                        />
                    }
                    {
                        !!counts.altmetric &&
                        counts.altmetric > 0 &&
                        !!publication.rek_altmetric_id &&
                        <Partials.CitationCountView
                            source="altmetric"
                            count={counts.altmetric}
                            link={txt.altmetric.externalUrl.replace(
                                '[id]',
                                publication.rek_altmetric_id
                            )}
                            title={this.getTitle(txt.altmetric.title)}
                        />
                    }
                    {
                        !!publication.rek_pid &&
                        <Partials.CitationCountView
                            source="google"
                            count={counts.google}
                            link={txt.google.externalUrl.replace(
                                '[id]',
                                encodeURI(publication.rek_title)
                            )}
                            title={this.getTitle(txt.google.title)}
                        />
                    }
                    <OpenAccessIcon {...(
                        this.props.publication.calculateOpenAccess
                            ? this.props.publication.calculateOpenAccess()
                            : {}
                    )} />
                </Grid>
                <Grid item>
                    {
                        !!publication.rek_pid && (
                            counts.wos !== null ||
                            counts.scopus !== null
                        ) &&
                        !hideViewFullStatisticsLink &&
                        <ExternalLink
                            href={`https://app.library.uq.edu.au/#/authors/view/${publication.rek_pid}`}
                            title={publication.rek_title}
                            className={classes.statsLink}
                        >
                            {txt.statsLabel}
                        </ExternalLink>
                    }
                </Grid>
                <Hidden xsDown>
                    <Grid item xs />
                </Hidden>
            </Grid>
        );
    }
}

export default withStyles(styles, { withTheme: true })(CitationCounts);
