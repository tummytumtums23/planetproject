import * as THREE from 'three';
import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SaturnService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.DirectionalLight;
  private vectoraxis: THREE.Vector3;

  private sphere: THREE.Mesh;
  private stars: THREE.Mesh;
  private clouds: THREE.Mesh;
  private rings: THREE.Mesh;

  private frameId: number = null;

  public constructor(private ngZone: NgZone) {}

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45, window.innerWidth / window.innerHeight, 0.01, 1000
    );
    this.camera.position.z = 3;
    this.scene.add(this.camera);
    // soft white light
      this.scene.add(new THREE.AmbientLight(0x333333));

    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(5,3,5);
    this.scene.add(this.light);
    var radius   = 0.5,
    segments = 32,
    rotation = 6,  
     counter = 0,
    angle = Math.PI * (Math.sin(counter) + 1.01) / 2, // avoid negatives
   increase = Math.PI / 100;
   counter += increase;
 
  this.vectoraxis = new THREE.Vector3( 0.5003, 0.5003, 0 );

     this.sphere = this.createSphere(radius, segments);
     this.sphere.rotateZ(THREE.MathUtils.degToRad(-26));
     this.sphere.rotation.y = rotation; 
  /* this.sphere.rotateOnWorldAxis(this.vectoraxis, 45);*/
     this.scene.add(this.sphere);
     this.rings = this.createRings(radius, segments, angle);
     this.rings.rotation.z = rotation;
     this.rings.rotateX(THREE.MathUtils.degToRad(-85));
     //this.rings.rotateZ(THREE.MathUtils.degToRad(35));
     this.scene.add(this.rings);
     this.clouds = this.createClouds(radius, segments);
     this.clouds.rotation.y = rotation;
    // this.scene.add(this.clouds);

     this.stars = this.createStars(90, 64);
      this.scene.add(this.stars);

//mesh.geometry.vertices = this.rings.vertices;
    /*const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh( geometry, material );
    this.scene.add(this.cube);*/

  }


    public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });
 
    this.sphere.rotation.y += 0.0005;
    this.clouds.rotation.y += 0.0005;  
    this.rings.rotation.z += 0.0005;
    /*this.sphere.rotateOnWorldAxis(this.vectoraxis, 45);*/

    //this.cube.rotation.x += 0.01;
   // this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  
  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }


  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( width, height );
  }

    createSphere(radius, segments) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, segments),
      new THREE.MeshPhongMaterial({
        map:         THREE.ImageUtils.loadTexture('assets/images/saturnmap.jpg'),
        /*bumpMap:     THREE.ImageUtils.loadTexture('assets/images/elev_bump_4k.jpg'),
        bumpScale:   0.005,
        specularMap: THREE.ImageUtils.loadTexture('assets/images/water_4k.png'),*/
        specular:    new THREE.Color('grey')              
      })
    );
  }

 createClouds(radius, segments) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius + 0.003, segments, segments),      
      new THREE.MeshPhongMaterial({
        map:         THREE.ImageUtils.loadTexture('assets/images/fair_clouds_4k.png'),
        transparent: true
      })
    );    
  }

  createRings(radius, segments, angle) {
    return new THREE.Mesh(
      new THREE.RingGeometry(radius+0.056, radius+0.663, segments-2, segments-26),
      new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('assets/images/saturnringcolor1.jpg'),
        specularMap: THREE.ImageUtils.loadTexture('assets/images/saturnringpattern.jpg'),
        specular: new THREE.Color('grey')
      })
     );
  }    

  createStars(radius, segments) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, segments), 
      new THREE.MeshBasicMaterial({
        map:  THREE.ImageUtils.loadTexture('assets/images/galaxy_starfield.png'), 
        side: THREE.BackSide
      })
    );
  }
 /*public adjustRingGeometry(geom) {
  const twopi = 2 * Math.PI;
  const iVer = Math.max(2, geom.gridY);
  for (let i = 0; i < iVer + 1; i++) {
    const fRad1 = i / iVer,
      fRad2 = (i + 1) / iVer,
      fX1 = geom.innerRadius * Math.cos(fRad1 * twopi),
      fY1 = geom.innerRadius * Math.sin(fRad1 * twopi),
      fX2 = geom.outerRadius * Math.cos(fRad1 * twopi),
      fY2 = geom.outerRadius * Math.sin(fRad1 * twopi),
      fX4 = geom.innerRadius * Math.cos(fRad2 * twopi),
      fY4 = geom.innerRadius * Math.sin(fRad2 * twopi),
      fX3 = geom.outerRadius * Math.cos(fRad2 * twopi),
      fY3 = geom.outerRadius * Math.sin(fRad2 * twopi),
      v1 = new THREE.Vector3(fX1, fY1, 0),
      v2 = new THREE.Vector3(fX2, fY2, 0),
      v3 = new THREE.Vector3(fX3, fY3, 0),
      v4 = new THREE.Vector3(fX4, fY4, 0);
    geom.vertices.push(new THREE.v(v1));
    geom.vertices.push(new THREE.Vertex(v2));
    geom.vertices.push(new THREE.Vertex(v3));
    geom.vertices.push(new THREE.Vertex(v4));
  }
  for (let i = 0; i < iVer + 1; i++) {
    geom.faces.push(new THREE.Face3(i * 4, i * 4 + 1, i * 4 + 2));
    geom.faces.push(new THREE.Face3(i * 4, i * 4 + 2, i * 4 + 3));
    geom.faceVertexUvs[0].push([
      new THREE.UV(0, 1),
      new THREE.UV(1, 1),
      new THREE.UV(1, 0)
    ]);
    geom.faceVertexUvs[0].push([
      new THREE.UV(0, 1),
      new THREE.UV(1, 0),
      new THREE.UV(0, 0)
    ]);
  }
  geom.computeFaceNormals();
  geom.boundingSphere = {
    radius: geom.outerRadius
  };
}
*/
}

