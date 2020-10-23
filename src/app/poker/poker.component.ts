import { Component, OnInit } from '@angular/core';

import { Rules } from './enums';

@Component({
    selector: 'app-poker',
    templateUrl: './poker.component.html',
    styleUrls: ['./poker.component.scss'],
})
export class PokerComponent implements OnInit {
    rules = Rules;

    uniqueOccurrence = {
        // 1: highcard
        1: {
            card: 5, // pattern: 2478J
            suit: 'Many',
        },
        // 2: pair
        2: {
            card: 4, // pattern: 22345
            suit: 'Many',
        },
        3: {
            card: 3, // pattern: 22334
            suit: 'Many',
        },
        4: {
            card: 3, // pattern: 22234
            suit: 'Many',
        },
        5: {
            card: 5, // pattern: 23456
            suit: 'Many',
        },
        6: {
            card: 5, // pattern: 2369K
            suit: 'One',
        },
        7: {
            card: 2, // pattern: 22233
            suit: 'Many',
        },
        8: {
            card: 2, // pattern: 22223
            suit: 'Many',
        },
        9: {
            card: 5, // pattern: 34567
            suit: 'One',
        },
        10: {
            card: 5, // pattern: TJQKA
            suit: 'One',
        },
    };

    ngOnInit(): void {
        this.comparison(['JH 7H 8H 9H TH', '3C JD AD AS 6S'], 2);
    }

    getCardValuesSorted(hand: string): number[] {
        const mapping = {
            T: '10',
            J: '11',
            Q: '12',
            K: '13',
            A: '14',
        };

        const values = hand.split(' ').map((x: string) => {
            const value = x.charAt(0);
            const remappedValues = mapping[value] ?? value;

            return +remappedValues;
        });

        return values.sort((a: number, b: number) => b - a);
    }

    areSuitsSame(hand: string): boolean {
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

    isRoyal(cardsValues: number[]): boolean {
        const straight = this.isStraight(cardsValues);

        if (!straight) {
            return false;
        }

        // TODO: Use letters and do mapping
        const royalValues = [10, 11, 12, 13, 14];

        return cardsValues.every((val) => royalValues.includes(val));
    }

    occuranceCount(cardsValues: number[]): number {
        const occuranceCount = [...cardsValues].reduce((x, y) => {
            x[y] = x[y] ? x[y] + 1 : 1;
            return x;
        }, {});

        console.log(
            'occuranceCount:',
            this.getMaximum(Object.values(occuranceCount))
        );
        return this.getMaximum(Object.values(occuranceCount));
    }

    cardOccurance(cardsValues: number[]): number {
        const cardOccurance = [...cardsValues].reduce((x, y) => {
            x[y] = x[y] ? x[y] + 1 : 1;
            return x;
        }, {});

        console.log('cardOccurance:', Object.keys(cardOccurance).length);
        return Object.keys(cardOccurance).length;
    }

    getPointsFromRule(hand: string): number {
        const cardValues = this.getCardValuesSorted(hand);
        const flush = this.areSuitsSame(hand);
        const straight = this.isStraight(cardValues);
        const royal = this.isRoyal(cardValues);

        const cardOccurance = this.cardOccurance(cardValues);
        const occuranceCount = this.occuranceCount(cardValues);

        let points = 0;

        // TODO: Fix magic numbers and sort this mess
        if (straight) {
            points = this.rules.Straight;
            if (flush) {
                if (points === this.rules.Straight) {
                    points = royal
                        ? this.rules.RoyalFlush
                        : this.rules.StraightFlush;
                } else {
                    points = this.rules.Flush;
                }
            }
        } else if (cardOccurance === 2) {
            if (occuranceCount === 4) {
                points = this.rules.FourOfaKind;
            } else if (occuranceCount === 3) {
                points = this.rules.FullHouse;
            }
        } else if (cardOccurance === 3) {
            if (occuranceCount === 3) {
                points = this.rules.ThreeOfaKind;
            } else if (occuranceCount === 2) {
                points = this.rules.TwoPairs;
            }
        } else if (cardOccurance === 4) {
            points = this.rules.Pair;
        } else {
            points = this.rules.Highcard;
        }

        return points;

        /**
         * 1. Is straight?
         *    a. true -> points = 5
         *       a1. Is flush?
         *           a1a: true -> Is points === 5
         *                        a1a1: true -> if royal ? return 10 : return 9;(straight flush)
         *                        a1a2: false -> return 6; (flush)
         *           a1b: false -> return 5 (just straight)
         *    b. false -> continue
         *
         * 2. Is Card occurrence === 2 ?
         *    a. true ->
         *        a1. max count of same cards === 4 (four of a kind) => return 8;
         *        a2. max count of same cards === 3 (full house) => return 7;
         *    b. false -> continue
         *
         * 3. Is Card occurrence === 3 ?
         *    a. true ->
         *        a1. max count of same cards === 3 (three of a kind) => return 4;
         *        a2. max count of same cards === 2 (two pairs) => return 3;
         *    b. false -> continue
         *
         * 3. Is Card occurrence === 4 ?
         *    a. true -> return 2; (pair)
         *    b. false -> return 1; (high card)
         */
    }

    comparison(hands: string[], players: number): void {
        // TODO: Players implementation for later

        const pointsPlayer1 = this.getPointsFromRule(hands[0]);
        const pointsPlayer2 = this.getPointsFromRule(hands[1]);

        console.log('pointsPlayer1', pointsPlayer1);
        console.log('pointsPlayer2', pointsPlayer2);

        // TODO: Compare points and if the same compare values again
    }
}
