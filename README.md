# CodeQuest

**[Open CodeQuest](https://codequest.aurorax.chatgpt.site/)**

CodeQuest helps you learn to code in small steps. Read a short explanation, look at an example, then try it yourself. Questions help you check what you understand.

This version has:

- **1,221 lessons** across **21 courses**.
- **1,029 coding words and meanings** to help with new terms.
- Lessons, code examples, and projects built into the app.

The courses cover AI, Back-End Development, C, C#, C++, CSS, Developer Toolkit, Go, HTML, Java, JavaScript, Kotlin, PHP, Python, R, React, Ruby, Rust, SQL, Swift, and TypeScript.

The courses were made with help from ChatGPT and may contain mistakes. Some missing topics were added using free MIT teaching materials available online. The courses cover a set of topics, not everything about coding. Finishing them does not prove that you have mastered every skill.

## Choose how to use CodeQuest

- **Use the website:** open the app and sign in with ChatGPT. This is the simplest way to start.
- **Use the website without internet later:** sign in while online, then download the offline pack in Settings. Keep using the same browser and browser profile.
- **Run it on your own computer:** download this project's files and follow the setup steps below. You do not need a ChatGPT account or sign-in for this option. You need internet for the first setup.

Go to [website setup](#online-through-chatgpt--sites), [offline-pack setup](#hosted-app-offline-pack-sign-in-and-download-first), [computer setup](#run-the-source-locally-without-chatgpt), or [Windows help](#windows-troubleshooting-write-eof).

## Online through ChatGPT / Sites

1. [Open CodeQuest](https://codequest.aurorax.chatgpt.site/).
2. Sign in with ChatGPT when asked.
3. Choose a course and start learning.

The website is open to visitors, but it still needs sign-in. Each person's saved learning records belong to their own account.

**Coding Buddy is optional.** You can use the lessons without it. Coding Buddy is the AI helper. It needs internet and your own API key from a supported AI provider. An API key is a secret code that lets an app use your account with that provider.

The AI provider may charge you for using its service. A ChatGPT subscription does not include money or credits for these separate API requests. Keep API keys private and never upload them to this GitHub project. See [how to remove an API key](docs/api-key-removal.md).

## Hosted app offline pack: sign in and download first

An **offline pack** saves files in your browser so you can use parts of the app without internet. For this option, use the website. You do not need to download the GitHub project.

1. While online, open the website in your own browser profile. A browser profile is the browser's separate space for your settings and saved data.
2. Sign in with ChatGPT and wait for your account to load.
3. Open **Settings** and download the offline learning pack. Wait until the app says its files have been checked.
4. Later, open CodeQuest in the **same browser and profile**, even when you have no internet. Downloaded lessons and supported code tools can be used there.
5. When you go online again, check that your work has synced. Syncing means sending supported saved changes back to your account. Keep a backup before clearing any browser data.

### What to know before going offline

- The pack is about **39 MB** in this version.
- It is saved inside your browser. It is **not one HTML file** that you can double-click to open.
- It cannot set up a new account on a computer that has never connected. That browser must already have a saved copy of your signed-in account details.
- Drafts and supported changes waiting to sync stay on that device until they can be sent.
- Browsers sometimes remove saved downloads to free space. Keep backups and check your pack in Settings.
- Anyone using the same browser profile may be able to open your downloaded work. Use a personal profile.

You still need internet for the first sign-in and download, account sync, Coding Buddy, API-key changes, and outside websites. Marking concept lessons as complete and confirming that you have read them still need the online account service. **Not every online feature works offline.**

Some lessons also need extra tools. Swift and native-framework exercises (code that uses a device's own features), real-server exercises, and publishing exercises still need the tools listed in those lessons. The Python runner includes its standard library, which is Python's built-in collection of tools. It does not include every extra Python package.

## Run the source locally without ChatGPT

The **source** is the collection of files that make CodeQuest work. **Locally** means the app runs on your own computer. You still use a browser to see it.

This setup does not need ChatGPT sign-in. It keeps its own saved work and does not bring over your website account data.

### First-time setup

1. **Download the project.** On this GitHub page, choose **Code → Download ZIP**. Extract the ZIP into a folder. If you already use Git, you can clone the project instead.

2. **Install Node.js.** [Download Node.js from its official website](https://nodejs.org/en/download). Choose the version marked **Latest LTS**, rather than an Alpha or preview version. LTS means it receives fixes over a longer period. Older versions such as **22.13 are too old** for some of the project's current helper files. Node.js runs the app on your computer, and its installer includes npm, the tool used in the commands below.

3. **Open a terminal in the project folder.** A terminal is a window where you type commands. Choose the extracted folder that contains `package.json`. On Windows, open that folder in File Explorer, click the address bar, type `cmd`, and press **Enter**.

4. **Install the files the app needs.** Stay connected to the internet. Type this command and press **Enter**, then wait for it to finish:

   ```sh
   npm ci
   ```

5. **Start CodeQuest.** After the first command finishes successfully, type:

   ```sh
   npm run local
   ```

6. **Open the address shown in the terminal.** It is normally http://127.0.0.1:5173. This address points to the app running on your computer. Keep the terminal open while you use CodeQuest.

7. **Prepare before going offline.** In this local app, open Settings, download its offline pack, and wait for the file checks to finish. This is an extra precaution for the code tools that run in your browser. A pack downloaded from the hosted website is stored separately and does not belong to this local address.

### Opening it next time

Open a terminal in the same project folder and run:

```sh
npm run local
```

Open the printed address again. To stop the app, click the terminal and press **Ctrl + C**. You do not need to run `npm ci` every time.

### Keep your saved work safe

The first setup downloads the app's helper files and checks the files used to run code in the browser. Later starts reuse those files if they are still intact.

Your local database (saved app information) and encryption key are in `.codequest-local`. The key helps protect saved private information. **Keep this folder private and backed up. Never upload it to GitHub or share it when asking for help.**

This is not a single HTML file you can open by double-clicking. The app must be started using the command above.

Coding Buddy still needs internet and your own supported provider API key. Outside websites, extra packages, and exercises that use other tools or services still have their own requirements. Downloaded lessons and supported browser code tools do not need ChatGPT to run.

**Windows:** a Windows 10 user reported that CodeQuest started after installing Node.js's additional tools. If you see `write EOF`, follow the steps below. An earlier Windows test had a native access violation, which is a crash in the program that runs the app. One successful report does not mean that every Windows computer will work. A new Windows installation has not been fully tested with the internet disconnected.

## Windows troubleshooting: write EOF

### What happened

On one Windows 10 computer using Node.js v26.13.0, `npm run local` stopped with `write EOF` while Wrangler was preparing the local database. Wrangler is a tool CodeQuest uses to run the app on your computer. The database is where the app keeps your saved information.

After the user installed the additional tools that come with the Node.js installer, they reported that CodeQuest was running. **We do not know which installed part solved the problem.** This is something to try for the same error, not a guaranteed fix for every `write EOF` message. You do not need to install that exact Node.js version to follow these steps.

### Try these steps

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

### If it still does not work

Keep the full error message, your Windows version, and the results of `node -v` and `npm -v`. These commands show your installed Node.js and npm versions; npm is the tool that installs and starts the project. Also note whether the extra-tools installer finished successfully. This helps someone work out whether you have the same problem or a different one.

Do not delete `.codequest-local` to try to fix this error. It contains your saved local work and private key. Do not share that folder, API keys, or other secrets when asking for help. If the tools installer itself fails, follow the error it shows and the official instructions linked above.

## Put your own copy online

You can skip this section if you only want to learn or run CodeQuest on your computer.

To publish a separate copy using Sites:

1. Register a **new Sites project**.
2. Use the new project ID that Sites gives you. The public setup file leaves out the existing website's project ID on purpose.
3. If your copy will save users' AI provider keys, set your own `AI_KEY_ENCRYPTION_KEY` server secret. This is a private value used to protect those saved keys. Store it in your hosting service's secret settings, not in a public file.

Never upload secrets or learners' databases to GitHub.

## What has been checked

The source files come from hosted version **75**, saved as commit `108f73fc5b297017deb3aeec73ab7d6f49db407d`. A commit is a saved version of the project. The public copy includes changes to the instructions and leaves out details that identify the original hosted website.

- Some live checks were done while signed in. These checked headings, moving between pages, and recovery after a server problem.
- Phone checks are only partly complete. Not every screen or interaction has been tested.
- The offline file test checks all **57 files**, including their fingerprints (hashes), the HTML files sent to the browser, and the helper files they need.
- Other tests check that downloads are verified, a failed update keeps the old pack, private account and sign-in responses stay out of the offline cache, and offline page navigation works. A cache is the browser's saved copy of files.
- These checks do not replace testing a fresh setup on a disconnected computer. That complete test has not been done.
- Some older tests refer to private Sites history. They need those original saved versions and cannot run unchanged from this public copy.

## What you may reuse

Different parts of CodeQuest have different rules. Read the linked license files before reusing them.

- **Original app code:** covered by the [MIT License](LICENSE), copyright 2026 AuroraX98. Follow the terms in that file.
- **Teaching content:** the MIT permission above does **not** cover the lessons, course text, explanations, exercises, or other teaching material written for CodeQuest. This also applies when that material appears inside a code file.
- **Work from other people:** outside code, data, and assets keep their own licenses. A license already attached to a particular file still applies to that file.

Keep the [third-party notices](public/third-party/README.txt), outside license files, and source links when using the parts they cover. Some questions about crediting outside work are still being checked; see the [notice-scope notes](docs/third-party-notice-scope.md). This release does not claim that every legal or license question has been settled.
