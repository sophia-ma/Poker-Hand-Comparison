import { Injectable } from '@angular/core';

import { CardValue, Suits } from '../enums';
import { Card } from '../models';

type Cache = {
    [key in Suits]: CardValue[];
};

@Injectable({
    providedIn: 'root',
})
export class GenerateService {
    private values = Object.values(CardValue);
    private suits = Object.values(Suits);
    private cache: Cache = {
        [Suits.Clubs]: [],
        [Suits.Diamonds]: [],
        [Suits.Hearts]: [],
        [Suits.Spades]: [],
    };
    private totalCardsUsed = 0;
    private validCardsAmount = 5;

    private generateRandomCard(): Card {
        const card: Card = { suit: null, value: null };

        do {
            card.suit = this.suits[this.getRandomNumber(this.suits.length - 1)];
            card.value = this.values[
                this.getRandomNumber(this.values.length - 1)
            ];
        } while (this.cache[card.suit].includes(card.value));

        return card;
    }

    private getRandomNumber(max: number): number {
        return Math.floor(Math.random() * (max + 1));
    }

    clearCache(): void {
        console.log('%c Cached has been cleared', 'color: #FFEE57');

        this.totalCardsUsed = 0;

        Object.keys(this.cache).forEach((suit) => {
            this.cache[suit] = [];
        });
    }

    generateHand(players: number = 2): [string, Card[]] {
        let result: string[] = [];
        let cards: Card[] = [];

        for (let i = 0; i < this.validCardsAmount; i++) {
            const card = this.generateRandomCard();
            const { value, suit } = card;

            this.cache[suit].push(value);
            this.totalCardsUsed++;

            cards = [...cards, card];
            result = [...result, `${card.value}${card.suit}`];
        }

        if (this.totalCardsUsed > this.validCardsAmount * players) {
            this.clearCache();
        }

        return [result.join(' ').toUpperCase(), cards];
    }
}
