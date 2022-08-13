import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'; // später ev. entfernen was ich nicht brauche
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { addDoc } from 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  // pickCardAnimation: boolean = false;
  // currentCard!: string;
  game!: Game;
  gameId!: string;

  constructor(
    private firestore: AngularFirestore, 
    public dialog: MatDialog, 
    private route: ActivatedRoute //s.d. über routen-rarameter jew game id übergeben werden kann
    ) { }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe( (params)=>{

      console.log(params); //params.id
      
      this.gameId = params['id']; //params.id
      // abonnieren
      this.firestore
      .collection('games')
      .doc(this.gameId)
      .valueChanges()
      .subscribe( (game: any) => {
        console.log('Game update ', game);
        this.game.currentPlayer = game.currentPlayer;
        this.game.playedCards = game.playedCards;
        this.game.players = game.players;
        this.game.stack = game.stack;
        this.game.pickCardAnimation = game.pickCardAnimation,
        this.game.currentCard = game.currentCard
      });

    });

  }

  newGame() {
    this.game = new Game();
  }

  pickCard() {
    if (!this.game.pickCardAnimation && this.game.players.length >= 2){
      let card = this.game.stack.pop();
      if (typeof card === 'string') this.game.currentCard = card;
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.updateGame();
      //animation
      setTimeout( ()=>{
        this.game.pickCardAnimation = false;
        this.game.playedCards.push(this.game.currentCard);
        this.updateGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe( (playerName: string) => {
      if (playerName && playerName.length > 0) {
        this.game.players.push(playerName)
        this.updateGame();
      }

    });
  }

  updateGame() {
    this.firestore
    .collection('games')
    .doc(this.gameId)
    .update(this.game.toJSON());
  }

  isGameReady() {
    return this.game.players.length >= 2;
  }

}

