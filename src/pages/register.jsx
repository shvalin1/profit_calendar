import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

// Firebaseの初期化をインポート
import { auth } from "../../firebaseConfig.js";

export default function Register() {
  // useStateでユーザーが入力したメールアドレスとパスワードをemailとpasswordに格納する
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  // ユーザーが登録ボタンを押したときにdoRegister関数が実行される
  const doRegister = () => {
    // Firebaseで用意されているユーザー登録の関数
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // ユーザー登録すると自動的にログインされてuserCredential.userでユーザーの情報を取得できる
        const user = userCredential.user;
        // 成功メッセージを表示
        setAlertMessage("登録完了！");
        setSeverity("success");
        setOpen(true);
        console.log(user);
      })
      .catch((error) => {
        // エラーメッセージを表示
        setAlertMessage(`エラー: ${error.message}`);
        setSeverity("error");
        setOpen(true);
        console.log(error);
      });
  };

  // handleClose関数を追加
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <PersonAddIcon sx={{ fontSize: 40, mb: 2, color: "primary.main" }} />
          <Typography component="h1" variant="h5" gutterBottom>
            新規登録
          </Typography>

          <Box component="form" sx={{ mt: 1, width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="メールアドレス"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="パスワード"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              onClick={doRegister}
            >
              登録
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
