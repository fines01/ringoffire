export class Game {

    public players: string[] = []; //public damit in anderen Dateien darauf zugegriffen werden kann
    public stack: string[] = [];
    public playedCards: string[] = [];
    public currentPlayer: number = 0;
    public pickCardAnimation: boolean = false;
    public currentCard: string = '';
    public lastActiveTime: number = Date.now();
    public gameRoomName: string = 'Room ' + new Date().toISOString(); //auto generate some name

    constructor() {
        // add cards to stack
        for (let i = 1; i < 14; i++) {
            this.stack.push('spade_' + i);
            // this.stack.push('hearts_' + i);
            // this.stack.push('clubs_' + i);
            // this.stack.push('diamonds_' + i);
        }
        // mix cards
        this.shuffle(this.stack);
    }
    
    // random 'shuffle' stack order (shuffle array, randomize array order)
    shuffle(arr: any) {
        let currentIndex = arr.length,  randomIndex;
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // And swap it with the current element.
            [arr[currentIndex], arr[randomIndex]] = [
            arr[randomIndex], arr[currentIndex]];
        }
        return arr;
    }

    // return data as json
    public toJSON() {
        return {
            players: this.players,
            stack: this.stack,
            playedCards: this.playedCards,
            currentPlayer: this.currentPlayer,
            pickCardAnimation: this.pickCardAnimation,
            currentCard: this.currentCard,
            lastActiveTime: this.lastActiveTime,
            gameRoomName: this.gameRoomName,
        }
    }

}