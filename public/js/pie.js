$(function () {
    var api = impress();
    api.init();
    $('body').on('keydown', function (e) {
        if (e.keyCode == 27) {
            api.goto('overview')
        }
    }).on('mousewheel', function (e) {
        e.preventDefault();
    });
    var steps = $('.step');
    pieChart('#areaTable td', '#areaChart');
    $('#overview').on('impress:stepenter', function (e) {
        $('.extra').removeClass('none');
    }).on('impress:stepleave', function (e) {
        $('.extra').addClass('none');
    });
    steps.eq(1).on('impress:stepenter', function (e) {
        $(this).find('.none').stop().delay(1000).animate({
            opacity: 1
        }, 2000)
    }).on('impress:stepleave', function (e) {
        console.log(123)
        $(this).find('.none').stop().animate({
            opacity: 0
        }, 0);
    }).end().eq(12).on('impress:stepenter', function (e) {
        var data = JSON.parse('{"label":[1394582400025,1394584200025,1394586000025,1394587800025,1394589600025,1394591400025,1394593200025,1394595000025,1394596800025,1394598600025,1394600400025,1394602200025,1394604000025,1394605800025,1394607600025,1394609400025,1394611200025,1394613000025,1394614800025,1394616600025,1394618400025],"data":[19,24,35,27,37,21,22,18,31,21,18,27,23,23,22,34,24,27,26,16,5]}')
        var arr = [];
        for (var i = 0; i < data.label.length; i++) {
            var stamp = new Date(data.label[i]);
            var h = stamp.getHours(),
                m = stamp.getMinutes() == 0 ? '00' : stamp.getMinutes();
            arr.push(h + ':' + m + '~' + h + ':' + (parseInt(m) + 29));
        }
        var lineChartData = {
            labels: arr,
            datasets: [{
                fillColor: "rgba(220,220,220,0)",
                strokeColor: "rgba(100,100,120,1)",
                pointColor: "rgba(100,100,120,1)",
                pointStrokeColor: "#fff",
                data: data.data
            }]
        }
        var options = {
            scaleOverride: true,
            scaleSteps: 8,
            scaleStepWidth: 5,
            scaleStartValue: 0,
            datasetStrokeWidth: 5,
            pointDotRadius: 7
        }
        var myLine = new Chart($(this).find('canvas')[0].getContext("2d")).Line(lineChartData, options);
    }).end().eq(13).on('impress:stepenter', function (e) {
        var doughnutData = [{
            value: 8,
            label: '服装',
            color: "#0DA068"
        }, {
            value: 15,
            label: '配件',
            color: "#194E9C"
        }, {
            value: 11,
            label: '包',
            color: "#ED9C13"
        }, {
            value: 7,
            label: '鞋',
            color: "#ED5713"
        }, {
            value: 8,
            label: '帐篷',
            color: "#057249"
        }, {
            value: 4,
            label: '互联网',
            color: '#5F91DC'
        }];
        var options = {
            tooltips: {
                fontSize: '20px',
                padding: {
                    top: 30,
                    right: 20,
                    bottom: 30,
                    left: 20
                },
                offset: {
                    left: 20,
                    top: 0
                }
            }
        }
        var myDoughnut = new Chart($(this).find('canvas')[0].getContext("2d"), options).Doughnut(doughnutData, {
            animationEasing: "easeInOutQuad"
        });
    });
});



