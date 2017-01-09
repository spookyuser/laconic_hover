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
    //your code here
    // hoverInit();
    // $('[title]').qtip();
    // attachToLinks();
    testqtip();
});



function attachToLinks() {
    // http://userscripts-mirror.org/scripts/source/482142.user.js
    // Attach to all
    // links that go somewhere inside pmwiki.php
    var links = document.getElementsByClassName('twikilink');

    for (var linkElement of links) {
        var url = linkElement.href;
        if (url.includes('pmwiki.php') && !url.includes('=')) {
            // http://userscripts-mirror.org/scripts/source/482142.user.js
            // From ^ here as well
            // linkElement.title = '';
            linkElement.onmouseover = testGrab;
        }
    }
}

function testqtip() {
    $(document).on('mouseover', '.twikilink', function(event) {

        var url = $(this).attr('href');
        var laconicUrl = qtipGrabLaconic($(this))

        // if (url.includes('pmwiki.php') && !url.includes('=')) {

        $(this).qtip({
            overwrite: false, // Make sure the tooltip won't be overridden once created
            content: {
                text: function(event, api) {
                    $.ajax({
                            url: laconicUrl // Use data-url attribute for the URL
                        })
                        .then(function(content) {
                            // Set the tooltip content upon successful retrieval
                            laconicContent = parseLaconic(content);
                            api.set('content.text', laconicContent);
                        }, function(xhr, status, error) {
                            // Upon failure... set the tooltip content to the status and error value
                            api.set('content.text', status + ': ' + error);
                        });

                    return 'Loading...'; // Set some initial text
                }
            },
            show: {
                event: event.type, // Use the same show event as the one that triggered the event handler
                ready: true // Show the tooltip as soon as it's bound, vital so it shows up the first time you hover!
            }
        }, event); // Pass through our original event to qTip

        // }

    });


}

function qtipGrabLaconic(linkElement) {
    return linkElement.attr('href').replace(/(pmwiki\.php)\/.*\//g, 'pmwiki.php/Laconic/');
}

function parseLaconic(laconicContent) {
    var parsedLaconicContent;
    parsedLaconicContent = $(laconicContent).find(".page-content").first().text().trim();
    if (laconicContent.indexOf("Inexact title") >= 0) {
        parsedLaconicContent = "No Laconic Page";
        //intiate callback
        return parsedLaconicContent;
    }
    //Remove 'Go to MAIN thing'
    parsedLaconicContent = parsedLaconicContent.replace(/\n\n.*/g, '');
    console.log("Laconic Cont", [parsedLaconicContent]);
    //intiate callback
    return parsedLaconicContent;
}

function testGrab(mouseEvent) {
    grabLaconicText(mouseEvent.target, handleLaconic);
}

function hoverInit() {
    $(".twikilink").hoverIntent(function() {
        var linkElement = $(this),
            isLink = linkElement.is("a");
        if (isLink) {
            grabLaconicText(linkElement, handleLaconic);
        }
    }, jQuery.noop);
}

function grabLaconicText(linkElement, callback) {
    //Replace Main URL with Laconic URL
    var laconicUrl = linkElement.href.replace(/(pmwiki\.php)\/.*\//g, 'pmwiki.php/Laconic/');
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
                callback(laconicContent, linkElement);
            }
            //Remove 'Go to MAIN thing'
            laconicContent = laconicContent.replace(/\n\n.*/g, '');
            console.log("Laconic Cont", [laconicContent]);
            //intiate callback
            callback(laconicContent, linkElement);
        },
        dataType: 'html'
    });
}

function handleLaconic(laconicContent, linkElement) {
    // linkElement.title = laconicContent;
    // $(linkElement).attr('title', laconicContent).tooltip('fixTitle').tooltip('show');
    // $(linkElement).data("ui-tooltip-title", laconicContent);
    // $(".ui-tooltip-content").html($(linkElement).data("ui-tooltip-title"));
    $(linkElement).qtip({ // Grab some elements to apply the tooltip to
        content: {
            text: laconicContent
        }
    });

}
