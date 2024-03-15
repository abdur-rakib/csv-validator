# CSV File Validator

This is a Node.js script to validate CSV files based on specific criteria. It reads CSV files from a directory, validates the headers, and then validates each row according to defined rules.

## Features

- Validates CSV file headers
- Validates each row of the CSV file against specific criteria
- Detects duplicates in the order_id column
- Provides detailed error logging during validation

## Requirements

- Node.js
- npm (Node Package Manager)

## Run Locally

Clone the project

```bash
  https://github.com/abdur-rakib/csv-validator.git
```

Go to the project directory

```bash
  cd csv-validator
```

Install dependencies

```bash
  npm install
```

Start the application

```bash
  node index.js
```

## License

[MIT](https://github.com/abdur-rakib/csv-validator/blob/master/license.md)