function pieChart(table, chart) {
    var chartSizePercent = 60; // The chart radius relative to the canvas width/height (in percent)
    var sliceBorderWidth = 1; // Width (in pixels) of the border around each slice
    var sliceBorderStyle = "#fff"; // Colour of the border around each slice
    var sliceGradientColour = "#ddd"; // Colour to use for one end of the chart gradient
    var maxPullOutDistance = 25; // How far, in pixels, to pull slices out when clicked
    var pullOutFrameStep = 4; // How many pixels to move a slice with each animation frame
    var pullOutFrameInterval = 40; // How long (in ms) between each animation frame
    var pullOutLabelPadding = 65; // Padding between pulled-out slice and its label
    var pullOutLabelFont = "bold 16px 微软雅黑"; // Pull-out slice label font
    var pullOutValueFont = "bold 12px 微软雅黑"; // Pull-out slice value font
    var pullOutValuePrefix = ""; // Pull-out slice value prefix
    var pullOutShadowColour = "rgba( 0, 0, 0, .5 )"; // Colour to use for the pull-out slice shadow
    var pullOutShadowOffsetX = 5; // X-offset (in pixels) of the pull-out slice shadow
    var pullOutShadowOffsetY = 5; // Y-offset (in pixels) of the pull-out slice shadow
    var pullOutShadowBlur = 5; // How much to blur the pull-out slice shadow
    var pullOutBorderWidth = 2; // Width (in pixels) of the pull-out slice border
    var pullOutBorderStyle = "#333"; // Colour of the pull-out slice border
    var chartStartAngle = -.5 * Math.PI; // Start the chart at 12 o'clock instead of 3 o'clock

    // Declare some variables for the chart
    var canvas; // The canvas element in the page
    var currentPullOutSlice = -1; // The slice currently pulled out (-1 = no slice)
    var currentPullOutDistance = 0; // How many pixels the pulled-out slice is currently pulled out in the animation
    var animationId = 0; // Tracks the interval ID for the animation created by setInterval()
    var chartData = []; // Chart data (labels, values, and angles)
    var chartColours = []; // Chart colours (pulled from the HTML table)
    var totalValue = 0; // Total of all the values in the chart
    var canvasWidth; // Width of the canvas, in pixels
    var canvasHeight; // Height of the canvas, in pixels
    var centreX; // X-coordinate of centre of the canvas/chart
    var centreY; // Y-coordinate of centre of the canvas/chart
    var chartRadius; // Radius of the pie chart, in pixels

    // Set things up and draw the chart
    init();


    /**
     * Set up the chart data and colours, as well as the chart and table click handlers,
     * and draw the initial pie chart
     */

    function init() {

        // Get the canvas element in the page
        canvas = $(chart)[0]

        // Exit if the browser isn't canvas-capable
        if (typeof canvas.getContext === 'undefined') return;

        // Initialise some properties of the canvas and chart
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        centreX = canvasWidth / 2 - 50;
        centreY = canvasHeight / 2;
        chartRadius = Math.min(canvasWidth, canvasHeight) / 2 * (chartSizePercent / 100);

        // Grab the data from the table,
        // and assign click handlers to the table data cells

        var currentRow = -1;
        var currentCell = 0;

        $(table).each(function (i, v) {
            currentCell++;
            if (currentCell % 2 != 0) {
                currentRow++;
                chartData[currentRow] = [];
                chartData[currentRow]['label'] = $(this).text();
            } else {
                var value = parseFloat($(this).text());
                totalValue += value;
                value = value.toFixed(2);
                chartData[currentRow]['value'] = value;
            }
            // Store the slice index in this cell, and attach a click handler to it
            $(this).data('slice', currentRow);
            $(this).click(handleTableClick);

            // Extract and store the cell colour
            if (rgb = $(this).css('color').match(/rgb\((\d+), (\d+), (\d+)/)) {
                chartColours[currentRow] = [rgb[1], rgb[2], rgb[3]];
            } else if (hex = $(this).css('color').match(/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/)) {
                chartColours[currentRow] = [parseInt(hex[1], 16), parseInt(hex[2], 16), parseInt(hex[3], 16)];
            } else {
                alert("Error: Colour could not be determined! Please specify table colours using the format '#xxxxxx'");
                return;
            }

        });
        // Now compute and store the start and end angles of each slice in the chart data

        var currentPos = 0; // The current position of the slice in the pie (from 0 to 1)

        for (var slice in chartData) {
            chartData[slice]['startAngle'] = 2 * Math.PI * currentPos;
            chartData[slice]['endAngle'] = 2 * Math.PI * (currentPos + (chartData[slice]['value'] / totalValue));
            currentPos += chartData[slice]['value'] / totalValue;
        }

        // All ready! Now draw the pie chart, and add the click handler to it
        drawChart();
        $(chart).click(handleChartClick);
    }


    /**
     * Process mouse clicks in the chart area.
     *
     * If a slice was clicked, toggle it in or out.
     * If the user clicked outside the pie, push any slices back in.
     *
     * @param Event The click event
     */

    function handleChartClick(clickEvent) {
        // Get the mouse cursor position at the time of the click, relative to the canvas
        var mouseX = clickEvent.offsetX - this.offsetLeft;
        var mouseY = clickEvent.offsetY - this.offsetTop;
        // Was the click inside the pie chart?
        var xFromCentre = mouseX - centreX;
        var yFromCentre = mouseY - centreY;
        var distanceFromCentre = Math.sqrt(Math.pow(Math.abs(xFromCentre), 2) + Math.pow(Math.abs(yFromCentre), 2));
        if (distanceFromCentre <= chartRadius) {

            // Yes, the click was inside the chart.
            // Find the slice that was clicked by comparing angles relative to the chart centre.

            var clickAngle = Math.atan2(yFromCentre, xFromCentre) - chartStartAngle;
            if (clickAngle < 0) clickAngle = 2 * Math.PI + clickAngle;

            for (var slice in chartData) {
                if (clickAngle >= chartData[slice]['startAngle'] && clickAngle <= chartData[slice]['endAngle']) {

                    // Slice found. Pull it out or push it in, as required.
                    toggleSlice(slice);
                    return;
                }
            }
        }

        // User must have clicked outside the pie. Push any pulled-out slice back in.
        pushIn();
    }


    /**
     * Process mouse clicks in the table area.
     *
     * Retrieve the slice number from the jQuery data stored in the
     * clicked table cell, then toggle the slice
     *
     * @param Event The click event
     */

    function handleTableClick(clickEvent) {
        var slice = $(this).data('slice');
        toggleSlice(slice);
    }


    /**
     * Push a slice in or out.
     *
     * If it's already pulled out, push it in. Otherwise, pull it out.
     *
     * @param Number The slice index (between 0 and the number of slices - 1)
     */

    function toggleSlice(slice) {
        if (slice == currentPullOutSlice) {
            pushIn();
        } else {
            startPullOut(slice);
        }
    }


    /**
     * Start pulling a slice out from the pie.
     *
     * @param Number The slice index (between 0 and the number of slices - 1)
     */

    function startPullOut(slice) {

        // Exit if we're already pulling out this slice
        if (currentPullOutSlice == slice) return;

        // Record the slice that we're pulling out, clear any previous animation, then start the animation
        currentPullOutSlice = slice;
        currentPullOutDistance = 0;
        clearInterval(animationId);
        animationId = setInterval(function () {
            animatePullOut(slice);
        }, pullOutFrameInterval);

        // Highlight the corresponding row in the key table
        $(table).removeClass('highlight');
        var labelCell = $(table + ':eq(' + (slice * 2) + ')');
        var valueCell = $(table + ':eq(' + (slice * 2 + 1) + ')');
        labelCell.addClass('highlight');
        valueCell.addClass('highlight');
    }


    /**
     * Draw a frame of the pull-out animation.
     *
     * @param Number The index of the slice being pulled out
     */

    function animatePullOut(slice) {

        // Pull the slice out some more
        currentPullOutDistance += pullOutFrameStep;

        // If we've pulled it right out, stop animating
        if (currentPullOutDistance >= maxPullOutDistance) {
            clearInterval(animationId);
            return;
        }

        // Draw the frame
        drawChart();
    }


    /**
     * Push any pulled-out slice back in.
     *
     * Resets the animation variables and redraws the chart.
     * Also un-highlights all rows in the table.
     */

    function pushIn() {
        currentPullOutSlice = -1;
        currentPullOutDistance = 0;
        clearInterval(animationId);
        drawChart();
        $(table).removeClass('highlight');
    }


    /**
     * Draw the chart.
     *
     * Loop through each slice of the pie, and draw it.
     */

    function drawChart() {

        // Get a drawing context
        var context = canvas.getContext('2d');

        // Clear the canvas, ready for the new frame
        context.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw each slice of the chart, skipping the pull-out slice (if any)
        for (var slice in chartData) {
            if (slice != currentPullOutSlice) drawSlice(context, slice);
        }

        // If there's a pull-out slice in effect, draw it.
        // (We draw the pull-out slice last so its drop shadow doesn't get painted over.)
        if (currentPullOutSlice != -1) drawSlice(context, currentPullOutSlice);
    }


    /**
     * Draw an individual slice in the chart.
     *
     * @param Context A canvas context to draw on
     * @param Number The index of the slice to draw
     */

    function drawSlice(context, slice) {

        // Compute the adjusted start and end angles for the slice
        var startAngle = chartData[slice]['startAngle'] + chartStartAngle;
        var endAngle = chartData[slice]['endAngle'] + chartStartAngle;

        if (slice == currentPullOutSlice) {

            // We're pulling (or have pulled) this slice out.
            // Offset it from the pie centre, draw the text label,
            // and add a drop shadow.

            var midAngle = (startAngle + endAngle) / 2;
            var actualPullOutDistance = currentPullOutDistance * easeOut(currentPullOutDistance / maxPullOutDistance, .8);
            startX = centreX + Math.cos(midAngle) * actualPullOutDistance;
            startY = centreY + Math.sin(midAngle) * actualPullOutDistance;
            context.fillStyle = 'rgb(' + chartColours[slice].join(',') + ')';
            context.textAlign = "center";
            context.font = pullOutLabelFont;
            context.fillText(chartData[slice]['label'], centreX + Math.cos(midAngle) * (chartRadius + maxPullOutDistance + pullOutLabelPadding), centreY + Math.sin(midAngle) * (chartRadius + maxPullOutDistance + pullOutLabelPadding));
            context.font = pullOutValueFont;
            context.fillText(pullOutValuePrefix + chartData[slice]['value'] + " (" + (parseInt(chartData[slice]['value'] / totalValue * 100 + .5)) + "%)", centreX + Math.cos(midAngle) * (chartRadius + maxPullOutDistance + pullOutLabelPadding), centreY + Math.sin(midAngle) * (chartRadius + maxPullOutDistance + pullOutLabelPadding) + 20);
            context.shadowOffsetX = pullOutShadowOffsetX;
            context.shadowOffsetY = pullOutShadowOffsetY;
            context.shadowBlur = pullOutShadowBlur;

        } else {

            // This slice isn't pulled out, so draw it from the pie centre
            startX = centreX;
            startY = centreY;
        }

        // Set up the gradient fill for the slice
        var sliceGradient = context.createLinearGradient(0, 0, canvasWidth * .75, canvasHeight * .75);
        sliceGradient.addColorStop(0, sliceGradientColour);
        sliceGradient.addColorStop(1, 'rgb(' + chartColours[slice].join(',') + ')');

        // Draw the slice
        context.beginPath();
        context.moveTo(startX, startY);
        context.arc(startX, startY, chartRadius, startAngle, endAngle, false);
        context.lineTo(startX, startY);
        context.closePath();
        context.fillStyle = sliceGradient;
        context.shadowColor = (slice == currentPullOutSlice) ? pullOutShadowColour : "rgba( 0, 0, 0, 0 )";
        context.fill();
        context.shadowColor = "rgba( 0, 0, 0, 0 )";

        // Style the slice border appropriately
        if (slice == currentPullOutSlice) {
            context.lineWidth = pullOutBorderWidth;
            context.strokeStyle = pullOutBorderStyle;
        } else {
            context.lineWidth = sliceBorderWidth;
            context.strokeStyle = sliceBorderStyle;
        }

        // Draw the slice border
        context.stroke();
    }


    /**
     * Easing function.
     *
     * A bit hacky but it seems to work! (Note to self: Re-read my school maths books sometime)
     *
     * @param Number The ratio of the current distance travelled to the maximum distance
     * @param Number The power (higher numbers = more gradual easing)
     * @return Number The new ratio
     */

    function easeOut(ratio, power) {
        return (Math.pow(1 - ratio, power) + 1);
    }

};
