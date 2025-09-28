export const CELL_TYPE = {
  EMPTY: 'empty',
  BOMB: 'bomb',
};

export const GAME_STATUS = {
  WIN: 'win',
  LOST: 'lost',
  IN_PROGRESS: 'in progress',
};

export const FIELD_SIZE = {
  mobile: {
    small: {
      ROWS: 9,
      COLS: 9,
      BOBMS_COUNT: 16,
    },
    medium: {
      ROWS: 16,
      COLS: 12,
      BOBMS_COUNT: 30,
    },
    large: {
      ROWS: 24,
      COLS: 12,
      BOBMS_COUNT: 70,
    },
  },
  desktop: {
    small: {
      ROWS: 9,
      COLS: 9,
      BOBMS_COUNT: 16,
    },
    medium: {
      ROWS: 16,
      COLS: 16,
      BOBMS_COUNT: 40,
    },
    large: {
      ROWS: 16,
      COLS: 30,
      BOBMS_COUNT: 99,
    },
  },
};

export const MOBILE_BREAKPOINT = 700;

export const STATISTICS_KEY = 'stat';
