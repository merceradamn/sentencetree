$(function() {
  function init() {

    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  // for conciseness in defining templates
    sent_diag_1 =
      $(go.Diagram, "sentence_div_1",
        {
          allowCopy: false,
          allowDelete: false,
          allowMove: false,
          initialContentAlignment: go.Spot.Center,
          initialAutoScale: go.Diagram.Uniform,
          layout:
            $(FlatTreeLayout,  // custom Layout, defined below
              { angle: 90,
                compaction: go.TreeLayout.CompactionNone }),
          "undoManager.isEnabled": true
        });

    sent_diag_2 =
      $(go.Diagram, "sentence_div_2",
        {
          allowCopy: false,
          allowDelete: false,
          allowMove: true,
          initialContentAlignment: go.Spot.Center,
          initialAutoScale: go.Diagram.Uniform,
          layout:
            $(FlatTreeLayout,  // custom Layout, defined below
              { angle: 90,
                compaction: go.TreeLayout.CompactionNone }),
          "undoManager.isEnabled": true
        });

    sent_diag_1.nodeTemplate =
      $(go.Node, "Vertical",
        { selectionObjectName: "BODY" },
        $(go.Panel, "Auto", { name: "BODY" },
          $(go.Shape, "RoundedRectangle",
            new go.Binding("fill"),
            new go.Binding("stroke")),
          $(go.TextBlock,
            { font: "bold 12pt Arial, sans-serif", margin: new go.Margin(4, 2, 2, 2) },
            new go.Binding("text"))
        ),
        $(go.Panel,  // this is underneath the "BODY"
          { height: 15 },  // always this height, even if the TreeExpanderButton is not visible
          $("TreeExpanderButton")
        )
      );

    sent_diag_2.nodeTemplate =
      $(go.Node, "Vertical",
        { selectionObjectName: "BODY" },
        $(go.Panel, "Auto", { name: "BODY" },
          $(go.Shape, "RoundedRectangle",
            new go.Binding("fill"),
            new go.Binding("stroke")),
          $(go.TextBlock,
            { font: "bold 12pt Arial, sans-serif", margin: new go.Margin(4, 2, 2, 2) },
            new go.Binding("text"))
        ),
        $(go.Panel,  // this is underneath the "BODY"
          { height: 15 },  // always this height, even if the TreeExpanderButton is not visible
          $("TreeExpanderButton")
        )
      );

    sent_diag_1.linkTemplate =
      $(go.Link,
        $(go.Shape, { strokeWidth: 1.5 }));

    sent_diag_2.linkTemplate =
      $(go.Link,
        $(go.Shape, { strokeWidth: 1.5 }));

    // set up the nodeDataArray, describing each part of the sentence
    var sentence_one = [
      { key: 1, text: "Sentence", fill: "#f68c06", stroke: "#4d90fe" },
      { key: 2, text: "NP", fill: "#f68c06", stroke: "#4d90fe", parent: 1 },
      { key: 3, text: "VP", fill: "#f68c06", stroke: "#4d90fe", parent: 1 },
      { key: 4, text: "Det", fill: "#ccc", stroke: "#4d90fe", parent: 2 },
      { key: 5, text: "Nom", fill: "#ccc", stroke: "#4d90fe", parent: 2 },
      { key: 6, text: "V", fill: "#ccc", stroke: "#4d90fe", parent: 3 },
      { key: 7, text: "N", fill: "#ccc", stroke: "#4d90fe", parent: 5 },
      { key: 8, text: "The", fill: "#f8f8f8", stroke: "#4d90fe", parent: 4 },
      { key: 9, text: "butterfly", fill: "#f8f8f8", stroke: "#4d90fe", parent: 7 },
      { key: 10, text: "grew.", fill: "#f8f8f8", stroke: "#4d90fe", parent: 6 }
    ]

    var sentence_two = [
      { key: 1, text: "Sentence", fill: "#f68c06", stroke: "#4d90fe" },
      { key: 2, text: "NP", fill: "#f68c06", stroke: "#4d90fe", parent: 1 },
      { key: 3, text: "VP", fill: "#f68c06", stroke: "#4d90fe", parent: 1 },
      { key: 4, text: "Det", fill: "#ccc", stroke: "#4d90fe", parent: 2 },
      { key: 5, text: "Nom", fill: "#ccc", stroke: "#4d90fe", parent: 2 },
      { key: 6, text: "Adj P", fill: "#ccc", stroke: "#4d90fe", parent: 5 },
      { key: 7, text: "Nom", fill: "#ccc", stroke: "#4d90fe", parent: 5 },
      { key: 8, text: "VP", fill: "#f68c06", stroke: "#4d90fe", parent: 3 },
      { key: 9, text: "Adv P", fill: "#ccc", stroke: "#4d90fe", parent: 3 },
      { key: 10, text: "Adj", fill: "#ccc", stroke: "#4d90fe", parent: 6 },
      { key: 11, text: "N", fill: "#ccc", stroke: "#4d90fe", parent: 7 },
      { key: 12, text: "V", fill: "#ccc", stroke: "#4d90fe", parent: 8 },
      { key: 13, text: "Adv", fill: "#ccc", stroke: "#4d90fe", parent: 9 },
      { key: 14, text: "The", fill: "#f8f8f8", stroke: "#4d90fe", parent: 4 },
      { key: 15, text: "excited", fill: "#f8f8f8", stroke: "#4d90fe", parent: 10 },
      { key: 16, text: "fans", fill: "#f8f8f8", stroke: "#4d90fe", parent: 11 },
      { key: 17, text: "screamed", fill: "#f8f8f8", stroke: "#4d90fe", parent: 12 },
      { key: 18, text: "loudly.", fill: "#f8f8f8", stroke: "#4d90fe", parent: 13 }
    ]

    // create the Model with data for the tree, and assign to the Diagram
    sent_diag_1.model =
      $(go.TreeModel,
        { nodeDataArray: sentence_one });

    sent_diag_2.model =
      $(go.TreeModel,
        { nodeDataArray: sentence_two });
  }



  // Customize the TreeLayout to position all of the leaf nodes at the same vertical Y position.
  function FlatTreeLayout() {
    go.TreeLayout.call(this);  // call base constructor
  }

  go.Diagram.inherit(FlatTreeLayout, go.TreeLayout);

  // This assumes the TreeLayout.angle is 90 -- growing downward
  /** @override */
  FlatTreeLayout.prototype.commitLayout = function() {
    go.TreeLayout.prototype.commitLayout.call(this);  // call base method first
    // find maximum Y position of all Nodes
    var y = -Infinity;
    this.network.vertexes.each(function(v) {
        y = Math.max(y, v.node.position.y);
      });
    // move down all leaf nodes to that Y position, but keeping their X position
    this.network.vertexes.each(function(v) {
        if (v.destinationEdges.count === 0) {
          // shift the node down to Y
          v.node.position = new go.Point(v.node.position.x, y);
          // extend the last segment vertically
          v.node.toEndSegmentLength = Math.abs(v.centerY - y);
        } else {  // restore to normal value
          v.node.toEndSegmentLength = 10;
        }
      });
  };
  // end FlatTreeLayout

  init();
});
