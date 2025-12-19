; ─────────────────────────────────────────────────────────────────────────────
; ACMP Connector API Installer
; NSIS Installer Script
; ─────────────────────────────────────────────────────────────────────────────

; ─────────────────────────────────────────────────────────────────────────────
; Includes
; ─────────────────────────────────────────────────────────────────────────────

!include "MUI2.nsh"
!include "FileFunc.nsh"
!include "LogicLib.nsh"
!include "TextFunc.nsh"

; ─────────────────────────────────────────────────────────────────────────────
; Configuration
; ─────────────────────────────────────────────────────────────────────────────

!define APP_NAME "ACMP Connector API"
!define APP_VERSION "1.0.0"
!define APP_PUBLISHER "ScaleITS Solutions"
!define APP_EXE_NAME "acmp-connector-api.exe"
!define APP_INSTALL_DIR "C:\Program Files\Ominnode\ACMP_API_Connector"
!define APP_UNINSTALL_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}"
!define DOWNLOAD_URL "https://github.com/scaleits-solutions-gmbh/acmp-connector-releases/releases/download/release/acmp-connector-api.exe" ;
!define SERVICE_NAME "Omninode ACMP API Connector"
!define SERVICE_DESCRIPTION "API Service to connect ACMP to Omninode Cloud Plattform"
!define NSSM_EXE "nssm.exe"
!define NSSM_DOWNLOAD_URL "https://nssm.cc/release/nssm-2.24.zip"
!define CONFIG_DIR "$PROGRAMDATA\ACMPConnector"
!define CONFIG_FILE "$PROGRAMDATA\ACMPConnector\config.json"

; Installer configuration
Name "${APP_NAME}"
OutFile "acmp-connector-api-installer.exe"
InstallDir "${APP_INSTALL_DIR}"
RequestExecutionLevel admin ; Request admin rights for port 80 binding
Unicode True

; ─────────────────────────────────────────────────────────────────────────────
; Modern UI Configuration
; ─────────────────────────────────────────────────────────────────────────────

!define MUI_ICON "${NSISDIR}\Contrib\Graphics\Icons\modern-install.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Header\nsis3-grey.bmp"
!define MUI_WELCOMEPAGE_TITLE "Welcome to ${APP_NAME} Setup"
!define MUI_WELCOMEPAGE_TEXT "This wizard will guide you through the installation of ${APP_NAME}.$\r$\n$\r$\nClick Next to continue."

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; Languages
!insertmacro MUI_LANGUAGE "English"

; ─────────────────────────────────────────────────────────────────────────────
; Variables
; ─────────────────────────────────────────────────────────────────────────────

Var ApiKey
Var Port
Var InstallProxy
Var ProxyDomain
Var ProxyPath

; ─────────────────────────────────────────────────────────────────────────────
; Installer Sections
; ─────────────────────────────────────────────────────────────────────────────

