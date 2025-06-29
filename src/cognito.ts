import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';

// 사용자 풀 정보
const poolData = {
  UserPoolId: 'ap-northeast-2_SNy2daNcS', // ← 본인의 User Pool ID
  ClientId: '1p6gp10unb3v2ovm5mkslpsbuj', // ← 본인의 App Client ID
};

export const userPool = new CognitoUserPool(poolData);

// ✅ 회원가입 함수
export function signUp({
  id,
  password,
  name,
  email,
  birthdate,
  address,
  latitude,
  longitude,
  secondaryPin,
}: {
  id: string;
  password: string;
  name: string;
  email: string;
  birthdate: string;
  address: string;
  latitude: string;
  longitude: string;
  secondaryPin: string;
}): Promise<CognitoUser> {
  const attributeList: CognitoUserAttribute[] = [
    new CognitoUserAttribute({ Name: 'name', Value: name }),
    new CognitoUserAttribute({ Name: 'email', Value: email }),
    new CognitoUserAttribute({ Name: 'birthdate', Value: birthdate }),
    new CognitoUserAttribute({ Name: 'address', Value: address }),
    new CognitoUserAttribute({ Name: 'custom:latitude', Value: latitude }),
    new CognitoUserAttribute({ Name: 'custom:longitude', Value: longitude }),
    new CognitoUserAttribute({ Name: 'custom:secondaryPin', Value: secondaryPin }),
  ];

  return new Promise((resolve, reject) => {
    userPool.signUp(id, password, attributeList, [], (err, result) => {
      if (err || !result?.user) return reject(err);
      return resolve(result.user);
    });
  });
}
// ✅ 로그인 함수
export function signIn(id: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const authDetails = new AuthenticationDetails({
      Username: id,
      Password: password,
    });

    const user = new CognitoUser({
      Username: id,
      Pool: userPool,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        console.log('✅ 로그인 성공:', result);
        resolve(); // 또는 resolve(result) 원한다면 반환값 전달 가능
      },
      onFailure: (err) => {
        console.error('❌ 로그인 실패:', err);
        reject(err);
      },
    });
  });
}

export function getCurrentUser(): CognitoUser | null {
  return userPool.getCurrentUser();
}

