import {journalArticle} from 'mock/data/testing/records';
import AudioPlayer from './AudioPlayer';

function setup(testProps, isShallow = true){
    const props = {
        ...testProps,
        pid: testProps.pid || journalArticle.rek_pid,
        fileName: testProps.fileName || journalArticle.fez_record_search_key_file_attachment_name[2].rek_file_attachment_name,
        mimeType: testProps.mimeType || 'audio/mp3'
    };
    return getElement(AudioPlayer, props, isShallow);
}

describe('Audio Player Component ', () => {
    it('should render component', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should set playing state via audioPlayerPlay()', async () => {
        const wrapper = setup({}, true);

        // Without promise
        wrapper.instance().audioPlayerPlay();
        expect(wrapper.state().isPlaying).toBe(true);

        // reset
        wrapper.instance().setState({isPlaying: false});
        expect(wrapper.state().isPlaying).toBe(false);

        // with promise
        wrapper.instance().audioPlayerRef = {
            play: () => Promise.resolve()
        };
        await wrapper.instance().audioPlayerPlay();
        expect(wrapper.state().isPlaying).toBe(true);
    });

    it('should play audio via button click', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
        const element = wrapper.find('PlayArrowIcon.play');
        const audio = wrapper.find('audio');
        const play = jest.fn();
        audio.getDOMNode().play = play;
        element.simulate('click');
        expect(play).toHaveBeenCalledTimes(1);
    });

    it('should play audio', () => {
        const shallowWrapper = setup({});
        shallowWrapper.setState({isPlaying: true});
        expect(toJson(shallowWrapper)).toMatchSnapshot();
    });

    it('should pause audio', () => {
        const wrapper = getElement(AudioPlayer, {pid: journalArticle.rek_pid,
            fileName: journalArticle.fez_record_search_key_file_attachment_name[2].rek_file_attachment_name,
            mimeType: 'audio/mp3'}, false);
        wrapper.setState({isPlaying: true});
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
        const playElement = wrapper.find('WithStyles(IconButton)#playButton');
        const audio = wrapper.find('#audioPlayer');
        const pause = jest.fn();
        const play = jest.fn();
        audio.getDOMNode().pause = pause;
        audio.getDOMNode().play = play;
        playElement.simulate('click');
        expect(pause).toHaveBeenCalledTimes(0);
        expect(play).toHaveBeenCalledTimes(1);
        const pauseElement = wrapper.find('WithStyles(IconButton)#pauseButton');
        pauseElement.simulate('click');
        expect(pause).toHaveBeenCalledTimes(1);
        expect(play).toHaveBeenCalledTimes(1);

    });

    it('should set component state to playing', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.setState({isPlaying: true});
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
