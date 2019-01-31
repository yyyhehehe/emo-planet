import React, { useEffect, useState } from "react";

import {Provider as OverlaysProvider} from "./Overlays";

import Game from "./Game";
import TesterSignin from "./TesterSignin";

export default function() {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      Kakao.init(process.env.KAKAO_CLIENT_ID!);
      // 카카오 로그인 버튼을 생성합니다.
      Kakao.Auth.createLoginButton({
        container: "#kakao-login-btn",
        success(authObj) {
          alert(JSON.stringify(authObj));
        },
        fail(err) {
          alert(JSON.stringify(err));
        },
      });
    }
  });

  return (
    <OverlaysProvider>
      {authorized
        ? <Game />
        :
        <div className="center-container">
          {process.env.NODE_ENV === "production"
            ? <div id="kakao-login-btn" />
            : <TesterSignin authorize={() => setAuthorized(true)} />
          }
        </div>}
    </OverlaysProvider>
  );
}
