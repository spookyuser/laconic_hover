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
    initQtipOnHover();
});

function initQtipOnHover() {
    $(document).on('mouseover', '.twikilink', function(event) {
        var jQueryElement = $(this);
        var currentUrl = jQueryElement.attr('href');
        setQtipContent(jQueryElement, currentUrl);
    });
}

function setQtipContent(jQueryElement, currentUrl) {

    $(jQueryElement).qtip({
        overwrite: false,
        position: {
            viewport: $(window),
            my: 'center right',  // Position my top left...
            at: 'center left', // at the bottom right of...
            target: $(jQueryElement), // my target
            adjust: {
                x: -10
            },
            effect: false
        },
        content: {
            text: function(event, api) {
                getLaconicPageAjax(api, currentUrl);
                return 'Loading...';
            },
            title: $(jQueryElement).text()
        },
        style: {
            classes: 'qtip-dark qtip-shadow tipstyle'

        },
        show: {
            event: event.type,
            ready: true
        }
    }, event);
}

function getLaconicPageAjax(api, currentUrl) {
    var laconicUrl = currentUrl.replace(/(pmwiki\.php)\/.*\//g, 'pmwiki.php/Laconic/');
    var laconicContent;

    // http://qtip2.com/guides#content.ajax
    $.ajax({
            url: laconicUrl
        })
        .then(function (response) {
            laconicContent = parseLaconic(response);
            api.set('content.text', laconicContent);
        }, function(xhr, status, error) {
            api.set('content.text', status + ': ' + error);
        });
}

function parseLaconic(response) {
    var parsedLaconicContent;
    // Find the main page element that contains the laconic text and remove whitespace
    // https://stackoverflow.com/questions/3422949/jquery-remove-all-child-elements-and-leave-text
    parsedLaconicContent = $(response).find(".indent").remove().end();
    parsedLaconicContent = $(parsedLaconicContent).find(".page-content").first().text().trim();
    if (response.indexOf("Inexact title") >= 0) {
        parsedLaconicContent = "No Laconic Page";
        // Return the 'no laconic' message
        return parsedLaconicContent;
    }
    console.log("Laconic Cont", [parsedLaconicContent]);
    //Return the found laconic text
    return parsedLaconicContent;
}
