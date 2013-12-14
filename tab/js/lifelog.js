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
            var marker = v.marker ? { symbol: 'url(' + v.marker + ')' } : null;;
            return { x: moment(v.date), y: self.yAxis2Cumulative() ? sum += v.value : v.value, marker: marker };
        }) : null;

        var series = [];
        if (self.yAxis1() != null)
            series.push({
                name: self.yAxis1().name + (self.yAxis1Cumulative() ? ' (cumulative)' : ''),
                data: ya1Data,
                yAxis: 0
            });
        if (self.yAxis2() != null)
            series.push({
                name: self.yAxis2().name + (self.yAxis2Cumulative() ? ' (cumulative)' : ''),
                data: ya2Data,
                yAxis: 1
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
                    title: { text: self.yAxis1() != null ? self.yAxis1().name : '' }
                },
                {
                    opposite: true,
                    title: { text: self.yAxis2() != null ? self.yAxis2().name : ''}
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
            hoverClass: 'hover',
            drop: function(e, u) {
                self.setY1($(u.draggable).data('id'));
            }
        });
        $('.ydrop2').droppable({
            hoverClass: 'hover',
            drop: function (e, u) {
                self.setY2($(u.draggable).data('id'));
            }
        });
    };

    self.setY1 = function(id) {
        if (id == 'pushups') {
            self.yAxis1(pushupData);
        } else if (id == 'running') {
            self.yAxis1(runningData);
        } else {
            self.yAxis1(happinessData);
        }
    };

    self.setY2 = function (id) {
        if (id == 'pushups') {
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
});
