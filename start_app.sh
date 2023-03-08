#!/bin/bash

# Define project path
PROJECT_PATH="/home/eirik/Coding/jobInterview/fckedup/time-register-app"

# Change directory to project path or exit if directory does not exist
cd "$PROJECT_PATH" || exit 1

# Update dependencies
pnpm update

# Start Next.js development server in the background
nohup pnpm run dev > /dev/null 2>&1 &

# Wait for server to start
echo "Waiting for server to start..."
until $(curl --output /dev/null --silent --head --fail http://localhost:3000); do
  printf '.'
  sleep 1
done
echo "Server is running"

# Check the logs for errors
LOG_FILE="$PROJECT_PATH/.next/logs/development.log"
if grep -q "Element type is invalid" "$LOG_FILE"
then
  echo "Error found in logs:"
  ERROR_MESSAGE=$(grep "Element type is invalid" "$LOG_FILE")
  echo "$ERROR_MESSAGE"

  # Find the source of the error
  SOURCE_FILE=$(echo "$ERROR_MESSAGE" | awk '{print $NF}' | tr -d '\n')
  if [ -f "$SOURCE_FILE" ]
  then
    echo "Error occurred in file: $SOURCE_FILE"
    LINE_NUMBER=$(echo "$ERROR_MESSAGE" | awk '{print $9}' | tr -d '\n')
    if [ "$LINE_NUMBER" != "null" ]
    then
      echo "Error occurred on line: $LINE_NUMBER"
    else
      echo "Could not determine line number for error"
    fi
  else
    echo "Could not find source file for error"
  fi
else
  echo "No errors found in logs"
fi

# Stop the server
kill "$(pidof node)"

# Check for additional causes of error

# 1. Syntax errors in component code
if npx eslint "$PROJECT_PATH" | grep -q "Parsing error:"
then
  echo "Syntax error found in component code"
  npx eslint "$PROJECT_PATH" | grep "Parsing error:"
else
  echo "No syntax errors found in component code"
fi

# 2. Mismatched imports and exports
if grep -rq "export default function" "$PROJECT_PATH/pages/"
then
  echo "Default exports found in function components"
fi

if grep -rq "export function" "$PROJECT_PATH/pages/"
then
  echo "Named exports found in pages"
fi

if grep -rq "export default function" "$PROJECT_PATH/components/"
then
  echo "Default exports found in function components"
fi

if grep -rq "export function" "$PROJECT_PATH/components/"
then
  echo "Named exports found in components"
fi

# 3. Circular dependencies
if circular_deps=$(npx madge "$PROJECT_PATH" --circular); then
  echo "No circular dependencies found"
else
  echo "Circular dependencies found"
  echo "$circular_deps"
fi

# 4. Missing dependencies
if missing_deps=$(pnpm ls --depth=0 | grep "ERR!"); then
  echo "No missing dependencies found"
else
  echo "Missing dependencies found"
  echo "$missing_deps"
fi

# 5. Outdated dependencies
if outdated_deps=$(pnpm outdated | grep "dependencies"); then
  echo "Outdated dependencies found"
  echo "$outdated_deps"
else
  echo "No outdated dependencies found"
fi

# 6 Check network connectivity
if ! nc -z localhost 3000; then
  echo "Unable to connect to server. Please check network connectivity and try again."
  exit 1
fi

# 7 Check for configuration errors
if [ ! -f "$PROJECT_PATH/.env" ]; then
  echo "Unable to find configuration file. Please make sure the .env file exists in the project root directory."
  exit 1
fi

# 8 Check for operating system issues
if [ "$(ulimit -n)" -lt 8192 ]; then
  echo "Insufficient system resources. Please increase the file descriptor limit to at least 8192 and try again."
  exit 1
fi

# 9 Check for permissions issues
if [ ! -w "$PROJECT_PATH" ]; then
  echo "Insufficient permissions to access project directory. Please make sure you have write permissions to the project directory and try again."
  exit 1
fi

# 10 Change directory to project path or exit if directory does not exist
cd "$PROJECT_PATH" || exit 1

# Exit script
exit 0
