# DiagnosisHelper

## Installation instructions

`requirements`: Docker Desktop, Node globally, NX globally, python

`before starting`
 make sure the requirements are installed and Docker Desktop is running

`For Windows` (in root):
-> set the OS "$env:OS="windows" (Windows power shell) OR set the OS "set OS=windows" (Windows Comman prop)
-> "npm install"
-> "npm run start:windows"

`For Unix (Linux,Mac...)` (in root):
-> set the OS "export OS=unix"
-> For Linux/MacOS -> "npm run start:all"

`further commands`
-> Windows
    -start frontend only: "npm run start:frontend:windows"
    -start backend only: "npm run start:backend:windows"
-> UNIX
    -start frontend only: "npm run start:frontend:unix"
    -start backend only: "npm run start:backend:unix"
