/*   Cognito 래퍼 – 회원가입 / 로그인 / 현재 유저*/

import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';

/* ✅ 사용자 풀 설정 */
const poolData = {
  UserPoolId: 'ap-northeast-2_SNy2daNcS',      // your pool
  ClientId:   '1p6gp10unb3v2ovm5mkslpsbuj',    // your client
};

export const userPool = new CognitoUserPool(poolData);

/* ── 회원가입 ──────────────────────────────── */
/** 가입 완료 시 `userSub`(고유 id) 를 돌려준다 */
export function signUp(params: {
  id: string;
  password: string;
  name: string;
  email: string;
  birthdate: string;
  address: string;
  latitude: string;
  longitude: string;
  secondaryPin: string;
}): Promise<{ user: CognitoUser; userSub: string }> {
  const {
    id, password, name, email,
    birthdate, address,
    latitude, longitude,
    secondaryPin,
  } = params;

  const attrs: CognitoUserAttribute[] = [
    new CognitoUserAttribute({ Name: 'name', Value: name }),
    new CognitoUserAttribute({ Name: 'email', Value: email }),
    new CognitoUserAttribute({ Name: 'birthdate', Value: birthdate }),
    new CognitoUserAttribute({ Name: 'address', Value: address }),
    new CognitoUserAttribute({ Name: 'custom:latitude',  Value: latitude }),
    new CognitoUserAttribute({ Name: 'custom:longitude', Value: longitude }),
    new CognitoUserAttribute({ Name: 'custom:secondaryPin', Value: secondaryPin }),
  ];

  return new Promise((resolve, reject) => {
    userPool.signUp(id, password, attrs, [], (err, result) => {
      if (err || !result) return reject(err);
      resolve({ user: result.user, userSub: result.userSub });
    });
  });
}

/* ── 로그인 ───────────────────────────────── */
export async function signIn(
  id: string,
  password: string,
): Promise<string> {            // ✅ sub 문자열 반환
  const user = new CognitoUser({ Username: id, Pool: userPool });
  const authDetails = new AuthenticationDetails({ Username: id, Password: password });

  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: session => {
        // id 토큰 payload 안에 sub 포함
        const sub: string = session.getIdToken().payload.sub;
        resolve(sub);
      },
      onFailure: err => reject(err),
    });
  });
}

/* ── 현재 로그인 유저 ─────────────────────── */
export function getCurrentUser(): CognitoUser | null {
  return userPool.getCurrentUser();
}
