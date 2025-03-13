import { useState, useEffect } from 'react';
import { signOut } from "firebase/auth";
import { 
  Box, 
  Typography, 
  Button, 
  Chip,
  Avatar
} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { auth } from "../../firebaseConfig.js";

const Header = () => {
  // 現在ログインしているユーザーの状態を管理
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ログアウト処理
  const handleLogout = () => {
    signOut(auth).then(() => {
      // ログアウト成功
      console.log("ログアウト成功");
    }).catch((error) => {
      // エラー処理
      console.error("ログアウトエラー:", error);
    });
  };

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // クリーンアップ関数
    return () => unsubscribe();
  }, []);

  // ローディング中は何も表示しない
  if (loading) {
    return null;
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 0',
        borderBottom: '1px solid #eaeaea'
      }}
    >
      <Box>
        {currentUser ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              avatar={<Avatar><AccountCircleIcon /></Avatar>}
              label={currentUser.email}
              variant="outlined"
              color="primary"
              sx={{ mr: 2 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              でログインしています
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary">
            ログインしていません
          </Typography>
        )}
      </Box>
      
      {currentUser && (
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          ログアウト
        </Button>
      )}
    </Box>
  );
};

export default Header;