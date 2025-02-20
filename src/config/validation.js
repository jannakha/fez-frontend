import React from 'react';
import locale from 'locale/validationErrors';
import Immutable from 'immutable';
import { ORG_TYPE_NOT_SET } from 'config/general';

// Max Length
export const maxLength = max => value => value && value.toString().replace(/\s/g, '').length > max ? locale.validationErrors.maxLength.replace('[max]', max) : undefined;
export const maxLengthWithWhitespace = max => value => value && (value.plainText && value.plainText.length > max) || (!value.plainText && value.length > max + 7) ? locale.validationErrors.maxLength.replace('[max]', max) : undefined;
export const maxLength9 = maxLength(9);
export const maxLength10 = maxLength(10);
export const maxLength255 = maxLength(255);
export const maxLength800 = maxLength(800);
export const maxLength1000 = maxLength(1000);
export const maxLength2000 = maxLength(2000); // URL's must be under 2000 characters

// Min Length
export const minLength = min => value => (value !== null || value !== undefined) && value.trim().length < min ? locale.validationErrors.minLength.replace('[min]', min) : undefined;
export const minLength10 = minLength(10);

// Public Search Validation rules
export const maxLength500 = maxLength(500);

// Max Words
export const maxWords = (max) => (value) => {
    let valueToValidate = null;
    if (typeof value === 'object' && value.hasOwnProperty('plainText')) {
        valueToValidate = value.plainText;
    } else {
        valueToValidate = value;
    }

    const regExp = '^ *\\S+(?: +\\S+){[max],}$';
    return (new RegExp(regExp.replace('[max]', max), 'gim')).test(valueToValidate.trim()) ?  locale.validationErrors.maxWords.replace('[max]', max) : undefined;
};

export const maxWords100 = maxWords(100);

export const maxListEditorTextLength = (max) => (value) => {
    let valueToValidate = null;
    if (typeof value === 'object' && value.hasOwnProperty('plainText')) {
        valueToValidate = value.plainText;
    } else {
        valueToValidate = value;
    }

    return maxLengthWithWhitespace(max)(valueToValidate);
};

export const maxListEditorTextLength800 = maxListEditorTextLength(800);
export const maxListEditorTextLength2000 = maxListEditorTextLength(2000);

// TODO: fix validation, make it generic etc....
export const isValidDOIValue = value => {
    const regexGroup = [
        /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i,
        /^10.1002\/[^\s]+$/i,
        /^10.\d{4}\/\d+-\d+X?\(\d+\)\d+<[\d\w]+:[\d\w]*>\d+.\d+.\w+;\d$/i,
        /^10.1021\/\w\w\d+$/i,
        /^10.1207\/[\w\d]+\&\d+_\d+$/i
    ];

    return regexGroup.reduce((isValid, regex) => (regex.test(value.trim()) || isValid), false);
};
export const isValidPubMedValue = value => {
    // pubmed id is all digits, min 3 digits
    const isValid = /^[\d]{3,}$/;
    return isValid.test(value.trim());
};
export const isValidPartialDOIValue = value => {
    const isValid = /^10\..*/;
    return isValid.test(value.trim());
};
export const isValidPublicationTitle = value => {
    const isValid = /.{10,255}$/i;
    return isValid.test(value.trim());
};

// Generic
export const required = value => value ? undefined : locale.validationErrors.required;

// Check if copyright/agreement is checked
export const requireChecked = value => value === 'on' ? undefined : locale.validationErrors.requireChecked;

export const requiredList = value => {
    return ((value instanceof Immutable.List) && value.toJS() || value || []).length > 0
        ? undefined
        : locale.validationErrors.required;
};

export const email = value => !value || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? locale.validationErrors.email : undefined;
export const url = (value) => value && !/^(http[s]?|ftp[s]?)(:\/\/){1}(.*)$/i.test(value) ? locale.validationErrors.url : maxLength2000(value);
export const doi = (value) => !!value && !isValidDOIValue(value) ? locale.validationErrors.doi : undefined;
export const forRequired = (itemList) => !itemList || itemList.length === 0 ? locale.validationErrors.forRequired : undefined;

export const peopleRequired = (itemList, validationError, checkSelected = true) => (
    !itemList || itemList.length === 0 || (checkSelected && itemList && itemList.filter(item => (item.selected)).length === 0)
        ? validationError : undefined
);

export const authorRequired = (authors) => peopleRequired(authors, locale.validationErrors.authorRequired, true);
export const editorRequired = (editors) => peopleRequired(editors, locale.validationErrors.editorRequired, true);
export const supervisorRequired = (supervisors) => peopleRequired(supervisors, locale.validationErrors.supervisorRequired, false);

export const authorAffiliationRequired = (authorAffiliation, loggedInAuthor) => (
    (
        authorAffiliation.uqIdentifier === '0' ||
        authorAffiliation.uqIdentifier === String(loggedInAuthor.aut_id)
    ) &&
    (
        (authorAffiliation.nameAsPublished || '').trim().length === 0 ||
        (authorAffiliation.orgaff || '').trim().length === 0 ||
        (authorAffiliation.orgtype || '').trim().length === 0 ||
        (authorAffiliation.orgtype === ORG_TYPE_NOT_SET)
    )
);

// DateTime
export const dateTimeDay = value => value && (isNaN(value) || parseInt(value, 10) < 0 || parseInt(value, 10) > 31) ? locale.validationErrors.dateTimeDay : undefined;
export const dateTimeYear = value => !value || value.length === 0 || isNaN(value) || parseInt(value, 10) > (new Date()).getFullYear() ? locale.validationErrors.dateTimeYear : undefined;
export const validFileUpload = value => {
    return value && value.hasOwnProperty('isValid') && !value.isValid ? locale.validationErrors.fileUpload : undefined;
};

