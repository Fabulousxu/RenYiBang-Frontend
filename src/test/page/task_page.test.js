import React from 'react';
import {render, waitFor, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TaskPage from '../../page/task_page';
import { searchTask } from '../../service/task';
import { BrowserRouter as Router } from 'react-router-dom';
import { message } from 'antd';
import userEvent from "@testing-library/user-event";

jest.mock('../../service/task');
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

describe('TaskPage', () => {
    beforeAll(() => {
        searchTask.mockResolvedValue(
            {
                total: 100,
                items: [{
                    taskId: '1',
                    collected: true,
                    title: 'Test Task',
                    description: 'This is a test task.',
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

    test('renders TaskPage and fetches tasks', async () => {
        searchTask.mockResolvedValueOnce({
            total: 1,
            items: [{
                taskId: '1',
                collected: true,
                title: 'Test Task',
                description: 'This is a test task.',
            }],
        });

        render(
            <Router>
                <TaskPage />
            </Router>
        );

        await waitFor(() => {
            expect(searchTask).toHaveBeenCalledWith('', 24, 0, 'time', ['', ''], [0, -1]);
        });

        // 验证 TaskPage 是否渲染了任务
        const taskElement = screen.getByRole('heading', { name: '任务 0条' });
        expect(taskElement).toBeInTheDocument();
    });

    test('handles search task error', async () => {
        searchTask.mockRejectedValueOnce('Search failed');

        render(
            <Router>
                <TaskPage />
            </Router>
        );

        await waitFor(() => {
            expect(message.error).toHaveBeenCalledWith('Search failed');
        });
    });

    test('ItemList onSearch function', async () => {
        // Mock the searchTask to return a resolved value
        searchTask.mockResolvedValueOnce({
            total: 1,
            items: [{
                taskId: '1',
                collected: true,
                title: 'Test Task',
                description: 'This is a test task.',
                owner: {
                    userId: '1',
                    nickname: 'test',
                    rating: 100,
                    avatar: 'test.jpg',
                }
            }],
        });

        // Render TaskPage component
        render(
            <Router>
                <TaskPage />
            </Router>
        );

        // Ensure that initial searchTask call is made
        await waitFor(() => {
            expect(searchTask).toHaveBeenCalledWith('', 24, 0, 'time', ['', ''], [0, -1]);
        });

        // Find and interact with search input and button
        const searchInput = screen.getByPlaceholderText('请输入任务关键词或用户关键词来搜索相关任务');
        const searchButton = screen.getByRole('button', { name: '搜 索' }); // Use the exact name as rendered

        userEvent.type(searchInput, 'test');
        userEvent.click(searchButton);

        // Wait for the searchTask to be called with correct arguments
        await waitFor(() => {
            expect(searchTask).toHaveBeenCalledWith('test', 24, 0, 'time', ['', ''], [0, -1]);
        });
    });

});
