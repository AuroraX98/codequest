# API key storage and removal

Each person connects their own API key in CodeQuest. The app saves it encrypted on its server, tied to that person's signed-in account. It is excluded from the project's source files, offline downloads, and learning backups. Connecting a key in the app does not upload it to GitHub.

## Remove your saved key from CodeQuest

1. Connect to the internet and sign in to the CodeQuest account that saved the key.
2. Open **Settings**, then find **Your AI assistant**. If you are choosing a replacement provider, select **Cancel** to return to the connected assistant.
3. Select **Disconnect assistant**. Wait for the message saying your assistant is disconnected. The provider choices will appear again.

This clears the key saved for that CodeQuest account. Turning off AI assistance, signing out, or clearing your browser's data does not remove the saved server key. Your lessons and saved projects remain available after disconnecting.

## Stop the key from working everywhere

Open the API key management page in the developer account for the provider that issued the key: DeepSeek, OpenAI, or Anthropic. Find the key and use that provider's delete or revoke option. Revoking a key means it can no longer authorize new API requests, including requests from other apps that used it.

Disconnecting in CodeQuest does not revoke the key at its provider. If you want to stop using the key everywhere, revoke it there as well. If you later want AI help again, create a new key and connect it in CodeQuest Settings.

## If a key was accidentally uploaded to GitHub

These steps apply if you pasted a key into a project file, commit, or other GitHub content yourself.

1. **Revoke the exposed key through its API provider first.** Treat it as exposed even if the repository is private. Create a replacement only if you still need one.
2. **Remove the key from the current files or other content where you posted it.** Keep replacement keys in the app's connection settings or an appropriate secret manager.
3. **Check older copies.** Editing or deleting a file does not remove the key from Git history. It can also remain in forks, clones, cached views, or pull requests. Revoking it makes the exposed key unusable.
4. **Use GitHub's official cleanup guide if history removal is needed.** History cleanup changes commits and needs coordination with other people using the repository. Follow the guide's instructions for copies and GitHub Support where applicable.
5. **Prevent another upload.** Keep secret files out of source control and review changes before committing. `.gitignore` does not remove files that are already tracked or erase previous commits. Enable GitHub push protection where available.

Reference: [GitHub's guide to removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).

Never paste an API key into a GitHub issue, pull request, comment, screenshot, or support message.
