import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
  Snackbar,
  Link as MuiLink
} from "@mui/material";
import LockResetIcon from '@mui/icons-material/LockReset';
import Link from "next/link";
import { auth } from "../../firebaseConfig.js";
import Header from "../components/Header";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const doResetEmail = () => {
    const actionCodeSettings = {
      // パスワード再設定後にログイン画面にリダイレクトさせる
      url: `${window.location.origin}/login`,
      handleCodeInApp: false,
    };

    // Firebaseで用意されているパスワード再設定のメールを送るための関数
    sendPasswordResetEmail(auth, email, actionCodeSettings)
      .then(() => {
        setAlertMessage("パスワード再設定メールを送信しました");
        setSeverity("success");
        setOpen(true);
        console.log(email);
      })
      .catch((error) => {
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
      <Header />
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <LockResetIcon sx={{ fontSize: 40, mb: 2, color: "primary.main" }} />
          <Typography component="h1" variant="h5" gutterBottom>
            パスワード再設定
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: "center" }}>
            登録したメールアドレスを入力してください。
            パスワード再設定用のリンクをメールで送信します。
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
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              onClick={doResetEmail}
            >
              送信
            </Button>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Link href="/login" passHref>
                <MuiLink variant="body2" component="span">
                  ログイン画面に戻る
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