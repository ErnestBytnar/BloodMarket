import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';

// Mock useNavigate z react-router-dom
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// Mock AuthContext - zwracamy poprawny kontekst jako React Context
import ReactContext from 'react';

const mockLogin = jest.fn();

jest.mock('../../context/AuthContext', () => {
  const React = require('react');
  return {
    AuthContext: React.createContext({
      login: jest.fn(),
    }),
  };
});

import { AuthContext } from '../../context/AuthContext';

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderWithContext() {
    return render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <LoginPage />
      </AuthContext.Provider>
    );
  }

  test('renders inputs and button', () => {
    renderWithContext();

    expect(screen.getByPlaceholderText(/Nazwa użytkownika/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Hasło/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Zaloguj się/i })).toBeInTheDocument();
  });

  test('shows validation error when submitting empty form', async () => {
    renderWithContext();

    fireEvent.click(screen.getByRole('button', { name: /Zaloguj się/i }));

    await waitFor(() => {
      expect(screen.getByText(/Nazwa jest wymagana/i)).toBeInTheDocument();
    });
  });

  test('shows validation error on invalid username', async () => {
    renderWithContext();

    fireEvent.change(screen.getByPlaceholderText(/Nazwa użytkownika/i), { target: { value: 'a' } });
    fireEvent.change(screen.getByPlaceholderText(/Hasło/i), { target: { value: 'Aa123456!' } });
    fireEvent.click(screen.getByRole('button', { name: /Zaloguj się/i }));

    await waitFor(() => {
      expect(screen.getByText(/Dane są nieprawidłowe/i)).toBeInTheDocument();
    });
  });

  test('calls login and navigates on successful login', async () => {
    mockLogin.mockResolvedValueOnce();

    renderWithContext();

    fireEvent.change(screen.getByPlaceholderText(/Nazwa użytkownika/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Hasło/i), { target: { value: 'Aa123456!' } });

    fireEvent.click(screen.getByRole('button', { name: /Zaloguj się/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'Aa123456!');
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows error message on login failure with 429 status', async () => {
    mockLogin.mockRejectedValueOnce({ status: 429, data: { detail: 'Zbyt wiele prób' } });

    renderWithContext();

    fireEvent.change(screen.getByPlaceholderText(/Nazwa użytkownika/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Hasło/i), { target: { value: 'Aa123456!' } });

    fireEvent.click(screen.getByRole('button', { name: /Zaloguj się/i }));

    await waitFor(() => {
      expect(screen.getByText(/Zbyt wiele prób/i)).toBeInTheDocument();
    });
  });

  test('shows generic error message on login failure without 429 status', async () => {
    mockLogin.mockRejectedValueOnce({ status: 401 });

    renderWithContext();

    fireEvent.change(screen.getByPlaceholderText(/Nazwa użytkownika/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Hasło/i), { target: { value: 'Aa123456!' } });

    fireEvent.click(screen.getByRole('button', { name: /Zaloguj się/i }));

    await waitFor(() => {
      expect(screen.getByText(/Niepoprawne dane/i)).toBeInTheDocument();
    });
  });
});
