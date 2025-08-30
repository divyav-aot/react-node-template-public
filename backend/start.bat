@echo off
echo Starting FastAPI application...
echo.
echo Make sure you have Python and pip installed.
echo.
echo Installing dependencies...
pip install -r requirements.txt
echo.
echo Starting the server...
echo API will be available at: http://localhost:8300
echo Interactive docs at: http://localhost:8300/docs
echo.
echo Press Ctrl+C to stop the server
echo.
python main.py
pause 