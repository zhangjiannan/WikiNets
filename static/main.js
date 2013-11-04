requirejs.config({
  baseUrl: "/",
  paths: {
    "jquery": "celestrium/lib/jquery",
    "jquery.typeahead": "celestrium/lib/jquery.typeahead",
    "underscore": "celestrium/lib/underscore",
    "backbone": "celestrium/lib/backbone",
    "d3": "celestrium/lib/d3",
  },
  shim: {
    'jquery.typeahead': ['jquery'],
    'd3': {
      exports: "d3",
    },
    'underscore': {
      exports: '_',
    },
    'backbone': {
      deps: ['underscore'],
      exports: 'Backbone',
    },
  }
});

requirejs(["celestrium/core/celestrium"], function(Celestrium) {

  var dataProvider = new function() {
    this.minThreshold = 0.75;
    this.getLinks = function(node, nodes, callback) {
      console.log("getLinks was called with", node, " and ", nodes);
      var data = {
        node: JSON.stringify(node),
        otherNodes: JSON.stringify(nodes),
      }
      this.ajax('get_edges', data, callback);
    };

    this.getLinkedNodes = function(nodes, callback) {
    console.log("getLinkedNodes was called with", nodes);
      var data = {
        nodes: JSON.stringify(nodes),
        minStrength: this.minThreshold,
      };
      this.ajax('get_related_nodes', data, callback);
    };

    this.ajax = function(url, data, callback) {
      $.ajax({
        url: url,
        data: data,
        success: callback,
      });
    }
  };

  console.log("Create workspace called");
  Celestrium.createWorkspace({
    el: document.querySelector("#maingraph"),
    dataProvider: dataProvider,
    nodePrefetch: "get_nodes",
    nodeAttributes: {
      conceptText: {
        type: "nominal",
        getValue: function(node) {
          return node.text;
        },
      },
    },
  });
});
