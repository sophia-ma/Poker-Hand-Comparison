import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FinalResult, Suits } from './enums';
import { Card } from './models';
import { GenerateService, CompareService } from './services';

@Component({
    selector: 'app-poker',
    templateUrl: './poker.component.html',
    styleUrls: ['./poker.component.scss'],
})
export class PokerComponent {
    form: FormGroup;
    result: FinalResult;
    FinalResult = FinalResult;

    constructor(
        private generateService: GenerateService,
        private compareService: CompareService,
        private element: ElementRef,
        private renderer: Renderer2,
        private fb: FormBuilder,
    ) {
        this.form = this.fb.group({
            playerName: [null],
        });
    }

    generateCards(): void {
        this.generateService.clearCache();

        const [houseHand, houseDeck] = this.generateService.generateHand();
        const [userHand, userDeck] = this.generateService.generateHand();

        this.result = this.compareService.compare(houseHand, userHand);

        const tableElement = this.element.nativeElement.querySelector('#table');
        this.renderer.setProperty(tableElement, 'textContent', '');

        this.createHtml(houseDeck, tableElement, 'House');
        this.createHtml(userDeck, tableElement, this.form.value.playerName ? this.form.value.playerName : 'User');
    }

    createHtml(deck: Card[], tableElement: HTMLElement, title: string): void {
        const row = this.renderer.createElement('tr');
        const cell = this.renderer.createElement('td');

        this.renderer.appendChild(tableElement, row);
        this.renderer.appendChild(tableElement, cell);

        this.renderer.addClass(cell, 'title');
        this.renderer.setProperty(cell, 'textContent', title);

        this.renderer.appendChild(row, cell);

        for (let i = 0; i < 5; i++) {
            const card = this.renderer.createElement('td');
            const spanValue = this.renderer.createElement('span');
            const spanSuit = this.renderer.createElement('span');
            let icon = '';

            if (deck[i].suit === Suits.Hearts) {
                icon = '\u2665';
                this.renderer.addClass(card, 'red');
            } else if (deck[i].suit === Suits.Spades) {
                icon = '\u2660';
            } else if (deck[i].suit === Suits.Diamonds) {
                icon = '\u2666';
                this.renderer.addClass(card, 'red');
            } else {
                icon = '\u2663';
            }

            this.renderer.setProperty(spanValue, 'textContent', deck[i].value);

            this.renderer.setProperty(spanSuit, 'textContent', icon);

            this.renderer.addClass(card, 'card-cell');
            this.renderer.addClass(spanValue, 'value');
            this.renderer.addClass(spanSuit, 'suit');
            this.renderer.appendChild(card, spanValue);
            this.renderer.appendChild(card, spanSuit);
            this.renderer.appendChild(row, card);
        }
    }
}