Section "ACMP Connector API" SecMain
    SectionIn RO ; Required section
    
    SetOutPath "$INSTDIR"
    
    ; Stop existing service if running (using NSSM if available, fallback to sc)
    DetailPrint "Stopping existing ${SERVICE_NAME} service..."
    ${If} ${FileExists} "$INSTDIR\${NSSM_EXE}"
        nsExec::ExecToLog '"$INSTDIR\${NSSM_EXE}" stop "${SERVICE_NAME}"'
    ${Else}
        nsExec::ExecToLog 'sc stop "${SERVICE_NAME}"'
    ${EndIf}
    Pop $0
    ; Wait a moment for service to stop
    Sleep 2000
    
    ; Delete existing service if it exists (for reinstall/upgrade)
    DetailPrint "Removing existing service (if any)..."
    ${If} ${FileExists} "$INSTDIR\${NSSM_EXE}"
        nsExec::ExecToLog '"$INSTDIR\${NSSM_EXE}" remove "${SERVICE_NAME}" confirm'
    ${Else}
        nsExec::ExecToLog 'sc delete "${SERVICE_NAME}"'
    ${EndIf}
    Pop $0
    ${If} $0 == 0
        DetailPrint "Service deleted successfully."
    ${ElseIf} $0 == 1062
        DetailPrint "Service does not exist (not installed yet)."
    ${Else}
        DetailPrint "Warning: Service deletion returned code $0 (service may still exist)"
    ${EndIf}
    ; Wait a moment for service to be removed
    Sleep 2000
    
    ; Also stop any running process instances (fallback)
    nsExec::ExecToLog 'taskkill /F /IM ${APP_EXE_NAME} 2>nul'
    nsExec::ExecToLog 'taskkill /F /IM ${NSSM_EXE} 2>nul'
    Pop $0 ; consume return value
    
    ; Download executable using INetC plugin (fast with progress bar)
    DetailPrint "Downloading latest service components..."
    
    ; INetC::get shows a progress bar and is much faster
    INetC::get /CAPTION "Downloading latest service components" /BANNER "Please wait..." "${DOWNLOAD_URL}" "$INSTDIR\${APP_EXE_NAME}" /END
    Pop $0
    
    ${If} $0 != "OK"
        MessageBox MB_OK|MB_ICONEXCLAMATION "Failed to download ${APP_EXE_NAME}.$\r$\n$\r$\nError: $0$\r$\n$\r$\nPlease check your internet connection and try again."
        Abort
    ${EndIf}
    
    ; Verify file exists
    ${IfNot} ${FileExists} "$INSTDIR\${APP_EXE_NAME}"
        MessageBox MB_OK|MB_ICONEXCLAMATION "Download completed but file not found.$\r$\n$\r$\nPlease check your internet connection and try again."
        Abort
    ${EndIf}
    DetailPrint "Download completed successfully."
    
    ; Install NSSM (Non-Sucking Service Manager) - bundled with installer
    DetailPrint "Installing NSSM service manager..."
    File "nssm.exe"
    
    ; Create config.json only if it doesn't exist (preserve user config on reinstall/upgrade)
    ${IfNot} ${FileExists} "${CONFIG_FILE}"
        DetailPrint "Creating configuration file..."
        CreateDirectory "${CONFIG_DIR}"
        FileOpen $0 "${CONFIG_FILE}" w
        FileWrite $0 "{$\r$\n"
        FileWrite $0 "  \"HOST\": \"0.0.0.0\",$\r$\n"
        FileWrite $0 "  \"PORT\": \"$Port\",$\r$\n"
        FileWrite $0 "  \"PUBLIC_IP\": \"203.0.113.10\",$\r$\n"
        FileWrite $0 "  \"DB_SERVER\": \"DE-CLD-WV-SQL01\",$\r$\n"
        FileWrite $0 "  \"DB_NAME\": \"ACMP_INTERN\",$\r$\n"
        FileWrite $0 "  \"DB_USER\": \"ACMPDBUser\",$\r$\n"
        FileWrite $0 "  \"DB_PORT\": \"1433\",$\r$\n"
        FileWrite $0 "  \"DB_ENCRYPT\": true,$\r$\n"
        FileWrite $0 "  \"DB_TRUST_CERT\": true,$\r$\n"
        FileWrite $0 "  \"SICS_API_URL\": \"http://localhost:3900\",$\r$\n"
        FileWrite $0 "  \"SICS_USER_USERNAME\": \"ACMP\",$\r$\n"
        FileWrite $0 "  \"SICS_ACMP_ROUTING_KEY\": \"\"$\r$\n"
        FileWrite $0 "}$\r$\n"
        FileClose $0
    ${Else}
        DetailPrint "Configuration file already exists, preserving..."
    ${EndIf}
    
    ; Create helper scripts
    DetailPrint "Creating helper scripts..."
    
    ; start.vbs (runs completely hidden, no window at all)
    FileOpen $0 "$INSTDIR\start.vbs" w
    FileWrite $0 "Set WshShell = CreateObject($\"WScript.Shell$\")$\r$\n"
    FileWrite $0 "WshShell.CurrentDirectory = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, $\"\$\") - 1)$\r$\n"
    FileWrite $0 "WshShell.Run $\"${APP_EXE_NAME}$\", 0, False$\r$\n"
    FileClose $0
    
    ; start.bat (starts the Windows service using NSSM)
    FileOpen $0 "$INSTDIR\start.bat" w
    FileWrite $0 "@echo off$\r$\n"
    FileWrite $0 "cd /d $\"%~dp0$\"$\r$\n"
    FileWrite $0 "echo Starting ${SERVICE_NAME}...$\r$\n"
    FileWrite $0 "nssm.exe start $\"${SERVICE_NAME}$\"$\r$\n"
    FileWrite $0 "if %errorlevel%==0 ($\r$\n"
    FileWrite $0 "    echo Service started successfully.$\r$\n"
    FileWrite $0 ") else ($\r$\n"
    FileWrite $0 "    echo Failed to start service. Trying sc...$\r$\n"
    FileWrite $0 "    sc start $\"${SERVICE_NAME}$\"$\r$\n"
    FileWrite $0 ")$\r$\n"
    FileWrite $0 "timeout /t 2 >nul$\r$\n"
    FileClose $0
    
    ; stop.bat (stops the Windows service using NSSM)
    FileOpen $0 "$INSTDIR\stop.bat" w
    FileWrite $0 "@echo off$\r$\n"
    FileWrite $0 "cd /d $\"%~dp0$\"$\r$\n"
    FileWrite $0 "echo Stopping ${SERVICE_NAME}...$\r$\n"
    FileWrite $0 "nssm.exe stop $\"${SERVICE_NAME}$\"$\r$\n"
    FileWrite $0 "if %errorlevel%==0 ($\r$\n"
    FileWrite $0 "    echo Service stopped successfully.$\r$\n"
    FileWrite $0 ") else ($\r$\n"
    FileWrite $0 "    echo Service is not running or could not be stopped.$\r$\n"
    FileWrite $0 ")$\r$\n"
    FileWrite $0 "timeout /t 2 >nul$\r$\n"
    FileClose $0
    
    ; status.bat (checks service status using NSSM)
    FileOpen $0 "$INSTDIR\status.bat" w
    FileWrite $0 "@echo off$\r$\n"
    FileWrite $0 "cd /d $\"%~dp0$\"$\r$\n"
    FileWrite $0 "echo Checking ${SERVICE_NAME} status...$\r$\n"
    FileWrite $0 "echo.$\r$\n"
    FileWrite $0 "nssm.exe status $\"${SERVICE_NAME}$\"$\r$\n"
    FileWrite $0 "echo.$\r$\n"
    FileWrite $0 "echo Service details:$\r$\n"
    FileWrite $0 "sc query $\"${SERVICE_NAME}$\"$\r$\n"
    FileWrite $0 "pause$\r$\n"
    FileClose $0
    
    ; Install Windows Service using NSSM
    DetailPrint "Installing Windows Service using NSSM..."
    
    ; Install the service with NSSM
    nsExec::ExecToLog '"$INSTDIR\${NSSM_EXE}" install "${SERVICE_NAME}" "$INSTDIR\${APP_EXE_NAME}"'
    Pop $0
    
    ${If} $0 != 0
        DetailPrint "Warning: NSSM service installation returned code $0"
        ; Service might already exist, try to update it
        DetailPrint "Attempting to update existing service..."
        nsExec::ExecToLog '"$INSTDIR\${NSSM_EXE}" set "${SERVICE_NAME}" Application "$INSTDIR\${APP_EXE_NAME}"'
        Pop $0
    ${Else}
        DetailPrint "Service installed successfully."
    ${EndIf}
    
    ; Configure service settings with NSSM
    DetailPrint "Configuring service settings..."
    
    ; Set the application directory (working directory)
    nsExec::ExecToLog '"$INSTDIR\${NSSM_EXE}" set "${SERVICE_NAME}" AppDirectory "$INSTDIR"'
    Pop $0
    
    ; Set service display name
    nsExec::ExecToLog '"$INSTDIR\${NSSM_EXE}" set "${SERVICE_NAME}" DisplayName "${SERVICE_NAME}"'
    Pop $0
    
    ; Set service description
    nsExec::ExecToLog '"$INSTDIR\${NSSM_EXE}" set "${SERVICE_NAME}" Description "${SERVICE_DESCRIPTION}"'
    Pop $0
    
    ; Set service to start automatically
    nsExec::ExecToLog '"$INSTDIR\${NSSM_EXE}" set "${SERVICE_NAME}" Start SERVICE_AUTO_START'
    Pop $0
    
    ; Configure stdout and stderr logging
    nsExec::ExecToLog '"$INSTDIR\${NSSM_EXE}" set "${SERVICE_NAME}" AppStdout "$INSTDIR\logs\service.log"'
    Pop $0
    nsExec::ExecToLog '"$INSTDIR\${NSSM_EXE}" set "${SERVICE_NAME}" AppStderr "$INSTDIR\logs\error.log"'
    Pop $0
    
    ; Create logs directory
    CreateDirectory "$INSTDIR\logs"
    
    ; Configure graceful shutdown
    nsExec::ExecToLog '"$INSTDIR\${NSSM_EXE}" set "${SERVICE_NAME}" AppStopMethodSkip 0'
    Pop $0
    nsExec::ExecToLog '"$INSTDIR\${NSSM_EXE}" set "${SERVICE_NAME}" AppStopMethodConsole 3000'
    Pop $0
    nsExec::ExecToLog '"$INSTDIR\${NSSM_EXE}" set "${SERVICE_NAME}" AppStopMethodWindow 3000'
    Pop $0
    nsExec::ExecToLog '"$INSTDIR\${NSSM_EXE}" set "${SERVICE_NAME}" AppStopMethodThreads 3000'
    Pop $0
    
    DetailPrint "Service configuration completed."
    
    ; Write registry keys for uninstaller
    WriteRegStr HKLM "${APP_UNINSTALL_KEY}" "DisplayName" "${APP_NAME}"
    WriteRegStr HKLM "${APP_UNINSTALL_KEY}" "UninstallString" "$INSTDIR\uninstall.exe"
    WriteRegStr HKLM "${APP_UNINSTALL_KEY}" "InstallLocation" "$INSTDIR"
    WriteRegStr HKLM "${APP_UNINSTALL_KEY}" "Publisher" "${APP_PUBLISHER}"
    WriteRegStr HKLM "${APP_UNINSTALL_KEY}" "DisplayVersion" "${APP_VERSION}"
    WriteRegDWORD HKLM "${APP_UNINSTALL_KEY}" "NoModify" 1
    WriteRegDWORD HKLM "${APP_UNINSTALL_KEY}" "NoRepair" 1
    
    ; Create uninstaller
    WriteUninstaller "$INSTDIR\uninstall.exe"
