var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
'user strict';
var Scenes;
(function (Scenes) {
    var BootScene = (function (_super) {
        __extends(BootScene, _super);
        function BootScene() {
            _super.call(this);
        }
        BootScene.prototype.init = function () {
            _super.prototype.init.call(this);
            this.cache = new Utils.Cache(this.game);
            this.game.cache = this.cache;
            this.load = new Utils.Loader(this.game);
            this.game.load = this.load;
            this.game.canvas.style.position = "absolute";
            this.game.canvas.style.top = "0px";
            this.game.canvas.style.left = "0px";
        };
        BootScene.prototype.preload = function () {
            _super.prototype.preload.call(this);
            this.load.atlas('game_ui', 'assets/atlas_hash_trim.png', 'assets/atlas_json_hash_trim.json');
        };
        BootScene.prototype.create = function () {
            _super.prototype.create.call(this);
            this.game.stage.backgroundColor = 0xFFF;
            this.game.state.start('Menu');
        };
        return BootScene;
    }(Phaser.State));
    Scenes.BootScene = BootScene;
})(Scenes || (Scenes = {}));
'user strict';
var Scenes;
(function (Scenes) {
    var MenuScene = (function (_super) {
        __extends(MenuScene, _super);
        function MenuScene() {
            _super.call(this);
        }
        MenuScene.prototype.init = function () {
            _super.prototype.init.call(this);
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
        };
        MenuScene.prototype.preload = function () {
            _super.prototype.preload.call(this);
        };
        MenuScene.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            this.game.stage.backgroundColor = 0xFFF;
            var button = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'game_ui', function () {
                _this.game.state.start('Game Preload');
            }, this, 'cactuar');
            button.anchor.setTo(0.5);
        };
        return MenuScene;
    }(Phaser.State));
    Scenes.MenuScene = MenuScene;
})(Scenes || (Scenes = {}));
'user strict';
var Scenes;
(function (Scenes) {
    var GamePreloadScene = (function (_super) {
        __extends(GamePreloadScene, _super);
        function GamePreloadScene() {
            var _this = this;
            _super.call(this);
            this.onFileStart = function (index, cacheKey, url) {
                console.log("Start loading " + cacheKey);
            };
            this.onFileComplete = function (progress, cacheKey, success, totalLoaded, totalFiles) {
                console.log("Finished loading " + cacheKey + " " + totalLoaded + "/" + totalFiles + " " + progress + "%");
                var cache = _this.cache;
                if (cacheKey === 'level') {
                    var json = cache.getJSON('level');
                    var loader = _this.load;
                    loader.json('level_path', json.path);
                    loader.threeJSON('level_geometry', json.static.geometry);
                    loader.threeTexture('level_texture', json.static.texture);
                }
            };
            this.onFileError = function (cacheKey, file) {
                if (file.error)
                    console.error("Error loading " + cacheKey + ": " + file.errorMessage);
            };
            this.onLoadStart = function () {
                console.log("Loading starts");
            };
            this.onLoaded = function () {
                console.log("Loading finished");
            };
        }
        GamePreloadScene.prototype.init = function () {
            _super.prototype.init.call(this);
            this.load.onLoadStart.add(this.onLoadStart);
            this.load.onLoadComplete.add(this.onLoaded);
            this.load.onFileStart.add(this.onFileStart);
            this.load.onFileComplete.add(this.onFileComplete);
            this.load.onFileError.add(this.onFileError);
        };
        GamePreloadScene.prototype.preload = function () {
            _super.prototype.preload.call(this);
            var loader = this.load;
            loader.json('level', 'assets/level1.json');
        };
        GamePreloadScene.prototype.create = function () {
            _super.prototype.create.call(this);
            this.game.stage.backgroundColor = 0xFFF;
            this.game.state.start('Game');
        };
        return GamePreloadScene;
    }(Phaser.State));
    Scenes.GamePreloadScene = GamePreloadScene;
})(Scenes || (Scenes = {}));
'user strict';
var Objects;
(function (Objects) {
    var Path = (function (_super) {
        __extends(Path, _super);
        function Path(data) {
            var _this = this;
            _super.call(this);
            this.getCurrent = function () {
                return _this._vertices[_this._current];
            };
            this.setCurrent = function (current) {
                _this._previous = _this._current;
                _this._current = current.index;
            };
            this.getStart = function () {
                return _this._vertices[_this._start];
            };
            this.getEnd = function () {
                return _this._vertices[_this._end];
            };
            this.get = function (index) {
                return _this._vertices[index];
            };
            this.getInmediateNext = function () {
                for (var i = 0; i < _this._edges.length; i++) {
                    if (_this._edges[i].vertices.a === _this._current) {
                        return _this._vertices[_this._edges[i].vertices.b];
                    }
                }
                return null;
            };
            this.getNext = function (position, base, aperture) {
                var next = null;
                for (var i = 0; i < _this._edges.length; i++) {
                    if (Game.Globals.DEBUG) {
                        var material = _this._debugEdges[i].material;
                        material.color.setHex(0xff0000);
                    }
                }
                var apex = position.clone();
                if (Game.Globals.DEBUG) {
                    console.log("Current: " + _this._current);
                    for (var i = 0; i < _this._edges.length; i++) {
                        if (_this._edges[i].vertices.b === _this._current) {
                            console.log("Option: (" + _this._edges[i].vertices.a + ", " + _this._edges[i].vertices.b + ")");
                        }
                        else if (_this._edges[i].vertices.a === _this._current) {
                            console.log("Option: (" + _this._edges[i].vertices.a + ", " + _this._edges[i].vertices.b + ")");
                        }
                    }
                }
                for (var i = 0; i < _this._edges.length; i++) {
                    var waypoint = void 0;
                    if (_this._edges[i].vertices.b === _this._current) {
                        waypoint = _this._vertices[_this._edges[i].vertices.a];
                    }
                    else if (_this._edges[i].vertices.a === _this._current) {
                        waypoint = _this._vertices[_this._edges[i].vertices.b];
                    }
                    if (Game.Globals.DEBUG) {
                        var coneGeometry = _this._debugCone.geometry;
                        coneGeometry.vertices[0] = apex;
                        coneGeometry.vertices[1] = base;
                        coneGeometry.verticesNeedUpdate = true;
                    }
                    if (waypoint) {
                        var vertex = waypoint.position;
                        if (_this.isLyingInCone(vertex, apex, base, THREE.Math.degToRad(aperture))) {
                            if (Game.Globals.DEBUG)
                                console.log("Next: " + waypoint.index);
                            return waypoint;
                        }
                    }
                }
            };
            this.isLyingInCone = function (vertex, apex, base, aperture) {
                var halfAperture = aperture / 2;
                var apexToXVect = apex.clone().sub(vertex);
                var axisVect = apex.clone().sub(base);
                var isInInfiniteCone = apexToXVect.dot(axisVect) / apexToXVect.length() / axisVect.length() > Math.cos(halfAperture);
                if (!isInInfiniteCone)
                    return false;
                var isUnderRoundCap = apexToXVect.dot(axisVect) / axisVect.length() < axisVect.length();
                return isUnderRoundCap;
            };
            this._vertices = [];
            this._debugVertices = [];
            this._edges = [];
            this._debugEdges = [];
            for (var i = 0; i < data.vertices.length; i++) {
                var vertex = {
                    index: i,
                    position: new THREE.Vector3(data.vertices[i].position.x, data.vertices[i].position.y, data.vertices[i].position.z),
                    properties: data.vertices[i].properties
                };
                if (vertex.properties) {
                    for (var j = 0; j < vertex.properties.length; j++) {
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
                    var geometry = new THREE.SphereGeometry(0.025, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
                    var material = new THREE.MeshBasicMaterial({
                        color: 0x0000ff
                    });
                    var sphere = new THREE.Mesh(geometry, material);
                    sphere.position.set(vertex.position.x, vertex.position.y, vertex.position.z);
                    this.add(sphere);
                    this._debugVertices[i] = sphere;
                }
                this._previous = this._current;
                this._vertices[i] = vertex;
            }
            for (var i = 0; i < data.edges.length; i++) {
                var edge = {
                    vertices: {
                        a: data.edges[i][0],
                        b: data.edges[i][1]
                    }
                };
                if (Game.Globals.DEBUG) {
                    var geometry = new THREE.Geometry();
                    geometry.vertices.push(this._vertices[edge.vertices.a].position, this._vertices[edge.vertices.b].position);
                    var material = new THREE.LineBasicMaterial({
                        color: 0xff0000
                    });
                    var line = new THREE.Line(geometry, material);
                    this.add(line);
                    this._debugEdges[i] = line;
                }
                this._edges[i] = edge;
            }
            if (Game.Globals.DEBUG) {
                var coneGeometry = new THREE.Geometry();
                coneGeometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));
                var coneMaterial = new THREE.LineBasicMaterial({
                    color: 0x00ff00
                });
                this._debugCone = new THREE.Line(coneGeometry, coneMaterial);
                this.add(this._debugCone);
            }
        }
        Path.START = "start";
        Path.END = "end";
        return Path;
    }(THREE.Object3D));
    Objects.Path = Path;
})(Objects || (Objects = {}));
'user strict';
var Objects;
(function (Objects) {
    (function (Direction) {
        Direction[Direction["FRONT"] = 0] = "FRONT";
        Direction[Direction["BACK"] = 1] = "BACK";
        Direction[Direction["LEFT"] = 2] = "LEFT";
        Direction[Direction["RIGHT"] = 3] = "RIGHT";
        Direction[Direction["UP"] = 4] = "UP";
        Direction[Direction["DOWN"] = 5] = "DOWN";
    })(Objects.Direction || (Objects.Direction = {}));
    var Direction = Objects.Direction;
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(renderer, path) {
            var _this = this;
            _super.call(this);
            this.update = function (delta) {
                var timeSinceStarted = new Date().getTime() - _this._startTime;
                var distanceCovered = timeSinceStarted * 0.0005;
                var percentageCompleted = distanceCovered / _this._remainingLength;
                _this._frontVector = _this._nextWayPoint.position.clone().sub(_this.position).normalize();
                _this._upVector = _this.position.clone().normalize();
                _this.lookAt(_this.position.clone().add(_this._previousFrontVector.lerp(_this._frontVector, percentageCompleted * 0.3)));
                _this.up.set(_this._upVector.x, _this._upVector.y, _this._upVector.z);
                if (Game.Globals.DEBUG) {
                    var frontGeometry = _this._front.geometry;
                    frontGeometry.vertices[0] = _this.worldToLocal(_this.position.clone());
                    frontGeometry.vertices[1] = _this.worldToLocal(_this._nextWayPoint.position.clone());
                    frontGeometry.verticesNeedUpdate = true;
                    var upGeometry = _this._up.geometry;
                    upGeometry.vertices[0] = _this.worldToLocal(_this.position.clone());
                    upGeometry.vertices[1] = _this.worldToLocal(_this.position.clone().multiplyScalar(1.5));
                    upGeometry.verticesNeedUpdate = true;
                }
                if (percentageCompleted < 1.0) {
                    var position = _this._startPosition.clone().lerp(_this._nextWayPoint.position, percentageCompleted);
                    _this.position.set(position.x, position.y, position.z);
                }
                else {
                    _this._path.setCurrent(_this._nextWayPoint);
                    var aperture = Player.APERTURE;
                    if (_this._direction !== Direction.FRONT)
                        aperture = Player.APERTURE_WIDE;
                    var next = _this._path.getNext(_this.position, _this.getBase(_this._direction), aperture);
                    if (!next) {
                        next = _this._path.getNext(_this.position, _this.getBase(Direction.FRONT), aperture);
                        if (!next) {
                            next = _this._path.getNext(_this.position, _this.getBase(Direction.RIGHT), aperture);
                        }
                        if (!next) {
                            next = _this._path.getNext(_this.position, _this.getBase(Direction.LEFT), aperture);
                        }
                    }
                    else {
                        _this._direction = Direction.FRONT;
                        _this.dispatchEvent({ type: "direction", direction: _this._direction });
                    }
                    if (Game.Globals.DEBUG) {
                        console.log("Direction: " + DirectionToString(_this._direction));
                    }
                    if (!next) {
                        console.error("Can find a next waypoint");
                        return;
                    }
                    _this._remainingLength = next.position.clone().sub(_this._path.getCurrent().position).length();
                    _this._startTime = new Date().getTime();
                    _this._startPosition = _this._nextWayPoint.position.clone();
                    _this._previousWayPoint = _this._nextWayPoint;
                    _this._nextWayPoint = next;
                }
            };
            this.getFront = function () {
                return _this._frontVector;
            };
            this.getUp = function () {
                return _this._upVector;
            };
            this.setDirection = function (direction) {
                _this._direction = direction;
                _this.dispatchEvent({ type: "direction", direction: _this._direction });
            };
            this.getDirection = function () {
                return _this._direction;
            };
            this.getBase = function (direction) {
                var base = null;
                switch (direction) {
                    case Objects.Direction.FRONT:
                        base = _this.position.clone().add(_this._frontVector);
                        return base;
                    case Objects.Direction.BACK:
                        break;
                    case Objects.Direction.LEFT:
                        base = _this.position.clone().add(_this._frontVector);
                        base.cross(_this._frontVector);
                        return base;
                    case Objects.Direction.RIGHT:
                        base = _this.position.clone().add(_this._frontVector).negate();
                        base.cross(_this._frontVector.clone());
                        break;
                    case Objects.Direction.UP:
                        base = _this.position.clone().add(_this._upVector);
                        break;
                    case Objects.Direction.DOWN:
                        break;
                }
                return base;
            };
            this._direction = Objects.Direction.LEFT;
            this._path = path;
            var geometry = new THREE.CubeGeometry(0.1, 0.1, 0.1);
            var material = new THREE.MeshBasicMaterial({
                color: 0xff0000
            });
            this._mesh = new THREE.Mesh(geometry, material);
            this.add(this._mesh);
            var startWayPoint = this._path.getStart();
            this.position.set(startWayPoint.position.x, startWayPoint.position.y, startWayPoint.position.z);
            this._nextWayPoint = this._path.getInmediateNext();
            this._previousWayPoint = this._nextWayPoint;
            ;
            this._remainingLength = this._nextWayPoint.position.clone().sub(this.position).length();
            this._startTime = new Date().getTime();
            this._startPosition = this.position.clone();
            this._frontVector = this.position.clone().sub(this._nextWayPoint.position).normalize();
            this._previousFrontVector = this._frontVector;
            this._upVector = this.position.clone().normalize();
            if (Game.Globals.DEBUG) {
                var frontGeometry = new THREE.Geometry();
                frontGeometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));
                var frontMaterial = new THREE.LineBasicMaterial({
                    color: 0xffff00
                });
                this._front = new THREE.Line(frontGeometry, frontMaterial);
                this.add(this._front);
                var upGeometry = new THREE.Geometry();
                upGeometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0));
                var upMaterial = new THREE.LineBasicMaterial({
                    color: 0x00ffff
                });
                this._up = new THREE.Line(upGeometry, upMaterial);
                this.add(this._up);
                var coneGeometry = new THREE.CylinderGeometry(0, 1, 1, 32);
                var coneMaterial = new THREE.MeshBasicMaterial({
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
        Player.APERTURE_WIDE = 140;
        Player.APERTURE = 90;
        return Player;
    }(THREE.Object3D));
    Objects.Player = Player;
    function DirectionToString(direction) {
        switch (direction) {
            case Direction.FRONT:
                return "FRONT";
            case Direction.BACK:
                return "BACK";
            case Direction.LEFT:
                return "LEFT";
            case Direction.RIGHT:
                return "RIGHT";
            case Direction.UP:
                return "UP";
            case Direction.DOWN:
                return "DOWN";
        }
    }
    Objects.DirectionToString = DirectionToString;
})(Objects || (Objects = {}));
'user strict';
var Scenes;
(function (Scenes) {
    var GameScene = (function (_super) {
        __extends(GameScene, _super);
        function GameScene() {
            _super.call(this);
        }
        GameScene.prototype.init = function () {
            _super.prototype.init.call(this);
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
            this._three.setClearColor(0xB2E5D4, 1);
            document.body.insertBefore(this._three.domElement, this.game.canvas);
            window.addEventListener('resize', this.onWindowResize.bind(this), false);
            this.onWindowResize(null);
        };
        GameScene.prototype.preload = function () {
            _super.prototype.preload.call(this);
        };
        GameScene.prototype.create = function () {
            var _this = this;
            _super.prototype.create.call(this);
            var cache = this.cache;
            var text = this.game.add.text(this.game.width / 2, 50, "FRONT", { fill: "0x545142" });
            text.anchor = new Phaser.Point(0.5, 0.5);
            this._world = new THREE.Mesh(cache.getThreeGeometry("level_geometry"), new THREE.MeshBasicMaterial({
                map: cache.getThreeTexture("level_texture"),
                side: THREE.FrontSide,
                color: 0xffffff,
                opacity: 1.0,
                transparent: false
            }));
            this._world.rotateOnAxis(new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(90));
            this._threeScene.add(this._world);
            var pathJson = cache.getJSON('level_path');
            this._path = new Objects.Path(pathJson);
            this._threeScene.add(this._path);
            this._player = new Objects.Player(this.game.canvas, this._path);
            this._player.addEventListener("direction", function (event) {
                text.setText(Objects.DirectionToString(event['direction']));
            });
            this._threeScene.add(this._player);
            this._orbitCamera = new Objects.OrbitCamera();
            this._threeScene.add(this._orbitCamera);
            this._playerCamera = new Objects.PlayerCamera(this._player);
            this._camera = this._playerCamera;
            this._threeScene.add(new THREE.HemisphereLight(0x404040));
            this._hammer = new Hammer(this.game.canvas);
            this._hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
            this._hammer.on("panleft panright panup tap press", function (ev) {
                if (ev.direction === Hammer.DIRECTION_UP) {
                    _this._player.setDirection(Objects.Direction.UP);
                }
                else if (ev.direction === Hammer.DIRECTION_LEFT) {
                    _this._player.setDirection(Objects.Direction.LEFT);
                }
                else if (ev.direction === Hammer.DIRECTION_RIGHT) {
                    _this._player.setDirection(Objects.Direction.RIGHT);
                }
            });
            this.animateLoop();
            this.renderLoop();
        };
        GameScene.prototype.paused = function () {
            _super.prototype.paused.call(this);
        };
        GameScene.prototype.resumed = function () {
            _super.prototype.resumed.call(this);
        };
        GameScene.prototype.shutdown = function () {
            _super.prototype.shutdown.call(this);
            cancelAnimationFrame(this._requestId);
        };
        GameScene.prototype.onWindowResize = function (event) {
            this._three.setSize(window.innerWidth, window.innerHeight);
        };
        GameScene.prototype.animateLoop = function () {
            this._requestId = requestAnimationFrame(this.animateLoop.bind(this));
            var delta = this._clock.getDelta();
            this._player.update(delta);
            this._orbitCamera.update(delta);
            this._playerCamera.update(delta);
            this.renderLoop();
        };
        GameScene.prototype.renderLoop = function () {
            this._camera.render(this._three, this._threeScene);
        };
        GameScene.INPUT_THRESOLD = 100;
        GameScene.MAX_X_ANGLE = -Math.PI / 2;
        GameScene.MIN_X_ANGLE = -Math.PI / 9;
        return GameScene;
    }(Phaser.State));
    Scenes.GameScene = GameScene;
})(Scenes || (Scenes = {}));
'user strict';
var Game;
(function (Game) {
    var Globals = (function () {
        function Globals() {
        }
        Globals.DEBUG = true;
        return Globals;
    }());
    Game.Globals = Globals;
})(Game || (Game = {}));
function start() {
    var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'body', null, true);
    game.state.add('Boot', Scenes.BootScene);
    game.state.add('Menu', Scenes.MenuScene);
    game.state.add('Game Preload', Scenes.GamePreloadScene);
    game.state.add('Game', Scenes.GameScene);
    game.state.start('Boot');
}
if (window['cordova']) {
    document.addEventListener("deviceready", function () {
        start();
    }, false);
}
else {
    start();
}
'user strict';
var Objects;
(function (Objects) {
    var Camera = (function (_super) {
        __extends(Camera, _super);
        function Camera() {
            _super.call(this);
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
        Camera.prototype.destroy = function () {
            document.removeEventListener("mousemove", this.onMouseMove.bind(this), false);
            document.removeEventListener("mousedown", this.onMouseDown.bind(this), false);
            document.removeEventListener("mouseup", this.onMouseUp.bind(this), false);
            document.removeEventListener("touchstart", this.onTouchStart.bind(this), false);
            document.removeEventListener("touchend", this.onTouchEnd.bind(this), false);
            document.removeEventListener("touchcancel", this.onTouchCancel.bind(this), false);
            document.removeEventListener("touchleave", this.onTouchLeave.bind(this), false);
            document.removeEventListener("touchmove", this.onTouchMove.bind(this), false);
        };
        Camera.prototype.render = function (three, scene) {
            three.render(scene, this._camera);
        };
        Camera.prototype.onWindowResize = function (event) {
            this._camera.aspect = window.innerWidth / window.innerHeight;
            this._camera.updateProjectionMatrix();
        };
        return Camera;
    }(THREE.Object3D));
    Objects.Camera = Camera;
})(Objects || (Objects = {}));
'user strict';
var Objects;
(function (Objects) {
    var OrbitCamera = (function (_super) {
        __extends(OrbitCamera, _super);
        function OrbitCamera() {
            _super.call(this);
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
            this.onWindowResize(null);
        }
        OrbitCamera.prototype.destroy = function () {
        };
        OrbitCamera.prototype.update = function (delta) {
            this._camera.position.set(0, 0, 0);
            this._camera.setRotationFromEuler(this._rot);
            this._camera.translateOnAxis(new THREE.Vector3(0, 0, 1), this._distance);
            this._camera.lookAt(new THREE.Vector3(0, 0, 0));
        };
        OrbitCamera.prototype.render = function (three, scene) {
            three.render(scene, this._camera);
        };
        OrbitCamera.prototype.onWindowResize = function (event) {
            this._camera.aspect = window.innerWidth / window.innerHeight;
            this._camera.updateProjectionMatrix();
        };
        OrbitCamera.prototype.onMouseMove = function (event) {
            this.onEventMove(this._lastX - event.clientX, this._lastY - event.clientY);
            this._lastX = event.clientX;
            this._lastY = event.clientY;
        };
        OrbitCamera.prototype.onTouchMove = function (event) {
            this.onEventMove(this._lastX - event.changedTouches[0].clientX, this._lastY - event.changedTouches[0].clientY);
            this._lastX = event.changedTouches[0].clientX;
            this._lastY = event.changedTouches[0].clientY;
        };
        OrbitCamera.prototype.onEventMove = function (dx, dy) {
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
        };
        OrbitCamera.prototype.onMouseDown = function (event) {
            this._isEventDown = true;
            this._eventStart = event.timeStamp;
            this._lastX = event.clientX;
            this._lastY = event.clientY;
            this.onEventStart(event.clientX, event.clientY);
        };
        OrbitCamera.prototype.onTouchStart = function (event) {
            this._isEventDown = true;
            this._eventStart = event.timeStamp;
            this._lastX = event.changedTouches[0].clientX;
            this._lastY = event.changedTouches[0].clientY;
            this.onEventStart(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        };
        OrbitCamera.prototype.onEventStart = function (posX, posY) {
            if (!this._threeInputEnabled)
                return;
            this._lastX = posX;
            this._lastY = posY;
            this._mouse.x = (posX / window.innerWidth) * 2 - 1;
            this._mouse.y = -(posY / window.innerHeight) * 2 + 1;
            event.preventDefault();
        };
        OrbitCamera.prototype.onMouseUp = function (event) {
            this._isEventDown = false;
            this.onEventEnd(event.clientX, event.clientY);
        };
        OrbitCamera.prototype.onTouchEnd = function (event) {
            this._isEventDown = false;
            this.onEventEnd(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        };
        OrbitCamera.prototype.onEventEnd = function (posX, posY) {
            if (!this._threeInputEnabled)
                return;
            this._eventStart = 0;
            this._lastX = 0;
            this._lastY = 0;
            event.preventDefault();
        };
        OrbitCamera.prototype.onTouchCancel = function (event) {
            this._isEventDown = false;
            event.preventDefault();
        };
        OrbitCamera.prototype.onTouchLeave = function (event) {
            this._isEventDown = false;
            event.preventDefault();
        };
        OrbitCamera.INPUT_THRESOLD = 100;
        OrbitCamera.MAX_X_ANGLE = -Math.PI / 2;
        OrbitCamera.MIN_X_ANGLE = -Math.PI / 9;
        return OrbitCamera;
    }(Objects.Camera));
    Objects.OrbitCamera = OrbitCamera;
})(Objects || (Objects = {}));
'user strict';
var Objects;
(function (Objects) {
    var PlayerCamera = (function (_super) {
        __extends(PlayerCamera, _super);
        function PlayerCamera(target) {
            _super.call(this);
            this._target = target;
            this._target.add(this);
            if (Game.Globals.DEBUG) {
                var geometry = new THREE.CubeGeometry(0.3, 0.1, 0.1);
                var material = new THREE.MeshBasicMaterial({
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
        PlayerCamera.prototype.update = function (delta) {
        };
        PlayerCamera.prototype.onMouseMove = function (event) {
            event.preventDefault();
        };
        PlayerCamera.prototype.onTouchMove = function (event) {
            event.preventDefault();
        };
        PlayerCamera.prototype.onEventMove = function (dx, dy) {
        };
        PlayerCamera.prototype.onMouseDown = function (event) {
            event.preventDefault();
        };
        PlayerCamera.prototype.onTouchStart = function (event) {
            event.preventDefault();
        };
        PlayerCamera.prototype.onEventStart = function (posX, posY) {
        };
        PlayerCamera.prototype.onMouseUp = function (event) {
            event.preventDefault();
        };
        PlayerCamera.prototype.onTouchEnd = function (event) {
            event.preventDefault();
        };
        PlayerCamera.prototype.onEventEnd = function (posX, posY) {
            event.preventDefault();
        };
        PlayerCamera.prototype.onTouchCancel = function (event) {
            event.preventDefault();
        };
        PlayerCamera.prototype.onTouchLeave = function (event) {
            event.preventDefault();
        };
        return PlayerCamera;
    }(Objects.Camera));
    Objects.PlayerCamera = PlayerCamera;
})(Objects || (Objects = {}));
'user strict';
var Utils;
(function (Utils) {
    var Cache = (function (_super) {
        __extends(Cache, _super);
        function Cache(game) {
            _super.call(this, game);
            this._threeGeometries = {};
            this._threeMaterials = {};
            this._threeTextures = {};
        }
        Cache.prototype.addThreeGeometry = function (key, url, data) {
            if (this.checkThreeGeometry(key)) {
                this.removeThreeGeometry(key);
            }
            this._threeGeometries[key] = data;
        };
        Cache.prototype.addThreeMaterial = function (key, data) {
            if (this.checkThreeMaterial(key)) {
                this.removeThreeMaterial(key);
            }
            this._threeMaterials[key] = data;
        };
        Cache.prototype.addThreeTexture = function (key, data) {
            if (this.checkThreeTexture(key)) {
                this.removeThreeTexture(key);
            }
            this._threeTextures[key] = data;
        };
        Cache.prototype.getThreeGeometry = function (key) {
            return this._threeGeometries[key];
        };
        Cache.prototype.getThreeMaterial = function (key) {
            return this._threeMaterials[key];
        };
        Cache.prototype.getThreeTexture = function (key) {
            return this._threeTextures[key];
        };
        Cache.prototype.checkThreeGeometry = function (key) {
        };
        Cache.prototype.checkThreeMaterial = function (key) {
        };
        Cache.prototype.checkThreeTexture = function (key) {
        };
        Cache.prototype.removeThreeGeometry = function (key) {
        };
        Cache.prototype.removeThreeMaterial = function (key) {
        };
        Cache.prototype.removeThreeTexture = function (key) {
        };
        return Cache;
    }(Phaser.Cache));
    Utils.Cache = Cache;
})(Utils || (Utils = {}));
'user strict';
var Utils;
(function (Utils) {
    var Loader = (function (_super) {
        __extends(Loader, _super);
        function Loader(game) {
            _super.call(this, game);
            this._loadingManager = new THREE.LoadingManager();
            this._jsonLoader = new THREE.JSONLoader();
            this._textureLoader = new THREE.TextureLoader(this._loadingManager);
        }
        Loader.prototype.loadFile = function (file) {
            var _this = this;
            _super.prototype.loadFile.call(this, file);
            var cache = this.cache;
            switch (file.type) {
                case 'three_json':
                    this._jsonLoader.load(file.url, function (geometry, materials) {
                        if (geometry) {
                            cache.addThreeGeometry(file.key, file.url, geometry);
                        }
                        else {
                            _this.asyncComplete(file, "Can't load ThreeJS JSON geometry: " + file.key);
                        }
                        if (materials) {
                            for (var i = 0; i < materials.length; i++) {
                                cache.addThreeMaterial(materials[i].name, materials[i]);
                            }
                        }
                        _this.asyncComplete(file);
                    });
                    this._jsonLoader.manager.onError = function () {
                        _this.asyncComplete(file, "Can't load ThreeJS JSON: " + file.key);
                    };
                    break;
                case 'three_texture':
                    this._textureLoader.load(file.url, function (texture) {
                        if (texture) {
                            cache.addThreeTexture(file.key, texture);
                            _this.asyncComplete(file);
                        }
                        else {
                            _this.asyncComplete(file, "Can't load ThreeJS texture: " + file.key);
                        }
                    });
                    this._textureLoader.manager.onError = function () {
                        _this.asyncComplete(file, "Can't load ThreeJS texture: " + file.key);
                    };
                    break;
            }
        };
        Loader.prototype.threeJSON = function (key, url) {
            this.addToFileList('three_json', key, url);
            return this;
        };
        Loader.prototype.threeTexture = function (key, url) {
            this.addToFileList('three_texture', key, url);
            return this;
        };
        return Loader;
    }(Phaser.Loader));
    Utils.Loader = Loader;
})(Utils || (Utils = {}));
//# sourceMappingURL=app.js.map