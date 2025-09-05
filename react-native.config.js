module.exports = {
  dependencies: {
    // 완전히 빌드에서 제외 (앱에서 JS만 쓸 때 문제 없음)
    '@aws-amplify/react-native': { platforms: { android: null, ios: null } },

    // amazon-cognito-identity-js는 JS 라이브러리라 네이티브 불필요.
    // rnconfig에 네이티브 섹션이 잡혀 충돌하므로 오토링킹만 오프.
    'amazon-cognito-identity-js': { platforms: { android: null, ios: null } },
    '@notifee/react-native': {
      platforms: { android: null },
    },
  },
};