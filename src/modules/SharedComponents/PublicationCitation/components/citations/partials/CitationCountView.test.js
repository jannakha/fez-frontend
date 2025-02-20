import CitationCountView from './CitationCountView';

function setup(testProps, isShallow = true) {
    const props = {
        classes: {},
        ...testProps,
        source: testProps.source,
        count: testProps.count,
        link: testProps.link,
        title: testProps.title
    };
    return getElement(CitationCountView, props, isShallow);
}

describe('CitationCountView test ', () => {
    it('should render component with given count', () => {
        const wrapper = setup({source: 'wos', count: 4, link: 'www.google.com', title: 'Google'});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
