'use strict';

angular.module('SimonSaysApp', ['ngMaterial'])

    .controller('MainGameCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
        $scope.game = 'Simon Says';
        var colors = angular.element('.color');

        colors.on('click', function (event) {
            var elem = angular.element(event.target),
                color = elem.attr('class').split(' ')[1];
            console.log(color);
            elem.addClass('clicked');
            $timeout(function () {
                elem.removeClass('clicked');
            }, 300);
        });
    }])

    .directive('simonSays', ['$window', '$timeout', '$interval', function ($window, $timeout, $interval) {
        return {
            restrict: 'E',
            replace: false,
            link: function ($scope, elem, attrs) {
                var scene = new THREE.Scene(),
                    width = window.innerWidth,
                    height = window.innerHeight,
                    fov = 55,
                    aspect = width / height,
                    near = 0.1,
                    far = 1000,
                    camera = new THREE.PerspectiveCamera( fov, aspect, near, far ),
                    renderer = new THREE.WebGLRenderer( {antialias: true} ),
                    lightAmbient = new THREE.AmbientLight(),
                    lightTop = new THREE.PointLight(),
                    objLoader = new THREE.ObjectLoader(),
                    jsonLoader = new THREE.JSONLoader(),
                    raycaster = new THREE.Raycaster(),
                    mouse = new THREE.Vector2(),
                    intersects,
                    clickedObject,
                    keyedObject,
                    gameScale = width / 36,
                    simonSaysContainer, consoleBody,
                    green, red, yellow, blue, colorCache,
                    randomColorArray,
                    keyObjectMap,
                    indicator,
                    indicatorColor,
                    strictModeOn = false,
                    illuminated = false,
                    buttonTone,
                    powerSwitch, startButton, modeButton,
                    opperationButtonMap,
                    playButtonMap,
                    labelMaterial,
                    computerPlay,
                    computerPlayInterval,
                    humanMemory,
                    powerOn = false,
                    humanTurn = false,
                    powerChange = null,
                    powerChanged = 0.05,
                    powerChangeAbs = 0.01,
                    countDisplay, countPosition,
                    countCanvas, countContext, countMaterial, countTexture,
                    countData = 0,
                    table,
                    box;

                function initScene () {
                    renderer.setSize(width, height);
                    elem.append(renderer.domElement);
                    renderer.setClearColor(0x436883);

                    camera.position.set(0, 120, 0);
                    camera.rotation.x = degToRad(-90);

                    lightAmbient.intensity = 0.5;

                    lightTop.position.set(0, 100, -50);
                    lightTop.castShadow = true;

                    countCanvas = document.createElement('canvas');
                    countCanvas.width = 512;
                    countCanvas.height = 512;
                    countContext = countCanvas.getContext('2d');
                    countContext.font = "320px Digital Numbers";
                    countTexture = new THREE.Texture(countCanvas);
                    countMaterial = new THREE.MeshBasicMaterial({map:countTexture, transparent: true, opacity: 1});

                    countDisplay = new THREE.Mesh(new THREE.PlaneGeometry(.15, .15), countMaterial);
                    countDisplay.rotation.x = degToRad(-90);
                    countDisplay.rotation.z = degToRad(180);
                    countDisplay.name = 'countDisplayReplacement';

                    countCanvasUpdate('');

                    table = new THREE.Mesh(new THREE.PlaneGeometry(500, 500),
                        new THREE.MeshPhongMaterial({color:0x436883}));
                    table.rotation.x = degToRad(-90);

                    simonSaysContainer = new THREE.Object3D();
                    simonSaysContainer.scale.set(gameScale, gameScale, gameScale);
                    simonSaysContainer.rotation.y = degToRad(180);

                    powerSwitch = new THREE.Object3D();

                    indicator = new THREE.Mesh(new THREE.SphereGeometry(0.016, 16, 16),
                        new THREE.MeshPhongMaterial({color: 0x015602}));

                    objLoader.load('simonSays.json', function (blender) {
                        blender.getObjectByName('lattice').material = new THREE.MeshLambertMaterial({color: 0x0A0A0A});
                        blender.getObjectByName('powerBG').material = new THREE.MeshPhongMaterial({color: 0x222222});
                        blender.getObjectByName('table').material = new THREE.MeshPhongMaterial({color: 0x436883});
                        labelMaterial = new THREE.MeshPhongMaterial({color: 0xAAAAAA});
                        blender.getObjectByName('simonSays').material = labelMaterial;
                        blender.getObjectByName('onoffLabel').material = labelMaterial;
                        blender.getObjectByName('startLabel').material = labelMaterial;
                        blender.getObjectByName('modeLabel').material = labelMaterial;

                        consoleBody = blender.getObjectByName('consoleBody');
                        consoleBody.material = new THREE.MeshPhongMaterial({color: 0x111111});
                        consoleBody.castShadow = true;

                        green = blender.getObjectByName('green');
                        green.material = new THREE.MeshPhongMaterial({color: 0x028803});

                        red = blender.getObjectByName('red');
                        red.material = new THREE.MeshPhongMaterial({color: 0x880A0A});

                        blue = blender.getObjectByName('blue');
                        blue.material = new THREE.MeshPhongMaterial({color: 0x020388});

                        yellow = blender.getObjectByName('yellow');
                        yellow.material = new THREE.MeshPhongMaterial({color: 0x888809});

                        modeButton = blender.getObjectByName('modeButton');
                        modeButton.material = new THREE.MeshPhongMaterial({color: 0x888809});

                        indicator.position.set(modeButton.position.x, modeButton.position.y - 0.006, modeButton.position.z + 0.06);

                        startButton = blender.getObjectByName('startButton');
                        startButton.material = new THREE.MeshPhongMaterial({color: 0x880A0A});

                        powerSwitch = blender.getObjectByName('powerSwitch');
                        powerSwitch.material = new THREE.MeshPhongMaterial({color: 0x028803});


                        countPosition = blender.getObjectByName('countDisplay');
                        countDisplay.position.set(countPosition.position.x, countPosition.position.y, countPosition.position.z);

                        blender.remove(blender.getObjectByName('table'));
                        simonSaysContainer.add(blender);
                        simonSaysContainer.add(indicator);
                        simonSaysContainer.add(countDisplay);
                    });

                    function determineClickedObject () {
                        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
                        raycaster.setFromCamera(mouse, camera);
                        intersects = raycaster.intersectObjects(simonSaysContainer.children[0].children);
                        return intersects[0].object;
                    }

                    function powerOpperation () {
                        powerChange = powerOn ? powerChangeAbs : -powerChangeAbs;
                        powerChanged = 0;
                        strictModeOn ? changeMode() : null;
                        powerOn = !powerOn;
                        humanTurn = false;
                        randomColorArray = [];
                        $interval.cancel(computerPlayInterval);
                        countCanvasUpdate(powerOn ? (countData = 0) : '');
                    }

                    buttonTone = new Tone.Synth({
                        "oscillator" : {
                            "type" : "square"
                        },
                        "volume": -24,
                        "envelope" : {
                            "attack" : 0.1,
                            "decay" : 1,
                            "sustain" : 1,
                            "release" : 0.1
                        }
                    }).toMaster();

                    function buttonFunctions (object, color, tone) {
                        if (!illuminated) {
                            illuminated = true;
                            colorCache = object.material.color;
                            object.material.color = new THREE.Color(color);
                            buttonTone.triggerAttack(tone);
                            $timeout(function () {
                                object.material.color = colorCache;
                                illuminated = false;
                                buttonTone.triggerRelease();
                            }, 300);
                        }
                    }

                    function randomColor () {
                        return ['green', 'red', 'blue', 'yellow'][Math.floor(Math.random() * 4)];
                    }

                    function computerPlay (addColor) {
                        if (powerOn && !humanTurn) {
                            if (addColor) {
                                randomColorArray.push(randomColor());
                            }
                            countData = randomColorArray.length;
                            countCanvasUpdate(countData);
                            humanMemory = Array.from(randomColorArray);
                            var index = 0;
                            computerPlayInterval = $interval(function () {
                                if (randomColorArray[index]) {
                                    colorButtonAction(randomColorArray[index]);
                                    index++;
                                } else {
                                    $interval.cancel(computerPlayInterval);
                                }
                            }, 550);
                            $timeout(function () {
                                humanTurn = true;
                            }, 550 * randomColorArray.length);
                        }
                    }

                    function changeMode () {
                        if (powerOn) {
                            strictModeOn = !strictModeOn;
                            indicatorColor = strictModeOn ? 0x0FFF0F : 0x015602;
                            indicator.material.color = new THREE.Color(indicatorColor);
                        }
                    }

                    function gameOver () {
                        if (strictModeOn) {
                            countData = 0;
                            randomColorArray = [];
                        }
                        humanTurn = false;
                        buttonTone.triggerAttack(80);
                        countCanvasUpdate('!!');
                        $timeout(function () {
                            countCanvasUpdate('');
                        }, 430);
                        $timeout(function () {
                            countCanvasUpdate('!!');
                        }, 860);
                        $timeout(function () {
                            countCanvasUpdate('');
                            buttonTone.triggerRelease();
                        }, 1290);
                        $timeout(function () {
                            countCanvasUpdate(countData);
                            if (strictModeOn) {
                                computerPlay(true);
                            } else {
                                computerPlay(false);
                            }
                        }, 2000);
                    }

                    function colorButtonAction (objectName) {
                        switch (objectName) {
                            case 'green':
                                buttonFunctions(green, 0x0FFF0F, 560);
                                break;
                            case 'red':
                                buttonFunctions(red, 0xFF0F0F, 440);
                                break;
                            case 'yellow':
                                buttonFunctions(yellow, 0xFFFF00, 320);
                                break;
                            case 'blue':
                                buttonFunctions(blue, 0x0F0FFF, 210);
                                break;
                        }
                    }

                    function playButtonEvent (object) {
                        if (powerOn && humanTurn && humanMemory[0]) {
                            if (object !== humanMemory.shift()) {
                                gameOver();
                                return "game over";
                            }
                            colorButtonAction(object);
                            if (humanMemory.length === 0) {
                                humanTurn = false;
                                $timeout(function () {
                                    computerPlay(true);
                                }, 500);
                            }
                        }
                    }

                    function opperationButtonEvent (object) {
                        if (object === 'powerSwitch') {
                            powerOpperation();
                        }
                        if (object === 'startButton') {
                            computerPlay(true);
                        }
                        if (object === 'modeButton') {
                            changeMode();
                        }
                    }

                    function onMouseClick (event) {
                        clickedObject = determineClickedObject();
                        inputObjectMap(clickedObject);
                    }

                    function inputObjectMap (event) {
                        var key = event.key || event.name;
                        if (key === ' ') {
                            event.preventDefault();
                        }
                        playButtonMap = {
                            'q': 'green',
                            'w': 'red',
                            'a': 'yellow',
                            's': 'blue',
                            'green': 'green',
                            'red': 'red',
                            'yellow': 'yellow',
                            'blue': 'blue'
                        }
                        opperationButtonMap = {
                            'o': 'powerSwitch',
                            ' ': 'startButton',
                            'm': 'modeButton',
                            'powerSwitch': 'powerSwitch',
                            'startButton': 'startButton',
                            'modeButton': 'modeButton'
                        }
                        if (playButtonMap.hasOwnProperty(key)) {
                            playButtonEvent(playButtonMap[key]);
                        } else if (opperationButtonMap.hasOwnProperty(key)) {
                            opperationButtonEvent(opperationButtonMap[key]);
                        }
                    }

                    elem.on('click', onMouseClick);
                    $window.addEventListener('keydown', inputObjectMap);

                    scene.add(camera);
                    scene.add(lightAmbient);
                    scene.add(lightTop);
                    scene.add(table);
                    scene.add(simonSaysContainer);

                    render();

                }

                initScene();

                function render () {
                    if (powerChanged < 0.05) {
                        powerSwitch.position.x += powerChange;
                        powerChanged += powerChangeAbs;
                    }
                    requestAnimationFrame(render)
                    renderer.render(scene, camera);
                }

                function countCanvasUpdate (count) {
                    countContext.fillStyle = '#000';
                    countContext.fillRect(0, 0, countCanvas.width, countCanvas.height);
                    countContext.fillStyle = '#2F0000';
                    countContext.fillText('88', 0, 350);
                    countContext.fillStyle = '#FE2210';
                    countContext.fillText(typeof count !== 'number' ? count : leadingZero(count), 0, 350);
                    countDisplay.material.map.needsUpdate = true;
                }

                function degToRad (deg) {
                    return Math.PI / 180 * deg;
                }

                function leadingZero (num) {
                    return num < 10 ? ('0' + num) : num;
                }

            }
        }
    }]);