import Masquerade from './Masquerade';

function setup(testProps, isShallow = true) {
    const props = {
        author: testProps.author || null,
        actions: testProps.actions || {},
        history: testProps.history || {
            push: jest.fn()
        },
        account: testProps.account || {},
        ...testProps
    };
    return getElement(Masquerade, props, isShallow);
}

const { href } = window.location;

beforeAll(() => {
    delete global.window.location;
    global.window.location = {href: jest.fn(), assign: jest.fn()};
});

describe('Component Masquerade', () => {
    it('should correctly set state on username change', () => {
       const wrapper = setup({});

       wrapper.instance()._usernameChanged({
           target: {
               value: 'uqtest'
           }
       });

       wrapper.update();
       expect(wrapper.state('userName')).toEqual('uqtest');
    });

    it('should not masquerade if Esc key is pressed', () => {
        const wrapper = setup({});
        wrapper.instance()._usernameChanged({
            target: {
                value: 'uqtest'
            }
        });
        wrapper.update();

        wrapper.instance()._masqueradeAs({
            key: 'Esc'
        });

        expect(wrapper.state('loading')).toBeFalsy();
    });

    it('should not masquerade if Enter is pressed but username length is 0', () => {
        const wrapper = setup({});
        wrapper.instance()._masqueradeAs({
            key: 'Enter'
        });
        expect(wrapper.state('loading')).toBeFalsy();
    });

    it('should masquerade if Enter is pressed and username is set', () => {
        const wrapper = setup({});
        wrapper.instance()._usernameChanged({
            target: {
                value: 'uqtest'
            }
        });
        wrapper.update();

        wrapper.instance()._masqueradeAs({
            key: 'Enter'
        });
        expect(wrapper.state('loading')).toBeTruthy();
    });
});
