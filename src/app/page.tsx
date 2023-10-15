"use client";
import styles from "./page.module.scss";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/lib/store";

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [userName, setUserName] = useState("");
  const [roomId, setroomId] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);

  const { setUsername: setStoreUserName } = useStore.getState();

  const router = useRouter();

  const handleJoin = useCallback(
    (username: string, roomid: string) => {
      if (username !== "" && roomid !== "") {
        setShowSpinner(true);
        // You can remove this setTimeout and add your own logic
        setTimeout(() => {
          setStoreUserName(username);
          setShowChat(true);
          setShowSpinner(false);

          router.push(`/chat/${roomid}`);
        }, 100);
      } else {
        alert("Please fill in Username and Room Id");
      }
    },
    [setStoreUserName, router]
  );

  return (
    <div>
      <div
        className={styles.main_div}
        style={{ display: showChat ? "none" : "" }}
      >
        <input
          className={styles.main_input}
          type="text"
          placeholder="Username"
          onChange={(e) => setUserName(e.target.value)}
          disabled={showSpinner}
        />
        <input
          className={styles.main_input}
          type="text"
          placeholder="room id"
          onChange={(e) => setroomId(e.target.value)}
          disabled={showSpinner}
        />
        <button
          className={styles.main_button}
          onClick={() => handleJoin(userName, roomId)}
        >
          {!showSpinner ? (
            "Join"
          ) : (
            <div className={styles.loading_spinner}></div>
          )}
        </button>
      </div>
    </div>
  );
}
