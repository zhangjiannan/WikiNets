###

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

###

define ["DataProvider"], (DataProvider) ->

  ###

  Our example graph data.
  graph[node text][othernode text] ::=\
    link strength between node and otherNode

  BUG/TODO: doesn't handle asymmetric weights well.

  ###

  graph =
    "A":
      "B": 1.0
    "B":
      "A": 1.0
      "C": 0.1
    "C":
      "B": 0.1

  class ExampleDataProvider extends DataProvider

    ###

    See above for a spec of this method.
    As a sanity check getLinks({"text": "A"}, [{"text": "B"}], f)
    should call f with [{"strength": 1.0}] as an argument.

    ###
    getLinks: (node, nodes, callback) ->
      callback _.map nodes, (otherNode, i) ->
        return "strength": graph[node.text][otherNode.text]

    ###

    See above for a spec of this method.
    As a sanity check getLinkedNodes([{"text": "C"}], f)
    should call f with [{"text": "B"}] as an argument

    ###
    getLinkedNodes: (nodes, callback) ->
      callback _.chain(nodes)
        .map (node) ->
          _.map graph[node.text], (strength, text) ->
            "text": text
        .flatten()
        .value()
