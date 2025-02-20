import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {HelpIcon} from 'modules/SharedComponents/Toolbox/HelpDrawer';

const styles = theme => ({
    layoutCard: {
        maxWidth: '1200px',
        margin: '24px auto',
        width: '90%',
        padding: 0
    },
    layoutTitle: {
        maxWidth: 1200,
        width: '90%',
        margin: '12px auto',
        padding: 0,
        [theme.breakpoints.down('sm')]: {
            margin: '0 auto 12px auto'
        }
    }
});

export class Page extends Component {
    static propTypes = {
        title: PropTypes.any,
        help: PropTypes.object,
        children: PropTypes.any,
        classes: PropTypes.object
    };

    render() {
        const {classes, title, children, help} = this.props;
        return (
            <Grid container className="StandardPage">
                {title &&
                <Typography variant={'h4'} component={'h2'} color={'primary'} className={classes.layoutTitle}>{title}</Typography>
                }
                {help &&
                    <HelpIcon {...help} />
                }
                <Grid item className={classes.layoutCard}>
                    {children}
                </Grid>
            </Grid>
        );
    }
}

const StyledPage = withStyles(styles, {withTheme: true})(Page);
const StandardPage = (props) => <StyledPage {...props}/>;
export default StandardPage;
