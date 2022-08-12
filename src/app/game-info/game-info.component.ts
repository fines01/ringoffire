import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent implements OnInit, OnChanges {

  cardActions = //JSON
  [
    {title: 'Waterfall', description: 'Everyone has to start drinking at the same time. As soon as player 1 stops drinking, player...'},
  ]

  title!: string;
  description!: string;

  @Input() card!: string;

  constructor() { }

  ngOnInit(): void {
    console.log('Current card on init: ', this.card); // ngOnInit nur einmal (beim Aufrufen) ausgeführt --> ngOnChange()
  }

  ngOnChanges(): void { // wird immer aufgerufen, wenn input variable geändert wird
    console.log('Current card: ', this.card);
    console.log('Current number: ', +this.card.split('_')[1] ); // + wandelt string in number um

    if (this.card) {
      let cardNumber = +this.card.split('_')[1]; // + wandelt string in number um
      this.title = this.cardActions[cardNumber-1].title;
      this.description = this.cardActions[cardNumber-1].description;
    }
  }

}
