import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Game } from 'src/models/game';


@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  gamesCollection!: any;
  allGames$!: Observable<any[]>;

  constructor(private router: Router, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    //this.allGames = this.firestore.collection('games');
    this.gamesCollection = this.firestore.collection('games'); // collection
    this.allGames$ = this.getAllGames();// observable
    
    console.log(this.gamesCollection, this.allGames$);
    this.checkGameActivity();
  }

  startGame() {
    //Start Game:
    let game = new Game();
    // CREATE: add a new game object in firestore db
    this.firestore
    .collection('games')
    .add(game.toJSON())
    .then((gameInfo: any)=>{
      this.router.navigateByUrl('/game/' + gameInfo.id); //
    });
  }

  getAllGames(): Observable<any[]> {
    //return collectionData(this.gamesCollection);
    return this.gamesCollection.valueChanges({idField:'id'});
  }

  checkGameActivity(){
    //console.log(Date.now() - game.lastActiveTime >= 300000 ); // 5 min --> mark as inactive
  }

}
