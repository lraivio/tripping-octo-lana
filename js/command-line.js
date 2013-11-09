$(document).ready(function() {

  $('#command-line').typeahead({
    name: 'commands',
    local: ['sauna on', 'sauna off', 'lights on', 'lights off']
  });

});
