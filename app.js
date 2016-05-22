'user strict';
var Game;
(function (Game) {
    class Globals {
    }
    Globals.DEBUG = true;
    Game.Globals = Globals;
})(Game || (Game = {}));
function start() {
    let game = new Phaser.Game(1280, 720, Phaser.AUTO, 'body', null, true);
    game.state.add('Boot', Scenes.BootScene);
    game.state.add('Menu', Scenes.MenuScene);
    game.state.add('Game Preload', Scenes.GamePreloadScene);
    game.state.add('Game', Scenes.GameScene);
    game.state.start('Boot');
}
if (window.cordova) {
    document.addEventListener("deviceready", () => {
        start();
    }, false);
}
else {
    setTimeout(() => {
        start();
    }, 1000);
}
'user strict';
var Objects;
(function (Objects) {
    class Camera extends THREE.Object3D {
        constructor() {
            super();
            this._camera = new THREE.PerspectiveCamera(60, 0 / 0, 0.1, 100);
            this.add(this._camera);
            window.addEventListener('resize', this.onWindowResize.bind(this), false);
            document.addEventListener("mousemove", this.onMouseMove.bind(this), false);
            document.addEventListener("mousedown", this.onMouseDown.bind(this), false);
            document.addEventListener("mouseup", this.onMouseUp.bind(this), false);
            document.addEventListener("touchstart", this.onTouchStart.bind(this), false);
            document.addEventListener("touchend", this.onTouchEnd.bind(this), false);
            document.addEventListener("touchcancel", this.onTouchCancel.bind(this), false);
            document.addEventListener("touchleave", this.onTouchLeave.bind(this), false);
            document.addEventListener("touchmove", this.onTouchMove.bind(this), false);
            this.onWindowResize(null);
        }
        destroy() {
            document.removeEventListener("mousemove", this.onMouseMove.bind(this), false);
            document.removeEventListener("mousedown", this.onMouseDown.bind(this), false);
            document.removeEventListener("mouseup", this.onMouseUp.bind(this), false);
            document.removeEventListener("touchstart", this.onTouchStart.bind(this), false);
            document.removeEventListener("touchend", this.onTouchEnd.bind(this), false);
            document.removeEventListener("touchcancel", this.onTouchCancel.bind(this), false);
            document.removeEventListener("touchleave", this.onTouchLeave.bind(this), false);
            document.removeEventListener("touchmove", this.onTouchMove.bind(this), false);
        }
        render(three, scene) {
            three.render(scene, this._camera);
        }
        onWindowResize(event) {
            this._camera.aspect = window.innerWidth / window.innerHeight;
            this._camera.updateProjectionMatrix();
        }
    }
    Objects.Camera = Camera;
})(Objects || (Objects = {}));
'user strict';
var Objects;
(function (Objects) {
    class OrbitCamera extends Objects.Camera {
        constructor() {
            super();
            this._rot = new THREE.Euler(-Math.PI / 4, -Math.PI / 2, 0, 'YXZ');
            this._distance = 3;
            this._lastX = 0;
            this._lastY = 0;
            this._eventStart = 0;
            this._isCameraRotating = false;
            this._mouse = new THREE.Vector2();
            this._isEventDown = false;
            this._threeInputEnabled = true;
            window.addEventListener('resize', this.onWindowResize.bind(this), false);
            document.addEventListener("mousemove", this.onMouseMove.bind(this), false);
            document.addEventListener("mousedown", this.onMouseDown.bind(this), false);
            document.addEventListener("mouseup", this.onMouseUp.bind(this), false);
            document.addEventListener("touchstart", this.onTouchStart.bind(this), false);
            document.addEventListener("touchend", this.onTouchEnd.bind(this), false);
            document.addEventListener("touchcancel", this.onTouchCancel.bind(this), false);
            document.addEventListener("touchleave", this.onTouchLeave.bind(this), false);
            document.addEventListener("touchmove", this.onTouchMove.bind(this), false);
            this.onWindowResize(null);
        }
        destroy() {
        }
        update(delta) {
            this._camera.position.set(0, 0, 0);
            this._camera.setRotationFromEuler(this._rot);
            this._camera.translateOnAxis(new THREE.Vector3(0, 0, 1), this._distance);
            this._camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
        render(three, scene) {
            three.render(scene, this._camera);
        }
        onWindowResize(event) {
            this._camera.aspect = window.innerWidth / window.innerHeight;
            this._camera.updateProjectionMatrix();
        }
        onMouseMove(event) {
            this.onEventMove(this._lastX - event.clientX, this._lastY - event.clientY);
            this._lastX = event.clientX;
            this._lastY = event.clientY;
        }
        onTouchMove(event) {
            this.onEventMove(this._lastX - event.changedTouches[0].clientX, this._lastY - event.changedTouches[0].clientY);
            this._lastX = event.changedTouches[0].clientX;
            this._lastY = event.changedTouches[0].clientY;
        }
        onEventMove(dx, dy) {
            if (!this._threeInputEnabled)
                return;
            if (this._isEventDown) {
                if (Date.now() - this._eventStart > OrbitCamera.INPUT_THRESOLD) {
                    this._isCameraRotating = true;
                    dx = dx * (Math.PI / 180);
                    dy = dy * (Math.PI / 180);
                    this._rot.y += dx;
                    this._rot.z = 0;
                    if (this._rot.x + dy < OrbitCamera.MIN_X_ANGLE && this._rot.x + dy > OrbitCamera.MAX_X_ANGLE) {
                        this._rot.x += dy;
                    }
                }
            }
            event.preventDefault();
        }
        onMouseDown(event) {
            this._isEventDown = true;
            this._eventStart = event.timeStamp;
            this._lastX = event.clientX;
            this._lastY = event.clientY;
            this.onEventStart(event.clientX, event.clientY);
        }
        onTouchStart(event) {
            this._isEventDown = true;
            this._eventStart = event.timeStamp;
            this._lastX = event.changedTouches[0].clientX;
            this._lastY = event.changedTouches[0].clientY;
            this.onEventStart(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        }
        onEventStart(posX, posY) {
            if (!this._threeInputEnabled)
                return;
            this._lastX = posX;
            this._lastY = posY;
            this._mouse.x = (posX / window.innerWidth) * 2 - 1;
            this._mouse.y = -(posY / window.innerHeight) * 2 + 1;
            event.preventDefault();
        }
        onMouseUp(event) {
            this._isEventDown = false;
            this.onEventEnd(event.clientX, event.clientY);
        }
        onTouchEnd(event) {
            this._isEventDown = false;
            this.onEventEnd(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        }
        onEventEnd(posX, posY) {
            if (!this._threeInputEnabled)
                return;
            this._eventStart = 0;
            this._lastX = 0;
            this._lastY = 0;
            event.preventDefault();
        }
        onTouchCancel(event) {
            this._isEventDown = false;
            event.preventDefault();
        }
        onTouchLeave(event) {
            this._isEventDown = false;
            event.preventDefault();
        }
    }
    OrbitCamera.INPUT_THRESOLD = 100;
    OrbitCamera.MAX_X_ANGLE = -Math.PI / 2;
    OrbitCamera.MIN_X_ANGLE = -Math.PI / 9;
    Objects.OrbitCamera = OrbitCamera;
})(Objects || (Objects = {}));
'user strict';
var Objects;
(function (Objects) {
    class PlayerCamera extends Objects.Camera {
        constructor(target) {
            super();
            this._target = target;
            this._target.add(this);
            if (Game.Globals.DEBUG) {
                let geometry = new THREE.CubeGeometry(0.3, 0.1, 0.1);
                let material = new THREE.MeshBasicMaterial({
                    color: 0x00ff00
                });
                this._debugMesh = new THREE.Mesh(geometry, material);
                this.add(this._debugMesh);
            }
            this.position.set(0, 0.5, -0.5);
            this.lookAt(new THREE.Vector3(0, 0, 0));
            this.rotateOnAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(180));
            this.rotateOnAxis(new THREE.Vector3(0, 0, 1), THREE.Math.degToRad(180));
        }
        update(delta) {
        }
        onMouseMove(event) {
            event.preventDefault();
        }
        onTouchMove(event) {
            event.preventDefault();
        }
        onEventMove(dx, dy) {
        }
        onMouseDown(event) {
            event.preventDefault();
        }
        onTouchStart(event) {
            event.preventDefault();
        }
        onEventStart(posX, posY) {
        }
        onMouseUp(event) {
            event.preventDefault();
        }
        onTouchEnd(event) {
            event.preventDefault();
        }
        onEventEnd(posX, posY) {
            event.preventDefault();
        }
        onTouchCancel(event) {
            event.preventDefault();
        }
        onTouchLeave(event) {
            event.preventDefault();
        }
    }
    Objects.PlayerCamera = PlayerCamera;
})(Objects || (Objects = {}));
'user strict';
var Objects;
(function (Objects) {
    class Path extends THREE.Object3D {
        constructor(data) {
            super();
            this.getCurrent = () => {
                return this._vertices[this._current];
            };
            this.setCurrent = (current) => {
                this._previous = this._current;
                this._current = current.index;
            };
            this.getStart = () => {
                return this._vertices[this._start];
            };
            this.getEnd = () => {
                return this._vertices[this._end];
            };
            this.get = (index) => {
                return this._vertices[index];
            };
            this.getInmediateNext = (direction, front) => {
                for (let i = 0; i < this._edges.length; i++) {
                    if (this._edges[i].vertices.a === this._current) {
                        return this._vertices[this._edges[i].vertices.b];
                    }
                }
                return null;
            };
            this.getNext = (direction, position, front, up) => {
                let next = null;
                for (let i = 0; i < this._edges.length; i++) {
                    if (Game.Globals.DEBUG) {
                        let material = this._debugEdges[i].material;
                        material.color.setHex(0xff0000);
                    }
                }
                let aperture = THREE.Math.degToRad(90);
                let apex = position.clone();
                if (Game.Globals.DEBUG) {
                    console.log("Current: " + this._current);
                    for (let i = 0; i < this._edges.length; i++) {
                        if (this._edges[i].vertices.b === this._current) {
                            console.log("Option: (" + this._edges[i].vertices.a + ", " + this._edges[i].vertices.b + ")");
                        }
                        else if (this._edges[i].vertices.a === this._current) {
                            console.log("Option: (" + this._edges[i].vertices.a + ", " + this._edges[i].vertices.b + ")");
                        }
                    }
                }
                for (let i = 0; i < this._edges.length; i++) {
                    let waypoint;
                    if (this._edges[i].vertices.b === this._current) {
                        waypoint = this._vertices[this._edges[i].vertices.a];
                    }
                    else if (this._edges[i].vertices.a === this._current) {
                        waypoint = this._vertices[this._edges[i].vertices.b];
                    }
                    if (waypoint) {
                        let vertex = waypoint.position;
                        let base = position.clone().add(front);
                        base.cross(front);
                        if (Game.Globals.DEBUG) {
                            let coneGeometry = this._debugCone.geometry;
                            coneGeometry.vertices[0] = apex;
                            coneGeometry.vertices[1] = base;
                            coneGeometry.verticesNeedUpdate = true;
                        }
                        if (this.isLyingInCone(vertex, apex, base, aperture)) {
                            if (Game.Globals.DEBUG)
                                console.log("Special Next: " + waypoint.index);
                            return waypoint;
                        }
                    }
                }
                for (let i = 0; i < this._edges.length; i++) {
                    let waypoint;
                    if (this._edges[i].vertices.b === this._current) {
                        waypoint = this._vertices[this._edges[i].vertices.a];
                    }
                    else if (this._edges[i].vertices.a === this._current) {
                        waypoint = this._vertices[this._edges[i].vertices.b];
                    }
                    let base = position.clone().add(front);
                    if (Game.Globals.DEBUG) {
                        let coneGeometry = this._debugCone.geometry;
                        coneGeometry.vertices[0] = apex;
                        coneGeometry.vertices[1] = base;
                        coneGeometry.verticesNeedUpdate = true;
                    }
                    if (waypoint) {
                        let vertex = waypoint.position;
                        if (this.isLyingInCone(vertex, apex, base, aperture)) {
                            if (Game.Globals.DEBUG)
                                console.log("Next: " + waypoint.index);
                            return waypoint;
                        }
                    }
                }
            };
            this.isLyingInCone = (vertex, apex, base, aperture) => {
                let halfAperture = aperture / 2;
                let apexToXVect = apex.clone().sub(vertex);
                let axisVect = apex.clone().sub(base);
                let isInInfiniteCone = apexToXVect.dot(axisVect) / apexToXVect.length() / axisVect.length() > Math.cos(halfAperture);
                if (!isInInfiniteCone)
                    return false;
                let isUnderRoundCap = apexToXVect.dot(axisVect) / axisVect.length() < axisVect.length();
                return isUnderRoundCap;
            };
            this._vertices = [];
            this._debugVertices = [];
            this._edges = [];
            this._debugEdges = [];
            for (let i = 0; i < data.vertices.length; i++) {
                let vertex = {
                    index: i,
                    position: new THREE.Vector3(data.vertices[i].position.x, data.vertices[i].position.y, data.vertices[i].position.z),
                    properties: data.vertices[i].properties
                };
                if (vertex.properties) {
                    for (let j = 0; j < vertex.properties.length; j++) {
                        if (vertex.properties[j] === Path.START) {
                            this._start = i;
                            this._current = i;
                        }
                        else if (vertex.properties[j] === Path.END) {
                            this._end = i;
                        }
                    }
                }
                if (Game.Globals.DEBUG) {
                    let geometry = new THREE.SphereGeometry(0.025, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
                    let material = new THREE.MeshBasicMaterial({
                        color: 0x0000ff
                    });
                    let sphere = new THREE.Mesh(geometry, material);
                    sphere.position.set(vertex.position.x, vertex.position.y, vertex.position.z);
                    this.add(sphere);
                    this._debugVertices[i] = sphere;
                }
                this._previous = this._current;
                this._vertices[i] = vertex;
            }
            for (let i = 0; i < data.edges.length; i++) {
                let edge = {
                    vertices: {
                        a: data.edges[i][0],
                        b: data.edges[i][1]
                    }
                };
                if (Game.Globals.DEBUG) {
                    let geometry = new THREE.Geometry();
                    geometry.vertices.push(this._vertices[edge.vertices.a].position, this._vertices[edge.vertices.b].position);
                    let material = new THREE.LineBasicMaterial({
                        color: 0xff0000
                    });
                    let line = new THREE.Line(geometry, material);
                    this.add(line);
                    this._debugEdges[i] = line;
                }
                this._edges[i] = edge;
            }
            if (Game.Globals.DEBUG) {
                let coneGeometry = new THREE.Geometry();
                coneGeometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));
                let coneMaterial = new THREE.LineBasicMaterial({
                    color: 0x00ff00
                });
                this._debugCone = new THREE.Line(coneGeometry, coneMaterial);
                this.add(this._debugCone);
            }
        }
    }
    Path.START = "start";
    Path.END = "end";
    Objects.Path = Path;
})(Objects || (Objects = {}));
'user strict';
var Objects;
(function (Objects) {
    class Player extends THREE.Object3D {
        constructor(path) {
            super();
            this.update = (delta) => {
                let timeSinceStarted = new Date().getTime() - this._startTime;
                let distanceCovered = timeSinceStarted * 0.0005;
                var percentageCompleted = distanceCovered / this._remainingLength;
                this._frontVector = this._nextWayPoint.position.clone().sub(this.position).normalize();
                this._upVector = this.position.clone().normalize();
                this.lookAt(this.position.clone().add(this._previousFrontVector.lerp(this._frontVector, percentageCompleted * 0.3)));
                this.up.set(this._upVector.x, this._upVector.y, this._upVector.z);
                if (Game.Globals.DEBUG) {
                    let frontGeometry = this._front.geometry;
                    frontGeometry.vertices[0] = this.worldToLocal(this.position.clone());
                    frontGeometry.vertices[1] = this.worldToLocal(this._nextWayPoint.position.clone());
                    frontGeometry.verticesNeedUpdate = true;
                    let upGeometry = this._up.geometry;
                    upGeometry.vertices[0] = this.worldToLocal(this.position.clone());
                    upGeometry.vertices[1] = this.worldToLocal(this.position.clone().multiplyScalar(1.5));
                    upGeometry.verticesNeedUpdate = true;
                }
                if (percentageCompleted < 1.0) {
                    let position = this._startPosition.clone().lerp(this._nextWayPoint.position, percentageCompleted);
                    this.position.set(position.x, position.y, position.z);
                }
                else {
                    this._path.setCurrent(this._nextWayPoint);
                    let next = this._path.getNext(Utils.Direction.FRONT, this.position, this._frontVector, this._upVector);
                    if (next) {
                        this._remainingLength = next.position.clone().sub(this._path.getCurrent().position).length();
                        this._startTime = new Date().getTime();
                        this._startPosition = this._nextWayPoint.position.clone();
                        this._previousWayPoint = this._nextWayPoint;
                        this._nextWayPoint = next;
                    }
                }
            };
            this.getFront = () => {
                return this._frontVector;
            };
            this.getUp = () => {
                return this._upVector;
            };
            this._direction = Utils.Direction.FRONT;
            this._path = path;
            let geometry = new THREE.CubeGeometry(0.1, 0.1, 0.1);
            let material = new THREE.MeshBasicMaterial({
                color: 0xff0000
            });
            this._mesh = new THREE.Mesh(geometry, material);
            this.add(this._mesh);
            let startWayPoint = this._path.getStart();
            this.position.set(startWayPoint.position.x, startWayPoint.position.y, startWayPoint.position.z);
            this._previousWayPoint = this._path.getInmediateNext();
            this._nextWayPoint = this._path.getInmediateNext();
            this._remainingLength = this._nextWayPoint.position.clone().sub(this.position).length();
            this._startTime = new Date().getTime();
            this._startPosition = this.position.clone();
            this._frontVector = this.position.clone().sub(this._nextWayPoint.position).normalize();
            this._previousFrontVector = this._frontVector;
            this._upVector = this.position.clone().normalize();
            if (Game.Globals.DEBUG) {
                let frontGeometry = new THREE.Geometry();
                frontGeometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));
                let frontMaterial = new THREE.LineBasicMaterial({
                    color: 0xffff00
                });
                this._front = new THREE.Line(frontGeometry, frontMaterial);
                this.add(this._front);
                let upGeometry = new THREE.Geometry();
                upGeometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));
                let upMaterial = new THREE.LineBasicMaterial({
                    color: 0x00ffff
                });
                this._up = new THREE.Line(upGeometry, upMaterial);
                this.add(this._up);
                let coneGeometry = new THREE.CylinderGeometry(0, 1, 1, 32);
                let coneMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffff00,
                    transparent: true,
                    opacity: 0.5
                });
                this._frontCone = new THREE.Mesh(coneGeometry, coneMaterial);
                this.add(this._frontCone);
                this._frontCone.geometry.applyMatrix(new THREE.Matrix4().setPosition(new THREE.Vector3(0, -0.5, 0)));
                var quaternion = new THREE.Quaternion();
                quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
                this._frontCone.geometry.applyMatrix(new THREE.Matrix4().makeRotationFromQuaternion(quaternion));
            }
        }
    }
    Objects.Player = Player;
})(Objects || (Objects = {}));
'user strict';
var Scenes;
(function (Scenes) {
    class BootScene extends Phaser.State {
        constructor() {
            super();
        }
        init() {
            super.init();
            this.cache = new Utils.Cache(this.game);
            this.game.cache = this.cache;
            this.load = new Utils.Loader(this.game);
            this.game.load = this.load;
            this.game.canvas.style.position = "absolute";
            this.game.canvas.style.top = "0px";
            this.game.canvas.style.left = "0px";
        }
        preload() {
            super.preload();
            this.load.atlas('game_ui', 'assets/atlas_hash_trim.png', 'assets/atlas_json_hash_trim.json');
        }
        create() {
            super.create();
            this.game.stage.backgroundColor = 0xFFF;
            this.game.state.start('Menu');
        }
    }
    Scenes.BootScene = BootScene;
})(Scenes || (Scenes = {}));
'user strict';
var Scenes;
(function (Scenes) {
    class GameScene extends Phaser.State {
        constructor() {
            super();
        }
        init(data) {
            super.init();
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            this._clock = new THREE.Clock();
            this._threeScene = new THREE.Scene();
            if (Game.Globals.DEBUG) {
            }
            var threeOptions = {
                antialias: false,
            };
            this._three = new THREE.WebGLRenderer(threeOptions);
            this._three.domElement.id = "threejs";
            this._three.domElement.style.position = "absolute";
            this._three.domElement.style.top = "0px";
            this._three.domElement.style.left = "0px";
            this._three.domElement.style.backgroundColor = "#000000";
            this._three.setPixelRatio(window.devicePixelRatio);
            this._three.setSize(1280, 720);
            this._three.setClearColor(0xcccccc, 1);
            document.body.insertBefore(this._three.domElement, this.game.canvas);
            window.addEventListener('resize', this.onWindowResize.bind(this), false);
            this.onWindowResize(null);
        }
        preload() {
            super.preload();
        }
        create() {
            super.create();
            let cache = this.cache;
            this._world = new THREE.Mesh(cache.getThreeGeometry("level_geometry"), new THREE.MeshBasicMaterial({
                map: cache.getThreeTexture("level_texture"),
                side: THREE.FrontSide,
                color: 0xffffff,
                opacity: 1.0,
                transparent: false
            }));
            this._world.rotateOnAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(90));
            this._threeScene.add(this._world);
            let pathJson = cache.getJSON('level_path');
            this._path = new Objects.Path(pathJson);
            this._threeScene.add(this._path);
            this._player = new Objects.Player(this._path);
            this._threeScene.add(this._player);
            this._orbitCamera = new Objects.OrbitCamera();
            this._threeScene.add(this._orbitCamera);
            this._playerCamera = new Objects.PlayerCamera(this._player);
            this._camera = this._playerCamera;
            this._threeScene.add(new THREE.HemisphereLight(0x404040));
            this.animateLoop();
            this.renderLoop();
        }
        paused() {
            super.paused();
        }
        resumed() {
            super.resumed();
        }
        shutdown() {
            super.shutdown();
            cancelAnimationFrame(this._requestId);
        }
        onWindowResize(event) {
            this._three.setSize(window.innerWidth, window.innerHeight);
        }
        animateLoop() {
            this._requestId = requestAnimationFrame(this.animateLoop.bind(this));
            var delta = this._clock.getDelta();
            this._player.update(delta);
            this._orbitCamera.update(delta);
            this._playerCamera.update(delta);
            this.renderLoop();
        }
        renderLoop() {
            this._camera.render(this._three, this._threeScene);
        }
    }
    GameScene.INPUT_THRESOLD = 100;
    GameScene.MAX_X_ANGLE = -Math.PI / 2;
    GameScene.MIN_X_ANGLE = -Math.PI / 9;
    Scenes.GameScene = GameScene;
})(Scenes || (Scenes = {}));
'user strict';
var Scenes;
(function (Scenes) {
    class GamePreloadScene extends Phaser.State {
        constructor() {
            super();
            this.onFileStart = (index, cacheKey, url) => {
                console.log("Start loading " + cacheKey);
            };
            this.onFileComplete = (progress, cacheKey, success, totalLoaded, totalFiles) => {
                console.log("Finished loading " + cacheKey + " " + totalLoaded + "/" + totalFiles + " " + progress + "%");
                let cache = this.cache;
                if (cacheKey === 'level') {
                    let json = cache.getJSON('level');
                    let loader = this.load;
                    loader.json('level_path', json.path);
                    loader.threeJSON('level_geometry', json.static.geometry);
                    loader.threeTexture('level_texture', json.static.texture);
                }
            };
            this.onFileError = (cacheKey, file) => {
                if (file.error)
                    console.error("Error loading " + cacheKey + ": " + file.errorMessage);
            };
            this.onLoadStart = () => {
                console.log("Loading starts");
            };
            this.onLoaded = () => {
                console.log("Loading finished");
            };
        }
        init() {
            super.init();
            this.load.onLoadStart.add(this.onLoadStart);
            this.load.onLoadComplete.add(this.onLoaded);
            this.load.onFileStart.add(this.onFileStart);
            this.load.onFileComplete.add(this.onFileComplete);
            this.load.onFileError.add(this.onFileError);
        }
        preload() {
            super.preload();
            let loader = this.load;
            loader.json('level', 'assets/level1.json');
        }
        create() {
            super.create();
            this.game.stage.backgroundColor = 0xFFF;
            this.game.state.start('Game');
        }
    }
    Scenes.GamePreloadScene = GamePreloadScene;
})(Scenes || (Scenes = {}));
'user strict';
var Scenes;
(function (Scenes) {
    class MenuScene extends Phaser.State {
        constructor() {
            super();
        }
        init() {
            super.init();
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
        }
        preload() {
            super.preload();
        }
        create() {
            super.create();
            this.game.stage.backgroundColor = 0xFFF;
            let button = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'game_ui', () => {
                this.game.state.start('Game Preload');
            }, this, 'cactuar');
            button.anchor.setTo(0.5);
        }
    }
    Scenes.MenuScene = MenuScene;
})(Scenes || (Scenes = {}));
'user strict';
var Utils;
(function (Utils) {
    class Cache extends Phaser.Cache {
        constructor(game) {
            super(game);
            this._threeGeometries = {};
            this._threeMaterials = {};
            this._threeTextures = {};
        }
        addThreeGeometry(key, url, data) {
            if (this.checkThreeGeometry(key)) {
                this.removeThreeGeometry(key);
            }
            this._threeGeometries[key] = data;
        }
        addThreeMaterial(key, data) {
            if (this.checkThreeMaterial(key)) {
                this.removeThreeMaterial(key);
            }
            this._threeMaterials[key] = data;
        }
        addThreeTexture(key, data) {
            if (this.checkThreeTexture(key)) {
                this.removeThreeTexture(key);
            }
            this._threeTextures[key] = data;
        }
        getThreeGeometry(key) {
            return this._threeGeometries[key];
        }
        getThreeMaterial(key) {
            return this._threeMaterials[key];
        }
        getThreeTexture(key) {
            return this._threeTextures[key];
        }
        checkThreeGeometry(key) {
        }
        checkThreeMaterial(key) {
        }
        checkThreeTexture(key) {
        }
        removeThreeGeometry(key) {
        }
        removeThreeMaterial(key) {
        }
        removeThreeTexture(key) {
        }
    }
    Utils.Cache = Cache;
})(Utils || (Utils = {}));
'user strict';
var Utils;
(function (Utils) {
    (function (Direction) {
        Direction[Direction["FRONT"] = 0] = "FRONT";
        Direction[Direction["BACK"] = 1] = "BACK";
        Direction[Direction["LEFT"] = 2] = "LEFT";
        Direction[Direction["RIGTH"] = 3] = "RIGTH";
        Direction[Direction["UP"] = 4] = "UP";
        Direction[Direction["DOWN"] = 5] = "DOWN";
    })(Utils.Direction || (Utils.Direction = {}));
    var Direction = Utils.Direction;
})(Utils || (Utils = {}));
'user strict';
var Utils;
(function (Utils) {
    class Loader extends Phaser.Loader {
        constructor(game) {
            super(game);
            this._loadingManager = new THREE.LoadingManager();
            this._jsonLoader = new THREE.JSONLoader();
            this._textureLoader = new THREE.TextureLoader(this._loadingManager);
        }
        loadFile(file) {
            super.loadFile(file);
            let cache = this.cache;
            switch (file.type) {
                case 'three_json':
                    this._jsonLoader.load(file.url, (geometry, materials) => {
                        if (geometry) {
                            cache.addThreeGeometry(file.key, file.url, geometry);
                        }
                        else {
                            this.asyncComplete(file, "Can't load ThreeJS JSON geometry: " + file.key);
                        }
                        if (materials) {
                            for (let i = 0; i < materials.length; i++) {
                                cache.addThreeMaterial(materials[i].name, materials[i]);
                            }
                        }
                        this.asyncComplete(file);
                    });
                    this._jsonLoader.manager.onError = () => {
                        this.asyncComplete(file, "Can't load ThreeJS JSON: " + file.key);
                    };
                    break;
                case 'three_texture':
                    this._textureLoader.load(file.url, (texture) => {
                        if (texture) {
                            cache.addThreeTexture(file.key, texture);
                            this.asyncComplete(file);
                        }
                        else {
                            this.asyncComplete(file, "Can't load ThreeJS texture: " + file.key);
                        }
                    });
                    this._textureLoader.manager.onError = () => {
                        this.asyncComplete(file, "Can't load ThreeJS texture: " + file.key);
                    };
                    break;
            }
        }
        threeJSON(key, url) {
            this.addToFileList('three_json', key, url);
            return this;
        }
        threeTexture(key, url) {
            this.addToFileList('three_texture', key, url);
            return this;
        }
    }
    Utils.Loader = Loader;
})(Utils || (Utils = {}));
//# sourceMappingURL=app.js.map