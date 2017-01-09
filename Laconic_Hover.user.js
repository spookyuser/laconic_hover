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
// Working with grabLaconicText on dynamic hover function.
/*jshint esversion: 6 */

$(document).ready(function() {
    // Start
    testqtip();
});

function testqtip() {
    // http://qtip2.com/guides#content.ajax
    $(document).on('mouseover', '.twikilink', function(event) {
        var jQueryElement = $(this);
        var url = jQueryElement.attr('href');
        setQtip(jQueryElement);
    });
}

function setQtip(jQueryElement) {

    $(jQueryElement).qtip({
        overwrite: false,
        content: {
            text: function(event, api) {
                getLaconichtml(api, url);
                return 'Loading...';
            }
        },
        show: {
            event: event.type,
            ready: true
        }
    }, event);
}

function getLaconichtml(api, url) {
    var laconicUrl = linkElement.attr('href').replace(/(pmwiki\.php)\/.*\//g, 'pmwiki.php/Laconic/');

    $.ajax({
            url: laconicUrl
        })
        .then(function(content) {
            laconicContent = parseLaconic(content);
            api.set('content.text', laconicContent);
        }, function(xhr, status, error) {
            api.set('content.text', status + ': ' + error);
        });
}

function parseLaconic(laconicContent) {
    var parsedLaconicContent;
    //Find the main page element that contains the laconic text and remove whitespace
    parsedLaconicContent = $(laconicContent).find(".page-content").first().text().trim();
    if (laconicContent.indexOf("Inexact title") >= 0) {
        parsedLaconicContent = "No Laconic Page";
        //Return the 'no laconic' message
        return parsedLaconicContent;
    }
    //Remove 'Go to MAIN thing'
    parsedLaconicContent = parsedLaconicContent.replace(/\n\n.*/g, '');
    console.log("Laconic Cont", [parsedLaconicContent]);
    //Return the found laconic text
    return parsedLaconicContent;
}
