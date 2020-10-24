import { CardValue } from '../enums';

export type CardValueCount = {
    [value in CardValue]?: number;
};
