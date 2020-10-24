import { Injectable } from '@angular/core';

import {
    CardOccurrence,
    CardValue,
    FinalResult,
    Rules,
    Suits,
    ValuesOccurrence,
} from '../enums';

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
    comparison(hands: string[], players: number): void {
        // TODO v2: More players implementation

        const pointsHouse = this.getPointsFromRule(hands[0]);
        const pointsUser = this.getPointsFromRule(hands[1]);

        if (!pointsHouse || !pointsUser) {
            return;
        }

        console.log('pointsHouse', pointsHouse);
        console.log('pointsUser', pointsUser);

        let final: FinalResult = null;

        if (pointsHouse > pointsUser) {
            final = FinalResult.Loss;
        } else if (pointsHouse < pointsUser) {
            final = FinalResult.Win;
        } else {
            final = this.whoHasTheBestHand(hands[0], hands[1]);
        }

        console.log('Final Result:', FinalResult[final]);
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

    getMinimum(array: number[]): number {
        return Math.min(...array);
    }

    getMaximum(array: number[]): number {
        return Math.max(...array);
    }

    isStraight(cardsValues: number[]): boolean {
        const arr = cardsValues.sort((a: number, b: number) => a - b);

        return arr
            .slice(1)
            .map((n, i) => n - arr[i])
            .every((value) => value === 1);
    }

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
            console.log(
                'Cards and suits are not valid, therefore cannot compare'
            );
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

    private whoHasTheBestHand(
        houseHand: string,
        userHand: string
    ): FinalResult {
        const cardValuesHouse = this.getCardValuesSorted(houseHand);
        const cardValuesUser = this.getCardValuesSorted(userHand);

        const houseMaxNumber = this.getMaximum(cardValuesHouse);
        const userMaxNumber = this.getMaximum(cardValuesUser);

        console.log('houseMaxNumber', houseMaxNumber);
        console.log('userMaxNumber', userMaxNumber);

        if (houseMaxNumber > userMaxNumber) {
            return FinalResult.Loss;
        } else if (houseMaxNumber < userMaxNumber) {
            return FinalResult.Win;
        } else {
            return FinalResult.Tie;
        }
    }
}
