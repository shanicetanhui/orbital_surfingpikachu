import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { HomeScreen } from '../assets';
import { UserContext } from '../UserContext';
import themeContext from '../theme/themeContext';
import theme from '../theme/theme';

// Mock react-native-event-listeners
jest.mock('react-native-event-listeners', () => ({
  EventRegister: {
    addEventListener: jest.fn(),
    removeAllListeners: jest.fn(),
  },
}));

// Mock firebaseConfig
jest.mock('../firebaseConfig', () => ({
  auth: {
    currentUser: { uid: 'XvZ2FhJfbnRkToQk5tPQeuk3fN03' },
    onAuthStateChanged: jest.fn(),
  },
}));

// Mock API functions
jest.mock('../db', () => ({
  add_habit: jest.fn(),
  delete_habit: jest.fn(),
  update_habit: jest.fn(),
  read_initialData: jest.fn((setData, uid) => {
    setData([{
      title: 'Habits',
      subtitle: 'Small habits, big changes',
      data: [{
        title: 'Existing Habit',
        details: ['Some details'],
        goal: '5',
        color: 'rgba(252, 223, 202, 0.7)'
      }]
    }]);
  }),
  read_habits: jest.fn(() => Promise.resolve([{
    display_name: 'Existing Habit',
    description: 'Some details',
    goal: '5',
    color: 'rgba(252, 223, 202, 0.7)'
  }])),
  create_or_update: jest.fn(),
  fetch_entries_habit: jest.fn(),
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

describe('<HomeScreen />', () => {
  const mockLoggedInUser = { uid: 'XvZ2FhJfbnRkToQk5tPQeuk3fN03' };
  const mockSetLoggedInUser = jest.fn();

  const defaultProviderProps = {
    loggedInUser: mockLoggedInUser,
    setLoggedInUser: mockSetLoggedInUser,
  };

  it('renders the HomeScreen component', () => {
    const { getByText } = customRender(<HomeScreen />, { providerProps: defaultProviderProps });
    expect(getByText('Habits')).toBeTruthy();
  });

  it('opens the add new item modal when the "+" button is pressed', () => {
    const { getByText, getByPlaceholderText } = customRender(<HomeScreen />, { providerProps: defaultProviderProps });

    act(() => {
      fireEvent.press(getByText('+'));
    });

    expect(getByPlaceholderText('Enter new habits name')).toBeTruthy();
    expect(getByPlaceholderText('Enter daily goal')).toBeTruthy();
  });

  it('adds a new item when all inputs are filled and "Add Item" button is pressed', async () => {
    const { getByText, getByPlaceholderText } = customRender(<HomeScreen />, { providerProps: defaultProviderProps });

    act(() => {
      fireEvent.press(getByText('+'));
    });

    act(() => {
      fireEvent.changeText(getByPlaceholderText('Enter new habits name'), 'New Habit');
      fireEvent.changeText(getByPlaceholderText('Enter daily goal'), '5');
    });

    act(() => {
      fireEvent.press(getByText('Add Item'));
    });

    await waitFor(() => {
      expect(getByText('New Habit')).toBeTruthy();
    });
  });

  it('opens the edit modal when the "Edit" button is pressed', () => {
    const { getByText } = customRender(<HomeScreen />, { providerProps: defaultProviderProps });

    // Find the parent view containing the item title "test"
    const itemTitleElement = getByText('Existing Habit');
    const parentElement = itemTitleElement.closest('View');

    // Query the "Edit" button within the parent element
    const editButton = queryByText(parentElement, 'Edit');

    act(() => {
      fireEvent.press(editButton);
    });

    expect(getByText('EDIT')).toBeTruthy();
    expect(getByText('Confirm edit')).toBeTruthy();
  });

  it('deletes an item when the "Delete" button is pressed', async () => {
    const { getByText, queryByText } = customRender(<HomeScreen />, { providerProps: defaultProviderProps });

    // Find the parent view containing the item title "test"
    const itemTitleElement = getByText('Existing Habit');
    const parentElement = itemTitleElement.closest('View');

    // Query the "Edit" button within the parent element
    const deleteButton = queryByText(parentElement, 'Delete');

    act(() => {
      fireEvent.press(deleteButton);
    });

    // act(() => {
    //   fireEvent.press(getByText('Delete'));
    // });

    await waitFor(() => {
      expect(queryByText('Existing Habit')).toBeNull();
    });
  });

  it('toggles theme between light and dark mode', () => {
    const { getByText, rerender } = customRender(<HomeScreen />, { 
      providerProps: defaultProviderProps,
      themeProps: theme.light
    });

    let habitTitle = getByText('Habits');
    expect(habitTitle.props.style).toContainEqual({ color: 'black' });

    rerender(
      <UserContext.Provider value={defaultProviderProps}>
        <themeContext.Provider value={theme.dark}>
          <HomeScreen />
        </themeContext.Provider>
      </UserContext.Provider>
    );

    habitTitle = getByText('Habits');
    expect(habitTitle.props.style).toContainEqual({ color: 'white' });
  });
});

// describe('<HomeScreen />', () => {
//   const loggedInUser = { uid: 'XvZ2FhJfbnRkToQk5tPQeuk3fN03' };

//   const setup = (ui, { providerProps, themeProps }) => {
//     return render(
//       <UserProvider value={providerProps}>
//         <themeContext.Provider value={themeProps}>
//           {ui}
//         </themeContext.Provider>
//       </UserProvider>
//     );
//   };

//   it('renders the HomeScreen component', () => {
//     const providerProps = { loggedInUser };
//     const themeProps = theme.light;

//     const { getByText } = setup(<HomeScreen />, { providerProps, themeProps });

//     // Verify that the screen contains "Habits" title, indicating the section is rendered
//     expect(getByText('Habits')).toBeTruthy();
//   });

//   it('opens the add new item modal when the "+" button is pressed', () => {
//     const providerProps = { loggedInUser };
//     const themeProps = theme.light;

//     const { getByText, getByPlaceholderText } = setup(<HomeScreen />, { providerProps, themeProps });

//     // Simulate button press to open modal
//     fireEvent.press(getByText('+'));

//     // Verify that modal components are visible
//     expect(getByPlaceholderText('Enter new habits name')).toBeTruthy();
//     expect(getByPlaceholderText('Enter daily goal')).toBeTruthy();
//   });

//   it('adds a new item when all inputs are filled and "Add Item" button is pressed', async () => {
//     const providerProps = { loggedInUser };
//     const themeProps = theme.light;

//     const { getByText, getByPlaceholderText } = setup(<HomeScreen />, { providerProps, themeProps });

//     // Simulate button press to open modal
//     fireEvent.press(getByText('+'));

//     // Fill out inputs
//     fireEvent.changeText(getByPlaceholderText('Enter new habits name'), 'New Habit');
//     fireEvent.changeText(getByPlaceholderText('Enter daily goal'), '5');

//     // Simulate adding new item
//     fireEvent.press(getByText('Add Item'));

//     // Wait for any asynchronous tasks
//     await waitFor(() => {
//       expect(getByText('New Habit')).toBeTruthy();
//     });
//   });

//   it('opens the edit modal when the "Edit" button is pressed', () => {
//     const providerProps = { loggedInUser };
//     const themeProps = theme.light;

//     const { getByText } = setup(<HomeScreen />, { providerProps, themeProps });

//     // Assuming the item "Existing Habit" exists, find its edit button
//     fireEvent.press(getByText('Edit'));

//     // Verify that the edit modal components are visible
//     expect(getByText('EDIT')).toBeTruthy();
//     expect(getByText('Confirm edit')).toBeTruthy();
//   });

//   it('deletes an item when the "Delete" button is pressed', async () => {
//     const providerProps = { loggedInUser };
//     const themeProps = theme.light;

//     const { getByText } = setup(<HomeScreen />, { providerProps, themeProps });

//     // Assuming the item "Existing Habit" exists, find its delete button
//     fireEvent.press(getByText('Delete'));

//     // Confirm delete in the modal
//     fireEvent.press(getByText('Delete'));

//     // Wait for deletion process
//     await waitFor(() => {
//       // The specific item should no longer exist in the component
//       expect(() => getByText('Existing Habit')).toThrow('Unable to find an element');
//     });
//   });

//   it('toggles theme between light and dark mode', () => {
//     const providerProps = { loggedInUser };
//     const themeProps = theme.light;

//     const { getByText, rerender } = setup(<HomeScreen />, { providerProps, themeProps });

//     // Change theme context to dark mode
//     rerender(
//       <UserProvider value={providerProps}>
//         <themeContext.Provider value={theme.dark}>
//           <HomeScreen />
//         </themeContext.Provider>
//       </UserProvider>
//     );

//     // Verify dark theme styles are applied
//     const habitTitle = getByText('Habits');
//     expect(habitTitle.props.style).toContainEqual({ color: 'white' }); // Replace with actual dark theme styles

//     // Revert back to light mode and verify
//     rerender(
//       <UserProvider value={providerProps}>
//         <themeContext.Provider value={theme.light}>
//           <HomeScreen />
//         </themeContext.Provider>
//       </UserProvider>
//     );

//     expect(habitTitle.props.style).toContainEqual({ color: 'black' }); // Replace with actual light theme styles
//   });
// });
