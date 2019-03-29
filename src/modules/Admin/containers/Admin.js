import {connect} from 'react-redux';
import { reduxForm, getFormValues, getFormSyncErrors, SubmissionError } from 'redux-form/immutable';
import { updateSecurity } from 'actions';
import Immutable from 'immutable';
import Admin from '../components/Admin';
import { securityAssignments } from '../components/MockData';
import {confirmDiscardFormChanges} from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import {withRouter} from 'react-router';
import Cookies from 'js-cookie';

const FORM_NAME = 'Prototype';

const onSubmit = (values, dispatch) => {
    let policyAssignmentRecord = {};
    let security = null;
    let dataStreamSecurity = null;

    const formValues = values.toJS();

    switch (formValues.type) {
        case 'Community':
            policyAssignmentRecord = securityAssignments[0];
            security = formValues.communitySecurity;
            break;
        case 'Collection':
            policyAssignmentRecord = securityAssignments[1];
            security = formValues.collectionSecurity;
            dataStreamSecurity = formValues.collectionDataStreamSecurity;
            break;
        default:
            break;
    }

    return dispatch(updateSecurity({
        pid: policyAssignmentRecord.pid,
        type: formValues.type,
        security,
        dataStreamSecurity
    })).catch(error => {
        throw new SubmissionError({_error: error});
    });
};

let PrototypeContainer = reduxForm({
    form: FORM_NAME,
    onSubmit
})(confirmDiscardFormChanges(Admin, FORM_NAME));

const mapStateToProps = (state) => {
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    return {
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        initialValues: {
            communitySecurity: securityAssignments[0].policyID,
            collectionSecurity: securityAssignments[1].policyID,
            collectionDataStreamSecurity: securityAssignments[1].dataStreamPolicyID,
            collection: [],
            subject: []
        },
        tabbed: Cookies.get('adminFormTabbed') && !!(Cookies.get('adminFormTabbed') === 'tabbed')
    };
};

PrototypeContainer = connect(mapStateToProps)(PrototypeContainer);
export default withRouter(PrototypeContainer);
