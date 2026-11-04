# Windows setup help

## If startup shows `write EOF`

On one Windows 10 computer using Node.js v26.13.0, `npm run local` stopped with `write EOF` while Wrangler was preparing the local database. Wrangler is a tool CodeQuest uses to run the app on your computer. The database is where the app keeps your saved information.

After the user installed the additional tools that come with the Node.js installer, they reported that CodeQuest was running. **We do not know which installed part solved the problem.** This is something to try for the same error, not a guaranteed fix for every `write EOF` message. You do not need to install that exact Node.js version to follow these steps.

## Try these steps

1. **Save your work and stay connected to the internet.** If CodeQuest is still trying to start, click its terminal window (the window where you type commands) and press **Ctrl + C** to stop it.

2. **Find Node.js's extra-tools installer.** Open File Explorer and go to:

   ```text
   C:\Program Files\nodejs
   ```

   Look for `install_tools.bat`. Windows might show it as just `install_tools` if file extensions are hidden. If you installed Node.js somewhere else, look in that folder instead. You can also look in the Start menu under **Node.js** for **Install Additional Tools for Node.js**.

   If it is missing, use the [official Node.js Windows installer](https://nodejs.org/en/download). Its setup may offer an option to install the tools needed for native modules. These are helper tools that some Node.js programs use. The [official manual instructions](https://github.com/nodejs/node-gyp#on-windows) are another option.

3. **Read the warnings before you continue.** This installer makes changes to your computer. Depending on its version and what is already installed, it can install or update:
   - **Chocolatey**, a tool that downloads and installs other programs.
   - **Python**, a programming language.
   - **Visual Studio C++ Build Tools**, tools that build parts of some programs.
   - Required **Windows updates**.

   You need administrator permission, which means permission to change the computer. On a school or work computer, ask the person who manages it.

   The download can be large and take a while. Node.js's script currently warns that it needs about **7 GiB of free space**, plus more for Windows updates. Follow the amount shown by your own installer.

   Continuing also accepts the licenses (rules for using the software) for the packages it installs. Read its notices before agreeing. See the [official Node.js installer script and warnings](https://github.com/nodejs/node/blob/main/tools/msvs/install_tools/install_tools.bat).

4. **Run the installer and let it finish.** Double-click `install_tools.bat`. Continue only if you agree with its notices, and approve the Windows administrator prompt if you have permission. Follow the prompts. Some stages may look quiet for a while. Wait for the final completion message and check for errors, rather than closing the window partway through. Restart the computer if the installer asks you to.

5. **Open a new terminal in your CodeQuest folder.** This must be the folder containing `package.json`, not the `nodejs` folder. An easy way on Windows is to open the CodeQuest folder in File Explorer, click the address bar at the top, type `cmd`, and press **Enter**.

6. **Try starting CodeQuest again.** If you have not installed the project's files yet, or the earlier `npm ci` command failed, run `npm ci` first. Wait for it to finish successfully. You do not need this step every time you open the app.

   Then type this command and press **Enter**:

   ```sh
   npm run local
   ```

7. **Open the address shown in the terminal.** It is normally http://127.0.0.1:5173. This address opens the app running on your own computer. Keep the terminal open while you use CodeQuest. Next time, repeat steps 5–7.

## If it still does not work

Keep the full error message, your Windows version, and the results of `node -v` and `npm -v`. These commands show your installed Node.js and npm versions; npm is the tool that installs and starts the project. Also note whether the extra-tools installer finished successfully. This helps someone work out whether you have the same problem or a different one.

Do not delete `.codequest-local` to try to fix this error. It contains your saved local work and private key. Do not share that folder, API keys, or other secrets when asking for help. If the tools installer itself fails, follow the error it shows and the official instructions linked above.

[Back to the setup guide](../README.md#run-a-copy-on-your-computer)
