#!/bin/bash
cd /home/kavia/workspace/code-generation/employee-onboarding-management-system-185853/employee_onboarding_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

