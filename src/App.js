import React, { useState } from "react"; // React ve useState hook'unu içe aktar
import { Chat } from "./components/Chat"; // Chat bileşenini içe aktar
import { Auth } from "./components/Auth.js"; // Auth bileşenini içe aktar
import { AppWrapper } from "./components/AppWrapper"; // AppWrapper bileşenini içe aktar
import Cookies from "universal-cookie"; // Universal Cookies paketini içe aktar
import "./App.css"; // App.css dosyasını içe aktar

const cookies = new Cookies();

function ChatApp() {
  // ChatApp adında bir işlev bileşeni tanımla
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token")); // Kimlik doğrulama durumu ve kimlik doğrulama durumunu güncelleme işlevi için bir useState hook'u kullan
  const [isInChat, setIsInChat] = useState(null); // Sohbet odasında olma durumu ve bu durumu güncelleme işlevi için bir useState hook'u kullan
  const [room, setRoom] = useState(""); // Sohbet odası adı ve bu adı güncelleme işlevi için bir useState hook'u kullan
  // Eğer kullanıcı kimlik doğrulamamışsa, Auth bileşenini göster

  if (!isAuth) {
    return (
      <AppWrapper
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        setIsInChat={setIsInChat}
      >
        <Auth setIsAuth={setIsAuth} />
      </AppWrapper>
    );
  }
  // Eğer kullanıcı kimlik doğrulamışsa, bir sohbet odasına katılma seçeneği sun

  return (
    <AppWrapper isAuth={isAuth} setIsAuth={setIsAuth} setIsInChat={setIsInChat}>
      {!isInChat ? (
        <div className="room">
          <label> Type room name: </label>
          <input onChange={(e) => setRoom(e.target.value)} />
          <button
            onClick={() => {
              setIsInChat(true);
            }}
          >
            Enter Chat
          </button>
        </div>
      ) : (
        <Chat room={room} />
      )}
    </AppWrapper>
  );
}

export default ChatApp;