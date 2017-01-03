// ==UserScript==
// @name         Laconic Hover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://tvtropes.org/*
// @grant        none
// @require      https://code.jquery.com/jquery.min.js
// @require      https://raw.githubusercontent.com/briancherne/jquery-hoverIntent/master/jquery.hoverIntent.js
// ==/UserScript==

(function() {
    'use strict';
    'debugger';
    console.log("Launching Tamper Script");
    // hoverInilt();
    attachToLinks();

})();



function attachToLinks() {
    // http://userscripts-mirror.org/scripts/source/482142.user.js
    // Attach to all
    // links that go somewhere inside pmwiki.php
    var links = document.getElementsByTagName('a');
    // links.forEach(function(element) {
    //     console.log(element);
    //     var url = element.href;
    //     url.onmouseover = grabLaconicText(element, handleLaconic);
    // });

    for (var link of links) {
        var url = link.href;
        if (url.includes('pmwiki.php') && !url.includes('=')) {
            console.log(url);
            url.onmouseover = grabLaconicText(url, handleLaconic);
        }
    }
}

function hoverInit() {
    $(".twikilink").hoverIntent(function() {
        var element = $(this),
            isLink = element.is("a");
        if (isLink) {
            grabLaconicText(element, handleLaconic);
        }
    }, jQuery.noop);
}

function grabLaconicText(link, callback) {
    //Replace Main URL with Laconic URL
    var laconicUrl = link.replace(/(pmwiki\.php)\/.*\//g, 'pmwiki.php/Laconic/');
    var laconicContent;
    $.ajax({
        context: this,
        url: laconicUrl,
        data: {},
        success: function(data) {
            laconicContent = $(data).find(".page-content").first().text().trim();
            if (laconicContent.indexOf("Inexact title") >= 0) {
                laconicContent = "No Laconic Page";
                //intiate callback
                callback(laconicContent, link);
            }
            //Remove 'Go to MAIN thing'
            laconicContent = laconicContent.replace(/\n\n.*/g, '');
            console.log("Laconic Cont", [laconicContent]);
            //intiate callback
            callback(laconicContent, link);
        },
        dataType: 'html'
    });
}

function handleLaconic(laconic, element) {
    element.attr('title', laconic).change();
}
