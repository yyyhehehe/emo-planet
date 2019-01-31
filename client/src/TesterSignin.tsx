import React, { useContext, useState } from "react";

import { Button, TextField } from "@material-ui/core";

import axios from "axios";

import { apiEndpoint } from "./endpoints";
import { onChange } from "./utils";

import Overlays from "./Overlays";

export default function({ authorize }: { authorize: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const overlays = useContext(Overlays);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <TextField
        value={username}
        onChange={onChange(setUsername)}
        label="아이디"
      />
      <TextField
        value={password}
        onChange={onChange(setPassword)}
        label="비밀번호"
        type="password"
      />
      <Button
        onClick={async () => {
          try {
            await axios.post(`${apiEndpoint}/auth`, { username, password });
            overlays.toast(`${username}님 반갑습니다!`);
            authorize();
          } catch (ex) {
            overlays.toast("로그인 실패!");
          }
        }}
        color="primary">
        로그인
    </Button>
    </div>
  );
}
