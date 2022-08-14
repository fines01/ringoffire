import { Component, HostListener, Directive, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'; // später ev. entfernen was ich nicht brauche
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { addDoc } from 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';
import { databaseInstance$ } from '@angular/fire/database';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  game!: Game;
  gameId!: string;
  gameOver: boolean = false;

  constructor(
    private firestore: AngularFirestore, 
    public dialog: MatDialog, 
    private route: ActivatedRoute 
    ) { }

  ngOnInit() {
    this.newGame();

    //open game room modal (name room, show btn to copy url)

   this.route.params.subscribe( (params)=>{     
      this.gameId = params['id']; //params.id
      
      this.firestore
      .collection('games')
      .doc(this.gameId)
      .valueChanges()
      .subscribe( (game: any) => {
        this.game.currentPlayer = game.currentPlayer;
        this.game.playedCards = game.playedCards;
        this.game.players = game.players;
        this.game.stack = game.stack;
        this.game.pickCardAnimation = game.pickCardAnimation,
        this.game.currentCard = game.currentCard
        this.game.lastActiveTime = game.lastActiveTime;
        this.checkGameStatus(game.stack);
      });
    });

  }

  newGame(): void {
    this.game = new Game();
  }

  pickCard() {
    console.log(this.game.stack.length, this.game.players);
    this.checkGameStatus();

    if (!this.game.pickCardAnimation && this.game.players.length >= 2 && !this.gameOver){
      let card = this.game.stack.pop();
      if (typeof card === 'string') this.game.currentCard = card;
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.game.lastActiveTime = Date.now();
      this.updateGamesCollection();
      //animation
      setTimeout( ()=>{
        this.game.pickCardAnimation = false;
        this.game.playedCards.push(this.game.currentCard);
        this.updateGamesCollection();
      }, 1000);
    }
  
  }

  openModal(componentRef: any, modalWidth: string) {
    const dialogRef = this.dialog.open(componentRef, {
      width: modalWidth,
    });
    return dialogRef;
  }

  addPlayer(dialogRef: any) {
    dialogRef.afterClosed().subscribe( (playerName: string) => {
      if (playerName && playerName.length > 0) {
        this.game.players.push(playerName)
        this.updateGamesCollection();
      }
    });

  }

  addPlayerModal(): void {
    const dialogRef = this.openModal(DialogAddPlayerComponent, '250px');
    this.addPlayer(dialogRef);
  }

  updateGamesCollection() {
    this.firestore
    .collection('games')
    .doc(this.gameId)
    .update(this.game.toJSON());
  }

  isGameReady() {
    return this.game.players.length >= 2;
  }

  isGameOver() {
    return this.gameOver;
  }

  @HostListener('window: load', ['$event'])
  onLoad1(event: Event) {
    console.log('LoAD');
  }

  @HostListener('window: load')
  onLoad2() {
    console.log('LOAD');
  }

  checkGameStatus( stack = this.game.stack ) {
    if (stack.length === 0) this.gameOver = true;
  }

  copyURLToClipboard() {
    navigator.clipboard.writeText(window.location.href);
  }

}

