# Connect an API key from a file

Each person uses their own API key. You can paste it into CodeQuest or choose a JSON file from your computer. Reading a key file is optional and starts only after you enable it and choose a file. The app cannot search your computer for keys.

## Make your key file

Download the [blank JSON template](../public/api-key-file-template.json), then save a copy named `codequest-api-key.json` somewhere private **outside the project or repository folder**. Fill in the provider and your key in that private copy:

```json
{
  "provider": "deepseek",
  "apiKey": ""
}
```

Put your actual key between the empty quotes after `apiKey` in your private copy. Leave the public template blank. Use `deepseek`, `openai`, or `claude` as the provider. Keep the quotes, commas, and braces shown in the template. Do not put comments into JSON.

A filled file contains your key as readable text. Use a personal device and a folder that other people cannot access. Avoid shared folders, public cloud links, screenshots, and shared backups. On macOS or Linux, file permissions can restrict access to your user account; on Windows, use the file's security settings. Those permissions protect local access; they do not encrypt the file.

## Choose the file in CodeQuest

1. In the hosted app, sign in while online. In local mode, start `npm run local` and open http://127.0.0.1:5173 without signing in. Open **Settings → API key file (optional)**. **Download blank template** gives you an empty starting file.
2. Turn on **Allow this device to read my API key file**, then select **Choose JSON file** and choose your private filled file. Allow access if your browser asks.
3. Wait for the connection message before asking a question. Use **Read file again** after editing the file; Safari may ask you to choose it again.

The hosted app saves the chosen key encrypted on its server for your signed-in account. Local mode saves it encrypted in this computer's `.codequest-local/` database using its private encryption key; that folder is ignored by Git. The file feature changes how you provide the key; live AI requests still use the account's saved server key and need internet. Keys are excluded from GitHub source, public assets, the offline pack, learning backups, and the coding project's downloadable files.

Browsers handle file access differently. In a supported browser, CodeQuest remembers a handle to your chosen file, the enabled setting, and the last provider for that account on that device. It does not save the key itself in browser storage. When you reopen the app or reconnect, it can reread the file if you are online, AI is enabled, and read permission is already granted. **Read file again** can ask you to grant permission if needed.

Safari and browsers without that file-access feature use a normal file picker: the app reads your chosen file once. Choose it again when you want to reread it. Do not expect CodeQuest to monitor a file in the background or access it automatically in Safari.

## Change or remove the key

Editing or deleting the local key does **not** immediately change the encrypted key already saved in CodeQuest. Reread the changed file to update the saved connection. A valid file with an empty `apiKey` disconnects the server key when it is reread. Simply deleting the file itself is not the same as reading a valid empty file. To remove the server key directly, select **Disconnect assistant** while online and wait for confirmation.

**Clear key and disconnect** asks for confirmation, clears the key-file workflow, and disconnects the account's saved server key. In a browser that supports writing to the selected file, allow write permission so CodeQuest can replace its contents with a blank key while preserving the provider. In Safari or another browser without supported write access, this action downloads a blank replacement and disconnects the server key. You must manually replace your private filled file with the blank version. Check that the old filled copy is gone from that location. A downloaded blank file cannot erase the original file by itself.

Turning off **Allow this device to read my API key file** stops automatic reads. **Forget file** also removes the remembered file selection. Neither action revokes your provider key or removes the connection already saved on the server. Turning off the AI assistant stops AI requests but also keeps the saved server key.

If you want the key to stop working in every app, revoke it through DeepSeek, OpenAI, or Anthropic's developer-key page. See [API key storage and removal](api-key-removal.md) for disconnecting, revoking, and cleaning up an accidental GitHub upload.

## Keep filled files out of GitHub

The repository ignores `codequest-api-key.json` and names matching `codequest-api-key.*.json`, such as `codequest-api-key.personal.json`. The blank `public/api-key-file-template.json` is safe to publish and stays tracked.

These ignore patterns are a backup precaution. They do not protect arbitrary filenames, remove files already tracked by Git, or erase past commits. Keep your filled file outside the repository, review changes before committing, and never add a real key to `public/`, `public/vendor/`, source code, examples, issues, or documentation.
