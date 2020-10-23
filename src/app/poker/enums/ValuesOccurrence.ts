// ValuesOccurrence: max number of same values in a 5 card hand
export enum ValuesOccurrence {
    HighCard = 1, // pattern: 3 6 9 J K -> 1 1 1 1 1 -> max:1
    Pair = 2, // pattern: AA 3 7 2 -> 2 1 1 1 -> max: 2
    TwoPairs = 2, // pattern: AA JJ 6 -> 2 2 1 -> max:2
    ThreeOfaKind = 3, // pattern: AAA J 6 -> 3 1 1 -> max:3
    FullHouse = 3, // pattern: AAA JJ -> 3 2 -> max:3
    FourOfaKind = 4, // pattern: AAAA J -> 4 1 -> max:4
}
