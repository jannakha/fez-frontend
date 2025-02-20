import {connect} from 'react-redux';

import {hide} from '../actions';
import HelpDrawer from '../components/HelpDrawer';

const HelpDrawerContainer = connect(state => {
    return state.get('helpDrawer') ? state.get('helpDrawer').toJS() : {open: false, title: '', text: ''};
}, dispatch => {
    return {
        hide: () => dispatch(hide())
    };
})(HelpDrawer);

export default HelpDrawerContainer;
