require.config({
  paths: {
    backbone: "empty:",
    underscore: "empty:",
    jquery: "empty:"
  },
  shim: {
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    underscore: {
      exports: "_"
    }
  }
});
