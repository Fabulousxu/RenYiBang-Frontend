import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ServiceDetailPage from '../../page/service_detail_page'; // 修改为实际路径
import { getService, getServiceComment, getServiceMessage, collectService, uncollectService, accessService, unaccessService, enterChat, deleteComment, deleteMessage, putMessage, putComment, likeComment, unlikeComment, likeMessage, unlikeMessage } from '../../service/service';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// 模拟服务
jest.mock('../../service/service', () => ({
    getService: jest.fn(),
    getServiceComment: jest.fn(),
    getServiceMessage: jest.fn(),
    collectService: jest.fn(),
    uncollectService: jest.fn(),
    accessService: jest.fn(),
    unaccessService: jest.fn(),
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

describe('ServiceDetailPage', () => {
    const serviceId = '1';

    beforeEach(() => {
        // 每次测试前清理模拟函数
        jest.clearAllMocks();

        window.matchMedia = window.matchMedia || function () {
            return {matches: false, addListener: () => {}, removeListener: () => {}}
        }
    });

    test('renders and loads service detail', async () => {
        // 模拟数据
        getService.mockResolvedValueOnce({
            id: serviceId,
            collected: false,
            accessed: false,
            status: 'ACTIVE'
        });
        getServiceComment.mockResolvedValueOnce({
            total: 0,
            items: []
        });
        getServiceMessage.mockResolvedValueOnce({
            total: 0
        });

        render(
            <MemoryRouter initialEntries={[`/services/${serviceId}`]}>
                <Routes>
                    <Route path="/services/:id" element={<ServiceDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getService).toHaveBeenCalledWith(serviceId);
        });
        expect(screen.getByText('收藏')).toBeInTheDocument();
        expect(screen.getByText('聊一聊')).toBeInTheDocument();
    });

    test('handles collect and uncollect actions', async () => {
        // 初始状态
        getService.mockResolvedValueOnce({
            id: serviceId,
            collected: false,
            accessed: false,
            status: 'ACTIVE'
        });
        collectService.mockResolvedValueOnce({});
        uncollectService.mockResolvedValueOnce({});

        render(
            <MemoryRouter initialEntries={[`/services/${serviceId}`]}>
                <Routes>
                    <Route path="/services/:id" element={<ServiceDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        // 确保 getService 被调用
        await waitFor(() => {
            expect(getService).toHaveBeenCalledWith(serviceId);
        });

        // 确保页面渲染了收藏按钮
        const collectButton = screen.getByText('收藏');
        expect(collectButton).toBeInTheDocument();

        // 点击收藏按钮
        fireEvent.click(collectButton);

        // 确保 collectService 被调用
        await waitFor(() => {
            expect(collectService).toHaveBeenCalledWith(serviceId);
        });

        // 更新状态
        getService.mockResolvedValueOnce({
            id: serviceId,
            collected: true,
            accessed: false,
            status: 'ACTIVE'
        });

        // 重新渲染组件以反映新的状态
        render(
            <MemoryRouter initialEntries={[`/services/${serviceId}`]}>
                <Routes>
                    <Route path="/services/:id" element={<ServiceDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        // 确保取消收藏按钮渲染
        await waitFor(() => {
            expect(screen.getByText('取消收藏')).toBeInTheDocument();
        });

        // 点击取消收藏按钮
        fireEvent.click(screen.getByText('取消收藏'));

        // 确保 uncollectService 被调用
        await waitFor(() => {
            expect(uncollectService).toHaveBeenCalledWith(serviceId);
        });
    });

    test('handles chat action', async () => {
        enterChat.mockResolvedValueOnce({});

        render(
            <MemoryRouter initialEntries={[`/services/${serviceId}`]}>
                <Routes>
                    <Route path="/services/:id" element={<ServiceDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('聊一聊')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('聊一聊'));

        await waitFor(() => {
            expect(enterChat).toHaveBeenCalledWith('service', serviceId);
        });
    });

    test('handles accept and unaccept actions', async () => {
        getService.mockResolvedValueOnce({
            id: serviceId,
            collected: false,
            accessed: false,
            status: 'ACTIVE'
        });
        accessService.mockResolvedValueOnce({});
        unaccessService.mockResolvedValueOnce({});

        render(
            <MemoryRouter initialEntries={[`/services/${serviceId}`]}>
                <Routes>
                    <Route path="/services/:id" element={<ServiceDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getService).toHaveBeenCalledWith(serviceId);
        });

        const acceptButton = screen.getByText('接任务');
        fireEvent.click(acceptButton);

        await waitFor(() => {
            expect(accessService).toHaveBeenCalledWith(serviceId);
        });

        // 更改数据
        getService.mockResolvedValueOnce({
            id: serviceId,
            collected: false,
            accessed: true,
            status: 'ACTIVE'
        });

        await waitFor(() => {
            expect(screen.getByText('取消接取')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('取消接取'));

        await waitFor(() => {
            expect(unaccessService).toHaveBeenCalledWith(serviceId);
        });
    });
});
