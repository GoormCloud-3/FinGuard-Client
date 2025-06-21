import {
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'ap-northeast-2_SNy2daNcS', // 본인의 Cognito User Pool ID 입력
  ClientId: '1p6gp10unb3v2ovm5mkslpsbuj', // 본인의 App client ID 입력
};

const userPool = new CognitoUserPool(poolData);

export function signUp({ id, password, name, email, birthdate, address }) {
  const attributeList = [
    new CognitoUserAttribute({ Name: 'name', Value: name }),
    new CognitoUserAttribute({ Name: 'email', Value: email }),
    new CognitoUserAttribute({ Name: 'birthdate', Value: birthdate }),
    new CognitoUserAttribute({ Name: 'address', Value: address }),
  ];

  return new Promise((resolve, reject) => {
    userPool.signUp(id, password, attributeList, null, (err, result) => {
      if (err) return reject(err);
      return resolve(result.user);
    });
  });
}
