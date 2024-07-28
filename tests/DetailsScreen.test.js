import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { DetailsScreen } from '../assets';
import { UserContext } from '../UserContext';
import themeContext from '../theme/themeContext';
import theme from '../theme/theme';

// Mock the necessary modules
jest.mock('react-native-chart-kit', () => ({
  LineChart: () => null
}));

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
}));

jest.mock('../db', () => ({
  fetch_entries_habit: jest.fn(() => Promise.resolve([
    { day: new Date('2023-07-01'), num: 5, habit: 'TestHabit' },
    { day: new Date('2023-07-02'), num: 7, habit: 'TestHabit' },
  ])),
  add_entry: jest.fn(),
  create_or_update: jest.fn(),
  delete_habit_entry: jest.fn(),
  update_entry: jest.fn(),
  today_date: jest.fn(() => new Date()),
  date_display_format: jest.fn(() => {return '11/11'})
}));

// Custom render function
const customRender = (ui, { providerProps = {}, themeProps = theme.light, ...renderOptions } = {}) => {
  return render(
    <UserContext.Provider value={providerProps}>
      <themeContext.Provider value={themeProps}>
        {ui}
      </themeContext.Provider>
    </UserContext.Provider>,
    renderOptions
  );
};

describe('<DetailsScreen />', () => {
  const mockLoggedInUser = { uid: 'XvZ2FhJfbnRkToQk5tPQeuk3fN03' };
  const mockSetLoggedInUser = jest.fn();
  const mockRoute = {
    params: {
      item: {
        title: 'Test Habit',
        details: ['Daily goal: 5'],
        goal: '5',
        color: 'rgba(252, 223, 202, 0.7)',
      },
      additionalDetails: 'Some additional details',
    },
  };
  const mockNavigation = { navigate: jest.fn() };

  const defaultProviderProps = {
    loggedInUser: mockLoggedInUser,
    setLoggedInUser: mockSetLoggedInUser,
  };

  it('renders the DetailsScreen component', async () => {
    const { getByText } = customRender(
      <DetailsScreen route={mockRoute} navigation={mockNavigation} />,
      { providerProps: defaultProviderProps }
    );

    await waitFor(() => {
      expect(getByText('Test Habit')).toBeTruthy();
      expect(getByText('Daily goal: 5')).toBeTruthy();
    });
  });

  it('increments counter when + button is pressed', async () => {
    const { getByText } = customRender(
      <DetailsScreen route={mockRoute} navigation={mockNavigation} />,
      { providerProps: defaultProviderProps }
    );

    await waitFor(() => {
      const plusButton = getByText('+');
      fireEvent.press(plusButton);
    });

    await waitFor(() => {
      expect(getByText('1')).toBeTruthy();
    });
  });

  it('decrements counter when - button is pressed', async () => {
    const { getByText } = customRender(
      <DetailsScreen route={mockRoute} navigation={mockNavigation} />,
      { providerProps: defaultProviderProps }
    );

    await waitFor(() => {
      const plusButton = getByText('+');
      fireEvent.press(plusButton);
      fireEvent.press(plusButton);
    });

    await waitFor(() => {
      const minusButton = getByText('-');
      fireEvent.press(minusButton);
    });

    await waitFor(() => {
      expect(getByText('1')).toBeTruthy();
    });
  });

  it('schedules a notification when reminder is set', async () => {
    const { getByText, getByPlaceholderText } = customRender(
      <DetailsScreen route={mockRoute} navigation={mockNavigation} />,
      { providerProps: defaultProviderProps }
    );

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('Hour:'), '14');
      fireEvent.changeText(getByPlaceholderText('Minutes:'), '30');
      fireEvent.press(getByText('Schedule Notification'));
    });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Notification scheduled!');
    });
  });

  it('opens edit modal when edit button is pressed', async () => {
    const { getByText } = customRender(
      <DetailsScreen route={mockRoute} navigation={mockNavigation} />,
      { providerProps: defaultProviderProps }
    );

    await waitFor(() => {
      fireEvent.press(getByText('edit'));
    });

    await waitFor(() => {
      expect(getByText('Edit data')).toBeTruthy();
    });
  });

  it('deletes entry when delete button is pressed', async () => {
    const { getAllByText } = customRender(
      <DetailsScreen route={mockRoute} navigation={mockNavigation} />,
      { providerProps: defaultProviderProps }
    );

    await waitFor(() => {
      const deleteButtons = getAllByText('delete');
      fireEvent.press(deleteButtons[0]);
    });

    // You might want to add an expectation here to check if the entry was deleted
  });

  it('adds new entry when add data button is pressed', async () => {
    const { getByText, getByPlaceholderText } = customRender(
      <DetailsScreen route={mockRoute} navigation={mockNavigation} />,
      { providerProps: defaultProviderProps }
    );

    await waitFor(() => {
      fireEvent.press(getByText('Add Data'));
    });

    await waitFor(() => {
      fireEvent.changeText(getByPlaceholderText('Year'), '2023');
      fireEvent.changeText(getByPlaceholderText('Month'), '7');
      fireEvent.changeText(getByPlaceholderText('Day'), '15');
      fireEvent.changeText(getByPlaceholderText('Num'), '10');
      fireEvent.press(getByText('Submit'));
    });

    // You might want to add an expectation here to check if the new entry was added
  });
});