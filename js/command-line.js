$(document).ready(function() {
  $('#command-line').typeahead({
    name: 'commands',
    local: window.viewModel.COMMANDS,
    template: '<p><strong>{{value}}</strong> – <small>{{info}}</small></p>',
    engine: Hogan
  }).on('typeahead:selected', function() {
    $("#command-line").trigger("change");
  });
});

function CLIViewModel() {
  var self = this;
  
  self.log = new Log();
  self.state = ko.observable(new SystemState());
  self.commandText = ko.observable();
  self.cancelCommand = null;
  
  self.command = function() {
    self.state().sauna.tick();
    var cancel = false;
    
    var command = findCommand(self.commandText());
    if(command == null) {
      self.log.addMessage(self.commandText(), "Could not understand command");
      return;
    }
    
    self.commandText("");
    $('#command-line').typeahead('setQuery', '')
    var commandString = command.value;
    if(commandString == "cancel") {
      if(self.cancelCommand == null) {
        self.log.addMessage(command.value, "Could not cancel previous action");
        return;
      }
      
      commandString = self.cancelCommand;
      cancel = true;
    }
    
    if(commandString == "sauna on") {
      if(cancel) {
        self.state().sauna.active(false);
        self.log.addMessage("cancel", "Canceled previous command, turned sauna off");
        self.cancelCommand = null;
        return;
      }
    
      if(self.state().sauna.active()) {
        self.log.addMessage(command.value, "Sauna is already warming");
        return;
      }
      self.state().sauna.active(true);
      self.state().sauna.timeWarmed(0);
      self.log.addMessage("sauna on", "Sauna was turned on. Target temperature was set to 80 degrees. Warming the sauna takes approximately 45 minutes.");
    }
    else if(commandString == "sauna off") {
      if(cancel) {
        self.state().sauna.active(true);
        self.state().sauna.timeWarmed(0);
        self.log.addMessage("cancel", "Canceled previous command, turned sauna back on");
        self.cancelCommand = null;
        return;
      }
      
      if(!self.state().sauna.active()) {
        self.log.addMessage(command.value, "Sauna is already off");
        return;
      }
      self.state().sauna.active(false);
      self.log.addMessage(command.value, "Sauna was turned off.");
    } 
    
    self.cancelCommand = command.value;
  };
  
  self.COMMANDS = [
    {
      value: 'sauna on',
      info: 'Turns the sauna on',
      cancel: 'sauna off'
    },
    {
      value: 'sauna off',
      info: 'Turns the sauna off',
      cancel: 'sauna on'
    },
    {
      value: 'lights on',
      info: 'Turns the lights on',
      cancel: 'lights '
    },
    {
      value: 'lights off',
      info: 'Turns the lights off',
      cancel: 'Turned lights back on'
    },
    {
      value: 'cancel',
      info: 'Cancels last action'
    }
  ];
  function findCommand(command) {
    for(var i in self.COMMANDS)
      if(self.COMMANDS[i].value == command)
        return self.COMMANDS[i];
    return null;
  }
}

function SystemState() {
  var self = this;
  
  self.sauna = new Sauna();
  self.lights = new Lights();
}

function Lights() {
  var self = this;
  
  self.bedroom = ko.observable(false);
  self.kitchen = ko.observable(false);
  self.livingroom = ko.observable(false);
  self.bathroom = ko.observable(false);
}

function Sauna() {
  var self = this;
  self.warmUpTime = 45;
  
  self.active = ko.observable(false);
  self.timeWarmed = ko.observable(0);
  self.progress = ko.computed(function() {
    return self.timeWarmed() / self.warmUpTime * 100;
  });
  self.tick = function() {
    if(self.active() && self.timeWarmed() < self.warmUpTime) {
      self.timeWarmed(self.timeWarmed() + 5);
    }
  };
}

function Log() {
  var self = this;
  
  self.messages = ko.observableArray();
  
  self.addMessage = function(command, reply) {
    self.messages.push(new LogMessage(command, reply));
  };
}

function LogMessage(command, reply) {
  self.timeStamp = ko.observable(dateTimeNow());
  self.command = ko.observable(command);
  self.reply = ko.observable(reply);
  
  function dateTimeNow() {
    var date = new Date();
    return pad(date.getHours()) + "." + pad(date.getMinutes()) + "." + pad(date.getSeconds());
  }
  function pad(n) { return ("0" + n).slice(-2); }
}

window.viewModel = new CLIViewModel();
ko.applyBindings(window.viewModel);