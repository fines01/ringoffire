import { Component, HostListener, Directive, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { addDoc, CollectionReference, doc, deleteDoc } from 'firebase/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { databaseInstance$ } from '@angular/fire/database';
import { collectionData } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  game!: Game;
  gameId!: string;
  gameDocumentRef!: any;
  gameOver: boolean = false;

  constructor(
    private firestore: AngularFirestore, 
    public dialog: MatDialog, 
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit() {
    this.newGame();
    this.route.params.subscribe( (params)=>{     
      this.gameId = params['id'];
      this.subscribeGameCollection(this.gameId);
    });

  }

  subscribeGameCollection(gameId: string) {
    this.gameDocumentRef = this.firestore
      .collection('games')
      .doc(this.gameId);
    this.gameDocumentRef
      .valueChanges()
      .subscribe( (game: any) => {
        //check if game exists in db, else redirect
        if (!this.checkRouteExists(game)) return;
        // copy variables with game infos (because observables are asynchronous)
        this.setGameInfo(game);
        this.checkGameStatus(game.stack);
      });
  }

  setGameInfo(game: any) {
    this.game.currentPlayer = game.currentPlayer;
    this.game.playedCards = game.playedCards;
    this.game.players = game.players;
    this.game.pickCardAnimation = game.pickCardAnimation,
    this.game.stack = game.stack;
    this.game.lastActiveTime = game.lastActiveTime;
    this.game.currentCard = game.currentCard
    this.game.gameRoomName = game.gameRoomName;
  }

  newGame(): void {
    this.game = new Game();
  }

  pickCard() {
    this.checkGameStatus();
    if (this.cardDrawPossible()){
      let card = this.game.stack.pop();
      if (typeof card === 'string') this.game.currentCard = card;
      this.game.pickCardAnimation = true;
      this.nextPlayer();
      this.game.lastActiveTime = Date.now();
      this.updateGamesCollection();
      this.endAnimation();
    }
  }

  cardDrawPossible() {
    return (
      !this.game.pickCardAnimation && 
      this.game.players.length >= 2 && 
      !this.gameOver
    );
  }

  endAnimation() {
     setTimeout( ()=>{
        this.game.pickCardAnimation = false;
        this.game.playedCards.push(this.game.currentCard);
        this.updateGamesCollection();
      }, 1000);
  }

  nextPlayer(index: number | undefined = undefined) {
    if (index || index == 0) this.game.currentPlayer = index; // ! if index == 0 --> evaluates to false
    else this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
    if (this.game.players.length < 2) this.game.currentPlayer = 0;
  }

  openModal(componentRef: any, modalWidth: string):  MatDialogRef<unknown, any> {
    const dialogRef = this.dialog.open(componentRef, {
      width: modalWidth,
    });
    return dialogRef;
  }

  addPlayer(dialogRef: any) {
    dialogRef.afterClosed().subscribe( (nameInput: string) => {
      if (nameInput && nameInput.length > 0) {
        let playerName = this.validateName(nameInput)
        this.game.players.push(playerName);
        this.game.lastActiveTime = Date.now();
        this.updateGamesCollection();
      }
    });
  }

  addPlayerModal(): void {
    const dialogRef = this.openModal(DialogAddPlayerComponent, '250px');
    this.addPlayer(dialogRef);
  }

  validateName(name: string) {
    name = name.trim();
    if (name.length > 10){
      name = name.slice(0,10) + '...';
    }
    return name;
  }

  updateGamesCollection() {
    this.firestore
    .collection('games')
    .doc(this.gameId)
    .update(this.game.toJSON());
  }

  async onDeleteGame() {
    this.router.navigate(['/']);
    await this.gameDocumentRef.delete();
  }

  onRestartGame() {
    let players = this.game.players; // keep players
    this.game = new Game();
    this.gameOver = false;
    this.game.players = players;
    this.updateGamesCollection();
  }

  onUpdatePlayer(player: [name: string, index: number]){
    let newName = player[0];
    let playerIndex = player[1];
    this.game.players[playerIndex] = newName;
    this.updateGamesCollection();
  }

  onDeletePlayer(player: [name: string, index: number, isActive: boolean]){
    let playerIndex = player[1];
    this.game.players.splice(playerIndex, 1);
    if (player[2]) this.nextPlayer(playerIndex);
    this.updateGamesCollection();
  }

  isGameReady() {
    return this.game.players.length >= 2;
  }

  isGameOver() {
    return this.gameOver;
  }

  checkGameStatus( stack = this.game.stack ) {
    if (stack.length === 0) this.gameOver = true;
  }
  
  checkRouteExists(game: object): boolean {
    if (game === undefined)  { 
      this.router.navigate(['/']);
      return false;
    } 
    else return true;
  }

  copyURLToClipboard() {
    navigator.clipboard.writeText(window.location.href);
  }

}

