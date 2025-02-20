import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import {ConfirmDialogBox} from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Hidden from '@material-ui/core/Hidden';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteForever from '@material-ui/icons/DeleteForever';
import People from '@material-ui/icons/People';
import {withStyles} from '@material-ui/core/styles';

export class ContributorRowHeader extends PureComponent {
    static propTypes = {
        classes: PropTypes.object,
        disabled: PropTypes.bool,
        hideDelete: PropTypes.bool,
        isInfinite: PropTypes.bool,
        locale: PropTypes.object,
        onDeleteAll: PropTypes.func.isRequired,
        showContributorAssignment: PropTypes.bool,
        showIdentifierLookup: PropTypes.bool,
        showRoleInput: PropTypes.bool,
    };

    static defaultProps = {
        hideDelete: false,
        hideReorder: false,
        locale: {
            contributorAssignmentColumn: 'Select your name',
            deleteAll: 'Remove all records',
            deleteAllConfirmation: {
                confirmationTitle: 'Delete all',
                confirmationMessage: 'Are you sure you want to delete all records?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            },
            descriptionStep2: 'Step 2 - Select your name from the list below',
            identifierColumn: 'UQ identifier',
            nameColumn: 'Name as published',
            reorderColumn: 'Reorder records',
            roleColumn: 'Role',
        },
    };

    constructor(props) {
        super(props);
    }

    _showConfirmation = () => {
        this.confirmationBox.showConfirmation();
    };

    render() {
        const {
            deleteAll,
            deleteAllConfirmation,
            descriptionStep2,
            identifierColumn,
            nameColumn,
            reorderColumn,
            roleColumn,
        } = this.props.locale;

        const {
            classes,
            disabled,
            hideDelete,
            isInfinite,
            onDeleteAll,
            showContributorAssignment,
            showIdentifierLookup,
            showRoleInput,
        } = this.props;

        return (
            <Fragment>
                <ConfirmDialogBox
                    onRef={ref => (this.confirmationBox = ref)}
                    onAction={onDeleteAll}
                    locale={deleteAllConfirmation}
                />
                {
                    showContributorAssignment &&
                    <Fragment>
                        <br/>
                        {descriptionStep2}
                    </Fragment>
                }
                <ListItem classes={{root: classes.header}}>
                    <Hidden xsDown>
                        <ListItemIcon>
                            <People/>
                        </ListItemIcon>
                    </Hidden>
                    <ListItemText secondary={nameColumn} secondaryTypographyProps={{variant: 'caption'}}/>
                    {
                        showIdentifierLookup &&
                        <Hidden xsDown>
                            <ListItemText secondary={identifierColumn} secondaryTypographyProps={{variant: 'caption'}}/>
                        </Hidden>
                    }
                    {
                        showRoleInput &&
                        <Hidden xsDown>
                            <ListItemText secondary={roleColumn} secondaryTypographyProps={{variant: 'caption'}}/>
                        </Hidden>
                    }
                    <Hidden xsDown>
                        <ListItemText
                            secondary={reorderColumn}
                            secondaryTypographyProps={{variant: 'caption'}}
                            classes={{
                                secondary: `${classes.right} ${
                                    isInfinite
                                        ? classes.paddingRight36
                                        : classes.paddingRight24
                                }`
                            }}
                        />
                    </Hidden>
                    <ListItemSecondaryAction classes={{root: isInfinite ? classes.paddingRight14 : ''}}>
                        <Tooltip title={deleteAll}
                            disableFocusListener={disabled || hideDelete}
                            disableHoverListener={disabled || hideDelete}
                            disableTouchListener={disabled || hideDelete}
                        >
                            <span>
                                <IconButton
                                    onClick={this._showConfirmation}
                                    disabled={disabled || hideDelete}
                                >
                                    <DeleteForever titleAccess={deleteAll} />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </ListItemSecondaryAction>
                </ListItem>
            </Fragment>
        );
    }
}

export const styles = () => ({
    right: {
        textAlign: 'right'
    },
    header: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
        marginTop: 8
    },
    paddingRight24: {
        paddingRight: 24
    },
    paddingRight36: {
        paddingRight: 36
    },
    paddingRight14: {
        paddingRight: 14
    }
});

export default withStyles(styles)(ContributorRowHeader);