SectionEnd

Section "Start Menu Shortcuts" SecShortcuts
    DetailPrint "Creating Start Menu shortcuts..."
    
    CreateDirectory "$SMPROGRAMS\ACMP Connector"
    
    ; Start shortcut
    CreateShortcut "$SMPROGRAMS\ACMP Connector\Start ACMP Connector.lnk" "$INSTDIR\start.bat" "" "$INSTDIR\${APP_EXE_NAME}" 0
    
    ; Stop shortcut
    CreateShortcut "$SMPROGRAMS\ACMP Connector\Stop ACMP Connector.lnk" "$INSTDIR\stop.bat" "" "" 0
    
    ; Open folder shortcut
    CreateShortcut "$SMPROGRAMS\ACMP Connector\Open Installation Folder.lnk" "$INSTDIR" "" "" 0
SectionEnd

Section "Auto-start on Windows Login" SecAutoStart
    DetailPrint "Service is configured to start automatically with Windows..."
    ; Service is already configured with start= auto, so no additional setup needed
    ; This section is kept for compatibility but the service handles auto-start
SectionEnd

Section "Start Service Now" SecStartNow
    DetailPrint "Starting ${SERVICE_NAME}..."
    ; Start the Windows service using NSSM
    nsExec::ExecToLog '"$INSTDIR\${NSSM_EXE}" start "${SERVICE_NAME}"'
    Pop $0
    ${If} $0 != 0
        DetailPrint "Warning: Service start returned code $0"
        ; Try using sc as fallback
        nsExec::ExecToLog 'sc start "${SERVICE_NAME}"'
        Pop $0
        ${If} $0 != 0
            ${If} $0 == 1056
                DetailPrint "Service is already running."
            ${Else}
                MessageBox MB_OK|MB_ICONEXCLAMATION "Failed to start service.$\r$\n$\r$\nError code: $0$\r$\n$\r$\nYou can start it manually using the Start Menu shortcut or by running: sc start $\"${SERVICE_NAME}$\""
            ${EndIf}
        ${Else}
            DetailPrint "Service started successfully."
        ${EndIf}
    ${Else}
        DetailPrint "Service started successfully."
    ${EndIf}
