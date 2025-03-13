import { createContext, useState, useContext, useEffect } from 'react';
import { 
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { CircularProgress, Box } from '@mui/material';
import { auth } from '../../firebaseConfig.js';

// 認証コンテキストを作成
const AuthContext = createContext();

// 認証プロバイダーコンポーネント
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ユーザー登録関数
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // ログイン関数
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ログアウト関数
  const logout = () => {
    return signOut(auth);
  };

  // パスワードリセット関数
  const resetPassword = (email) => {
    const actionCodeSettings = {
      // パスワード再設定後にログイン画面にリダイレクトさせる
      url: `${window.location.origin}/login`,
      handleCodeInApp: false,
    };
    return sendPasswordResetEmail(auth, email, actionCodeSettings);
  };

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // クリーンアップ関数
    return unsubscribe;
  }, []);

  // コンテキストの値
  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword
  };

  // ローディング中はローディングインジケーターを表示
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// カスタムフック - 認証コンテキストを使用するためのフック
export const useAuth = () => {
  return useContext(AuthContext);
};