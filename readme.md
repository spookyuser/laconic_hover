# <img src="https://cdn.rawgit.com/spookyUnknownUser/6bfc0fb6d49d9c0a20f28038fafebacf/raw/eb7bc8649b0fa458291d675bcef2c6261bcaf348/hover.svg" width="55"> Laconic Hover

> Shows laconic text when hovering on a trope link... that's it.

tvtropes is great but its even better when you have the power of a million tropes in the palm of your hand.

<p>

  [![Build](https://travis-ci.com/spookyUnknownUser/laconic_hover.svg?token=PJHXpbDxewtgA5uyyPPy&branch=master)](https://travis-ci.com/spookyUnknownUser/laconic_hover)
  [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style)](https://github.com/prettier/prettier)
  [![MIT License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)
  [![Dependencies license](https://david-dm.org/spookyUnknownUser/laconic_hover.svg)](https://david-dm.org/spookyUnknownUser/laconic_hover)

</p>

## Install

-   [**Chrome** extension][link-cws] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/ignndocldlheghlflchdbokagecncgmm.svg?label=%20">][link-cws]
-   [**Firefox** add-on][link-amo] [<img valign="middle" src="https://img.shields.io/amo/v/laconic-hover.svg?label=%20">][link-amo]

<p align = "left">
    <img width="750" src="https://user-images.githubusercontent.com/16196262/48306356-c8d67b80-e53f-11e8-94fb-6564224b73a3.gif">
</p>

## How

This used to be close to a user script but its become more of a fully fledged extension. At its core we make a request to the laconic page whenever a link is hovered over. This now even uses the native APIs of the browser so we don't need jQuery/Ajax. We can do this all with pure.js fetch and query selectors.

This also uses [tippy.js](https://atomiks.github.io/tippyjs/) which is super neat and replaces the old [qtip2](http://qtip2.com/) library, which was great while it lasted.

## Hasn't this been done before

Yes, I think so:
\[[1](http://userscripts-mirror.org/scripts/show/130346)]
\[[2](https://chrome.google.com/webstore/detail/tropes-helper-beta/nbmecnaokkbfonmbplonmnekhiklkjlm)]  
But neither were ever updated, hopefully this will be different.

## Development

See the npm scripts for more information. To get started make sure [Node.js®](https://nodejs.org/en/) is installed. You can then clone the repo and install the repositories:

`$ git clone https://github.com/spookyUnknownUser/laconic_hover`  
`$ cd laconic_hover`  
`$ npm install`

If you want to play around with the project around

`$ npm run build:dev`

This will make webpack watch for any changes and output the unpacked extension to `/distribution/`.  
Now you're ready to start editing the project. You can go straight into `/src/` and mess around if you want.  
To see your changes I recommend using firefox because it automatically reloads your changes and can be launched from the project by running:

`$ npm run start:firefox`

To build for production just run `$ npm run build`

Meta note: The structure of this project in large part comes from [github-refined](https://github.com/sindresorhus/refined-github/tree/65fd58a1f1505ff348e3a9111ccda1236c3b563f)  
If you're looking for the right way to structure a webextension, then this is probably the best you're going to find at the moment. Thanks [sindresorhus](https://github.com/sindresorhus/refined) and everyone that contributed to github-refined!!

## Forward

-   ~~Fixing the title~~
    -   ~~Currently using a weird camelCase method to get the title from the url. Not very accurate.~~

-   ~~Better CSS~~
    -   ~~The CSS looks great in normal mode. But doesn't stand out much in night mode. Colors need tweaking.~~

-   ~~Better box placement~~
    -   ~~The box sometimes doesn't read well with text. Sometimes blocking what the link is referencing. Could use dynamic placement.~~

> you tell me 🌯

## Contributing

I would welcome anything anyone has to offer if you have an idea for a pull request go right ahead and make it. Suggestions are great too! [Click here](https://github.com/spookyUnknownUser/laconic_hover/issues/new) to submit them.

## Third Party Licenses

-   [lamp by Sandra Mills from the Noun Project](https://thenounproject.com/search/?q=lamp+shade&i=121407)

[link-cws]: https://chrome.google.com/webstore/detail/laconic-hover/ignndocldlheghlflchdbokagecncgmm "Version published on Chrome Web Store"

[link-amo]: https://addons.mozilla.org/en-US/firefox/addon/laconic-hover/ "Version published on Mozilla Add-ons"
