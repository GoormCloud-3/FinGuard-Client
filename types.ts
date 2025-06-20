export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  SetAccountPin: undefined;
  Home: undefined;
  AccountDetail: undefined;
};

//  화면 이름과 그에 전달할 데이터 타입을 정의해둔 파일
// Home, AccountDetail 두 화면 모두 넘겨줄 데이터가 없기 때문에 undefined


// 로그인 및 회원가입에 필요한 타입 정의
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  SetAccountPin: undefined; // ← 새로 추가
}; 


//  화면 이름과 그에 전달할 데이터 타입을 정의해둔 파일
// Home, AccountDetail 두 화면 모두 넘겨줄 데이터가 없기 때문에 undefined

