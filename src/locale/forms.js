import React from 'react';

export default {
    forms: {
        claimPublicationForm: {
            title: 'Claim a work',
            cancel: 'Cancel this claim',
            submit: 'Claim this work',
            claimingInformation: {
                title: 'You are claiming to be an author for the following work:',
                // help: {
                //     title: 'Claiming a publication',
                //     text: 'Enter the text that will help people here',
                //     buttonLabel: 'CLOSE'
                // }
            },
            authorLinking: {
                title: 'Author linking',
                text: 'We were unable to automatically detect who you are from the list of authors on this work. Please select your name from the list below: ',
                // help: {
                //     title: 'Author linking',
                //     text: '...',
                //     buttonLabel: 'CLOSE'
                // }
            },
            contributorLinking: {
                title: 'Editor linking',
                text: 'We were unable to automatically detect who you are from the list of editors on this work. Please select your name from the list below: ',
                // help: {
                //     title: 'Editor linking',
                //     text: '...',
                //     buttonLabel: 'CLOSE'
                // }
            },
            comments: {
                title: 'Optional: Suggest changes or add links to this work',
                // help: {
                //     title: 'Additional information',
                //     text: '...',
                //     buttonLabel: 'CLOSE'
                // },
                fieldLabels: {
                    comments: 'Type edits/changes/comments here',
                    url: 'Link (URL)'
                }
            },
            fileUpload: {
                title: 'Optional: Upload additional files',
                // help: {
                //     title: 'Files',
                //     text: '...',
                //     buttonLabel: 'CLOSE'
                // }
            },
            cancelWorkflowConfirmation: {
                confirmationTitle: 'Cancel claiming a publication',
                confirmationMessage: 'Are you sure you want to cancel claiming this work?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            },
            successWorkflowConfirmation: {
                confirmationTitle: 'Claim has been submitted',
                successConfirmationMessage: (
                    <p>
                        Your item will be referred to a UQ eSpace Staging staff member for editing, prior to being moved into a publicly viewable collection.
                    </p>),
                fileFailConfirmationAlert: {
                    title: 'File upload and/or edits/changes/comments post failed',
                    message: 'Retry uploading files and/or posting edits/changes/comments about this claim via "Fix record" screen or contact eSpace administrators.',
                    type: 'warning'
                },
                cancelButtonLabel: 'Claim more publications',
                addRecordButtonLabel: 'Add another missing record',
                confirmButtonLabel: 'Go to my research'
            },
            validationAlert: {
                type: 'warning',
                title: 'Validation',
                message: 'Form cannot be submitted until all fields are valid. Please review all input fields.'
            },
            errorAlert: {
                type: 'error_outline',
                title: 'Error',
                message: (message) => (`Error has occurred during request and request cannot be processed. ${message} Please contact eSpace administrators or try again later.`),
                incompleteData: 'The selected source has incomplete data. You will need to ADD A MISSING RECORD and enter the information manually.'
            },
            progressAlert: {
                type: 'info_outline',
                title: 'Saving',
                message: 'Claim publication is being processed.',
                showLoader: true
            },
            successAlert: {
                type: 'done',
                title: 'Success',
                message: 'Publication claim has been submitted successfully.'
            },
            alreadyClaimedAlert: {
                type: 'error',
                title: 'Error',
                message: (
                    <span>
                        This record has been assigned to you already.  If you feel this is incorrect, please notify the eSpace admin team at <a href="mailto:espace@library.uq.edu.au">espace@library.uq.edu.au</a>
                    </span>
                )
            }
        },
        unclaimPublicationForm: {
            title: 'Remove this record from my profile',
            description: '',
            // help: {
            //     title: 'Unclaim a record',
            //     text: 'Enter the text that will help people here',
            //     buttonLabel: 'CLOSE'
            // },
            successWorkflowConfirmation: {
                confirmationTitle: 'Unclaim a record',
                confirmationMessage: 'You have unclaimed this record successfully',
                cancelButtonLabel: 'Go to my dashboard',
                confirmButtonLabel: 'Go to my research'
            },
            alert: {
                type: 'warning',
                title: 'WARNING',
                message: 'You are about to remove this publication from your eSpace profile.'
            }
        },
        fixPublicationForm: {
            comments: {
                title: 'Suggest a correction',
                // help: {
                //     title: 'Request a change',
                //     text: '...',
                //     buttonLabel: 'CLOSE'
                // },
                fieldLabels: {
                    comments: 'Describe the problem with this record, eg record is a duplicate, or suggested changes',
                    url: 'Link (URL)'
                }
            },
            fileUpload: {
                title: 'Upload files',
                description: (<div>
                    Upload an Open Access file, HERDC evidence or an NTRO Research Statement
                </div>),
                // help: {
                //     title: 'Upload files',
                //     text: '...',
                //     buttonLabel: 'CLOSE'
                // }
            },
            cancelWorkflowConfirmation: {
                confirmationTitle: 'Cancel request',
                confirmationMessage: 'Are you sure you want to cancel this request?',
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes'
            },
            successWorkflowConfirmation: {
                confirmationTitle: 'Your request has been submitted',
                confirmationMessage: (<p>Your request will be referred to a UQ eSpace staff member for review/action.</p>),
                fileFailConfirmationAlert: {
                    title: 'File upload failed',
                    message: 'Retry uploading files via "Fix record" screen or contact eSpace administrators.',
                    type: 'info'
                },
                cancelButtonLabel: 'Go to my dashboard',
                confirmButtonLabel: 'Go to my research'
            },
            validationAlert: {
                type: 'warning',
                title: 'Validation',
                message: 'Form cannot be submitted until all fields are valid. Please review all input fields.'
            },
            errorAlert: {
                type: 'error_outline',
                title: 'Error',
                message: (message) => (`Error has occurred during request and request cannot be processed. ${message} Please contact eSpace administrators or try again later.`)
            },
            progressAlert: {
                type: 'info_outline',
                title: 'Saving',
                message: 'Request is being processed.',
                showLoader: true
            },
            successAlert: {
                type: 'done',
                title: 'Success',
                message: 'Fix record request has been submitted successfully.'
            }
        }
    }
};
