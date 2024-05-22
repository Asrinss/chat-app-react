import React, { useState, useEffect } from "react"; // React ve useState, useEffect hook'larını içe aktar
import { db, auth, storage } from "../firebase-config"; // Firebase yapılandırması ve servislerini içe aktar
import { collection, addDoc, where, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore"; // Firestore işlevlerini içe aktar
import { ref, uploadBytes, getDownloadURL, deleteObject } from "@firebase/storage"; // Storage işlevlerini içe aktar
import data from '@emoji-mart/data'; // Emoji verilerini içe aktar
import Picker from '@emoji-mart/react'; // Emoji seçici bileşenini içe aktar
import "../styles/Chat.css"; // Stil dosyasını içe aktar
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesome bileşenlerini içe aktar
import { faPaperPlane, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'; // FontAwesome ikonlarını içe aktar

// Firebase Firestore'dan "messages" 
const messagesRef = collection(db, "messages");

export const Chat = ({ room }) => {
  // State'lerin tanımlanması
  const [messages, setMessages] = useState([]); // Mesajlar ve bu durumu güncellemek için bir useState hook'u kullan
  const [newMessage, setNewMessage] = useState(""); // Yeni mesaj ve bu durumu güncellemek için bir useState hook'u kullan
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false); // Emoji seçicinin görünürlüğü ve bu durumu güncellemek için bir useState hook'u kullan
  const [editingMessageId, setEditingMessageId] = useState(null); // Düzenlenen mesajın kimliği ve bu durumu güncellemek için bir useState hook'u kullan
  const [editingMessageText, setEditingMessageText] = useState(""); // Düzenlenen mesajın metni ve bu durumu güncellemek için bir useState hook'u kullan
  const [imageUpload, setImageUpload] = useState(null); // Yüklenen resim ve bu durumu güncellemek için bir useState hook'u kullan

  // Belirli bir odaya ait mesajlar
  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsuscribe();
  }, [room]);


  // Mesaj gönderme işlemi
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage === "" && !imageUpload) return;

    let imageUrl = "";
    if (imageUpload) {
      const imageRef = ref(storage, `images/${imageUpload.name}`);
      await uploadBytes(imageRef, imageUpload);
      imageUrl = await getDownloadURL(imageRef);
      setImageUpload(null);
    }


    await addDoc(messagesRef, {
      text: newMessage,
      imageUrl: imageUrl || "",
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room,
    });

    setNewMessage("");
    setImageUpload(null);
    
  };
  // Emoji ekleme
  const addEmoji = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji.native);
    setEmojiPickerVisible(false);
  };
  // Mesaj silme
  const handleDelete = async (id, imageUrl) => {
    const messageDoc = doc(db, "messages", id);
    await deleteDoc(messageDoc);

    if (imageUrl) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    }
  };
  // Mesaj düzenleme
  const handleEdit = (id, text) => {
    setEditingMessageId(id);
    setEditingMessageText(text);
  };
  // Düzenlenmiş mesajı gönderme
  const handleEditSubmit = async (id) => {
    const messageDoc = doc(db, "messages", id);
    await updateDoc(messageDoc, { text: editingMessageText });
    setEditingMessageId(null);
    setEditingMessageText("");
  };
    // Arayuz
  return (
    <div className="chat-app">
      <div className="header">
        <h1>{room.toUpperCase()}</h1>
      </div>
      <div className="messages"> {messages.map((message) => (
          <div key={message.id} className={`message ${message.user === auth.currentUser.displayName ? "my-message" : "other-message"}`}>
            {editingMessageId === message.id ? (
              <input
                type="text"
                value={editingMessageText}
                onChange={(e) => setEditingMessageText(e.target.value)}
                onBlur={() => handleEditSubmit(message.id)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleEditSubmit(message.id);
                  }
                }}
                autoFocus
              />
            ) : (
              <div onClick={() => handleEdit(message.id, message.text)}>
                <span className="user">{message.user}:</span> {message.text}
                {message.imageUrl && <img src={message.imageUrl} alt="send" className="uploaded-image" />}
              </div>
            )}
            {message.user === auth.currentUser.displayName && (
              <button onClick={() => handleDelete(message.id)} className="delete-button"><FontAwesomeIcon icon={faTrash} /></button>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="new-message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          className="new-message-input"
          placeholder="Type your message here..."
        />
        <button type="button" className="emoji-button" onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}>
          😀
        </button>
        {emojiPickerVisible && (
          <Picker data={data} onEmojiSelect={addEmoji} style={{ position: 'absolute', bottom: '50px', right: '20px' }} />
        )}
        <label htmlFor="imageUpload" className="upload-button">
          <FontAwesomeIcon icon={faUpload} />
        </label>
        <input type="file" id="imageUpload" accept="image/*" onChange={(event) => setImageUpload(event.target.files[0])} style={{ display: 'none' }} />
        <button type="submit" className="send-button"><FontAwesomeIcon icon={faPaperPlane} /></button>
      </form>
    </div>
  );
};
