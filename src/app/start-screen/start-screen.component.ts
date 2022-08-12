import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  constructor(private router: Router, private firestore: AngularFirestore) { }

  ngOnInit(): void {
  }

  newGame() {
    //Start Game:
    let game = new Game();
    console.log(typeof game.toJSON()); // object
    // CREATE: add a new game object in firestore db
    this.firestore
    .collection('games')
    .add(game.toJSON())
    // then: liefert eine promise 
    .then((gameInfo: any)=>{
      // redirect to game route (unique route for unique game, can be sent to other players so they can join the game )
      this.router.navigateByUrl('/game/' + gameInfo.id); //
    });
  }

}
