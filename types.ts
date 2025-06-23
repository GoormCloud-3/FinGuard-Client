export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  SetAccountPin: undefined;
  Home: undefined;
  AccountDetail: { accountId: string} ;
  SendMoney: { fromAccountId: string };
  EnterAmount: { fromAccountId: string; toAccountId: string };
};

//  화면 이름과 그에 전달할 데이터 타입을 정의해둔 파일



// 로그인 및 회원가입에 필요한 타입 정의
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  SetAccountPin: undefined; // ← 새로 추가
}; 



export type SignUpParams = {
  id: string;
  password: string;
  name: string;
  email: string;
  birthdate: string;
  address: string;
  latitude?: string;
  longitude?: string;  
};