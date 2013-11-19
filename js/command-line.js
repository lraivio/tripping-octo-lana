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
    if(self.commandText() == "") {
      return;
    }
    
    var cancel = false;
    
    var command = findCommand(self.commandText().toLowerCase());
    var fullCommand = self.commandText().toLowerCase();
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
        self.log.addMessage(command.value, "Sauna is already warming, use 'sauna off' to turn sauna off");
        return;
      }
      var saunaRegEx = /sauna on (\d*)/g;
      var m = saunaRegEx.exec(fullCommand);
      
      self.state().sauna.active(true);
      if(m != null) {
        self.state().sauna.temperatureTarget(m[1] == null ? 80 : m[1]);
      } else {
        self.state().sauna.temperatureTarget(80);
      }
      self.state().sauna.timeWarmed(0);
      self.log.addMessage("sauna on", "Sauna was turned on. Target temperature was set to " + self.state().sauna.temperatureTarget() + " degrees. Warming the sauna takes approximately 45 minutes.");
      self.cancelCommand = "sauna on";
      return;
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
        self.log.addMessage(command.value, "Sauna is already off, use 'sauna on' to turn sauna on");
        return;
      }
      self.state().sauna.active(false);
      self.log.addMessage(command.value, "Sauna was turned off.");
    } 
    else if(commandString == "lights on") {
      if(cancel) {
        self.state().lights.kitchen(false);
        self.state().lights.bedroom(false);
        self.state().lights.bathroom(false);
        self.state().lights.livingroom(false);
        self.log.addMessage("cancel", "Canceled previous command, turned ALL lights off, because this is just a test UI with no real intelligence...");
        self.cancelCommand = null;
        return;
      }
      
      if(fullCommand == "lights on") {
        self.state().lights.kitchen(true);
        self.state().lights.bedroom(true);
        self.state().lights.bathroom(true);
        self.state().lights.livingroom(true);
        self.log.addMessage("lights on", "Turned ALL lights on. Use 'lights on [room]' to toggle one light at a time.");
      } else {
        if(fullCommand.indexOf('kitchen', 8) != -1) {
          self.state().lights.kitchen(true);
          self.log.addMessage(fullCommand, "Kitchen lights turned on");
        }
        if(fullCommand.indexOf('bedroom', 8) != -1) {
          self.state().lights.bedroom(true);
          self.log.addMessage(fullCommand, "Bedroom lights turned on");
        }
        if(fullCommand.indexOf('bathroom', 8) != -1) {
          self.state().lights.bathroom(true);
          self.log.addMessage(fullCommand, "Bathroom lights turned on");
        }
        if(fullCommand.indexOf('livingroom', 8) != -1) {
          self.state().lights.livingroom(true);
          self.log.addMessage(fullCommand, "Livingroom lights turned on");
        }
      }
      self.cancelCommand = commandString;
      return;
    }
    else if(commandString == "lights off") {
      if(cancel) {
        self.state().lights.kitchen(true);
        self.state().lights.bedroom(true);
        self.state().lights.bathroom(true);
        self.state().lights.livingroom(true);
        self.log.addMessage("cancel", "Canceled previous command, turned ALL lights on, because this is just a test UI with no real intelligence...");
        self.cancelCommand = null;
        return;
      }
      
      if(fullCommand == "lights off") {
        self.state().lights.kitchen(false);
        self.state().lights.bedroom(false);
        self.state().lights.bathroom(false);
        self.state().lights.livingroom(false);
        self.log.addMessage("lights off", "Turned ALL lights off. Use 'lights off [room]' to toggle one light at a time.");
      } else {
        if(fullCommand.indexOf('kitchen', 8) != -1) {
          self.state().lights.kitchen(false);
          self.log.addMessage(fullCommand, "Kitchen lights turned off");
        }
        if(fullCommand.indexOf('bedroom', 8) != -1) {
          self.state().lights.bedroom(false);
          self.log.addMessage(fullCommand, "Bedroom lights turned off");
        }
        if(fullCommand.indexOf('bathroom', 8) != -1) {
          self.state().lights.bathroom(false);
          self.log.addMessage(fullCommand, "Bathroom lights turned off");
        }
        if(fullCommand.indexOf('livingroom', 8) != -1) {
          self.state().lights.livingroom(false);
          self.log.addMessage(fullCommand, "Livingroom lights turned off");
        }
      }
      self.cancelCommand = commandString;
      return;
    }
    else if(commandString == "leave") {
      self.state().lights.kitchen(false);
      self.state().lights.bedroom(false);
      self.state().lights.bathroom(false);
      self.state().lights.livingroom(false);
      
      self.state().appliances.oven(false);
      self.state().appliances.moccamaster(false);
      
      self.state().sauna.active(false);
      
      self.log.addMessage(fullCommand, "Leaving the apartment, turned all lights and devices off");
      self.cancelCommand = null;
      return;
    } else if(commandString == "help") {
      self.log.addMessage("help", "Instructions:<br/><b>sauna on [temperature]</b> - turn sauna on. Temperature is optional, default 80 C<br/><b>sauna off</b> - turn sauna off<br/>"
                                + "<b>lights on [room]</b> - turn lights on. Room is optional, e.g. 'lights on kitchen' will turn on kitchen lights only<br/>"
                                + "<b>lights off [room]</b> - turn lights off.<br/><b>leave</b> - Leave the apartment and turn off all lights and devices");
    
    }
    self.cancelCommand = fullCommand;
  };
  
  self.COMMANDS = [
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
    },
    {
      value: 'leave',
      info: 'Leave the apartment, turn all lights and devices off'
    },
    {
      value: 'cancel',
      info: 'Cancel last action'
    },
    {
      value: 'help',
      info: 'List available commands'
    }
  ];
  function findCommand(command) {
    for(var i in self.COMMANDS)
      if(command.indexOf(self.COMMANDS[i].value, 0) != -1)
        return self.COMMANDS[i];
    return null;
  }
}

function SystemState() {
  var self = this;
  
  self.sauna = new Sauna();
  self.lights = new Lights();
  self.appliances = new Appliances();
}

function Lights() {
  var self = this;
  
  self.allOff = function() {
    self.bedroom(false);
    self.kitchen(false);
    self.livingroom(false);
    self.bathroom(false);
  }
  
  self.bedroom = ko.observable(false);
  self.kitchen = ko.observable(false);
  self.livingroom = ko.observable(false);
  self.bathroom = ko.observable(false);
}

function Appliances() {
  var self = this;
  
  self.oven = ko.observable(true);
  self.moccamaster = ko.observable(false);
}

function Sauna() {
  var self = this;
  self.warmUpTime = 45;
  
  self.active = ko.observable(false);
  self.temperatureTarget = ko.observable(80);
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