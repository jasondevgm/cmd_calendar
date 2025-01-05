# Calendar Application

This is a simple calendar application designed to help users manage their events in an intuitive and easy way. The application allows users to create, read, update, and delete events.

## Features

- **Create Events**: Users can create new events with details such as title, date, time, location, and description.
- **Read Events**: Users can view all their created events.
- **Update Events**: Users can modify existing events to update information like date, time, or any other relevant detail.
- **Delete Events**: Users can delete events that are no longer needed.

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```sh
    cd <folder>
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## Usage

1. Run the application:
    ```sh
    node launch.js
    ```
2. Follow the prompts in the terminal to interact with the application.

## Code Overview

### index.js

This is the main file of the application. It contains the following key components:

- **User Class**: Represents a user with properties like userID, userName, timeStamp, and userEvents. It includes methods to get all events, add an event, modify an event, and delete an event.
- **Functions**:
  - `generateUserId()`: Generates a unique user ID.
  - `saveDataAsync(data)`: Saves data asynchronously to a file.
  - `readFileAsync()`: Reads data asynchronously from a file.
  - `showMenu()`: Displays the main menu.
  - `execFunct(res)`: Executes the selected menu function.
  - `question()`: Prompts the user to continue.
  - `dateDiff(date1, date2, time1, time2)`: Calculates the difference between two dates.
  - `addNewEvent()`: Adds a new event.
  - `showAllEvents()`: Displays all events.
  - `modifyMyEvent()`: Modifies an existing event.
  - `continueModifing(numUser)`: Continues modifying the selected event.
  - `deleteEvent()`: Deletes an event.
  - `showHelp()`: Displays the help information.
  - `showError()`: Displays an error message.
  - `main()`: The main function that initializes the application.

### calendar.module.js

This file contains the `showCalendar` function, which is used to display the calendar.

### launch.js

This file contains the script to launch the application in a new command prompt window.

### db.json

This file is used to store the user data persistently.

## Dependencies

- `prompt-sync`: For synchronous command-line input.
- `terminal-kit`: For enhanced terminal output.
- `fs.promises`: For file system operations.

## License

This project is licensed under the MIT License.