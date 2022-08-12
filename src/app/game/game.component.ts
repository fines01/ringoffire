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
    //this.newGame();
    this.newGame();
    // url parameter abonnieren (wir brauchen erst die id bevor wir collection abonnieren können)
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

    //// add new dataset
    //// we are going to add the whole game object --> data needs to be returned as json
    //this.firestore.collection('games').add(this.game.toJSON());

    //// oder (schauen was aktuellere Syntax ist)
    // const coll = collection(this.firestore, 'game');
    // let gameInfo = await addDoc(coll, {game: this.game.toJSON() });
  }

  pickCard() {
    if (!this.game.pickCardAnimation){
      // pick card (pop() returns last val of array & removes it from array)
      let card = this.game.stack.pop();
      if (typeof card === 'string') this.game.currentCard = card;
      // play animation (add class)
      this.game.pickCardAnimation = true;
      // change player
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length; // resr: dh ab [Anz Spieler] fängts wieder bei 0 an, zB 3 Spieler, 3/3 = 1 rest 0;
      // save updates
      this.updateGame();
      // remove/stop animation
      setTimeout( ()=>{
        this.game.pickCardAnimation = false;
        this.game.playedCards.push(this.game.currentCard);
        this.updateGame();
      }, 1000);
    }
  }

  // Mat Design
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
      width: '250px',
      // Daten hinzufügen:
      //data: {name: this.name, animal: this.animal}, // daten hinzufügen
    });

    dialogRef.afterClosed().subscribe( (playerName: string) => {
      console.log('The dialog was closed', playerName);
      // Daten zurückliefern:
      // nur speichern, wenn nicht leer (validate)
      if (playerName && playerName.length > 0) {
        this.game.players.push(playerName)
        this.updateGame();
      }

    });
  }

  // UPDATE game
  updateGame() {
    this.firestore
    .collection('games')
    .doc(this.gameId)
    .update(this.game.toJSON());
  }

}

