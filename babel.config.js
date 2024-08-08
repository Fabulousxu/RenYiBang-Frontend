module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', {
      runtime: 'automatic' // 将 runtime 配置为 @babel/preset-react 的选项
    }]
  ]
};
