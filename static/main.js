// Generated by CoffeeScript 1.6.3
/* javascript entry point for this example interface.*/


(function() {
  requirejs.config({
    baseUrl: "/celestrium/core/",
    paths: {
      local: "../../"
    }
  });

  /*
  
  You need only require the Celestrium plugin.
  NOTE: it's module loads the globally defined standard js libraries
        like jQuery, underscore, etc...
  */


  require(["Celestrium"], function(Celestrium) {
    /*
    
    This dictionary defines which plugins are to be included
    and what their arguments are.
    
    The key is the requirejs path to the plugin.
    The value is passed to its constructor.
    */

    var plugins;
    plugins = {
      Layout: {
        el: document.querySelector("#maingraph")
      },
      KeyListener: document.querySelector("#maingraph"),
      GraphModel: {
        nodeHash: function(node) {
          return node.text;
        },
        linkHash: function(link) {
          return link.source.text + link.target.text;
        }
      },
      GraphView: {},
      NodeSelection: {},
      "local/WikiNetsDataProvider": {},
      "Sliders": {},
      "ForceSliders": {},
      "LinkDistribution": {},
      "NodeSearch": {
        prefetch: "/get_node_names"
      },
      NodeDetails: {}
    };
    return Celestrium.init(plugins, function(instances) {
      instances["GraphModel"].putNode({
        text: "Albert",
        id: "300"
      });
      return instances["GraphView"].getLinkFilter().set("threshold", 0);
    });
  });

}).call(this);
