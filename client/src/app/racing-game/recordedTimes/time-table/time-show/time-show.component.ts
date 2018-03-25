import { Component, OnInit, Input } from '@angular/core';
import { RaceResults } from '../../raceResults';

@Component({
  selector: 'app-time-show',
  templateUrl: './time-show.component.html',
  styleUrls: ['./time-show.component.css']
})
export class TimeShowComponent implements OnInit {
  public showLapsTime: boolean = false;
  @Input() public  raceTime: RaceResults;
  public constructor() { }

  public ngOnInit(): void {
  }

}
