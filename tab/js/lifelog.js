function ViewModel() {
    var self = this;

    self.yAxis1 = ko.observable(pushupData);
    self.yAxis1.subscribe(function () { self.drawChart(); });
    self.yAxis1Cumulative = ko.observable(false);
    self.yAxis1Cumulative.subscribe(function() { self.drawChart(); });
    self.yAxis1Name = ko.computed(function() {
        return self.yAxis1() != null ? self.yAxis1().dropName : 'D r o p &nbsp; m e t r i c &nbsp; h e r e';
    });

    self.yAxis2 = ko.observable(null);
    self.yAxis2.subscribe(function () { self.drawChart(); });
    self.yAxis2Cumulative = ko.observable(false);
    self.yAxis2Cumulative.subscribe(function () { self.drawChart(); });
    self.yAxis2Name = ko.computed(function () {
        return self.yAxis2() != null ? self.yAxis2().dropName : 'D r o p &nbsp; m e t r i c &nbsp; h e r e';
    });

    self.xAxis = ko.observable(null);
    self.xAxis.subscribe(function () { self.drawChart(); });

    self.chartHeight = ko.observable(0);

    self.drawChart = function () {
        var sum = 0;
        var ya1Data = self.yAxis1() != null ? _.map(self.yAxis1().data, function (v) {
            var marker = v.marker ? { symbol: 'url(' + v.marker + ')' } : null;
            return { x: moment(v.date), y: self.yAxis1Cumulative() ? sum += v.value : v.value, marker: marker };
        }) : null;
        sum = 0;
        var ya2Data = self.yAxis2() != null ? _.map(self.yAxis2().data, function (v) {
            var marker = v.marker ? { symbol: 'url(' + v.marker + ')' } : null;
            return { x: moment(v.date), y: self.yAxis2Cumulative() ? sum += v.value : v.value, marker: marker };
        }) : null;

        var series = [];
        if (self.yAxis1() != null)
            series.push({
                name: self.yAxis1().name + (self.yAxis1Cumulative() ? ' (cumulative)' : ''),
                data: ya1Data,
                lineWidth: self.yAxis1().lineWidth != null ? self.yAxis1().lineWidth : 2,
                yAxis: 0,
                type: self.yAxis1().type
            });
        if (self.yAxis2() != null)
            series.push({
                name: self.yAxis2().name + (self.yAxis2Cumulative() ? ' (cumulative)' : ''),
                data: ya2Data,
                lineWidth: self.yAxis2().lineWidth != null ? self.yAxis2().lineWidth : 2,
                yAxis: 1,
                type: self.yAxis2().type
            });

        self.chart = $('#chart').highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'LifeLog',
                x: -20
            },
            xAxis: {
                type: self.xAxis() == null ? 'datetime' : '??',
                title: {
                    text: null
                }
            },
            yAxis: [
                {
                    title: { text: self.yAxis1() != null ? self.yAxis1().name : '' },
                    labels: { enabled: self.yAxis1() != null ? self.yAxis1().labels : true },
                    min: self.yAxis1() != null && self.yAxis1().min ? self.yAxis1().min : null,
                    max: self.yAxis1() != null && self.yAxis1().max ? self.yAxis1().max : null
                },
                {
                    opposite: true,
                    title: { text: self.yAxis2() != null ? self.yAxis2().name : '' },
                    labels: { enabled: self.yAxis2() != null ? self.yAxis2().labels : true },
                    min: self.yAxis2() != null && self.yAxis2().min ? self.yAxis2().min : null,
                    max: self.yAxis2() != null && self.yAxis2().max ? self.yAxis2().max : null
                }
            ],
            series: series
        });
        self.chartHeight($('#chart').height());
    };

    self.setDragDrop = function() {
        $('.measures li').draggable({
            helper: 'clone',
            revert: 'invalid'
        });
        $('.ydrop1').droppable({
            tolerance: 'touch',
            hoverClass: 'hover',
            drop: function(e, u) {
                self.setY1($(u.draggable).data('id'));
                self.setNullDrag('.ydrop1', self.setY1);
            }
        });
        $('.ydrop2').droppable({
            tolerance: 'touch',
            hoverClass: 'hover',
            drop: function (e, u) {
                self.setY2($(u.draggable).data('id'));
                self.setNullDrag('.ydrop2', self.setY2);
            }
        });
    };

    self.setNullDrag = function(cls, clb) {
        $(cls).draggable({
            helper: 'clone',
            stop: function(e, ui) {
                if (Math.abs($(cls).position().top - ui.position.top) > 50 || Math.abs($(cls).position().left - ui.position.left) > 50) {
                    clb(null);
                }
            }
        });
    };

    self.setY1 = function(id) {
        if (id == null) {
            self.yAxis1(null);
        } else if (id == 'pushups') {
            self.yAxis1(pushupData);
        } else if (id == 'running') {
            self.yAxis1(runningData);
        } else {
            self.yAxis1(happinessData);
        }
    };

    self.setY2 = function (id) {
        if (id == null) {
            self.yAxis2(null);
        } else if (id == 'pushups') {
            self.yAxis2(pushupData);
        } else if (id == 'running') {
            self.yAxis2(runningData);
        } else {
            self.yAxis2(happinessData);
        }
    };

    self.initialize = function () {
        self.drawChart();
        self.setDragDrop();
    };
}

$(function() {
    window.viewModel = new ViewModel();
    ko.applyBindings(window.viewModel);

    window.viewModel.initialize();
    window.viewModel.setNullDrag('.ydrop1', window.viewModel.setY1);
});
