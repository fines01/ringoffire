import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent implements OnInit, OnChanges {

  cardActions = //JSON
  [
    { title: 'Waterfall', description: 'Everyone has to start drinking at the same time. As soon as player 1 stops drinking, player 2 may stop drinking. Player 3 may stop as soon as player 2 stops drinking, and so on.' },
    { title: 'You', description: 'You decide who drinks' },
    { title: 'Me', description: 'Congrats! Drink a shot!' },
    { title: 'Category', description: 'Come up with a category (e.g. Colors). Each player must enumerate one item from the category.' },
    { title: 'Bust a jive', description: 'Player 1 makes a dance move. Player 2 repeats the dance move and adds a second one. ' },
    { title: 'Chicks', description: 'All girls drink.' },
    { title: 'Heaven', description: 'Put your hands up! The last player drinks!' },
    { title: 'Mate', description: 'Pick a mate. Your mate must always drink when you drink and the other way around.' },
    { title: 'Rhyme', description: 'Say a word (e.g. Rum). Then each player in turn has to say a word that rhymes (e.g. Drum). First player to stutter or fail drinks' },
    { title: 'Men', description: 'All boys drink.' },
    { title: 'Never have i ever...', description: 'Say something you never did. Everyone who did it has to drink.' },
    { title: 'Question Master', description: 'You have to keep asking questions to each other. Doesn’t matter what the question is, as long as its a question. Whoever messes up and does not say a question, drinks' },
    { title: 'Rule', description: 'Make a rule. Everyone needs to drink when they break the rule.' },
  ]

  title!: string;
  description!: string;

  @Input() card!: string;
  @Input() gameIsReady!: boolean;
  @Input() gameIsOver!: boolean;

  @Output() deleteGame = new EventEmitter();
  @Output() restartGame = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(): void {
    if (!this.card && this.gameIsReady && !this.gameIsOver) {
      this.title = 'Please pick a card';
      this.description ='Click on the card stack to select the next card';
    }
    if (this.gameIsOver){
      this.title = 'Game Over!'
      this.description = 'Exit and delete the game room or start again?'
    }
    if (!this.gameIsReady) {
      this.title = 'Please add at least 2 players!';
      this.description ='Click on the button above to add a new player.';
    }
    if (this.card && this.gameIsReady && !this.gameIsOver) {
      let cardNumber = +this.card.split('_')[1];
      this.title = this.cardActions[cardNumber-1].title;
      this.description = this.cardActions[cardNumber-1].description;
    }
  }

  emitDeleteEvent() {
    this.deleteGame.emit(); // emit empty event or bool
  }

  emitRestartEvent() {
    this.restartGame.emit();
  }



}
