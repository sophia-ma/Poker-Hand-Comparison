import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PokerComponent } from './poker.component';

export const ROUTES: Routes = [
    {
        path: 'poker',
        component: PokerComponent,
    },
];

@NgModule({
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        RouterModule.forChild(ROUTES),
    ],
    declarations: [
        PokerComponent,
    ],
})
export class PokerModule {}
