'use strict';

(function() {
  $('#visualization').hide()
  let cal = new CalHeatMap()
  window.cal = cal
  window.renderCal = function(data) {
    cal.init({
      domain: "day",
      subDomain: "hour",
      colLimit: 6,
      domainGutter: 0,
      data,
      start: new Date(2018, 11, 5),
      cellSize: 15,
      cellPadding: 5,
      range: 2,
      previousSelector: "#previous-selector",
      nextSelector: "#next-selector",
      verticalOrientation: true,
      displayLegend: false,
      label: {
        position: "left",
        offset: {
          x: 20,
          y: 12
        },
        width: 40
      },
      legend: [1, 2, 3, 4],
      legendColors: ["#ecf5e2", "#232181"]
    });
  }
})();
