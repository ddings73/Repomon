"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Header.module.scss";
import Logo from "../../public/logo.png";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { axiosRequestLogout } from "@/api/auth";
import { usePathname, useRouter } from "next/navigation";
import gitCat from "../../public/git_cat.svg";
import { getBaseURL } from "@/api/axios";
import { setAuthLogoutState } from "@/redux/features/authSlice";

const Header = () => {
  const githubLoginUrl = getBaseURL() + "/oauth2/authorization/github";
  const login = useAppSelector((state) => state.authReducer.login);
  const [userId, setUserId] = useState<number>();
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  /** ======================================== useEffect ======================================== */
  useEffect(() => {
    if (login || sessionStorage.getItem("accessToken")) {
      setUserId(parseInt(sessionStorage.getItem("userId") as string, 10));
      setAvatarUrl(sessionStorage.getItem("avatarUrl") as string);
      setUsername(sessionStorage.getItem("userName") as string);
    } else {
      setUserId(-1);
    }
  }, [login]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  /** ======================================== event Handler ======================================== */
  const onClickAvatar = () => {
    setShowMenu((prev) => !prev);
  };

  const onClickRepoList = () => {
    setShowMenu(false);
    router.push(`user/${userId}`);
  };

  const onClickLogout = async () => {
    setShowMenu(false);
    try {
      const res = await axiosRequestLogout();
      sessionStorage.clear();
      setUserId(-1);
      router.push(".");
      dispatch(setAuthLogoutState());
    } catch (err) {}
  };
  const pathname = usePathname();

  return (
    <>
      {!pathname.includes("repoBattle") && (
        <header className={styles.component}>
          <div className={styles.left}>
            <div className={styles["logo-div"]}>
              <Link href="/">
                <Image
                  src={Logo}
                  alt="logo"
                  placeholder="blur"
                  className={styles.logo}
                />
              </Link>
            </div>
            <Link href="/docs" className={styles.item}>
              Docs
            </Link>
            <Link href="/rank" className={styles.item}>
              랭킹
            </Link>
            {userId && userId !== -1 && (
              <Link
                href={`user/${userId}`}
                className={`${styles.item} ${styles["my-profile"]}`}
              >
                내 프로필
              </Link>
            )}
          </div>
          <div className={styles.right}>
            {userId === -1 && (
              <Link href={githubLoginUrl} className={styles.item}>
                로그인
              </Link>
            )}
            {userId && userId !== -1 && (
              <div className={styles["right-inner"]}>
                <p onClick={onClickRepoList}>{username}</p>
                <div className={styles["avatar-div"]}>
                  <Image
                    alt="프로필 이미지"
                    src={avatarUrl ? avatarUrl : gitCat}
                    width={50}
                    height={50}
                    className={styles.avatar}
                    onClick={onClickAvatar}
                  />
                  {showMenu && (
                    <div ref={menuRef} className={styles.menu}>
                      <button
                        style={{ marginBottom: "1rem" }}
                        onClick={onClickRepoList}
                      >
                        내 프로필
                      </button>
                      <button onClick={onClickLogout}>로그아웃</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
