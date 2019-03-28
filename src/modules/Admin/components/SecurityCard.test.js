import { SecurityCard } from './SecurityCard';

function setup(testProps, isShallow = true) {
    const props = {
        disabled: false,
        selectedPolicyKey: 1,
        fieldID: 'test1',
        entity: {
            type: 'test2',
            dataStreamPolicyID: 2
        },
        text: {
            description: 'test3',
            prompt: 'test4'
        },
        ...testProps
    };

    return getElement(SecurityCard, props, isShallow);
}

describe('SecurityCard component', () => {

    it('should render properly', () => {
        const wrapper1 = setup({});
        expect(toJson(wrapper1)).toMatchSnapshot();

        const wrapper2 = setup({ selectedPolicyKey: undefined });
        expect(toJson(wrapper2)).toMatchSnapshot();
    });

});