export const fileUploadRequired = value => {
    return value === undefined || (value.queue || {}).length === 0 ? locale.validationErrors.fileUploadRequired : undefined;
};

export const fileUploadNotRequiredForMediated = (value, values) => {
    const accessCondition = values.toJS().fez_record_search_key_access_conditions;
    if (!!accessCondition && accessCondition.rek_access_conditions === 'Mediated Access') {
        return undefined;
    } else {
        return value === undefined || value.queue.length === 0 ? locale.validationErrors.fileUploadRequired : undefined;
    }
};

export const isValidIssn = subject => {
    const regex = /^([ep]{0,1}ISSN |)[\d]{4}(\-|)[\d]{3}(\d|\S){1}$/;
    if (subject.trim().length === 0 || regex.test(subject)) {
        return '';
    } else {
        return locale.validationErrors.issn;
    }
};

export const isValidIsbn = subject => {
    // Checks for ISBN-10 or ISBN-13 format
    // https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9781449327453/ch04s13.html
    const regex = /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/;
    return subject.trim().length === 0 || regex.test(subject) ? '' : locale.validationErrors.isbn;
};

export const checkDigit = subject => {
    const check = subject && subject.toString().slice(-1) && !isNaN(subject.toString().slice(-1)) && parseInt(subject.toString().slice(-1), 10);
    const cleanCapitalM = subject.toString().replace('m', 'M');
    const cleanOldISMN = cleanCapitalM.replace('M', '9790');
    const ismn = cleanOldISMN.replace(/-/g, '');
    let checksum = null;
    for (let i = 0; i < ismn.length - 1; i++) {
        checksum += parseInt(ismn.charAt(i), 10) * (i % 2 === 0 ? 1 : 3);
    }
    return ismn.length === 13 && (checksum + check) % 10 === 0;
};

export const isValidIsmn = subject => {
    // https://www.wikidata.org/wiki/Property:P1208
    // const regex = /^(?:ISMN )?((?:979-0-[\d-]{9}-\d)|(?:M-[\d-]{9}-\d))$/gi;
    return subject.trim().length === 0 || checkDigit(subject) ? '' : locale.validationErrors.ismn;
};

export const isValidIsrc = subject => {
    // https://www.wikidata.org/wiki/Property:P1243
    const regex = /^(?:ISRC )?(?:[A-Z]{2}-[A-Z0-9]{3}-\d{2}-\d{5})$/gi;
    return subject.trim().length === 0 || regex.test(subject) ? '' : locale.validationErrors.isrc;
};

export const isValidAuthorLink = (link) => {
    return link && link.valid ? '' : locale.validationErrors.authorLinking;
};

export const isValidContributorLink = (link, required = false) => {
    return required && !(link && link.valid) ? locale.validationErrors.contributorLinking : '';
};

// Google Scholar ID
export const isValidGoogleScholarId = id => {
    const regex = /^[\w-]{12}$/;
    if (regex.test(id)) {
        return '';
    } else {
        return locale.validationErrors.googleScholarId;
    }
};

export const dateRange = (value, values) => {
    const lowerInRange = values.toJS().fez_record_search_key_start_date;
    const higherInRange = values.toJS().fez_record_search_key_end_date;

    if (!!lowerInRange && !!higherInRange && lowerInRange.rek_start_date.isAfter(higherInRange.rek_end_date)) {
        return locale.validationErrors.dateRange;
    } else {
        return '';
    }
};

export const grantFormIsPopulated = (value) => (value === true  ? locale.validationErrors.grants : undefined);

export const translateFormErrorsToText = (formErrors) => {
    if (!formErrors) return null;

    let errorMessagesList = [];

    Object.keys(formErrors).map(key => {
        const value = formErrors[key];
        if (typeof value === 'object') {
            const errorMessage = translateFormErrorsToText(value);
            if (errorMessage) {
                errorMessagesList = errorMessagesList.concat(errorMessage);
            }
        }

        if (locale.validationErrorsSummary.hasOwnProperty(key)) {
            errorMessagesList.push(locale.validationErrorsSummary[key]);
        }
    });

    return errorMessagesList.length > 0 ? errorMessagesList : null;
};

export const getErrorAlertProps = ({submitting = false,
    error, formErrors, submitSucceeded = false, alertLocale = {}}) => {
    let alertProps = null;
    if (submitting) {
        alertProps = {...alertLocale.progressAlert};
    } else if (submitSucceeded) {
        alertProps = {...alertLocale.successAlert};
    } else {
        if (error) {
            // error is set by submit failed, it's reset once form is re-validated (updated for re-submit)
            alertProps = {
                ...alertLocale.errorAlert,
                message: alertLocale.errorAlert.message ? alertLocale.errorAlert.message(error) : error
            };
        } else if (formErrors && formErrors.size === undefined) {
            // formErrors is set by form validation or validate method, it's reset once form is re-validated
            const errorMessagesList = formErrors ? translateFormErrorsToText(formErrors) : null;
            const message = (
                <span>
                    {alertLocale.validationAlert.message}
                    <ul>
                        {
                            errorMessagesList && errorMessagesList.length > 0 && errorMessagesList.map((item, index) => (
                                <li key={`validation-summary-${index}`}>{item}</li>
                            ))
                        }
                    </ul>
                </span>);
            alertProps = {...alertLocale.validationAlert, message: message};
        }
    }
    return alertProps;
};
