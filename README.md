# svn2chatwork

A small Node.js application to send Subversion commit messages to Chatwork.

## Usage

Download and put svn2chatwork directory to your Subversion server.

Retrieve npm dependencies.

```
npm install
```

Edit "config/default.json" to relate your Subversion repository and the Chatwork room to post messages to.
You can recieve your API key from your Chatwork settings page.

Open "post-commit" and change node command path and svn2chatwork directory path for your server.

Put "post-commit" in the hook directory of your repository.

Make "post-commit" executable.

```
chmod +x post-commit
```

## License

Copyright © 2016 Hiroki Tanaka

Distributed under the Eclipse Public License either version 1.0 or any later version.
