@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF)
@REM Apache Maven Wrapper startup batch script, version 3.2.0
@REM ----------------------------------------------------------------------------

@echo off
setlocal enabledelayedexpansion

@REM Determine project base directory
set "MAVEN_PROJECTBASEDIR=%~dp0"
if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%"

set "MAVEN_WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties"

@REM Read distributionUrl from properties file
for /f "tokens=2 delims==" %%A in ('findstr /b "distributionUrl" "%MAVEN_WRAPPER_PROPERTIES%"') do (
  set "DISTRIBUTION_URL=%%A"
)

@REM Set Maven user home
if not defined MAVEN_USER_HOME (
  set "MAVEN_USER_HOME=%USERPROFILE%\.m2"
)
set "MAVEN_WRAPPER_CACHE=%MAVEN_USER_HOME%\wrapper\dists"

@REM Derive distribution name from URL
for %%F in ("%DISTRIBUTION_URL%") do set "DIST_FILENAME=%%~nxF"
set "DIST_NAME=%DIST_FILENAME:-bin.zip=%"

set "MAVEN_HOME=%MAVEN_WRAPPER_CACHE%\%DIST_NAME%"

if not exist "%MAVEN_HOME%" (
  echo Downloading Maven from %DISTRIBUTION_URL% ...
  if not exist "%MAVEN_WRAPPER_CACHE%" mkdir "%MAVEN_WRAPPER_CACHE%"
  set "TMP_ZIP=%MAVEN_WRAPPER_CACHE%\%DIST_FILENAME%"

  @REM Try PowerShell download
  powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%DISTRIBUTION_URL%' -OutFile '!TMP_ZIP!'}" 2>nul
  if not exist "!TMP_ZIP!" (
    echo ERROR: Download failed. Please install Maven manually from https://maven.apache.org
    exit /b 1
  )

  @REM Unzip using PowerShell
  powershell -Command "Expand-Archive -Path '!TMP_ZIP!' -DestinationPath '%MAVEN_WRAPPER_CACHE%'" 2>nul
  del "!TMP_ZIP!" 2>nul
  echo Maven downloaded successfully.
)

set "MAVEN_CMD=%MAVEN_HOME%\bin\mvn.cmd"
if not exist "%MAVEN_CMD%" (
  set "MAVEN_CMD=%MAVEN_HOME%\bin\mvn.bat"
)
if not exist "%MAVEN_CMD%" (
  echo ERROR: Could not find mvn in %MAVEN_HOME%\bin
  exit /b 1
)

"%MAVEN_CMD%" %*
