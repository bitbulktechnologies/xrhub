import { NODE_EVENT, useNode } from "@spongelearning/widget-layout";
import * as OIMO from "oimo";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function basicTexture(n: any) {
    var canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    var ctx = canvas.getContext("2d") as any;
    var color;
    if (n === 0) color = "#3884AA"; // sphere58AA80
    if (n === 1) color = "#61686B"; // sphere sleep
    if (n === 2) color = "#AA6538"; // box
    if (n === 3) color = "#61686B"; // box sleep
    if (n === 4) color = "#AAAA38"; // cyl
    if (n === 5) color = "#61686B"; // cyl sleep
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillRect(32, 32, 32, 32);
    var tx = new THREE.Texture(canvas);
    tx.needsUpdate = true;
    return tx;
}

//Don't make this FC refresh any more
const ViewPort = memo((props: { id: string }) => {
    const { id } = props;
    const ref = useRef<HTMLDivElement>(null);
    const node = useNode(id);

    const [scene] = useState(new THREE.Scene());
    const [renderer] = useState(new THREE.WebGLRenderer());
    const [camera] = useState(
        new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
    );
    const [light] = useState(new THREE.AmbientLight("white", 0.3));
    const [dirLight] = useState(new THREE.DirectionalLight("white", 0.8));
    const [sceneBackgroundColor] = useState(new THREE.Color("white"));
    const [controls] = useState(new OrbitControls(camera, renderer.domElement));

    //oimo
    const [world] = useState(new OIMO.World({ info: true, worldscale: 100 }));
    const [meshes] = useState<any[]>([]);
    const [bodies] = useState<any[]>([]);
    const [grounds] = useState<any[]>([]);

    const [mats] = useState({
        sph: new THREE.MeshBasicMaterial({
            map: basicTexture(0),
            name: "sph",
        }),
        box: new THREE.MeshBasicMaterial({
            map: basicTexture(2),
            name: "box",
        }),
        cyl: new THREE.MeshBasicMaterial({
            map: basicTexture(4),
            name: "cyl",
        }),
        ssph: new THREE.MeshBasicMaterial({
            map: basicTexture(1),
            name: "ssph",
        }),
        sbox: new THREE.MeshBasicMaterial({
            map: basicTexture(3),
            name: "sbox",
        }),
        scyl: new THREE.MeshBasicMaterial({
            map: basicTexture(5),
            name: "scyl",
        }),
        ground: new THREE.MeshBasicMaterial({
            color: 0x3d4143,
            transparent: true,
            opacity: 0.5,
        }),
    });
    const [geos] = useState({
        sphere: new THREE.BufferGeometry().fromGeometry(
            new THREE.SphereGeometry(1, 16, 10)
        ),
        box: new THREE.BufferGeometry().fromGeometry(
            new THREE.BoxGeometry(1, 1, 1)
        ),
        cylinder: new THREE.BufferGeometry().fromGeometry(
            new THREE.CylinderGeometry(1, 1, 1)
        ),
    });
    const [ToRad] = useState(0.0174532925199432957);
    const reqContainer = useRef<number | null>(null);

    const layoutUpdate = useCallback(() => {
        console.log("layout update");
        renderer.setSize(ref.current!.clientWidth, ref.current!.clientHeight);
    }, [renderer]);

    const sceneInit = useCallback(() => {
        dirLight.position.set(-1, 1.75, 1);
        dirLight.position.multiplyScalar(30);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;

        camera.position.fromArray([
            -0.4013406342550598,
            7.44362999004455,
            11.24080658033156,
        ]);
        camera.quaternion.fromArray([
            -0.28811373671368645,
            -0.017086547783363,
            -0.005141753910019259,
            0.9574299384124418,
        ]);

        renderer.setSize(ref.current!.clientWidth, ref.current!.clientHeight);
        renderer.shadowMap.enabled = true;

        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 1;
        controls.maxDistance = 500;
        controls.maxPolarAngle = Math.PI / 2;

        scene.background = sceneBackgroundColor;
        scene.add(dirLight);
        scene.add(light);

        ref.current?.appendChild(renderer.domElement);
    }, [
        camera,
        controls,
        dirLight,
        light,
        renderer,
        scene,
        sceneBackgroundColor,
    ]);

    const addStaticBox = useCallback(
        (size, position, rotation) => {
            var mesh = new THREE.Mesh(geos.box, mats.ground);
            mesh.scale.set(size[0], size[1], size[2]);
            mesh.position.set(position[0], position[1], position[2]);
            mesh.rotation.set(
                rotation[0] * ToRad,
                rotation[1] * ToRad,
                rotation[2] * ToRad
            );
            scene.add(mesh);
            grounds.push(mesh);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        },
        [ToRad, geos.box, grounds, mats.ground, scene]
    );

    const populate = useCallback(() => {
        const max = 400;

        // reset old
        // clearMesh();
        world.clear();

        //add ground
        world.add({
            size: [40, 40, 390],
            pos: [-180, 20, 0],
            world: world,
        });
        world.add({
            size: [40, 40, 390],
            pos: [180, 20, 0],
            world: world,
        });
        world.add({
            size: [400, 80, 400],
            pos: [0, -40, 0],
            world: world,
        });

        addStaticBox([40, 40, 390], [-180, 20, 0], [0, 0, 0]);
        addStaticBox([40, 40, 390], [180, 20, 0], [0, 0, 0]);
        addStaticBox([400, 80, 400], [0, -40, 0], [0, 0, 0]);

        //add object
        let x, y, z, w;
        let i = max;

        while (i--) {
            x = -100 + Math.random() * 200;
            z = -100 + Math.random() * 200;
            y = 100 + Math.random() * 1000;
            w = 10 + Math.random() * 10;

            bodies[i] = world.add({
                type: "sphere",
                size: [w * 0.5],
                pos: [x, y, z],
                move: true,
                world: world,
            });
            meshes[i] = new THREE.Mesh(geos.sphere, mats.sph);
            meshes[i].scale.set(w * 0.5, w * 0.5, w * 0.5);

            meshes[i].castShadow = true;
            meshes[i].receiveShadow = true;

            scene.add(meshes[i]);
        }
    }, [addStaticBox, bodies, geos.sphere, mats.sph, meshes, scene, world]);

    const oimoInit = useCallback(() => {
        populate();
    }, [populate]);

    const oimoUpdate = useCallback(() => {
        if (world != null) {
            world.step();

            let x,
                y,
                z,
                mesh,
                body,
                i = bodies.length;

            while (i--) {
                body = bodies[i];
                mesh = meshes[i];

                if (!body.sleeping) {
                    mesh.position.copy(body.getPosition());
                    mesh.quaternion.copy(body.getQuaternion());

                    // change material
                    if (mesh.material.name === "sbox") mesh.material = mats.box;
                    if (mesh.material.name === "ssph") mesh.material = mats.sph;
                    if (mesh.material.name === "scyl") mesh.material = mats.cyl;

                    // reset position
                    if (mesh.position.y < -100) {
                        x = -100 + Math.random() * 200;
                        z = -100 + Math.random() * 200;
                        y = 100 + Math.random() * 1000;
                        body.resetPosition(x, y, z);
                    }
                } else {
                    if (mesh.material.name === "box") mesh.material = mats.sbox;
                    if (mesh.material.name === "sph") mesh.material = mats.ssph;
                    if (mesh.material.name === "cyl") mesh.material = mats.scyl;
                }
            }
        }
    }, [bodies, mats, meshes, world]);

    const update = useCallback(() => {
        controls.update();
        renderer.render(scene, camera);
        oimoUpdate();
        reqContainer.current = requestAnimationFrame(update);
    }, [camera, controls, oimoUpdate, renderer, scene]);

    useEffect(() => {
        node?.addListener(NODE_EVENT.UPDATE, layoutUpdate);
        return () => {
            node?.removeListener(NODE_EVENT.UPDATE, layoutUpdate);
        };
    }, [layoutUpdate, node]);

    useEffect(() => {
        sceneInit();
        oimoInit();
    }, [id, oimoInit, sceneInit]);

    useEffect(() => {
        update();
        return () => {
            if (reqContainer.current != null) {
                cancelAnimationFrame(reqContainer.current);
            }
        };
    }, [update]);

    return (
        <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
            <div style={{ flex: 1 }} ref={ref}></div>
        </div>
    );
});

export default ViewPort;
