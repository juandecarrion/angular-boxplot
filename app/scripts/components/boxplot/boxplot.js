
'use strict';

var scripts = document.getElementsByTagName('script');
var currentScriptPath = scripts[scripts.length-1].src;


function boxplotDirectiveLink() {
  
}

var boxplotDirective = function () {
  return {
    restrict: 'E',
    templateUrl: currentScriptPath.replace('.js', '.html'),
    scope: {
      fivenum: '@'
    },
    link: boxplotDirectiveLink
  };
};

angular.module('boxplot', [])
  .directive('boxplot', boxplotDirective);