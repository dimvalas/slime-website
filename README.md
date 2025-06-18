# Basket System Project

## Overview
This project implements a simple basket system for managing items in a web application. It allows users to add, remove, and view items in their basket.

## Project Structure
```
Web #1
├── app.ts
├── basket.ts
├── items.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Files Description
- **app.ts**: Entry point of the application. Initializes the application and sets up necessary configurations and routes.
- **basket.ts**: Contains the `Basket` class for managing items in the basket.
- **items.ts**: Defines the `Item` interface and functions for item data manipulation.
- **package.json**: Lists project dependencies and scripts for building and running the application.
- **tsconfig.json**: TypeScript configuration file specifying compiler options.

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run `npm install` to install the required dependencies.
4. Compile the TypeScript files using `tsc`.
5. Start the application with `node app.js`.

## Usage
- Use the `Basket` class to manage items in the basket.
- Create instances of `Item` to represent products.
- Call methods like `addItem`, `removeItem`, and `getItems` to manipulate the basket.

## Contributing
Feel free to submit issues or pull requests for improvements or bug fixes.

## License
This project is licensed under the MIT License.