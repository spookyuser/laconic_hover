//Node Requires
var qtip = require("qtip2");
var $ = require("jquery");
require('../css/tipstyle.css');
require('qtip2/dist/jquery.qtip.min.css');

$(document).ready(function () {
    // Start
    initQtipOnHover();
});

function initQtipOnHover() {
    $(document).on('mouseover', '.twikilink', function (evt) {
        //When mouse is over a wiki link (class: .twikilink)
        var jQueryElement = $(this);
        //Get the linked URL
        var currentUrl = jQueryElement.attr('href');
        //Init the qtip library
        setQtipContent(jQueryElement, currentUrl, evt);
    });
}

function setQtipContent(jQueryElement, currentUrl, evt) {
    //qtip related config
    $(jQueryElement).qtip({
        overwrite: false,
        position: {
            viewport: $(window),
            my: 'center right',
            at: 'center left',
            target: $(jQueryElement),
            adjust: {
                x: -10
            },
            //No slide in
            effect: false
        },
        content: {
            text: function (event, api) {
                //Create ajax request to laconic page
                getLaconicPageAjax(api, currentUrl);
                //Return 'Loading" until ajax is done
                return 'Loading...';
            },
            //Set the title of the page to the title of the qtip box
            title: convertCamelTitle(currentUrl)
        },
        style: {
            classes: 'qtip-dark qtip-shadow tipstyle'

        },
        show: {
            event: evt.type,
            ready: true
        }
    }, evt);
}

function getLaconicPageAjax(api, currentUrl) {
    //Regex to replace normal link with link directly to laconic page
    var laconicUrl = currentUrl.replace(/(pmwiki\.php)\/.*\//g, 'pmwiki.php/Laconic/');
    var laconicContent;

    // From http://qtip2.com/guides#content.ajax
    $.ajax({
        url: laconicUrl
    })
        .then(function (response) {
            laconicContent = parseLaconic(response);
            api.set('content.text', laconicContent);
        }, function (xhr, status, error) {
            api.set('content.text', status + ': ' + error);
        });
}

function convertCamelTitle(currentUrl) {
    // Getting the trope title from the end of the url. From http://stackoverflow.com/a/6165387/1649917
    // Adding spaces between the words. From http://stackoverflow.com/a/13720440/1649917

    var title = currentUrl.split("/").pop();

    return title.replace(/^[a-z]|[A-Z]/g, function (v, i) {
        return i === 0 ? v.toUpperCase() : " " + v.toLowerCase();
    });
}

function parseLaconic(response) {
    var parsedLaconicContent;
    // Find the main page element that contains the laconic text and remove whitespace
    parsedLaconicContent = $(response).find(".indent").remove().end();
    parsedLaconicContent = $(parsedLaconicContent).find(".page-content").first().text().trim();

    //If the tvtropes page has no Laconic entry
    if (response.indexOf("Inexact title") >= 0) {
        parsedLaconicContent = "No Laconic Page";
        // Return the 'no laconic' message
        return parsedLaconicContent;
    }
    //Return the found laconic text
    return parsedLaconicContent;
}
