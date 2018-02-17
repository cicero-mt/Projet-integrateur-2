import { Injectable } from '@angular/core';
import { TrackEditorRenderService } from './track-editor-render.service';
import { Track } from '../track/trackData/track';
import { Waypoint } from '../track/trackData/waypoint';
import { POINTS_POSITION_Z } from '../constants';
import { Constraints } from "./constrains/constraints";
import * as THREE from 'three';
import { ConstraintsError } from "./constrains/constraintsError";

const NB_MIN_WAYPOINTS_FOR_POLYGON: number = 3;
const MIN_MOVEMENT_TRESHOLD: number = 2;

@Injectable()
export class TrackEditorService {

    private container: HTMLDivElement;
    private track: Track;
    private dragDropActive: boolean;
    private selectedWaypoint: Waypoint;
    private selectedWaypointInitialPos: THREE.Vector3;
    private constraints: Constraints;


    public constructor(private trackEditorRenderService: TrackEditorRenderService) { }


    public initialize(container: HTMLDivElement): void {
        this.container = container;
        this.trackEditorRenderService.initialize(this.container, this.track);
        this.track = new Track();
        this.dragDropActive = false;
        this.track.isClosed = false;
        this.constraints = new Constraints();
    }

    public getTrack(): Track {
        return this.track;
    }

    public addWaypoints(waypoints: Waypoint[]): void {
        waypoints.forEach((waypoint) => {
            waypoint.setPositionZ(POINTS_POSITION_Z);
            this.track.addWaypoint(waypoint);
        });
        this.trackEditorRenderService.circleHandler.generateCircles(waypoints);
        if (this.track.getTrackSize() > 1) {
            if (waypoints.length === 1)
                waypoints.unshift(this.track.getPreviousToLastWaypoint());
            this.trackEditorRenderService.planeHandler.generatePlanes(waypoints);
            this.constraints.addRoads(waypoints);
            this.updateValidityOfTrack();
        }
      }

    public moveWaypoint(circleId: number, newPos: THREE.Vector3): void {
        const waypoint: Waypoint = this.track.getWaypoint(circleId);
        waypoint.setPosition(newPos);
        this.trackEditorRenderService.circleHandler.moveCircle(circleId, newPos);
        this.trackEditorRenderService.planeHandler.movedWaypoint(waypoint, newPos);
        this.constraints.movedWaypoint(waypoint, newPos);
        this.updateValidityOfTrack();
    }

    public removeWaypoint(): void {
        if (this.track.getTrackSize() > 0) {
            const waypoint: Waypoint = this.track.removeWaypoint();
            this.trackEditorRenderService.circleHandler.removeCircle(waypoint.getCircleId());
            if (this.track.getTrackSize() > 0) {
                const planeId: number = waypoint.getIncomingPlaneId();
                this.trackEditorRenderService.planeHandler.removePlane(planeId);
                this.constraints.removeRoad(planeId);
                this.track.getWaypointBindedToPlane(planeId).unbindOutgoingPlane();
            }
            this.updateValidityOfTrack();
        }
    }

    public isTrackClosable(): boolean {
        return !this.track.isClosed
               && this.track.isFirstWaypoint(this.selectedWaypoint.getCircleId())
               && this.track.getTrackSize() >= NB_MIN_WAYPOINTS_FOR_POLYGON
               && (this.selectedWaypoint.getPosition().distanceTo(this.selectedWaypointInitialPos) <= MIN_MOVEMENT_TRESHOLD);
    }

    public closeTrack(): void {
        const waypoints: Waypoint[] = [this.track.getLastWaypoint(), this.track.getFirstWaypoint()];
        this.trackEditorRenderService.planeHandler.generatePlanes(waypoints);
        this.constraints.addRoads(waypoints);
        this.constraints.closeRoad();
        this.updateValidityOfTrack();
        this.track.isClosed = true;
    }

    public uncloseTrack(): void {
        const lastPlaneId: number = this.track.getLastWaypoint().getOutgoingPlaneId();
        this.trackEditorRenderService.planeHandler.removePlane(lastPlaneId);

        this.track.getFirstWaypoint().unbindIncomingPlane();
        this.track.getLastWaypoint().unbindOutgoingPlane();

        this.track.isClosed = false;
    }

    public handleRightMouseDown(event: MouseEvent): void {
        if (this.track.isClosed) {
            this.uncloseTrack();
            this.track.isClosed = false;
        } else {
            this.removeWaypoint();
        }
    }


    public handleLeftMouseDown(event: MouseEvent): void {
        const objectsSelected: THREE.Intersection[] = this.trackEditorRenderService.getObjectsPointedByMouse(event);
        if (objectsSelected.length > 0) {
            const firstObjectName: string = objectsSelected[0].object.name;
            if (firstObjectName === "point") {
                    this.selectedWaypoint = this.track.getWaypoint(objectsSelected[0].object.id);
                    if (this.selectedWaypoint != null) {
                        this.selectedWaypointInitialPos = this.selectedWaypoint.getPosition();
                        this.dragDropActive = true;
                    }
            } else if (!this.track.isClosed && firstObjectName === "backgroundPlane")  {
                const newWaypoint: Waypoint[] = [new Waypoint(objectsSelected[0].point)];
                this.addWaypoints(newWaypoint);
            }
        }
    }

    public handleLeftMouseUp(event: MouseEvent): void {
        if (this.selectedWaypoint != null && this.isTrackClosable()) {
            this.track.isClosed = true;
            this.closeTrack();
        }
        this.selectedWaypoint = null;
        this.dragDropActive = false;
    }

    public handleMouseMove(event: MouseEvent): void {
        if (this.dragDropActive) {
            this.trackEditorRenderService.updateRaycastMousePos(event);
            const backgroundPlaneSelected: THREE.Intersection[] = this.trackEditorRenderService.getBackgroundPlaneWithRaycast();
            event.stopPropagation();
            backgroundPlaneSelected[0].point.z = POINTS_POSITION_Z;
            this.trackEditorRenderService.updateRaycastMousePos(event);
            this.moveWaypoint(this.selectedWaypoint.getCircleId(), backgroundPlaneSelected[0].point);
        }
    }
    // tslint:disable:no-console
    private updateValidityOfTrack(): void {
        const invalidsPlanesId: ConstraintsError[] = this.getInvalidPlanesId();
        console.log(invalidsPlanesId);
        if (invalidsPlanesId.length === 0) {
            this.track.isValid = true;
        }
        else {
            this.track.isValid = false;
            // TO DO : MODIFY TEXTURES
        }

        console.log(this.track);
    }

    private getInvalidPlanesId(): ConstraintsError[] {
        this.constraints.updateInvalidPlanes();

        return this.constraints.invalidPlanesErrors;
    }

}

