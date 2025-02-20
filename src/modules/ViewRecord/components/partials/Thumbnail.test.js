import {Thumbnail} from "./Thumbnail";

function setup(testProps, isShallow = true){
    const props = {
        mediaUrl: '/test/mediaUrl',
        previewMediaUrl: '/test/preview/mediaUrl',
        thumbnailMediaUrl: '/test/thumbnail/mediaUrl',
        thumbnailFileName: 'thumbnail.jpg',
        mimeType: 'image/jpeg',
        onClick: jest.fn(),
        classes: {
            image: ''
        },
        ...testProps
    };
    return getElement(Thumbnail, props, isShallow);
}

describe('Thumbnail component', () => {

    it('should run onClick function on click', () => {
        const onClick = jest.fn();
        const wrapper = setup({onClick: onClick}, false);
        const element = wrapper.find('Thumbnail a');
        element.simulate('click');
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should run onFileSelect function on key press', () => {
        const onClick = jest.fn();
        const wrapper = setup({onClick: onClick}, false);
        const element = wrapper.find('Thumbnail a');
        element.simulate('keyPress');
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should set thumbnail error state on calling imageError()', () => {
        const wrapper = setup({});
        wrapper.state().thumbnailError = false;
        wrapper.instance().imageError();
        expect(wrapper.state().thumbnailError).toBe(true);
    });

    it('should show a broken thumbnail icon when the thumbnail wont load.', () => {
        const wrapper = setup({});
        wrapper.instance().setState({thumbnailError: true});
        expect(toJson(wrapper)).toMatchSnapshot();

        const wrapper2 = setup({mediaUrl: ''});
        wrapper2.instance().setState({thumbnailError: true});
        expect(toJson(wrapper2)).toMatchSnapshot();
    });

    it('should render <ExternalLink> or <BrokenImage> for specific mime types', () => {
        const variants = [
            {
                fileName: 'video.mp4',
                mimeType: 'video/mp4'
            },
            {
                fileName: 'file.random',
                mimeType: 'application/octet-stream'
            }
        ];

        variants.forEach(variant => {
            const wrapper = setup({
                fileName: variant.fileName,
                mimeType: variant.mimeType,
                thumbnailError: false
            });
            expect(toJson(wrapper)).toMatchSnapshot();

            // Set thumbnailError prop to true
            wrapper.instance().setState({thumbnailError: true});

            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});