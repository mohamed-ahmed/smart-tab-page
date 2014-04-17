
"use strict";

// Event listener for clicks on links in a browser action popup.
// Open the link in a new tab of the current window.
function onAnchorClick(event) {
  chrome.tabs.create({ url: event.srcElement.href });
  return false;
}

// Given an array of URLs, build a DOM list of these URLs in the
// browser action popup.
function buildPopupDom(mostVisitedURLs) {
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
}

chrome.topSites.get(buildPopupDom);




var domObj;
var xhr = new XMLHttpRequest();
xhr.open("GET", "http://www.spauted.com", true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    // JSON.parse does not evaluate the attacker's scripts.
    //var resp = JSON.parse(xhr.responseText);
    console.log(xhr.responseText);
    domObj = $(xhr.responseText);
    console.log(domObj);
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