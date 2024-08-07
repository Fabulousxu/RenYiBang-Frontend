import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TaskDetailPage from '../../page/task_detail_page'; // 修改为实际路径
import { getTask, getTaskComment, getTaskMessage, collectTask, uncollectTask, accessTask, unaccessTask, enterChat, deleteComment, deleteMessage, putMessage, putComment, likeComment, unlikeComment, likeMessage, unlikeMessage } from '../../service/task';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// 模拟服务
jest.mock('../../service/task', () => ({
    getTask: jest.fn(),
    getTaskComment: jest.fn(),
    getTaskMessage: jest.fn(),
    collectTask: jest.fn(),
    uncollectTask: jest.fn(),
    accessTask: jest.fn(),
    unaccessTask: jest.fn(),
    enterChat: jest.fn(),
    deleteComment: jest.fn(),
    deleteMessage: jest.fn(),
    putMessage: jest.fn(),
    putComment: jest.fn(),
    likeComment: jest.fn(),
    unlikeComment: jest.fn(),
    likeMessage: jest.fn(),
    unlikeMessage: jest.fn(),
}));

describe('TaskDetailPage', () => {
    const taskId = '1';

    beforeEach(() => {
        // 每次测试前清理模拟函数
        jest.clearAllMocks();

        window.matchMedia = window.matchMedia || function () {
            return {matches: false, addListener: () => {}, removeListener: () => {}}
        }
    });

    test('renders and loads task detail', async () => {
        // 模拟数据
        getTask.mockResolvedValueOnce({
            id: taskId,
            collected: false,
            accessed: false,
            status: 'ACTIVE'
        });
        getTaskComment.mockResolvedValueOnce({
            total: 0,
            items: []
        });
        getTaskMessage.mockResolvedValueOnce({
            total: 0
        });

        render(
            <MemoryRouter initialEntries={[`/tasks/${taskId}`]}>
                <Routes>
                    <Route path="/tasks/:id" element={<TaskDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getTask).toHaveBeenCalledWith(taskId);
        });
        expect(screen.getByText('收藏')).toBeInTheDocument();
        expect(screen.getByText('聊一聊')).toBeInTheDocument();
    });

    test('handles collect and uncollect actions', async () => {
        // 初始状态
        getTask.mockResolvedValueOnce({
            id: taskId,
            collected: false,
            accessed: false,
            status: 'ACTIVE'
        });
        collectTask.mockResolvedValueOnce({});
        uncollectTask.mockResolvedValueOnce({});

        render(
            <MemoryRouter initialEntries={[`/tasks/${taskId}`]}>
                <Routes>
                    <Route path="/tasks/:id" element={<TaskDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        // 确保 getTask 被调用
        await waitFor(() => {
            expect(getTask).toHaveBeenCalledWith(taskId);
        });

        // 确保页面渲染了收藏按钮
        const collectButton = screen.getByText('收藏');
        expect(collectButton).toBeInTheDocument();

        // 点击收藏按钮
        fireEvent.click(collectButton);

        // 确保 collectTask 被调用
        await waitFor(() => {
            expect(collectTask).toHaveBeenCalledWith(taskId);
        });

        // 更新状态
        getTask.mockResolvedValueOnce({
            id: taskId,
            collected: true,
            accessed: false,
            status: 'ACTIVE'
        });

        // 重新渲染组件以反映新的状态
        render(
            <MemoryRouter initialEntries={[`/tasks/${taskId}`]}>
                <Routes>
                    <Route path="/tasks/:id" element={<TaskDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        // 确保取消收藏按钮渲染
        await waitFor(() => {
            expect(screen.getByText('取消收藏')).toBeInTheDocument();
        });

        // 点击取消收藏按钮
        fireEvent.click(screen.getByText('取消收藏'));

        // 确保 uncollectTask 被调用
        await waitFor(() => {
            expect(uncollectTask).toHaveBeenCalledWith(taskId);
        });
    });

    test('handles chat action', async () => {
        enterChat.mockResolvedValueOnce({});

        render(
            <MemoryRouter initialEntries={[`/tasks/${taskId}`]}>
                <Routes>
                    <Route path="/tasks/:id" element={<TaskDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('聊一聊')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('聊一聊'));

        await waitFor(() => {
            expect(enterChat).toHaveBeenCalledWith('task', taskId);
        });
    });

    test('handles accept and unaccept actions', async () => {
        getTask.mockResolvedValueOnce({
            id: taskId,
            collected: false,
            accessed: false,
            status: 'ACTIVE'
        });
        accessTask.mockResolvedValueOnce({});
        unaccessTask.mockResolvedValueOnce({});

        render(
            <MemoryRouter initialEntries={[`/tasks/${taskId}`]}>
                <Routes>
                    <Route path="/tasks/:id" element={<TaskDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getTask).toHaveBeenCalledWith(taskId);
        });

        const acceptButton = screen.getByText('接任务');
        fireEvent.click(acceptButton);

        await waitFor(() => {
            expect(accessTask).toHaveBeenCalledWith(taskId);
        });

        // 更改数据
        getTask.mockResolvedValueOnce({
            id: taskId,
            collected: false,
            accessed: true,
            status: 'ACTIVE'
        });

        await waitFor(() => {
            expect(screen.getByText('取消接取')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('取消接取'));

        await waitFor(() => {
            expect(unaccessTask).toHaveBeenCalledWith(taskId);
        });
    });
});
