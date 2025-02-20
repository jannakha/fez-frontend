jest.dontMock('./ThesisForm');

import ThesisForm from './ThesisForm';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        submitting: testProps.submitting || false, // : PropTypes.bool,
        vocabId: testProps.vocabId || 0, // : PropTypes.number
    };
    return getElement(ThesisForm, props, isShallow);
}

describe('ThesisForm ', () => {
    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should normalize total pages field', () => {
        const wrapper = setup({});
        expect(wrapper.instance().getNumbersOnly('Four')).toBe('');
        expect(wrapper.instance().getNumbersOnly('12Three')).toBe('12');
        expect(wrapper.instance().getNumbersOnly('  01Three')).toBe('01');
        expect(wrapper.instance().getNumbersOnly('124')).toBe('124');
    });

    it('should render component with 12 input fields', () => {
        const wrapper = setup({});
        expect(wrapper.find('Field').length).toEqual(12);
    });

    it('should render component with all fields disabled', () => {
        const wrapper = setup({submitting: true});
        wrapper.find('Field').forEach(field => {
            expect(field.props().disabled).toEqual(true);
        })
    });
});
