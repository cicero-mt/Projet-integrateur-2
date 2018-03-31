import { Component, OnInit } from '@angular/core';
import { RaceDataHandlerService } from '../../race-data-handler.service';
import { MAX_N_LAPS} from "../../../constants";
@Component({
  selector: 'app-lap',
  templateUrl: './lap.component.html',
  styleUrls: ['./lap.component.css']
})
export class LapComponent implements OnInit {

  public constructor(private raceDataHandler: RaceDataHandlerService) { }

  public ngOnInit(): void {
  }

  public get lapsElapsed(): number {
    return Math.min(this.raceDataHandler.lapElapsed + 1, MAX_N_LAPS);
  }
}
