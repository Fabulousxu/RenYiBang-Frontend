import React from 'react';
import {render, waitFor, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ServicePage from '../../page/service_page';
import { searchService } from '../../service/service';
import { BrowserRouter as Router } from 'react-router-dom';
import { message } from 'antd';
import userEvent from "@testing-library/user-event";

jest.mock('../../service/service');
// jest.mock('../../component/basic_layout', () => (props) => <div>{props.children}</div>);

jest.mock('antd', () => {
    const originalModule = jest.requireActual('antd');
    return {
        ...originalModule,
        message: {
            error: jest.fn(),
        },
    };
});

describe('ServicePage', () => {
    beforeAll(() => {
        searchService.mockResolvedValue(
            {
                total: 100,
                items: [{
                    serviceId: '1',
                    collected: true,
                    title: 'Test Service',
                    description: 'This is a test service.',
                    owner: {
                        userId: '1',
                        nickname: 'test',
                        rating: 100,
                        avatar: 'test.jpg',
                    }
                }],
            }
        );
        window.matchMedia = window.matchMedia || function () {
            return { matches: false, addListener: () => {}, removeListener: () => {} };
        };
    });

    test('renders ServicePage and fetches services', async () => {
        searchService.mockResolvedValueOnce({
            total: 1,
            items: [{
                serviceId: '1',
                collected: true,
                title: 'Test Service',
                description: 'This is a test service.',
            }],
        });

        render(
            <Router>
                <ServicePage />
            </Router>
        );

        await waitFor(() => {
            expect(searchService).toHaveBeenCalledWith('', 24, 0, 'time', ['', ''], [0, -1]);
        });

        // 验证 ServicePage 是否渲染了任务
        const serviceElement = screen.getByRole('heading', { name: '任务 0条' });
        expect(serviceElement).toBeInTheDocument();
    });

    test('handles search service error', async () => {
        searchService.mockRejectedValueOnce('Search failed');

        render(
            <Router>
                <ServicePage />
            </Router>
        );

        await waitFor(() => {
            expect(message.error).toHaveBeenCalledWith('Search failed');
        });
    });

    test('ItemList onSearch function', async () => {
        // Mock the searchService to return a resolved value
        searchService.mockResolvedValueOnce({
            total: 1,
            items: [{
                serviceId: '1',
                collected: true,
                title: 'Test Service',
                description: 'This is a test service.',
                owner: {
                    userId: '1',
                    nickname: 'test',
                    rating: 100,
                    avatar: 'test.jpg',
                }
            }],
        });

        // Render ServicePage component
        render(
            <Router>
                <ServicePage />
            </Router>
        );

        // Ensure that initial searchService call is made
        await waitFor(() => {
            expect(searchService).toHaveBeenCalledWith('', 24, 0, 'time', ['', ''], [0, -1]);
        });

        // Find and interact with search input and button
        const searchInput = screen.getByPlaceholderText('请输入任务关键词或用户关键词来搜索相关任务');
        const searchButton = screen.getByRole('button', { name: '搜 索' }); // Use the exact name as rendered

        userEvent.type(searchInput, 'test');
        userEvent.click(searchButton);

        // Wait for the searchService to be called with correct arguments
        await waitFor(() => {
            expect(searchService).toHaveBeenCalledWith('test', 24, 0, 'time', ['', ''], [0, -1]);
        });
    });

});
