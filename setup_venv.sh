#!/bin/bash

PYTHON_VERSION="3.12"
VENV_DIR="venv"
REQUIREMENTS_FILE="requirements.txt"

echo "Checking for Python $PYTHON_VERSION..."

# Check if python3.12 is available
if ! command -v python$PYTHON_VERSION &> /dev/null
then
    echo "Python $PYTHON_VERSION is not found. Please install it first."
    echo "On WSL/Ubuntu, you can install it using: sudo apt update && sudo apt install python$PYTHON_VERSION python$PYTHON_VERSION-venv"
    exit 1
fi

echo "Python $PYTHON_VERSION found. Creating virtual environment..."

# Create virtual environment
python$PYTHON_VERSION -m venv $VENV_DIR

if [ $? -ne 0 ]; then
    echo "Failed to create virtual environment. Exiting."
    exit 1
fi

echo "Activating virtual environment..."

# Activate virtual environment
source $VENV_DIR/bin/activate

if [ $? -ne 0 ]; then
    echo "Failed to activate virtual environment. Exiting."
    exit 1
fi

echo "Virtual environment activated. Installing dependencies from $REQUIREMENTS_FILE..."

# Install dependencies
pip install -r $REQUIREMENTS_FILE

if [ $? -ne 0 ]; then
    echo "Failed to install dependencies. Please check $REQUIREMENTS_FILE for errors."
    deactivate # Deactivate venv on failure
    exit 1
fi

echo "Dependencies installed successfully."
echo "To use the virtual environment, run: source $VENV_DIR/bin/activate"
echo "To deactivate, run: deactivate"