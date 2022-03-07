
/* global Heron */

Heron.TEST = false;


// OK, with custom menu.
Heron.options.map.toolbar.items = [
  {type: "pan"},
  {type: "zoomin"},
  {type: "zoomout"},
  {type: "zoomdefault"},
  {type: "zoomprevious"},
  {type: "zoomnext"},
  {type: "->"},
  {type: "any",
    options: {
      text: "User Menu",
      iconCls: "bmenu",
      margin: "0 5 0 0",
      menu: {
        items: [{
          text: "Choose me",
          handler: function () {
            alert("I like Heron");
          }
        },{
          text: "Choose me too",
          handler: function () {
            alert("I like Heron too");
          }
        }]
      }
    }
  }
];
