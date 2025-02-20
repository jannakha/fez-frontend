/* eslint-disable */
import React from 'react';
import { MyIncompleteRecord } from '.';
import Immutable from 'immutable';
import { UQ352045, UQ716942_uqagrinb, UQ716942_uqagrinb_grants } from 'mock/data/records';
import { uqrdav10, uqagrinb } from 'mock/data/account';
import * as repositories from 'repositories';
import {
    rtlRender,
    fireEvent,
    cleanup,
    withRedux,
    withRouter,
    waitForElement
} from 'test-utils';

const initialState = (accountReducer) => Immutable.Map({
    accountReducer
});

describe('MyIncompleteRecord form', () => {
    afterEach(() => cleanup);
    it('Creative Work:Live Performance of Creative Work - Music should allow user to update work', async () => {
        mockApi
            .onGet(repositories.routes.EXISTING_RECORD_API({pid: 'UQ:352045'}).apiUrl)
            .reply(200, {data: UQ352045});

        const path = '/records/:pid(UQ:[a-z0-9]+)/incomplete';
        const route = '/records/UQ:352045/incomplete';
        const {
            container,
            asFragment,
            getByText,
            getByTestId
        } = rtlRender(withRedux(initialState(uqrdav10))(withRouter({route, path})(<MyIncompleteRecord/>)));

        const submitButton = await waitForElement(() => getByTestId('update-my-work'));
        expect(submitButton).toHaveAttribute('disabled');

        let fragment = asFragment();

        fireEvent.click(getByTestId('significance'));
        fireEvent.click(getByText(/Major/));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId('rek-audience-size'));
        fireEvent.click(getByText(/less than 100/i));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId('quality-indicators'));
        fireEvent.click(getByText(/commissioned by external body/i));
        fireEvent.click(container);
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        expect(getByTestId('delete-author-0')).toHaveAttribute('disabled');
        expect(getByTestId('delete-author-1')).toHaveAttribute('disabled');
        expect(getByTestId('delete-author-2')).toHaveAttribute('disabled');
        expect(getByTestId('delete-author-3')).toHaveAttribute('disabled');

        fireEvent.click(getByTestId('contributor-editor-row-0'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        expect(getByTestId('submit-author')).toHaveAttribute('disabled');

        expect(getByTestId('authors-name-as-published-field')).toHaveAttribute('disabled');
        fireEvent.change(getByTestId('org-affiliation-name'), {target: {value: 'test'}});
        fireEvent.click(getByTestId('org-affiliation-type'));
        fireEvent.click(getByText('Government'));
        expect(getByTestId('submit-author')).not.toHaveAttribute('disabled');

        fireEvent.click(getByTestId('submit-author'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId('contributor-editor-row-1'));
        expect(getByTestId('authors-name-as-published-field')).toHaveAttribute('disabled');
        fireEvent.click(getByTestId('org-affiliation-selector'));
        fireEvent.click(getByText(/^uq$/i));
        expect(getByTestId('authors-name-as-published-field')).toHaveAttribute('disabled');
        fireEvent.click(getByTestId('submit-author'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId('contributor-editor-row-2'));
        expect(fragment).toMatchDiffSnapshot(fragment);

        fireEvent.click(getByTestId('contributor-editor-row-3'));
        expect(getByTestId('authors-name-as-published-field')).toHaveAttribute('disabled');
        fireEvent.click(getByTestId('org-affiliation-selector'));
        fireEvent.click(getByText(/^uq$/i));
        expect(getByTestId('authors-name-as-published-field')).toHaveAttribute('disabled');
        fireEvent.click(getByTestId('submit-author'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());
    });

    it('UQ:716942 - Creative Work:Live Performance of Creative Work - Music should allow user to update work', async () => {
        mockApi
            .onGet(repositories.routes.EXISTING_RECORD_API({pid: 'UQ:716942'}).apiUrl)
            .reply(200, {data: UQ716942_uqagrinb});

        const path = '/records/:pid(UQ:[a-z0-9]+)/incomplete';
        const route = '/records/UQ:716942/incomplete';
        const {
            container,
            asFragment,
            getByText,
            getByTestId
        } = rtlRender(withRedux(initialState(uqagrinb))(withRouter({route, path})(<MyIncompleteRecord/>)));

        const submitButton = await waitForElement(() => getByTestId('update-my-work'));
        expect(submitButton).toHaveAttribute('disabled');

        let fragment = asFragment();

        fireEvent.click(getByTestId('significance'));
        fireEvent.click(getByText(/Major/));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.change(getByTestId('rek-total-pages'), {target: {value: '10'}});
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId('rek-audience-size'));
        fireEvent.click(getByText(/less than 100/i));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId('quality-indicators'));
        fireEvent.click(getByText(/commissioned by external body/i));
        fireEvent.click(container);
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        expect(getByTestId('delete-author-0')).toHaveAttribute('disabled');
        expect(getByTestId('delete-author-1')).toHaveAttribute('disabled');
        expect(getByTestId('delete-author-2')).toHaveAttribute('disabled');
        expect(getByTestId('delete-author-3')).toHaveAttribute('disabled');

        fireEvent.click(getByTestId('contributor-editor-row-0'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId('contributor-editor-row-1'));
        expect(getByTestId('submit-author')).toHaveAttribute('disabled');
        expect(getByTestId('authors-name-as-published-field')).toHaveAttribute('disabled');
        expect(getByTestId('authors-name-as-published-field')).toHaveAttributeValue('value', 'Grinberg, Anna');
        fireEvent.click(getByTestId('org-affiliation-selector'));
        fireEvent.click(getByText(/^uq$/i));
        expect(getByTestId('authors-name-as-published-field')).toHaveAttribute('disabled');
        fireEvent.click(getByTestId('submit-author'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId('contributor-editor-row-2'));
        expect(getByTestId('authors-name-as-published-field')).toHaveAttribute('disabled');
        fireEvent.change(getByTestId('org-affiliation-name'), {target: {value: 'test'}});
        fireEvent.click(getByTestId('org-affiliation-type'));
        fireEvent.click(getByText('Government'));
        expect(getByTestId('submit-author')).not.toHaveAttribute('disabled');
        fireEvent.click(getByTestId('submit-author'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId('contributor-editor-row-3'));
        expect(getByTestId('authors-name-as-published-field')).toHaveAttribute('disabled');
        fireEvent.click(getByTestId('org-affiliation-selector'));
        fireEvent.click(getByText(/^uq$/i));
        expect(getByTestId('authors-name-as-published-field')).toHaveAttribute('disabled');
        fireEvent.click(getByTestId('submit-author'));
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());
    });

    it('UQ:716942 - Creative Work:Live Performance of Creative Work - Music : Grants editor tests should prevent submission if inputs are populated', async () => {
        mockApi
        .onGet(repositories.routes.EXISTING_RECORD_API({pid: 'UQ:716942'}).apiUrl)
        .reply(200, {data: UQ716942_uqagrinb_grants});

        const path = '/records/:pid(UQ:[a-z0-9]+)/incomplete';
        const route = '/records/UQ:716942/incomplete';
        const {
            container,
            asFragment,
            getByText,
            getByTestId
        } = rtlRender(withRedux(initialState(uqagrinb))(withRouter({route, path})(<MyIncompleteRecord/>)));

        const submitButton = await waitForElement(() => getByTestId('update-my-work'));
        expect(submitButton).toHaveAttribute('disabled');

        let fragment = asFragment();

        fireEvent.click(getByTestId('quality-indicators'));
        fireEvent.click(getByText(/commissioned by external body/i));
        fireEvent.click(container);

        expect(getByTestId('update-my-work')).not.toHaveAttribute('disabled');

        fireEvent.change(getByTestId('grantAgencyName'), {target: {value: 'Grant name'}});
        expect(getByTestId('update-my-work')).toHaveAttribute('disabled');
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.change(getByTestId('grantId'), {target: {value: '0001'}});
        expect(getByTestId('update-my-work')).toHaveAttribute('disabled');
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId('grantType'));
        fireEvent.click(getByText(/commercial gallery/i));

        expect(getByTestId('update-my-work')).toHaveAttribute('disabled');
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());

        fireEvent.click(getByTestId('grantAddButton'));

        expect(getByTestId('update-my-work')).not.toHaveAttribute('disabled');
        expect(fragment).toMatchDiffSnapshot(fragment = asFragment());
    });
});