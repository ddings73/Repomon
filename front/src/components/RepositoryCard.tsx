`use-client`;

import { setActiveRepo } from "@/api/userRepo";
import { useAppSelector } from "@/redux/hooks";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CardSkeleton from "./Skeletons/CardSkeleton";
import * as THREE from "three";
import styles from "./RepositoryCard.module.scss";

type propType = {
  title: string | undefined;
  desc: string | undefined;
  exp: number | undefined;
  rating: number | undefined;
  isActive: boolean | undefined;
  userId: string | undefined;
  repoId: number;
  isSameUser: boolean | undefined;
  setIsSameUser: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  isLoaded: boolean | undefined;
  repomonId: number;
  repomonUrl: string;
};

function RepositoryCard(props: propType) {
  const [isActive, setIsActive] = useState<boolean | undefined>(props.isActive);
  const [userOriginId, setUserOriginId] = useState<number>();
  const login = useAppSelector((state) => state.authReducer.login);
  const router = useRouter();

  function handleClick() {
    setIsActive(!isActive);
    if (props.repoId) setActiveRepo(props.repoId);
    console.log("변경");
  }

  function handleBtnRegist() {
    router.push(`/repo/${props.repoId}/registRepo`);
  }

  function handleRouting() {
    if (props.isActive) {
      // 활성화 일 때,
      router.push(`/repo/${props.repoId}`);
    } else {
      // 아닐 때
      if (props.isSameUser) router.push(`/repo/${props.repoId}`);
    }
  }
  // 3D 모델 렌더링

  useEffect(() => {
    if (sessionStorage.getItem("accessToken")) {
      setUserOriginId(parseInt(sessionStorage.getItem("userId") as string, 10));
    } else {
      setUserOriginId(-1);
    }
  }, [login]);

  useEffect(() => {
    if (userOriginId == props.userId) {
      props.setIsSameUser(true);
    } else {
      props.setIsSameUser(false);
    }
  }, [props.isSameUser]);

  return !props.isLoaded ? (
    <CardSkeleton />
  ) : (
    <div
      className="h-64 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
      style={{
        opacity: isActive ? "1" : "0.5",
      }}
      id={styles.cardContainer}
    >
      <div
        style={{
          height: "10%",
          justifyContent: "flex-end",
          display: "flex",
          visibility: props.isSameUser ? "visible" : "hidden",
          marginBottom: "1em",
        }}
      >
        <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          레포지터리 공개
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            defaultChecked={isActive ? true : false}
            onClick={() => handleClick()}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[0px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "80%",
          marginBottom: "5%",
        }}
      >
        <div
          style={{
            width: "40%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Canvas key={props.repoId}>
            <directionalLight
              color="white"
              position={[0, 0, 5]}
              intensity={0.5}
            />
            <directionalLight
              color="white"
              position={[-5, 0, -5]}
              intensity={0.5}
            />
            <Model repomonUrl={props.repomonUrl} repoId={props.repoId} />
          </Canvas>
        </div>
        <div style={{ width: "50%" }}>
          <p
            style={{
              fontSize: "2em",
              fontWeight: "600",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              cursor: props.isSameUser
                ? "pointer"
                : props.isActive
                ? "pointer"
                : "auto",
            }}
            onClick={handleRouting}
            id={styles.repoTitle}
          >
            {props.title}
          </p>
          <p
            style={{ fontSize: "1em", fontWeight: "500", marginBlock: "3%" }}
            id={styles.repoDesc}
          >
            {props.desc === null ? "설명 없음" : props.desc}
          </p>
          {props.repomonId >= 9000 ? (
            <button
              style={{
                display: props.isSameUser ? "block" : "none",
                textAlign: "center",
                backgroundColor: "#5AA7FF",
                color: "white",
                width: "10em",
                height: "3em",
                borderRadius: "10px",
                marginTop: "2em",
              }}
              onClick={handleBtnRegist}
              disabled={!isActive}
              id={styles.repoBtn}
            >
              레포몬 등록
            </button>
          ) : (
            <div style={{ display: props.isSameUser ? "block" : "none" }}>
              <p>경험치 : {props.exp}</p>
              <p>배틀 레이팅 : {props.rating} </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RepositoryCard;
type modelProps = {
  repomonUrl: string;
  repoId: number;
};
const Model = (props: modelProps) => {
  const [repomonURL, setRepomonURL] = useState<string>(props.repomonUrl);
  const [repoId, setRepoId] = useState<number>(props.repoId);
  // 기본값은 알 크기
  const filename = repomonURL.slice(repomonURL.lastIndexOf("/") + 1);
  const num = filename.slice(-5, filename.length - 4);
  const str = num.toString();
  // console.log(repomonURL + "?id=" + repoId);
  const getModelLevel = (str: string): number[] => {
    switch (str) {
      case "2":
        return [4.5, 4.5, 4.5];
      case "3":
        return [4, 4, 4];
      default:
        return [5, 5, 5];
    }
  };
  const getModelPosition = (str: string): number[] => {
    switch (str) {
      case "2":
        return [1, -2, 0];
      case "3":
        return [1, -2, 0];
      default:
        return [0, -2, 0];
    }
  };

  const [scaleState, setScaleState] = useState<number[]>(getModelLevel(str));
  const [positionState, setPositionState] = useState<number[]>(
    getModelPosition(str)
  );

  const gltf = useLoader(GLTFLoader, repomonURL + "?id=" + repoId);

  let mixer: THREE.AnimationMixer | undefined;

  if (gltf.animations.length) {
    mixer = new THREE.AnimationMixer(gltf.scene);
    mixer.timeScale = 0.4;
    const action = mixer.clipAction(gltf.animations[0]);
    action.clampWhenFinished = true;
    action.play();
  }

  useFrame((state, delta) => {
    mixer?.update(delta);
    // gltf.scene.rotation.y += delta * 0.05; // 회전 속도를 조절할 수 있습니다.
  });

  return (
    <primitive
      object={gltf.scene}
      scale={scaleState}
      position={positionState}
      rotation={[0.2, -0.8, 0]}
    />
  );
};
