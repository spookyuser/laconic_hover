
<p align="center">
<h1 align="center">Laconic Hover</h1>
  <img src="https://cdn.rawgit.com/spookyUnknownUser/6bfc0fb6d49d9c0a20f28038fafebacf/raw/eb7bc8649b0fa458291d675bcef2c6261bcaf348/hover.svg" width="100%" height="144">
</p>

<p align="center">
Shows laconic text when hovering on tvtropes links... That's it. 
</p>

<p align="center">
  <a href="https://travis-ci.com/spookyUnknownUser/Laconic_Hover"><img src="https://travis-ci.com/spookyUnknownUser/Laconic_Hover.svg?token=PJHXpbDxewtgA5uyyPPy&branch=master"></a>
</p>

<p align = "center">
<img src=https://i.imgur.com/v7svnMF.gif width=100%>
</p>
---
###Compatibility
* [Chrome](https://chrome.google.com/webstore/detail/laconic-hover/ignndocldlheghlflchdbokagecncgmm)
* [Firefox](https://addons.mozilla.org/en-US/firefox/addon/laconic-hover)
* Userscript?

---
###How
A very small [.js](https://github.com/spookyUnknownUser/Laconic_Hover/blob/dev/src/js/Laconic_Hover.user.js) file that makes an ajax request to the laconic page, strips out the trash and puts the laconic sentance in a tooltip. Additonaly *jQuery* for, jQuery purposes. And *[qTip2](http://qtip2.com/)*, for almost the entire script. 

The script is so basic it started out as a userscript. Where the laconic was just embedded in the `title` of a link on hover. This had a lot of disadvantages. Like not being able to update the title dynamically, meaning you would have to hover over something twice, for it to update. Or that a manual caching method would be required, to avoid making a request every time you hover over a link. [qTip2](http://qtip2.com/) did all of this out of the box. Plus it looks really great. However after (and even before) adding the library it got virtually impossible to debug so I just made it an extension. But I would like to try and make it a userscript again - considering how small the utility is.

---
###Hasn't this been done before
Yes, I think so:
* [1](http://userscripts-mirror.org/scripts/show/130346)
* [2](https://chrome.google.com/webstore/detail/tropes-helper-beta/nbmecnaokkbfonmbplonmnekhiklkjlm)

But neither were ever updated, hopefully this will be different. 

---
###Forward
* Fixing the title
  - Currently using a weird camelCase method to get the title from the url. Not very accurate.
* Better CSS
  - The CSS looks great in normal mode. But doesn't stand out much in night mode. Colors need tweaking. 
* Better box placement
  - The box sometimes doesn't read well with text. Sometimes blocking what the link is referencing. Could use dynamic placement. 

---
###Other Stuff
Building is done with node and webpack.  
Specifically `npm run build`.

###Third Party Licenses
* [qTip2: MIT](https://github.com/qTip2/qTip2/blob/master/LICENSE)
* [lamp by Sandra Mills from the Noun Project](https://thenounproject.com/search/?q=lamp+shade&i=121407)


