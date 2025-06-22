import {
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'ap-northeast-2_SNy2daNcS', // Cognito User Pool ID
  ClientId: '1p6gp10unb3v2ovm5mkslpsbuj', // App client ID
};

const userPool = new CognitoUserPool(poolData);

// ✅ 회원가입 함수
export function signUp({ id, password, name, email, birthdate, address, latitude, longitude }) {
  const attributeList = [
    new CognitoUserAttribute({ Name: 'name', Value: name }),
    new CognitoUserAttribute({ Name: 'email', Value: email }),
    new CognitoUserAttribute({ Name: 'birthdate', Value: birthdate }),
    new CognitoUserAttribute({ Name: 'address', Value: address }),
  ];

  // 위도/경도가 주어졌다면 custom attribute로 추가
  if (latitude) {
    attributeList.push(new CognitoUserAttribute({ Name: 'custom:latitude', Value: latitude }));
  }
  if (longitude) {
    attributeList.push(new CognitoUserAttribute({ Name: 'custom:longitude', Value: longitude }));
  }

  return new Promise((resolve, reject) => {
    userPool.signUp(id, password, attributeList, null, (err, result) => {
      if (err) return reject(err);
      return resolve(result.user);
    });
  });
}

// ✅ 로그인 함수
export const signIn = (id, password) => {
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
        resolve();
      },
      onFailure: (err) => {
        console.error('❌ 로그인 실패:', err);
        reject(err);
      },
    });
  });
};
