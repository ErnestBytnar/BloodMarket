import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from './RegisterPage';

// Mock api/auth registerUser
jest.mock('../../api/auth', () => ({
    registerUser: jest.fn(),
}));

import { registerUser } from '../../api/auth';

// Mock useNavigate from react-router-dom
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

describe('RegisterPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders form inputs and button', () => {
        render(<RegisterPage />);

        expect(screen.getByPlaceholderText(/Nazwa użytkownika/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/^Hasło$/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Powtórz hasło/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Zarejestruj się/i })).toBeInTheDocument();
    });

    test('shows validation error when submitting empty form', async () => {
        render(<RegisterPage />);

        fireEvent.click(screen.getByRole('button', { name: /Zarejestruj się/i }));

        await waitFor(() => {
            expect(screen.getByText(/Email jest wymagany/i)).toBeInTheDocument();
        });
    });

    test('calls registerUser and navigates on successful submit', async () => {
        registerUser.mockResolvedValueOnce(); // symuluj sukces

        render(<RegisterPage />);

        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Nazwa użytkownika/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText(/^Hasło$/i), { target: { value: 'Aa123456!' } });
        fireEvent.change(screen.getByPlaceholderText(/Powtórz hasło/i), { target: { value: 'Aa123456!' } });

        // mock alert
        window.alert = jest.fn();

        fireEvent.click(screen.getByRole('button', { name: /Zarejestruj się/i }));

        await waitFor(() => {
            expect(registerUser).toHaveBeenCalledWith('testuser', 'test@example.com', 'Aa123456!');
            expect(window.alert).toHaveBeenCalledWith('Rejestracja zakończona sukcesem');
            expect(mockedUsedNavigate).toHaveBeenCalledWith('/login');
        });
    });

    test('shows error message on failed registration', async () => {
        // symulujemy odpowiedź błędu z backendu
        registerUser.mockRejectedValueOnce({
            response: {
                data: {
                    username: 'Nazwa zajęta',
                    email: '',
                    password: '',
                    passwordRep: ''
                }
            }
        });

        render(<RegisterPage />);

        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Nazwa użytkownika/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText(/^Hasło$/i), { target: { value: 'Aa123456!' } });
        fireEvent.change(screen.getByPlaceholderText(/Powtórz hasło/i), { target: { value: 'Aa123456!' } });

        fireEvent.click(screen.getByRole('button', { name: /Zarejestruj się/i }));

        await waitFor(() => {
            expect(screen.getByText('Nazwa zajęta')).toBeInTheDocument();
        });
    });
});
