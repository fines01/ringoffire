import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  editMode = false;
  restoreValue!:string;

  @Input() name!: string;
  @Input() nameIndex!: number;
  @Input() playerIsActive: boolean = false;

  @Output() updatePlayer = new EventEmitter();
  @Output() deletePlayer = new EventEmitter();


  constructor() { }

  ngOnInit(): void {
    this.restoreValue = this.name;
  }

  toggleEditMode() {
    if (this.editMode) this.emitUpdateEvent();
    else this.editMode = !this.editMode;
  }

  @HostListener('window:keydown.enter')
  bindEnterKeyEvent() {
    let inputField = document.querySelector('input');
    if (document.activeElement === inputField) this.emitUpdateEvent();
  }

  emitUpdateEvent() {
    if (this.validateInput()) {
      this.updatePlayer.emit([this.name, this.nameIndex]);
    }
    else this.name = this.restoreValue;
    this.editMode = false;
  }

  emitDeleteEvent() {
    this.deletePlayer.emit([this.name, this.nameIndex, this.playerIsActive]); //or only nameIndex 
    this.editMode = false;
  }

  validateInput() {
    return (this.name && this.name.trim().length > 0)
  }

}
