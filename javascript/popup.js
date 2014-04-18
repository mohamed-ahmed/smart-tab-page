
"use strict";

// Event listener for clicks on links in a browser action popup.
// Open the link in a new tab of the current window.
function onAnchorClick(event) {
  chrome.tabs.create({ url: event.srcElement.href });
  return false;
}

// Given an array of URLs, build a DOM list of these URLs in the
// browser action popup.

var mostVisited;

function buildPopupDom(mostVisitedURLs) {
  mostVisited = mostVisitedURLs;
  var popupDiv = document.getElementById('mostVisited_div');
  //var ol = popupDiv.appendChild(document.createElement('ol'));

  /*for (var i = 0; i < mostVisitedURLs.length; i++) {
    var li = ol.appendChild(document.createElement('li'));
    var a = li.appendChild(document.createElement('a'));
    a.href = mostVisitedURLs[i].url;
    a.appendChild(document.createTextNode(mostVisitedURLs[i].title));
    a.addEventListener('click', onAnchorClick);
    console.log(a.href);
  }*/

  var iconElem;

  for (var i = 0; i < mostVisitedURLs.length; i++) {
    iconElem = getUrlIcon(mostVisitedURLs[i]);
    $("#mostVisited_div").append(iconElem);
  }
}

//var siteUrl = "http://www.spauted.com";

//getHTML(siteUrl);

function getHTML(siteUrl, elem){
  console.log("getHTML: " + siteUrl);

  var html;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", siteUrl, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      // JSON.parse does not evaluate the attacker's scripts.
      //var resp = JSON.parse(xhr.responseText);
      //console.log(xhr.responseText);
      html = $(xhr.responseText);
      //console.log(domObj);
      getImageUrl(siteUrl, xhr.responseText, elem);
    }
  }
  xhr.send();
}

function getImageUrl(siteUrl, html, imgElem){
  console.log("gettingImage: " + siteUrl);
  var imageUrl;
  var absUrl;

  //console.log(html);
  var occuranceIndex = html.indexOf('property="og:image')
  if(occuranceIndex >= 0){
    var indexOfBracket = html.indexOf(">", occuranceIndex );
    var htmlArray = html.slice(occuranceIndex-1, indexOfBracket);
    console.log("htmlArray: ");
    console.log(htmlArray);
}


  html.each(function (elem){
    /*if(html[elem].localName == "meta"){
      console.log(html[elem]);
      if(html[elem].attributes){
        console.log(html[elem].attributes);
        for(var  i = 0; i < html[elem].attributes.length ; i++){
          var attr = html[elem].attributes[i];
          if(attr.localName == "meta"){
            console.log("meta attr:" );
            console.log(attr);
          }
        }
      }
    }*/


    if(html[elem].localName == "link"){
      //console.log(html[elem]);
      if(html[elem].rel.indexOf("touch-icon") >= 0){
        imageUrl = html[elem].outerHTML.split("href")[1].split('"')[1];
        console.log("imageUrl: " + imageUrl );
        console.log("elem: ");
        console.log(imgElem);
        if(imageUrl.indexOf("http") >= 0){
          absUrl = imageUrl;
        }
        else{
          absUrl = siteUrl + imageUrl;
        }
        imgElem.attr("src", absUrl);
        return imageUrl;
      }

    }


  });
}




function dom(name, attributes) {
  var node = document.createElement(name);
  if (attributes) {
    forEachIn(attributes, function(name, value) {
      setNodeAttribute(node, name, value);
    });
  }
  for (var i = 2; i < arguments.length; i++) {
    var child = arguments[i];
    if (typeof child == "string")
      child = document.createTextNode(child);
    node.appendChild(child);
  }
  return node;
}

function forEachIn(object, action) {
  for (var property in object) {
    if (object.hasOwnProperty(property))
      action(property, object[property]);
  }
}

function setNodeAttribute(node, attribute, value) {
  if (attribute == "class")
    node.className = value;
  else if (attribute == "checked")
    node.defaultChecked = value;
  else if (attribute == "for")
    node.htmlFor = value;
  else if (attribute == "style")
    node.style.cssText = value;
  else
    node.setAttribute(attribute, value);
}

function getUrlIcon(url){
  var iconText;
  if(url.title.length < 36){
    iconText = url.title;
  }
  else{
    iconText = url.title.slice(0,33) + "...";
  }

  var facivonUrl;
  if(url.url.indexOf("/", 8) > 0 ){
    facivonUrl = url.url.slice( 0, url.url.indexOf("/", 8)) + "/favicon.ico";
  }
  else{
    facivonUrl = url.url + "favicon.ico";
  }
  console.log("facivonUrl");
  console.log(facivonUrl);

  console.log("getUrlIcon called");
  console.log(url);
  var iconElem = 
  dom("a", {class: "col-xs-6 col-sm-4 button", id:"icon", href:url.url, target:"_blank"},
    dom("img", {id:"icon-image", src : facivonUrl, alt:""}),
    dom("a", {id:"url-text", href:url.url , target:"_blank"}, document.createTextNode(iconText) )
  );

  getHTML(url.url, $(iconElem).find("#icon-image"));

  /*$(iconElem).click(function(){
    var win=window.open(url.url, '_blank');
    win.focus();
  });*/

return iconElem;

}


$(document).ready(function(){
  chrome.topSites.get(buildPopupDom);

  //TODO
  //not working
  $("#search-box")[0].focus();

});