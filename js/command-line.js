$(document).ready(function() {

  COMMANDS = [
    {
      value: 'sauna on',
      info: 'Turns the sauna on'
    },
    {
      value: 'sauna off',
      info: 'Turns the sauna off'
    },
    {
      value: 'lights on',
      info: 'Turns the lights on'
    },
    {
      value: 'lights off',
      info: 'Turns the lights off'
    }
  ];


  $('#command-line').typeahead({
    name: 'commands',
    local: COMMANDS,
    template: '<p><strong>{{value}}</strong> – <small>{{info}}</small></p>',
    engine: Hogan
  });

});
