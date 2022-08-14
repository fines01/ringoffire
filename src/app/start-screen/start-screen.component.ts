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
  fadeOutRoomsList: boolean = true;
  hideRoomsList: boolean = false;

  constructor(private router: Router, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.gamesCollection = this.firestore.collection('games'); // collection
    this.allGames$ = this.getAllGames();// observable
    
    console.log(this.gamesCollection, this.allGames$);
  }

  startGame() {
    let game = new Game();
    this.firestore
    .collection('games')
    .add(game.toJSON())
    .then((gameInfo: any)=>{
      this.router.navigateByUrl('/game/' + gameInfo.id); //
    });
  }

  getAllGames(): Observable<any[]> {
    return this.gamesCollection.valueChanges( {idField:'id'} ); //valueChanges() returns Observable
  }

  // rooms are marked as inactive after (5) minutes
  checkGameActivity(lastActive: number){
    return (Date.now() - lastActive <= 300000);
  }

  sortByTimestamp(arr: any[]) {
    arr.sort( (x:any,y:any)=>{
      return x.lastActiveTime - y.lastActiveTime
    })
  }

  toggleBox() {
    this.fadeOutRoomsList = !this.fadeOutRoomsList;
    setTimeout( ()=>{
      this.hideRoomsList = !this.hideRoomsList
    },1000);
  }

}
