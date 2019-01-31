declare namespace Kakao {
  function init(apiKey: string): void;
  namespace Auth {
    function createLoginButton(options: {
      container: string,
      success: (authObj: any) => void,
      fail: (err: any) => void,
    }): any;
  }
}