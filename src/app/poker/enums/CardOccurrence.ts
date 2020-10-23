// CardOccurrence: get the total of unique numbers in a 5 card hand
export enum CardOccurrence {
    HighCardOrStraightOrFlushOrRoyal = 5, // pattern: A2567 / 23456 / TJQKA ...
    Pair = 4, // pattern: 22345
    TwoPairsOrThreeOfaKind = 3, // pattern: 22334 / 22234
    FullHouseorFourOfaKind = 2, // pattern: 22233 / 22223
}
