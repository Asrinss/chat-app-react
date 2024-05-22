import { auth, provider } from "../firebase-config.js"; // Firebase kimlik doğrulama yapılandırmasını ve Google kimlik doğrulama sağlayıcısını içe aktar
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth"; // Firebase kimlik doğrulama işlemleri için gerekli fonksiyonları içe aktar
import "../styles/Auth.css"; // Stil dosyasını içe aktar
import Cookies from "universal-cookie"; // Universal Cookies paketini içe aktar
import { useState } from "react"; // React'in useState hook'unu içe aktar

const cookies = new Cookies(); // Universal Cookies kullanarak yeni bir cookie nesnesi oluştur

export const Auth = ({ setIsAuth }) => {
  // State'leri tanımlama 
  const [email, setEmail] = useState(""); // E-posta durumu ve bu durumu güncellemek için bir useState hook'u kullan
  const [password, setPassword] = useState(""); // Şifre durumu ve bu durumu güncellemek için bir useState hook'u kullan
  const [confirmPassword, setConfirmPassword] = useState(""); // Şifre onayı durumu ve bu durumu güncellemek için bir useState hook'u kullan
  const [username, setUsername] = useState(""); // Kullanıcı adı durumu ve bu durumu güncellemek için bir useState hook'u kullan
  const [isRegister, setIsRegister] = useState(false); // Kayıt modu durumu ve bu durumu güncellemek için bir useState hook'u kullan
  
  // Google ile giriş fonksiyonu
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
      setIsAuth(true);
    } catch (err) {
      console.error(err);
    }
  };
  
   // Email değişikliğini ele al
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  // Şifre değişikliğini ele al
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  // Şifre onayı değişikliğini ele al
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };
  // Kullanıcı adı değişikliğini ele al
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  // Form gönderimini ele al
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isRegister && password !== confirmPassword) {
      console.error("Passwords do not match!");
      return;
    }
    try {
      if (isRegister) {
        // Yeni kullanıcı oluştur
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Kullanıcı profili güncelle
        await updateProfile(userCredential.user, {
          displayName: username,
        });
      } else {
        // Giriş yap
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Kullanıcıyı kimliklendirme
      cookies.set("auth-token", auth.currentUser.refreshToken);
      setIsAuth(true);
    } catch (err) {
      console.error(err);
    }
  };
  // Modu değiştir
  const toggleMode = () => {
    setIsRegister(!isRegister);
  };

   // JSX dön
  return (
    <div className="auth">
      <button onClick={signInWithGoogle}>Sign In With Google</button>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        {isRegister && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        )}
        <button type="submit">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <button className="toggle-button" onClick={toggleMode}>
        {isRegister ? "Already have an account? Login" : "Register"}
      </button>
    </div>
  );
};
