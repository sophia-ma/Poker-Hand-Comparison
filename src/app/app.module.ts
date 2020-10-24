import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PokerModule } from './poker/poker.module';

export const ROUTES: Routes = [
    { path: '', redirectTo: 'poker', pathMatch: 'full' },
    { path: '**', redirectTo: 'poker', pathMatch: 'full' },
];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserModule,
        PokerModule,
        HttpClientModule,
        RouterModule.forRoot(ROUTES),
    ],
    providers: [],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {}
