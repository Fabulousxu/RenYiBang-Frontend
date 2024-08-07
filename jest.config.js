module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!antd)/',  // 让 Jest 处理 antd 中的 ES 模块
  ],
  moduleFileExtensions: ['js', 'jsx'],
};

