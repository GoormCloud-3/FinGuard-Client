/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// 1. RN 기본 설정 읽어오기
const defaultConfig = getDefaultConfig(__dirname);

// 2. 커스텀 설정: 필요한 sourceExts(확장자)만 추가
const customConfig = {
  resolver: {
    // 기본 확장자 목록에 'cjs', 'mjs'만 덧붙이기
    sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs', 'mjs'],

    // ❗ platforms 배열은 건드리지 않기.
    // platforms: ['android', 'ios']  ← 넣지 말 것
  },

  /**
   * 필요 시 transformer · server 항목도 여기에서 커스터마이즈
   * (예: react-native-svg-transformer 사용 시 등)
   */
};

// 3. 기본 설정과 병합하여 내보내기
module.exports = mergeConfig(defaultConfig, customConfig);