require.config({
  paths: {
    backbone: "empty:",
    underscore: "empty:",
    jQuery: "empty:"
  },
  shim: {
    backbone: {
      deps: ['underscore', 'jQuery'],
      exports: 'Backbone'
    },
    underscore: {
      exports: '_'
    }
  }
});
