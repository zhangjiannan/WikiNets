// Generated by CoffeeScript 1.6.3
/*

This is an example extension of a DataProvider.

You should define this to be backed by your own source of data.
This uses a static graph for the sake of example, but typically
you would make ajax requests and call the callbacks once the data
has been received.

DataProvider extensions need only define two functions

- getLinks(node, nodes, callback) should call callback with
  an array, A, of links st. A[i] is the link from node to nodes[i]
  links are javascript objects and can have any attributes you like
  so long as they don't conflict with d3's attributes and they
  must have a "strength" attribute in [0,1]

- getLinkedNodes(nodes, callback) should call callback with
  an array of the union of the linked nodes of each node in nodes.
  currently, a node can have any attributesyou like so they long
  as they don't conflict with d3's attributes and they
  must have a "text" attribute.

DataProviders are integrated to always be called when a node is
added to the graph to ensure the corresponding links between
all nodes in the graph are added.
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["DataProvider"], function(DataProvider) {
    /*
    
    Our example graph data.
    graph[node text][othernode text] ::=\
      link strength between node and otherNode
    
    BUG/TODO: doesn't handle asymmetric weights well.
    */

    var WikiNetsDataProvider, graph, graphNew, linksList, nodesList, _ref;
    graph = {
      "A": {
        "B": 1.0
      },
      "B": {
        "A": 1.0,
        "C": 0.1
      },
      "C": {
        "B": 0.1
      }
    };
    graphNew = {
      "links": [
        [
          {
            source: 1,
            target: 2,
            strength: 1
          }
        ], [
          {
            source: 2,
            target: 3,
            strength: 1
          }
        ]
      ],
      "nodes": [
        [
          {
            _id: 1,
            name: "Alice"
          }
        ], [
          {
            _id: 2,
            name: "Bob"
          }
        ], [
          {
            _id: 3,
            name: "Irving"
          }
        ]
      ]
    };
    nodesList = {};
    linksList = {};
    return WikiNetsDataProvider = (function(_super) {
      var assignNeighbors, convertForCelestrium, findSources, findTargets, getID, getName, newLink, renumberLinkSTIds;

      __extends(WikiNetsDataProvider, _super);

      function WikiNetsDataProvider() {
        _ref = WikiNetsDataProvider.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      getName = function(id) {
        var node, _i, _len;
        for (_i = 0, _len = nodesList.length; _i < _len; _i++) {
          node = nodesList[_i];
          if (node['_id'] === id) {
            return node['name'];
          }
        }
      };

      getID = function(name) {
        var node, _i, _len;
        console.log("getID for name: ", name);
        for (_i = 0, _len = nodesList.length; _i < _len; _i++) {
          node = nodesList[_i];
          if (node['name'] === name) {
            return node['_id'];
          }
        }
      };

      assignNeighbors = function(centerNode, Nnode, NewGraph, strength) {
        return NewGraph[centerNode][Nnode] = strength;
      };

      findTargets = function(id, NewGraph) {
        var link, _i, _len;
        NewGraph[getName(id)] = {};
        for (_i = 0, _len = linksList.length; _i < _len; _i++) {
          link = linksList[_i];
          if (link['source'] === id) {
            assignNeighbors(getName(id), getName(link['target']), NewGraph, link['strength']);
          }
        }
        return NewGraph;
      };

      findSources = function(id, NewGraph) {
        var link, _i, _len;
        for (_i = 0, _len = linksList.length; _i < _len; _i++) {
          link = linksList[_i];
          if (link['target'] === id) {
            assignNeighbors(getName(id), getName(link['source']), NewGraph, link['strength']);
          }
        }
        return NewGraph;
      };

      renumberLinkSTIds = function(linkSTId) {
        return nodesList[linkSTId]['_id'];
      };

      newLink = function(oldlink) {
        var tmp;
        tmp = {};
        tmp['source'] = renumberLinkSTIds(oldlink['source']);
        tmp['target'] = renumberLinkSTIds(oldlink['target']);
        tmp['strength'] = Math.random() * 0.9 + 0.1;
        return tmp;
      };

      convertForCelestrium = function(graphNew) {
        /*console.log "CONVERT HAS BEEN CALLED"
        console.log graphNew["nodes"]
        */

        var NewGraph, link, n, node, _i, _j, _len, _len1;
        nodesList = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = graphNew["nodes"];
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            n = _ref1[_i];
            _results.push(n);
          }
          return _results;
        })();
        linksList = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = graphNew["links"];
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            link = _ref1[_i];
            _results.push(newLink(link));
          }
          return _results;
        })();
        NewGraph = {};
        /*console.log "NODESLIST", nodesList
        console.log "linksList", linksList
        */

        for (_i = 0, _len = nodesList.length; _i < _len; _i++) {
          node = nodesList[_i];
          findTargets(node['_id'], NewGraph);
        }
        for (_j = 0, _len1 = nodesList.length; _j < _len1; _j++) {
          node = nodesList[_j];
          findSources(node['_id'], NewGraph);
        }
        return NewGraph;
      };

      /*
      
      See above for a spec of this method.
      As a sanity check getLinks({"text": "A"}, [{"text": "B"}], f)
      should call f with [{"strength": 1.0}] as an argument.
      */


      WikiNetsDataProvider.prototype.getLinks = function(node, nodes, callback) {
        return $.getJSON("/json", function(data) {
          graph = convertForCelestrium(data);
          /*console.log "This is the graph: ", graph*/

          return callback(_.map(nodes, function(otherNode, i) {
            return {
              "strength": graph[node.text][otherNode.text]
            };
          }));
        });
      };

      /*
      
      See above for a spec of this method.
      As a sanity check getLinkedNodes([{"text": "C"}], f)
      should call f with [{"text": "B"}] as an argument
      */


      WikiNetsDataProvider.prototype.getLinkedNodes = function(nodes, callback) {
        return $.getJSON("/json", function(data) {
          graph = convertForCelestrium(data);
          return callback(_.chain(nodes).map(function(node) {
            return _.map(graph[node.text], function(strength, text) {
              return {
                "text": text
              };
            });
          }).flatten().value());
        });
      };

      return WikiNetsDataProvider;

    })(DataProvider);
  });

}).call(this);
