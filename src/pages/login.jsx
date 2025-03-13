import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
  Snackbar,
  Link as MuiLink,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import Link from "next/link";

// Firebaseの初期化をインポート
import { auth } from "../../firebaseConfig.js";
import  Header  from "../components/Header";

export default function Login() {
  // useStateでユーザーが入力したメールアドレスとパスワードをemailとpasswordに格納する
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  // ユーザーがログインボタンを押したときにdoLogin関数が実行される
  const doLogin = () => {
    // Firebaseで用意されているログイン関数
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // ログインに成功するとuserCredential.userでユーザーの情報を取得できる
        const user = userCredential.user;
        // 成功メッセージを表示
        setAlertMessage("ログイン成功！");
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
          <LoginIcon sx={{ fontSize: 40, mb: 2, color: "primary.main" }} />
          <Typography component="h1" variant="h5" gutterBottom>
            ログイン
          </Typography>
          <Header />
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              onClick={doLogin}
            >
              ログイン
            </Button>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Link href="/forgot_password" passHref>
                <MuiLink variant="body2" component="span">
                  パスワードを忘れた場合
                </MuiLink>
              </Link>
            </Box>

            <Box sx={{ mt: 1, textAlign: "center" }}>
              <Link href="/register" passHref>
                <MuiLink variant="body2" component="span">
                  アカウントをお持ちでない方はこちら
                </MuiLink>
              </Link>
            </Box>
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
