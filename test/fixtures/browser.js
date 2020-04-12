/* eslint-disable strict */

var main = document.getElementById('main');
var template = {};

function fetchAndRender(recursionLevel) {
  var xhr = new XMLHttpRequest();
  var _templateName = window.templateName[recursionLevel];

  xhr.open('GET', _templateName, true);
  xhr.onreadystatechange = function () {
    if (
      xhr.readyState === XMLHttpRequest.DONE &&
      (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400))
    ) {
      template[_templateName] = xhr.responseText;

      Object.keys(window.partial[recursionLevel]).forEach(function (partialKey) {
        window.partial[recursionLevel][partialKey] = template[partialKey];
      });

      var assertion = document.getElementsByClassName('assertion-' + recursionLevel)[0];
      assertion.innerHTML =
        window.Feplet.render(xhr.responseText, window.context[recursionLevel], window.partial[recursionLevel]);

      if (window.templateName[recursionLevel + 1]) {
        fetchAndRender(recursionLevel + 1);
      }
    }
  };
  xhr.send();
}

window.templateName.forEach(function (t, i) {
  var contentParagraph = document.createElement('p');
  contentParagraph.className = 'assertion-' + i;
  main.appendChild(contentParagraph);
});

fetchAndRender(0);
