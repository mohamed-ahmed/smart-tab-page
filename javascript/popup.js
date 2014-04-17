
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
  var ol = popupDiv.appendChild(document.createElement('ol'));

  for (var i = 0; i < mostVisitedURLs.length; i++) {
    var li = ol.appendChild(document.createElement('li'));
    var a = li.appendChild(document.createElement('a'));
    a.href = mostVisitedURLs[i].url;
    a.appendChild(document.createTextNode(mostVisitedURLs[i].title));
    a.addEventListener('click', onAnchorClick);
    console.log(a.href);
  }

  var iconElem;

  for (var i = 0; i < mostVisitedURLs.length; i++) {
    iconElem = getUrlIcon(mostVisitedURLs[i]);
    $("#mostVisited_div").append(iconElem);
  }
}

chrome.topSites.get(buildPopupDom);




var domObj;
var xhr = new XMLHttpRequest();
xhr.open("GET", "http://www.spauted.com", true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    // JSON.parse does not evaluate the attacker's scripts.
    //var resp = JSON.parse(xhr.responseText);
    //console.log(xhr.responseText);
    domObj = $(xhr.responseText);
    //console.log(domObj);
    getHTML(domObj);

  }
}
xhr.send();

function getHTML(domObj){
  console.log("getHTML");
  domObj.each(function (elem){
    if(domObj[elem].localName == "meta"){
      console.log(domObj[elem]);
    }

    if(domObj[elem].localName == "link"){
      console.log(domObj[elem]);
      if(domObj[elem].rel.indexOf("touch-icon") >= 0){
        console.log( domObj[elem].outerHTML.split("href")[1].split('"')[1] );
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
  console.log("getUrlIcon called");
  console.log(url);
  var iconElem = 
    dom("div", {class: ".col-md-4 icon"},
      dom("p", {id:"url-text"}, document.createTextNode(url.title) )
    );

  return iconElem;

}