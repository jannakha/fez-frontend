export const CLOSED_ACCESS_ID = 8;
export const OPEN_ACCESS_ID = 9;
export const SIZE_BASE = 1000;

export const DEFAULT_FILE_UPLOAD_LIMIT = 10;
export const DEFAULT_MAX_FILE_SIZE = 8;

export const SIZE_UNIT_B = 'B';
export const SIZE_UNIT_K = 'K';
export const SIZE_UNIT_M = 'M';
export const SIZE_UNIT_G = 'G';

export const FILE_META_KEY_ACCESS_CONDITION = 'access_condition_id';
export const FILE_META_KEY_EMBARGO_DATE = 'date';

export const SIZE_UNITS = [
    SIZE_UNIT_B,
    SIZE_UNIT_K,
    SIZE_UNIT_M,
    SIZE_UNIT_G
];

export const FILE_NAME_RESTRICTION = /^(?=^\S*$)(?=^[a-z\d\-_]+(\.\d{3}|\.r\d{2,3}|\.part\d{1,3})?\.[^\.]+$)(?=.{1,45}$)(?!(web_|preview_|thumbnail_|stream_|fezacml_|presmd_|\d))[a-z\d\-_\.]+/;
