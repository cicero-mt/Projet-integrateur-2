import { Road } from "./road";
import * as THREE from "three";
import { Waypoint } from "../../track/trackData/waypoint";
import { ConstraintsError } from "./constraintsErrors/constraintsError";
import { IntersectionError } from "./constraintsErrors/intersectionError";
import { InvalidAngleError } from "./constraintsErrors/invalidAngleError";
import { SizeError } from "./constraintsErrors/sizeError";

export class Constraints {

    private _invalidPlanesErrors: ConstraintsError[];

    private _previousInvalidPlanesErrors: ConstraintsError[];

    private roads: Road[];

    public constructor () {
        this.roads = [];
        this._invalidPlanesErrors = [];
        this._previousInvalidPlanesErrors = [];
    }

    public addRoads(waypoints: Waypoint[]): void {
        let previousRoad: Road = this.roads[this.roads.length - 1];
        for (let i: number = 0; i < waypoints.length - 1; i++) {
            const road: Road = new Road(waypoints[i].position, waypoints[i + 1].position,
                                        waypoints[i].getOutgoingPlaneId(), previousRoad);
            road.initialize();
            this.roads.push(road);
            previousRoad = road;

        }
    }

    public closeRoad(): void {
        this.roads[0].previousRoad = this.roads[this.roads.length - 1];
    }

    public get newInvalidPlanesErrors(): ConstraintsError[] {
        return this.invalidPlanesErrors.filter(
            (newError) =>  {
                let isNew: boolean = true;
                this._previousInvalidPlanesErrors.forEach((previousError) => {
                    if (newError.planeId === previousError.planeId)
                        isNew = false;
                });

                return isNew;
            });    }

    public get newValidPlanes(): ConstraintsError[] {
        return this._previousInvalidPlanesErrors.filter(
            (previousError) =>  {
                let isNew: boolean = true;
                this._invalidPlanesErrors.forEach((newError) => {
                    if (newError.planeId === previousError.planeId)
                        isNew = false;
                });

                return isNew;
            });
    }

    public get invalidPlanesErrors(): ConstraintsError[] {
        return this._invalidPlanesErrors;
    }

    public removeRoad(roadId: number): void {
        const index: number = this.findRoadIndex(roadId);
        this.roads.splice(index, 1);
    }

    public movedWaypoint(waypoint: Waypoint, newPos: THREE.Vector3): void {
        const firstRoad: Road = this.getRoad(waypoint.getIncomingPlaneId());
        const secondRoad: Road = this.getRoad(waypoint.getOutgoingPlaneId());

        if (this.isDefined(firstRoad)) {
            firstRoad.endPoint = waypoint.position;
            firstRoad.initialize();
        }
        if (this.isDefined(secondRoad)) {
            secondRoad.beginPoint = waypoint.position;
            secondRoad.initialize();
        }
    }

    public updateInvalidPlanes(): void {
        this._previousInvalidPlanesErrors = this._invalidPlanesErrors;
        this._invalidPlanesErrors = [];
        this.roads.forEach((road) => {
            road.initialize();
            this.validityCheck(road);
        });
    }

    private validityCheck(road: Road): void {

        if (!road.hasValidAngle() ) {
            this._invalidPlanesErrors.push(new InvalidAngleError( road.id ));
            this._invalidPlanesErrors.push(new InvalidAngleError( road.previousRoad.id ));
        }
        if (!road.hasValidWidthHeightRatio()) {
            this._invalidPlanesErrors.push(new SizeError(road.id));
        }
        this.roads.forEach((element) => {
            if (element.intersects(road)) {
                this._invalidPlanesErrors.push(new IntersectionError(road.id));
            }
        });
    }

    private findRoadIndex(id: number): number {
        let index: number = null;
        this.roads.forEach((element, i) => {
            if (element.id === id)
                index = i;
        });

        return index;
    }

    private getRoad(id: number): Road {
        let road: Road = null;
        if (this.isDefined(id))
            road = this.roads[this.findRoadIndex(id)];

        return road;
    }

    /*tslint:disable:no-any*/
    private isDefined(object: any): boolean {
        return ((object !== null) && (object !== undefined));
    }/*tslint:enable:no-any*/
}

