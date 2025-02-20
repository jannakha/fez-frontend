import LanguageField from './LanguageField';
import Immutable from 'immutable';

function setup(testProps, isShallow = true) {
    const props = {
        ...testProps
    };

    return getElement(LanguageField, props, isShallow);
}

describe('LanguageField component', () => {
    it('should render default view', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with given field props', () => {
        const wrapper = setup({
            label: 'Test label',
            placeholder: 'Test placeholder',
            input: {
                value: ['One', 'Two'],
                onChange: jest.fn()
            },
            meta: {
                error: 'Test error'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render immutable list as selected value with given field props', () => {
        const wrapper = setup({
            label: 'Test label',
            placeholder: 'Test placeholder',
            input: {
                value: Immutable.List(['One', 'Two']),
                onChange: jest.fn()
            },
            meta: {
                error: 'Test error'
            }
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render when given a default value field props', () => {
        const wrapper = setup({
            label: 'Test label',
            placeholder: 'Test placeholder',
            defaultValue: "afr"
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
