"use strict";

var _react = _interopRequireDefault(require("react"));
var _react2 = require("@testing-library/react");
var _profile_page = _interopRequireDefault(require("../page/profile_page"));
var _user = require("../service/user");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Mock the service functions
jest.mock('../service/user', () => ({
  getUserProfile: jest.fn(),
  getUserTasks: jest.fn()
}));
jest.mock('../service/task', () => ({
  unaccessTask: jest.fn()
}));
describe('UserPage', () => {
  const mockUser = {
    avatar: 'avatar_url',
    nickname: 'testuser',
    intro: 'This is a test user.',
    type: 'regular',
    rating: 95,
    balance: 1000
  };
  beforeEach(() => {
    _user.getUserProfile.mockResolvedValue(mockUser);
  });
  it('renders user profile information', async () => {
    (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_profile_page.default, null));
    expect(_user.getUserProfile).toHaveBeenCalled();
    expect(await _react2.screen.findByText('testuser')).toBeInTheDocument();
    expect(_react2.screen.getByText('This is a test user.')).toBeInTheDocument();
  });
  it('renders user balance correctly', async () => {
    (0, _react2.render)( /*#__PURE__*/_react.default.createElement(_profile_page.default, null));
    expect(await _react2.screen.findByText(/10.00元/)).toBeInTheDocument();
  });
});