SectionEnd

; ─────────────────────────────────────────────────────────────────────────────
; Section Descriptions
; ─────────────────────────────────────────────────────────────────────────────

LangString DESC_SecMain ${LANG_ENGLISH} "Install ${APP_NAME} executable and configuration files."
LangString DESC_SecShortcuts ${LANG_ENGLISH} "Create Start Menu shortcuts for easy access."
LangString DESC_SecAutoStart ${LANG_ENGLISH} "Automatically start ${APP_NAME} when Windows starts."
LangString DESC_SecStartNow ${LANG_ENGLISH} "Start ${APP_NAME} immediately after installation."

!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
    !insertmacro MUI_DESCRIPTION_TEXT ${SecMain} $(DESC_SecMain)
    !insertmacro MUI_DESCRIPTION_TEXT ${SecShortcuts} $(DESC_SecShortcuts)
    !insertmacro MUI_DESCRIPTION_TEXT ${SecAutoStart} $(DESC_SecAutoStart)
    !insertmacro MUI_DESCRIPTION_TEXT ${SecStartNow} $(DESC_SecStartNow)
!insertmacro MUI_FUNCTION_DESCRIPTION_END

; ─────────────────────────────────────────────────────────────────────────────
; Custom Pages (Configuration)
; ─────────────────────────────────────────────────────────────────────────────

