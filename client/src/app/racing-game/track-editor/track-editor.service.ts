import { Injectable } from '@angular/core';
import { TrackEditorRenderService } from './track-editor-render.service';
import { Track } from '../track/track';
import { Vector3 } from 'three';
import { Waypoint } from '../track/waypoint';

@Injectable()
export class TrackEditorService {

  private container: HTMLDivElement;
  private track: Track;
  private dragDropActive: boolean;
  private selectedWaypoint: THREE.Object3D;

  public constructor(private trackEditorRenderService: TrackEditorRenderService) { }

  public initialize(container: HTMLDivElement): void {
      this.container = container;
      this.track = new Track();
      this.dragDropActive = false;
      this.trackEditorRenderService.initialize(this.container);
  }

  public getTrack(): Track {
    return this.track;
  }

  public handleLeftMouseDown(event: MouseEvent): void {
    let objectsSelected = this.trackEditorRenderService.getObjectsPointedByMouse(event);

    if(objectsSelected.length > 0) {
      if(objectsSelected[0].object.type === "wayPpoint") {
        this.dragDropActive = true;
        //
        // Il faut changer le code pour faire interface entre l'objet raycasté (un 3dObject)
        // et le "waypoint" correspondant dans le array waypoints
        //
        this.selectedWaypoint = objectsSelected[0].object;
      } else {

        //
        // A MODFIER EN RAISON DE LA NOUVELLE CLASSE WAYPOINT
        //
        this.track.addWaypoint(new Waypoint(new Vector3(
                                          (event.clientX / window.innerWidth) * 2 - 1,
                                          0,
                                          (event.clientY / window.innerHeight) * 2 + 1)))
      }
      
    }   
  }

  public handleLeftMouseUp(event: MouseEvent) : void {
    this.selectedWaypoint = null;
    this.dragDropActive = false;
  }

  public handleRightMouseDown(event: MouseEvent): void {
    this.track.removeLastWaypoint();
  }

  public handleMouseMove(event: MouseEvent): void {
    if(this.dragDropActive) {
      this.trackEditorRenderService.updateMousePos(event);

      // À MODIFIER EN FONCTION DE LA MÉTHODE DANS TRACK
      //this.track.moveWaypoint(this.selectedWaypoint, this.trackEditorRenderService.getMousePos);
    }
  }

}
