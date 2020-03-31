# Contributing

Suggestions and pull requests are highly encouraged! Have a look at the [open issues](https://github.com/spookyuser/laconic_hover/issues?q=is%3Aopen+is%3Aissue).

## Notions

- You will need to be familiar with [npm](https://docs.npmjs.com/getting-started/) to build this extension.
- The extension can be loaded into Chrome or Firefox manually ([See notes below](#loading-into-the-browser))
- All the [latest DOM APIs](https://github.com/WebReflection/dom4#features) and JavaScript features are available because the extension only has to work in recent versions of Chrome and Firefox. 🎉

## Workflow

First clone:

```sh
git clone https://github.com/spookyuser/laconic_hover/
cd laconic_hover
npm install
```

When working on the extension or checking out branches, use this to have it constantly build your changes:

```sh
npm run watch # Listen for file changes and automatically rebuild
```

Then load or reload it into the browser to see the changes (this does not happen automatically).

## Loading into the browser

Once built, load it in the browser of your choice:

<table>
	<tr>
		<th>Chrome</th>
		<th>Firefox</th>
	</tr>
	<tr>
		<td width="50%" valign="top">
			<ol>
				<li>Open <code>chrome://extensions</code>;
				<li>Check the <strong>Developer mode</strong> checkbox;
				<li>Click on the <strong>Load unpacked extension</strong> button;
				<li>Select the folder <code>laconic_hover/distribution</code>.
			</ol>
		</td>
		<td width="50%" valign="top">
			<ol>
				<li>Open <code>about:debugging#addons</code>;
				<li>Click on the <strong>Load Temporary Add-on</strong> button;
				<li>Select the file <code>laconic_hover/distribution/manifest.json</code>.
			</ol>
			Or you can use run this command to have Firefox automatically load and reload it through <a href="https://developer.mozilla.org/en-US/Add-ons/WebExtensions/web-ext_command_reference#web-ext_run"><code>web-ext run</code></a>:</p>
			<pre>npm run start:firefox</pre>
		</td>
	</tr>
</table>

## Attribution

This document is adapted from [refined-github/contributing.md](https://github.com/sindresorhus/refined-github/blob/c84162f1dc7ad898c7a3e303da285004c8c996da/contributing.md)