Function .onInit
    ; Set required space to 120MB (120 * 1024 KB) for the main section
    SectionSetSize ${SecMain} 122880
    
    ; Set default values
    StrCpy $Port "3000"
    StrCpy $ApiKey ""
    StrCpy $InstallProxy "0"
    StrCpy $ProxyDomain "localhost"
    StrCpy $ProxyPath "/acmp-connector"
    
    ; Optional: read existing config.json for PORT (skipped - JSON parsing not built-in)
FunctionEnd

; ─────────────────────────────────────────────────────────────────────────────
; Uninstaller Section
; ─────────────────────────────────────────────────────────────────────────────

Section "Uninstall"
    ; Stop and delete the Windows service using NSSM
    DetailPrint "Stopping ${SERVICE_NAME}..."
    ${If} ${FileExists} "$INSTDIR\${NSSM_EXE}"
        nsExec::ExecToLog '"$INSTDIR\${NSSM_EXE}" stop "${SERVICE_NAME}"'
        Pop $0
        Sleep 2000 ; Wait for service to stop
        
        DetailPrint "Removing ${SERVICE_NAME}..."
        nsExec::ExecToLog '"$INSTDIR\${NSSM_EXE}" remove "${SERVICE_NAME}" confirm'
        Pop $0
        ${If} $0 != 0
            DetailPrint "Warning: NSSM service removal returned code $0"
            ; Try sc as fallback
            nsExec::ExecToLog 'sc delete "${SERVICE_NAME}"'
            Pop $0
        ${EndIf}
    ${Else}
        ; Fallback to sc if NSSM not found
        nsExec::ExecToLog 'sc stop "${SERVICE_NAME}"'
        Pop $0
        Sleep 2000
        nsExec::ExecToLog 'sc delete "${SERVICE_NAME}"'
        Pop $0
    ${EndIf}
    
    ; Fallback: Stop any running process instances
    nsExec::ExecToLog 'taskkill /F /IM ${APP_EXE_NAME} 2>nul'
    Pop $0
    
    ; Remove files (but keep config.json for user configuration)
    DetailPrint "Removing files..."
    Delete "$INSTDIR\${APP_EXE_NAME}"
    Delete "$INSTDIR\${NSSM_EXE}"
    Delete "$INSTDIR\start.bat"
    Delete "$INSTDIR\start.vbs"
    Delete "$INSTDIR\stop.bat"
    Delete "$INSTDIR\status.bat"
    Delete "$INSTDIR\uninstall.exe"
    ; NOTE: config.json is intentionally NOT deleted to preserve user configuration
    
    ; Remove logs directory
    RMDir /r "$INSTDIR\logs"
    
    ; Remove shortcuts
    DetailPrint "Removing shortcuts..."
    Delete "$SMSTARTUP\ACMPConnector.lnk"
    RMDir /r "$SMPROGRAMS\ACMP Connector"
    
    ; Remove installation directory only if empty (will fail if extra files exist, which is fine)
    RMDir "$INSTDIR"
    
    ; Remove registry keys
    DeleteRegKey HKLM "${APP_UNINSTALL_KEY}"
    
    DetailPrint "${APP_NAME} has been uninstalled."
    DetailPrint "Note: Configuration file (config.json) has been preserved in ${CONFIG_DIR}"
SectionEnd

; ─────────────────────────────────────────────────────────────────────────────
; Finish Page Actions
; ─────────────────────────────────────────────────────────────────────────────

Function .onInstSuccess
    ; Open browser to health endpoint
    Exec 'rundll32 url.dll,FileProtocolHandler http://localhost:$Port/health'
FunctionEnd
