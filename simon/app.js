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

    .directive('simonSays', [function () {
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
                    raycaster = new THREE.Raycaster(),
                    mouse = new THREE.Vector2(),
                    intersects,
                    clickedObject,
                    gameScale = width / 36,
                    simonSaysContainer, consoleBody,
                    green, red, blue, yellow,
                    startButton, modeButton, powerSwitch,
                    lattice, simonSays,
                    countDisplay, countPosition,
                    countCanvas, countContext, countMaterial, countTexture,
                    countData = 0,
                    table,
                    box;

                function initScene () {
                    renderer.setSize(width, height);
                    elem.append(renderer.domElement);
                    renderer.setClearColor(0x666666);

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
                    countMaterial = new THREE.MeshBasicMaterial({map:countTexture, side: THREE.DoubleSide, transparent: true, opacity: 1});

                    countDisplay = new THREE.Mesh(new THREE.PlaneGeometry(.15, .15), countMaterial);
                    countDisplay.rotation.x = degToRad(-90);
                    countDisplay.rotation.z = degToRad(180);
                    countDisplay.name = 'countDisplay';

                    countCanvasUpdate();

                    simonSaysContainer = new THREE.Object3D();
                    simonSaysContainer.scale.set(gameScale, gameScale, gameScale);
                    simonSaysContainer.rotation.y = degToRad(180);

                    objLoader.load('simonSays.json', function (blender) {
                        consoleBody = blender.getObjectByName('consoleBody');
                        consoleBody.material = new THREE.MeshPhongMaterial({color: 0x111111});
                        consoleBody.castShadow = true;

                        green = blender.getObjectByName('green');
                        green.material = new THREE.MeshPhongMaterial({color: 0x22FF33});

                        red = blender.getObjectByName('red');
                        red.material = new THREE.MeshPhongMaterial({color: 0xFF3322});

                        blue = blender.getObjectByName('blue');
                        blue.material = new THREE.MeshPhongMaterial({color: 0x2233FF});

                        yellow = blender.getObjectByName('yellow');
                        yellow.material = new THREE.MeshPhongMaterial({color: 0xEEEF09});

                        lattice = blender.getObjectByName('lattice');
                        lattice.material = new THREE.MeshLambertMaterial({color: 0x0A0A0A});

                        simonSays = blender.getObjectByName('simonSays');
                        simonSays.material = new THREE.MeshPhongMaterial({color: 0xBBBBBB});

                        modeButton = blender.getObjectByName('modeButton');
                        modeButton.material = new THREE.MeshPhongMaterial({color: 0xEEEF09});

                        startButton = blender.getObjectByName('startButton');
                        startButton.material = new THREE.MeshPhongMaterial({color: 0xFF3322});

                        powerSwitch = blender.getObjectByName('powerSwitch');
                        powerSwitch.material = new THREE.MeshPhongMaterial({color: 0x22FF33});

                        table = blender.getObjectByName('table');
                        table.material = new THREE.MeshPhongMaterial({color: 0x8A572B});

                        countPosition = blender.getObjectByName('countDisplay');
                        countDisplay.position.set(countPosition.position.x, countPosition.position.y, countPosition.position.z);

                        simonSaysContainer.add(consoleBody);
                        simonSaysContainer.add(green);
                        simonSaysContainer.add(red);
                        simonSaysContainer.add(blue);
                        simonSaysContainer.add(yellow);
                        simonSaysContainer.add(lattice);
                        simonSaysContainer.add(simonSays);
                        simonSaysContainer.add(modeButton);
                        simonSaysContainer.add(startButton);
                        simonSaysContainer.add(powerSwitch);
                        simonSaysContainer.add(table);
                        simonSaysContainer.add(countDisplay);
                    });

                    function onMouseClick (event) {
                        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
                        raycaster.setFromCamera(mouse, camera);
                        intersects = raycaster.intersectObjects(simonSaysContainer.children);
                        var object = intersects[0].object;
                        clickedObject = intersects[0].object.name;
                        console.log(clickedObject);

                        camera.lookAt(object.position.x, object.position.y, object.position.z);

                        switch (clickedObject) {
                            case 'powerSwitch':
                            powerSwitch.position.x -= .05;
                        }

                        countData++;
                        countCanvasUpdate();
                    }

                    elem.on('click', onMouseClick);

                    scene.add(camera);
                    scene.add(lightAmbient);
                    scene.add(lightTop);
                    scene.add(simonSaysContainer);

                    render();
                }
                initScene();

                function render () {
                    renderer.render(scene, camera);
                    requestAnimationFrame(render)
                }

                function countCanvasUpdate () {
                    countContext.fillStyle = '#000';
                    countContext.fillRect(0, 0, countCanvas.width, countCanvas.height);
                    countContext.fillStyle = '#2F0000';
                    countContext.fillText('88', 0, 350);
                    countContext.fillStyle = '#FE2210';
                    countContext.fillText(leadingZero(countData), 0, 350);
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
    }])