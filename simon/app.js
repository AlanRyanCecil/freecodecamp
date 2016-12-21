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
                    fontLoader = new THREE.FontLoader(),
                    simonSaysContainer,
                    consoleBody,
                    green,
                    red,
                    blue,
                    yellow,
                    lattice,
                    simonSays,
                    font,
                    countDisplay,
                    digitalGhost,
                    count,
                    countContext,
                    countTexture,
                    countData = 0,
                    startButton,
                    modeButton,
                    powerSwitch,
                    table,
                    plane,
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

                    // fontLoader.load('DigitalNumbers_Regular.json', function (thisFont) {
                    //     font = thisFont;
                    //     digitalGhost = new THREE.Mesh(new THREE.TextGeometry('88', {font: font, size: 3.5, height: 0.1}),
                    //         new THREE.MeshPhongMaterial({color: 0x0200000}));
                    //     digitalGhost.rotation.x = degToRad(-90);
                    //     digitalGhost.position.set(-12, 18, 7);

                    //     count = new THREE.Mesh(new THREE.TextGeometry(leadingZero(countData), {font: font, size: 3.5, height: 0.1}),
                    //         new THREE.MeshPhongMaterial({color: 0x000000, emissive: 0xEE0000}));
                    //     count.rotation.x = degToRad(-90);
                    //     count.position.set(-12, 18, 7);
                    // });

                    var canvas = document.createElement('canvas');
                    canvas.width = 512;
                    canvas.height = 512;
                    countContext = canvas.getContext('2d');
                    countContext.font = "320px Digital Numbers";
                    countContext.fillStyle = '#000';
                    countContext.fillRect(0, 0, canvas.width, canvas.height);
                    countContext.fillStyle = '#550000';
                    countContext.fillText('00', 0, 350);
                    countContext.fillStyle = '#EE2210';
                    countContext.fillText(leadingZero(0), 0, 350);
                    countTexture = new THREE.Texture(canvas);
                    countTexture.needsUpdate = true;
                    var textMaterial = new THREE.MeshBasicMaterial({map:countTexture, side: THREE.DoubleSide, transparent: true, opacity: 1});
                    plane = new THREE.Mesh(new THREE.PlaneGeometry(.15, .15),
                        textMaterial);
                    plane.position.set(.165, .35, -.11);
                    // plane.position.set(-8.3, 18, 5.5);
                    plane.rotation.x = degToRad(-90);
                    plane.rotation.z = degToRad(180);

                    box = new THREE.Mesh( new THREE.BoxGeometry(25, 25, 25),
                        new THREE.MeshPhongMaterial({color: 0xFF9933}));

                    simonSaysContainer = new THREE.Object3D();
                    var scale = width / 36;
                    simonSaysContainer.scale.set(scale, scale, scale);
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

                        countDisplay = blender.getObjectByName('countDisplay');
                        // countDisplay.material = new THREE.MeshPhongMaterial({color: 0x000000});
                        countDisplay.material = textMaterial;

                        modeButton = blender.getObjectByName('modeButton');
                        modeButton.material = new THREE.MeshPhongMaterial({color: 0xEEEF09});

                        startButton = blender.getObjectByName('startButton');
                        startButton.material = new THREE.MeshPhongMaterial({color: 0xFF3322});

                        powerSwitch = blender.getObjectByName('powerSwitch');
                        powerSwitch.material = new THREE.MeshPhongMaterial({color: 0x22FF33});

                        table = blender.getObjectByName('table');
                        table.material = new THREE.MeshPhongMaterial({color: 0x8A572B});

                        simonSaysContainer.add(consoleBody);
                        simonSaysContainer.add(green);
                        simonSaysContainer.add(red);
                        simonSaysContainer.add(blue);
                        simonSaysContainer.add(yellow);
                        simonSaysContainer.add(lattice);
                        simonSaysContainer.add(simonSays);
                        simonSaysContainer.add(countDisplay);
                        simonSaysContainer.add(modeButton);
                        simonSaysContainer.add(startButton);
                        simonSaysContainer.add(powerSwitch);
                        simonSaysContainer.add(table);
                        // scene.add(digitalGhost);
                        // scene.add(count);
                        simonSaysContainer.add(plane);
                    });

                    angular.element('body').on('click', function () {
                        countData++;
                        plane.material.map.needsUpdate = true;
                        countContext.fillStyle = '#000';
                        countContext.fillRect(0, 0, canvas.width, canvas.height);
                        countContext.fillStyle = '#2F0000';
                        countContext.fillText('00', 0, 350);
                        countContext.fillStyle = '#EE2210';
                        countContext.fillText(leadingZero(countData), 0, 350);
                        console.log(countData);
                    })

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

                function degToRad (deg) {
                    return Math.PI / 180 * deg;
                }

                function leadingZero (num) {
                    return num < 10 ? ('0' + num) : num;
                }

            }
        }
    }])