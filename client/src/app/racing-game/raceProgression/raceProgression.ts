import * as THREE from "three";
import { Subject } from "rxjs/Subject";
import { MAX_N_LAPS } from "../constants";

const WAYPOINT_RADIUS: number = 10;

export class RaceProgression {
    private _nLap: number;
    private _lapDone$: Subject<void>;
    private _nextWaypointIndex: number;
    private _lastWaypointIndex: number;
    private _nextWaypointPosition: THREE.Vector3;
    private _lastWaypointPosition: THREE.Vector3;

    public constructor(private _carPosition: THREE.Vector3,
                       private _waypoints: [number, number, number][]) {
        this._nLap = -1;
        this._nextWaypointIndex = 0;
        this._lastWaypointIndex = this._waypoints.length - 1;

        this._nextWaypointPosition = new THREE.Vector3(
            this._waypoints[this._nextWaypointIndex][0],
            0, // tslint:disable-next-line:no-magic-numbers
            this._waypoints[this._nextWaypointIndex][2]
        );

        this._lastWaypointPosition = new THREE.Vector3(
            this._waypoints[this._waypoints.length - 1][0],
            0, // tslint:disable-next-line:no-magic-numbers
            this._waypoints[this._waypoints.length - 1][2]
        );
        this._lapDone$ = new Subject();
    }

    public get nLap(): number {
        return this._nLap;
    }

    public get remainingNLap(): number {
        return MAX_N_LAPS - this._nLap;
    }

    public get lapDone$(): Subject<void> {
        return this._lapDone$;
    }

    public get nextWaypointIndex(): number {
        return this._nextWaypointIndex;
    }

    public get nextWaypointPosition(): THREE.Vector3 {
        return this._nextWaypointPosition;
    }

    public get lastWaypointPosition(): THREE.Vector3 {
        return this._lastWaypointPosition;
    }

    public update(): void {
        if (this.distanceToNextWaypoint() < WAYPOINT_RADIUS) {
            this.updateNLap();
            this.incrementNextWaypointPosition();
        }
    }


    public distanceToNextWaypoint(): number {
        return this._carPosition.distanceTo(this._nextWaypointPosition);
    }

    public getCurrentTrackSegment(): THREE.Vector3 {
        return new THREE.Vector3().subVectors(this._nextWaypointPosition, this._lastWaypointPosition);
    }

    // tslint:disable:no-magic-numbers
    private incrementNextWaypointPosition(): void {
        this.incrementNextWaypointIndex();
        this.reassignNextWaypointIndex();
    }

    private incrementNextWaypointIndex(): void {
        this._lastWaypointIndex = (this._lastWaypointIndex + 1) % this._waypoints.length;
        this._nextWaypointIndex = (this._nextWaypointIndex + 1) % this._waypoints.length;

    }

    private reassignNextWaypointIndex(): void {
        this._nextWaypointPosition.set(
            this._waypoints[this._nextWaypointIndex][0],
            0,
            this._waypoints[this._nextWaypointIndex][2]
        );
        this._lastWaypointPosition.set(
            this._waypoints[this._lastWaypointIndex][0],
            0,
            this._waypoints[this._lastWaypointIndex][2]
        );
    }

    private updateNLap(): void {
        if (this._nextWaypointIndex === 0 && this._lastWaypointIndex === (this._waypoints.length - 1)) {
            this._nLap++;
            this._lapDone$.next();
        }
    }
}
