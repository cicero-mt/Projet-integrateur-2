import {Waypoint} from "../trackData/waypoint";
import * as THREE from "three";

export class CircleHandler {
    
    private circleGeometry : THREE.Geometry[] = [];

    private material : THREE.MeshBasicMaterial;

    private materialFirstCircle : THREE.MeshBasicMaterial;

    private meshs : THREE.Mesh[] = [];

    constructor(private scene: THREE.Scene) { }

    //TODO : on peut delete c.était pour des tests
    public getCircleGeometry(): THREE.Geometry[] {
        return this.circleGeometry;
    }

    public generateCircle(waypoint : Waypoint){
        this.generateCircleGeometry();
        this.material = this.getCircleMaterial();
        this.materialFirstCircle = this.getFirstCircleMaterial();
    
        let mesh = new THREE.Mesh;
        mesh.geometry = this.circleGeometry[this.circleGeometry.length - 1];

        if ( this.circleGeometry[this.circleGeometry.length - 1] === this.circleGeometry[0]) {
            mesh.material = this.materialFirstCircle;
        } 
        else {
            mesh.material = this.material;
        }

        this.meshs.push(mesh);
        mesh.name = "point";
        this.scene.add(mesh);
        this.bindMesh(mesh, waypoint);
    }

    public removeCircle(meshId : number){
        let meshToRemove : THREE.Mesh = this.findMesh(meshId);
        this.scene.remove(meshToRemove);
        let index : number = this.meshs.indexOf(meshToRemove);//no need to verify !=-1
        this.meshs.splice(index, 1);    
        this.circleGeometry.pop();
    }

    public moveCircle(id : number, newPosition : THREE.Vector3){
        let mesh : THREE.Mesh = this.findMesh(id);
        let relativeMovement : THREE.Vector3 = newPosition.sub(mesh.position);
        mesh.translateX(relativeMovement.x);
        mesh.translateY(relativeMovement.y);
        mesh.translateZ(relativeMovement.z);
    }

    private findMesh(id : number): THREE.Mesh{
        let mesh : THREE.Mesh = null;
        this.meshs.forEach((element)=> {
            if(element.id === id)
                mesh = element;
        });
        return mesh;
    }

    private bindMesh(mesh: THREE.Mesh, waypoint : Waypoint){
        waypoint.unbindCircle();
        waypoint.bindCircle(mesh.id);
        mesh.translateX(waypoint.getPosition().x);
        mesh.translateY(waypoint.getPosition().y);
        mesh.translateZ(waypoint.getPosition().z);
    }

    private generateCircleGeometry(): void {
        let circleGeometry  : THREE.Geometry = new THREE.CircleGeometry(15,300);
        this.circleGeometry.push(circleGeometry);          
    }
  
    private getCircleMaterial(): THREE.MeshBasicMaterial{
      return new THREE.MeshBasicMaterial( { color: 0xA8A8A8} );
    }
        
    private getFirstCircleMaterial(): THREE.MeshBasicMaterial{
      return new THREE.MeshBasicMaterial( { color: 0x000000} );
    }

}