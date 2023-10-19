@echo off
REM Instal paket dari requirements.txt
pip install -r requirements.txt

REM Jalankan main.py
python ws\server.py
