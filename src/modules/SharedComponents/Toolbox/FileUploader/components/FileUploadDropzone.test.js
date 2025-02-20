import {FileUploadDropzone} from './FileUploadDropzone';
import FileUploadDropzoneWithStyles from './FileUploadDropzone';
import {FILE_NAME_RESTRICTION} from '../config';

function setup(testProps, isShallow = true) {
    const props = {
        classes: {},
        onDrop: jest.fn(),
        locale: {},
        maxSize: 1000,
        fileNameRestrictions: /.+/,
        ...testProps,
    };
    return getElement(FileUploadDropzone, props, isShallow);
}

describe('Component FileUploadDropzone', () => {
    let getMockFile;

    beforeEach(() => {
        const _File = window.File;
        const FILE = (data = [''], name) => new _File(data, name, {lastModified: 12345678912});
        window.File = jest.fn((data, name) => FILE(data, name));
        getMockFile = (name) => new File([''], name);
    });

    it('should render component with default props', () => {
        const wrapper = setup({});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled component', () => {
        const wrapper = setup({disabled: true}, false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should open files selection dialog', () => {
        const wrapper = setup({}, false);
        expect(toJson(wrapper)).toMatchSnapshot();

        const testFn = jest.fn();

        wrapper.find('FileUploadDropzone').instance().dropzoneRef.open = testFn;
        wrapper.find('FileUploadDropzone').instance()._onKeyPress();

        wrapper.update();
        expect(testFn).toHaveBeenCalled();
    });

    it('should remove duplicate files', () => {
        const wrapper = setup({});

        const files = [getMockFile('c.txt'), getMockFile('d.txt')];
        const {uniqueFiles, duplicateFiles} = wrapper.instance().removeDuplicate(files, ['a.txt', 'b.txt', 'c.txt']);

        expect(uniqueFiles.length).toEqual(1);
        expect(duplicateFiles.length).toEqual(1);
    });

    it('should remove files with same filename but different extension from dropped incoming files', () => {
        const wrapper = setup({});

        const files = [getMockFile('a.txt'), getMockFile('a.doc'), getMockFile('b.txt')];
        const {uniqueFiles, duplicateFiles, sameFileNameWithDifferentExt} = wrapper.instance().removeDuplicate(files, []);

        expect(uniqueFiles.length).toEqual(2);
        expect(duplicateFiles.length).toEqual(0);
        expect(sameFileNameWithDifferentExt.length).toEqual(1);
    });

    it('should remove files with same filename but different extension from dropped incoming files and already queued files', () => {
        const wrapper = setup({});

        const queuedFiles = ['c.txt', 'd.txt', 'b.txt'];
        const files = [getMockFile('a.txt'), getMockFile('a.doc'), getMockFile('b.txt')];
        const {uniqueFiles, duplicateFiles, sameFileNameWithDifferentExt} = wrapper.instance().removeDuplicate(files, queuedFiles);

        expect(uniqueFiles.length).toEqual(1);
        expect(uniqueFiles).toEqual([getMockFile('a.txt')]);

        expect(duplicateFiles.length).toEqual(1);
        expect(duplicateFiles).toEqual(['b.txt']);

        expect(sameFileNameWithDifferentExt.length).toEqual(1);
        expect(sameFileNameWithDifferentExt).toEqual(['a.doc']);
    });

    it('should remove files with same filename but different extension from dropped incoming files and already queued files 2', () => {
        const wrapper = setup({});

        const queuedFiles = ['c.txt', 'd.txt', 'b.txt'];
        const files = [getMockFile('a.doc'), getMockFile('d.txt'), getMockFile('b.txt')];
        const {uniqueFiles, duplicateFiles, sameFileNameWithDifferentExt} = wrapper.instance().removeDuplicate(files, queuedFiles);

        expect(uniqueFiles.length).toEqual(1);
        expect(uniqueFiles).toEqual([getMockFile('a.doc')]);

        expect(duplicateFiles.length).toEqual(2);
        expect(duplicateFiles).toEqual(['d.txt', 'b.txt']);

        expect(sameFileNameWithDifferentExt.length).toEqual(0);
    });

    it('should not remove any files if there are no duplicate files', () => {
        const wrapper = setup({});

        const files = [getMockFile('c.txt'), getMockFile('d.txt')];
        const {uniqueFiles, duplicateFiles} = wrapper.instance().removeDuplicate(files, ['a.txt', 'b.txt']);

        expect(uniqueFiles.length).toEqual(2);
        expect(duplicateFiles.length).toEqual(0);
    });

    it('should not remove any files if there are no files', () => {
        const wrapper = setup({});

        const files = [];
        const {uniqueFiles, duplicateFiles} = wrapper.instance().removeDuplicate(files, ['a.txt', 'b.txt']);

        expect(uniqueFiles.length).toEqual(0);
        expect(duplicateFiles.length).toEqual(0);
    });

    it('should not remove any files if multipart zip files have been uploaded', () => {
        const wrapper = setup({});

        const files = [getMockFile('a.001.zip'), getMockFile('a.002.zip')];
        const {uniqueFiles, duplicateFiles} = wrapper.instance().removeDuplicate(files, []);

        expect(uniqueFiles.length).toEqual(2);
        expect(duplicateFiles.length).toEqual(0);
    });

    it('should remove files with invalid names', () => {
        const wrapper = setup({});

        const files = [getMockFile('c.txt'), getMockFile('1.txt')];
        const {validFiles, invalidFileNames} = wrapper.instance().removeInvalidFileNames(files, /^[a-z].+/);

        expect(validFiles.length).toEqual(1);
        expect(invalidFileNames.length).toEqual(1);
    });

    it('should not remove any files if there are no invalid names of files', () => {
        const wrapper = setup({});

        const files = [getMockFile('c.txt'), getMockFile('a.txt')];
        const {validFiles, invalidFileNames} = wrapper.instance().removeInvalidFileNames(files, /^[a-z].+/);

        expect(validFiles.length).toEqual(2);
        expect(invalidFileNames.length).toEqual(0);
    });

    it('should not remove any files if there are no files supplied', () => {
        const wrapper = setup({});

        const files = [];
        const {validFiles, invalidFileNames} = wrapper.instance().removeInvalidFileNames(files, /^[a-z].+/);

        expect(validFiles.length).toEqual(0);
        expect(invalidFileNames.length).toEqual(0);
    });

    it('should remove files exceeding max allowed number of files in removeTooManyFiles', () => {
        const wrapper = setup({});

        const files = [getMockFile('c.txt'), getMockFile('1.txt'), getMockFile('1a.txt')];
        const {limitedFiles, tooManyFiles} = wrapper.instance().removeTooManyFiles(files, 2);

        expect(limitedFiles.length).toEqual(2);
        expect(tooManyFiles.length).toEqual(1);
    });

    it('should not remove any files if number doesn\'t exceed max allowed number of files in removeTooManyFiles', () => {
        const wrapper = setup({});

        const files = [getMockFile('c.txt'), getMockFile('1.txt'), getMockFile('1a.txt')];
        const {limitedFiles, tooManyFiles} = wrapper.instance().removeTooManyFiles(files, 4);

        expect(limitedFiles.length).toEqual(3);
        expect(tooManyFiles.length).toEqual(0);
    });

    it('should not remove any files if there are no files supplied to removeTooManyFiles', () => {
        const wrapper = setup({});

        const files = [];
        const {limitedFiles, tooManyFiles} = wrapper.instance().removeTooManyFiles(files, 3);

        expect(limitedFiles.length).toEqual(0);
        expect(tooManyFiles.length).toEqual(0);
    });

    it('should filter folders out from the file list in removeDroppedFolders', async () => {
        const wrapper = setup({});

        const file_a = getMockFile('a.txt');
        file_a.slice = (x, y) => true;
        const file_b = getMockFile('droppedFolder');
        file_b.slice = (x, y) => false;
        const file_c = getMockFile('c.txt');
        file_c.slice = (x, y) => true;

        const accepted = [file_a, file_b, file_c];
        const errors = [];

        wrapper.instance().readFile = jest.fn((file, errors, resolve) => {
            file.slice() ? resolve(file) : resolve(false);
        });

        await expect(wrapper.instance().removeDroppedFolders(accepted, errors)).resolves.toEqual([file_a, false, file_c]);
    });

    it('should set all error messages', async () => {
        const file_a = getMockFile('a.txt');
        const file_a_doc = getMockFile('a.doc');
        const file_b = getMockFile('b.txt');
        const file_b_dup = getMockFile('b.txt');
        const file_c = getMockFile('c.txt');
        const file_d = getMockFile('web_d.txt');
        const file_e = getMockFile('e.txt');
        const file_f = getMockFile('f.txt');
        const file_g = getMockFile('g.txt');
        const file_g_doc = getMockFile('g.doc');
        const onDropTestFn = jest.fn();

        const wrapper = setup({
            fileUploadLimit: 4,
            filesInQueue: [file_a.name, file_b.name],
            onDrop: onDropTestFn,
            fileNameRestrictions: FILE_NAME_RESTRICTION
        });

        const expectedFiles = [file_c, file_f].map(file => ({fileData: file, name: file.name, size: file.size}));
        const expectedError = {
            tooBigFiles: ['e.txt'],
            notFiles: [],
            sameFileNameWithDifferentExt: ['g.doc', 'a.doc'],
            invalidFileNames: ['web_d.txt'],
            duplicateFiles: ['b.txt'],
            tooManyFiles: ['g.txt']
        };

        const accepted = [file_b_dup, file_c, file_d, file_f, file_g, file_a_doc, file_g_doc];
        wrapper.instance().removeDroppedFolders = jest.fn((accepted, {}) => new Promise(resolve => resolve(accepted)));

        await wrapper.instance()._onDrop(accepted, [file_e]);
        // wrapper.update();
        expect(onDropTestFn).toHaveBeenCalledWith(expectedFiles, expectedError);
    });

    it('should set all correct error messages for filenames with comma', async () => {
        const file_g = getMockFile('g.txt');
        const file_a = getMockFile('i,am.txt');
        const file_h = getMockFile('excel,txt');
        const file_i = getMockFile('excel,xls.txt');
        const onDropTestFn = jest.fn();

        const wrapper = setup({
            fileUploadLimit: 4,
            filesInQueue: [],
            onDrop: onDropTestFn,
            fileNameRestrictions: FILE_NAME_RESTRICTION
        });

        const expectedFiles = [file_g].map(file => ({fileData: file, name: file.name, size: file.size}));
        const expectedError = {
            tooBigFiles: [],
            notFiles: [],
            sameFileNameWithDifferentExt: [],
            invalidFileNames: ['i,am.txt', 'excel,txt', 'excel,xls.txt'],
            duplicateFiles: [],
            tooManyFiles: []
        };

        const accepted = [file_g, file_a, file_h, file_i];
        wrapper.instance().removeDroppedFolders = jest.fn((accepted, {}) => new Promise(resolve => resolve([file_g, file_a, file_h, file_i])));

        await wrapper.instance()._onDrop(accepted, []);
        // wrapper.update();
        expect(onDropTestFn).toHaveBeenCalledWith(expectedFiles, expectedError);
    });

    it('should render with styles', () => {
        const wrapper = getElement(FileUploadDropzoneWithStyles, {
            onDrop: jest.fn(),
            maxSize: 8,
            locale: {},
            fileNameRestrictions: /.+/
        });
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should read file', () => {
        const wrapper = setup({});
        const readAsDataURLFn = jest.fn((slice) => slice);
        window.FileReader = jest.fn(() => ({
            readAsDataURL: readAsDataURLFn
        }));
        const result = wrapper.instance().readFile('this is test file', [], Promise.resolve);
        expect(result).toBe('this is te');
    });

    it('should call onerror if fail on read file', () => {
        const wrapper = setup({});
        const result = wrapper.instance().onReadFileError({name: 'test'}, [], jest.fn((result) => result))();
        expect(result).toBeFalsy();

        const file = wrapper.instance().onReadFileLoad({name: 'test'}, jest.fn())();
        expect(file).toBeUndefined();
    });

    it('should allow multipart zip files with valid part format (000 - 999)', () => {
        const wrapper = setup({
            fileNameRestrictions: FILE_NAME_RESTRICTION
        });

        const file_a = getMockFile('test.000.zip');
        const file_b = getMockFile('test.111.zip');
        const file_c = getMockFile('test.999.zip');
        const file_d = getMockFile('test.abc.zip');
        const file_e = getMockFile('test.89.zip');
        const file_f = getMockFile('test.222.zip');
        const file_g = getMockFile('test.0123.zip')

        const files = [file_a, file_b, file_c, file_d, file_e, file_f, file_g];

        const {validFiles, invalidFileNames} = wrapper.instance().removeInvalidFileNames(files, FILE_NAME_RESTRICTION);

        expect(validFiles.length).toEqual(4);
        expect(invalidFileNames.length).toEqual(3);
    });

    it('should allow multipart zip files with valid part format (r01 - r999)', () => {
        const wrapper = setup({
            fileNameRestrictions: FILE_NAME_RESTRICTION
        });

        const file_a = getMockFile('test.r00.zip');
        const file_b = getMockFile('test.r11.zip');
        const file_c = getMockFile('test.r9.zip');
        const file_d = getMockFile('test.abc.zip');
        const file_e = getMockFile('test.89.zip');
        const file_f = getMockFile('test.r222.zip');
        const file_g = getMockFile('test.r0222.zip');

        const files = [file_a, file_b, file_c, file_d, file_e, file_f, file_g];

        const {validFiles, invalidFileNames} = wrapper.instance().removeInvalidFileNames(files, FILE_NAME_RESTRICTION);

        expect(validFiles.length).toEqual(3);
        expect(invalidFileNames.length).toEqual(4);
    });

    it('should allow multipart zip files with valid part format (part1 - part999)', () => {
        const wrapper = setup({
            fileNameRestrictions: FILE_NAME_RESTRICTION
        });

        const file_a = getMockFile('test.part1.zip');
        const file_b = getMockFile('test.part8888.zip');
        const file_c = getMockFile('test.part342.zip');
        const file_d = getMockFile('test.part33.zip');
        const file_e = getMockFile('test.rpart89.zip');

        const files = [file_a, file_b, file_c, file_d, file_e];

        const {validFiles, invalidFileNames} = wrapper.instance().removeInvalidFileNames(files, FILE_NAME_RESTRICTION);

        expect(validFiles.length).toEqual(3);
        expect(invalidFileNames.length).toEqual(2);
    });
});
