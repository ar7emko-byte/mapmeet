module.exports = function (api) {
  api.cache(true);
  return {
    // NativeWind's `jsxImportSource` lets us pass `className` directly to
    // React Native primitives. Reanimated's plugin has to be last.
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // Reanimated 3.16's plugin internally requires react-native-worklets
    // (which we've installed as a direct dep). Keep it last so it runs
    // after every other Babel transform.
    plugins: ['react-native-reanimated/plugin'],
  };
};
