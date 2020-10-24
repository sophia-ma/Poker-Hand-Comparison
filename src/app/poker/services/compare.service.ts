import { Injectable } from '@angular/core';

import {
    CardOccurrence,
    CardValue,
    FinalResult,
    Rules,
    Suits,
    ValuesOccurrence,
} from '../enums';
import { Card, CardValueCount } from '../models';

@Injectable({
    providedIn: 'root',
})
export class CompareService {
    cards: CardValue[] = Object.values(CardValue);
    royalCardsMapping = {
        T: '10',
        J: '11',
        Q: '12',
        K: '13',
        A: '14',
    };

    comparison(houseHand: string, userHand: string): string {
        // TODO v2: More players implementation
        const pointsHouse = this.getPointsFromRule(houseHand);
        const pointsUser = this.getPointsFromRule(userHand);
        const houseValuesCount = this.getValuesCount(houseHand);
        const userValuesCount = this.getValuesCount(userHand);

        if (!pointsHouse || !pointsUser) {
            return 'Cards and suits are not valid, therefore cannot compare';
        }

        console.log('pointsHouse', pointsHouse);
        console.log('pointsUser', pointsUser);

        if (pointsHouse > pointsUser) {
            return FinalResult[FinalResult.Loss];
        } else if (pointsHouse < pointsUser) {
            return FinalResult[FinalResult.Win];
        } else {
            let index = 0;
            const houseValues = this.sortAndRemoveDuplicates(houseValuesCount);
            const userValues = this.sortAndRemoveDuplicates(userValuesCount);

            while (index < userValues.length) {
                const userValue = this.remappedRoyal(userValues[index]);
                const houseValue = this.remappedRoyal(houseValues[index]);

                if (userValue !== houseValue) {
                    return this.findBestCard(userValue, houseValue) === 1
                        ? FinalResult[FinalResult.Win]
                        : FinalResult[FinalResult.Loss];
                }

                index++;
            }

            return FinalResult[FinalResult.Tie];
        }
    }

    private getValuesCount(hand: string): CardValueCount {
        const cards: Card[] = hand.split(' ').map((x: string) => {
            return {
                suit: x.charAt(1) as Suits,
                value: x.charAt(0) as CardValue,
            };
        });

        const valuesCount: CardValueCount = {};

        for (const element of cards) {
            const { value } = element;

            if (valuesCount[value] === undefined) {
                valuesCount[value] = 1;
            } else {
                valuesCount[value]++;
            }
        }

        return valuesCount;
    }

    private remappedRoyal(card: number | string): number {
        if (typeof card === 'number') {
            return card;
        } else {
            return +this.royalCardsMapping[card];
        }
    }

    private sortAndRemoveDuplicates(valuesCount: {}): (string | number)[] {
        return Object.keys(valuesCount)
            .map((key) => +key || key)
            .sort((a, b) => {
                if (valuesCount[a] < valuesCount[b]) {
                    return 1;
                } else if (valuesCount[a] > valuesCount[b]) {
                    return -1;
                } else {
                    if (this.remappedRoyal(a) < this.remappedRoyal(b)) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            });
    }

    private getCardValuesSorted(hand: string): number[] {
        const values = hand.split(' ').map((x: string) => {
            const value = x.charAt(0);
            const remappedValues = this.royalCardsMapping[value] ?? value;

            return +remappedValues;
        });

        return values.sort((a: number, b: number) => b - a);
    }

    private validation(hand: string): boolean {
        const validSuit = hand.split(' ').every((x: string) => {
            const suits = Object.values(Suits) as string[];

            return suits.includes(x.charAt(1));
        });

        const validCard = hand
            .split(' ')
            .every((x: string) =>
                (this.cards as string[]).includes(x.charAt(0))
            );

        return validSuit && validCard;
    }

    private isSuitSame(hand: string): boolean {
        const suits = hand.split(' ').map((x: string) => x.charAt(1));

        return suits.every((suit: string) => suit === suits[0]);
    }

    private getMinimum(array: number[]): number {
        return Math.min(...array);
    }

    private getMaximum(array: number[]): number {
        return Math.max(...array);
    }

    private isStraight(cardsValues: number[]): boolean {
        const arr = cardsValues.sort((a: number, b: number) => a - b);

        return arr
            .slice(1)
            .map((n, i) => n - arr[i])
            .every((value) => value === 1);
    }

    private findBestCard = (a: number, b: number): number => (a > b ? 1 : -1);

    private isRoyal(cardsValues: number[]): boolean {
        const straight = this.isStraight(cardsValues);

        if (!straight) {
            return false;
        }

        const royalValues = Object.keys(this.royalCardsMapping).map(
            (val: string) => +this.royalCardsMapping[val]
        );

        return cardsValues.every((val) => royalValues.includes(val));
    }

    private occurrenceCount(cardsValues: number[]): number {
        const occurrenceCount = [...cardsValues].reduce((x, y) => {
            x[y] = x[y] ? x[y] + 1 : 1;
            return x;
        }, {});

        return this.getMaximum(Object.values(occurrenceCount));
    }

    private cardOccurrence(cardsValues: number[]): number {
        const cardOccurrence = [...cardsValues].reduce((x, y) => {
            x[y] = x[y] ? x[y] + 1 : 1;
            return x;
        }, {});

        return Object.keys(cardOccurrence).length;
    }

    private getPointsFromRule(hand: string): number {
        if (!this.validation(hand)) {
            return 0;
        }

        const cardValues = this.getCardValuesSorted(hand);
        const flush = this.isSuitSame(hand);
        const straight = this.isStraight(cardValues);
        const royal = this.isRoyal(cardValues);

        const cardOccurrence = this.cardOccurrence(cardValues);
        const occurrenceCount = this.occurrenceCount(cardValues);

        let points = 0;

        // TODO: Sort this mess
        if (straight) {
            points = Rules.Straight;
            if (flush) {
                if (points === Rules.Straight) {
                    points = royal ? Rules.RoyalFlush : Rules.StraightFlush;
                } else {
                    points = Rules.Flush;
                }
            }
        } else if (cardOccurrence === CardOccurrence.FullHouseorFourOfaKind) {
            if (occurrenceCount === ValuesOccurrence.FourOfaKind) {
                points = Rules.FourOfaKind;
            } else if (occurrenceCount === ValuesOccurrence.FullHouse) {
                points = Rules.FullHouse;
            }
        } else if (cardOccurrence === CardOccurrence.TwoPairsOrThreeOfaKind) {
            if (occurrenceCount === ValuesOccurrence.ThreeOfaKind) {
                points = Rules.ThreeOfaKind;
            } else if (occurrenceCount === ValuesOccurrence.TwoPairs) {
                points = Rules.TwoPairs;
            }
        } else if (cardOccurrence === CardOccurrence.Pair) {
            points = Rules.Pair;
        } else {
            points = Rules.Highcard;
        }

        return points;
    }
}
