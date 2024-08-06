import React from 'react';
import '@testing-library/jest-dom';
import ChatList from "../../component/chat_list";
import {render, fireEvent, screen} from "@testing-library/react";

describe('ChatList', () => {
  const chats = [{
    chatter: {avatar: 'avatar1', nickname: 'user1'},
    lastMessageContent: 'content1',
    lastMessageCreatedAt: 'yyyy-MM-dd HH:mm:ss',
    unreadCount: 1,
  }, {
    chatter: {avatar: 'avatar2', nickname: 'user2'},
    lastMessageContent: 'content2',
    lastMessageCreatedAt: 'yyyy-MM-dd HH:mm:ss',
    unreadCount: 0,
  }]

  beforeAll(() => {
    window.matchMedia = window.matchMedia || function () {
      return {matches: false, addListener: () => {}, removeListener: () => {}}
    }
  })

  test('render test', () => {
    render(<ChatList list={chats} onChat={() => {}}/>)
    expect(screen.getByText('user1')).toBeInTheDocument()
    expect(screen.getByText('user2')).toBeInTheDocument()
    expect(screen.getByText('content1')).toBeInTheDocument()
    expect(screen.getByText('content2')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  test('onchat test', () => {
    const handleChat = jest.fn()
    render(<ChatList list={chats} onChat={handleChat}/>)
    fireEvent.click(screen.getByText('user1'))
    expect(handleChat).toHaveBeenCalledTimes(1)
    expect(handleChat).toHaveBeenCalledWith({
      chatter: {avatar: 'avatar1', nickname: 'user1'},
      lastMessageContent: 'content1',
      lastMessageCreatedAt: 'yyyy-MM-dd HH:mm:ss',
      unreadCount: 0
    })
  })
})