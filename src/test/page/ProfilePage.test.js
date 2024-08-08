import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import ProfilePage from '../../page/profile_page';
import { MemoryRouter } from 'react-router-dom';
import { getSelfProfile } from '../../service/user';
import '@testing-library/jest-dom/extend-expect';
jest.mock('../../service/user');

// 模拟 window.matchMedia
beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(), // 已弃用
            removeListener: jest.fn(), // 已弃用
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });
});

describe('ProfilePage Component', () => {
    test('should display user information on load', async () => {
        getSelfProfile.mockResolvedValue({
            nickname: 'John Doe',
            intro: 'Developer',
            phone: '1234567890',
            email: 'john@example.com',
            avatar: 'avatar_url',
        });

        render(
            <MemoryRouter>
                <ProfilePage />
            </MemoryRouter>
        );

        // 检查用户信息是否显示
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Developer')).toBeInTheDocument();
            expect(screen.getByText('1234567890')).toBeInTheDocument();
            expect(screen.getByText('john@example.com')).toBeInTheDocument();
        });
    });
});


