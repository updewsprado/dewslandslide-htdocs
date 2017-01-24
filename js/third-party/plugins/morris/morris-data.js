// Morris.js Charts sample data for SB Admin template

$(function() {

    // Area Chart
    Morris.Area({
        element: 'morris-area-chart',
        data: [{
            period: '2010 Q1',
            iphone: 2666,
            ipad: null,
            itouch: 2647
        }, {
            period: '2010 Q2',
            iphone: 2778,
            ipad: 2294,
            itouch: 2441
        }, {
            period: '2010 Q3',
            iphone: 4912,
            ipad: 1969,
            itouch: 2501
        }, {
            period: '2010 Q4',
            iphone: 3767,
            ipad: 3597,
            itouch: 5689
        }, {
            period: '2011 Q1',
            iphone: 6810,
            ipad: 1914,
            itouch: 2293
        }, {
            period: '2011 Q2',
            iphone: 5670,
            ipad: 4293,
            itouch: 1881
        }, {
            period: '2011 Q3',
            iphone: 4820,
            ipad: 3795,
            itouch: 1588
        }, {
            period: '2011 Q4',
            iphone: 15073,
            ipad: 5967,
            itouch: 5175
        }, {
            period: '2012 Q1',
            iphone: 10687,
            ipad: 4460,
            itouch: 2028
        }, {
            period: '2012 Q2',
            iphone: 8432,
            ipad: 5713,
            itouch: 1791
        }],
        xkey: 'period',
        ykeys: ['iphone', 'ipad', 'itouch'],
        labels: ['iPhone', 'iPad', 'iPod Touch'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });

	var senslopeAccel = [{"timestamp":"2014-08-05 00:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 01:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3114"},{"timestamp":"2014-08-05 01:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 02:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3114"},{"timestamp":"2014-08-05 02:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 03:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 03:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 04:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 04:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 05:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 05:30:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-05 06:00:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-05 06:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 07:00:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-05 07:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 08:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 08:30:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-05 09:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 09:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 10:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 10:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 11:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 11:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 12:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3030"},{"timestamp":"2014-08-05 12:30:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-05 13:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 13:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 14:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 15:00:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-05 15:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 16:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 16:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3030"},{"timestamp":"2014-08-05 17:00:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-05 17:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 18:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 18:30:00","xvalue":"970","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-05 19:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 19:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 20:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 20:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 21:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 22:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 22:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3030"},{"timestamp":"2014-08-05 23:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-05 23:30:00","xvalue":"970","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-06 00:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 00:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 01:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 01:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 02:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 02:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 03:30:00","xvalue":"969","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 05:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 05:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 06:30:00","xvalue":"969","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-06 07:00:00","xvalue":"969","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 07:30:00","xvalue":"970","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-06 08:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 08:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 09:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 09:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 10:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 10:30:00","xvalue":"969","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-06 11:00:00","xvalue":"969","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 11:30:00","xvalue":"970","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-06 12:00:00","xvalue":"970","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-06 12:30:00","xvalue":"970","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-06 13:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 13:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 14:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 15:00:00","xvalue":"970","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-06 15:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 16:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 16:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 17:00:00","xvalue":"970","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-06 17:30:00","xvalue":"970","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-06 18:00:00","xvalue":"969","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 18:30:00","xvalue":"969","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 19:00:00","xvalue":"970","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-06 19:30:00","xvalue":"969","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-06 20:00:00","xvalue":"970","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-06 20:30:00","xvalue":"969","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-06 21:00:00","xvalue":"969","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-06 21:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 22:00:00","xvalue":"969","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 22:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-06 23:00:00","xvalue":"969","yvalue":"4","zvalue":"64","mvalue":"3083"},{"timestamp":"2014-08-06 23:30:00","xvalue":"969","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-07 00:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-07 00:30:00","xvalue":"969","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-07 01:00:00","xvalue":"970","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-07 01:30:00","xvalue":"970","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-07 02:00:00","xvalue":"969","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-07 02:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-07 03:00:00","xvalue":"969","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-07 03:30:00","xvalue":"970","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-07 04:00:00","xvalue":"970","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-07 04:30:00","xvalue":"969","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-07 05:00:00","xvalue":"969","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-07 05:04:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-07 05:30:00","xvalue":"971","yvalue":"4","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-07 06:00:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-07 06:30:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3137"},{"timestamp":"2014-08-07 07:00:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"3030"},{"timestamp":"2014-08-07 07:30:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3030"},{"timestamp":"2014-08-07 08:00:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3030"},{"timestamp":"2014-08-07 08:30:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-07 09:00:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-07 09:30:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-07 10:00:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-07 10:30:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-07 11:00:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-07 11:30:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-07 12:00:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-07 12:30:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3137"},{"timestamp":"2014-08-07 13:00:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-07 13:30:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3137"},{"timestamp":"2014-08-07 14:00:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3137"},{"timestamp":"2014-08-07 14:30:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3137"},{"timestamp":"2014-08-07 15:00:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3137"},{"timestamp":"2014-08-07 15:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3137"},{"timestamp":"2014-08-07 16:00:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3030"},{"timestamp":"2014-08-07 16:30:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-07 17:00:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"3030"},{"timestamp":"2014-08-07 17:30:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3030"},{"timestamp":"2014-08-07 18:00:00","xvalue":"970","yvalue":"4","zvalue":"60","mvalue":"3030"},{"timestamp":"2014-08-07 18:30:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3030"},{"timestamp":"2014-08-07 19:00:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-08-07 19:30:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3030"},{"timestamp":"2014-08-07 20:00:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"2999"},{"timestamp":"2014-08-07 20:30:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3030"},{"timestamp":"2014-08-07 21:00:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-07 21:30:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3030"},{"timestamp":"2014-08-07 22:00:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"2999"},{"timestamp":"2014-08-07 22:30:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"2999"},{"timestamp":"2014-08-07 23:00:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-07 23:30:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-08 00:00:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-08 00:30:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-08 01:00:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-08 01:30:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-08 02:00:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-08 02:30:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-27 14:12:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-27 14:42:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-27 15:13:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-27 15:43:00","xvalue":"969","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-27 16:13:00","xvalue":"969","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-27 16:43:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-27 17:12:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-27 17:30:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-27 17:48:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-27 18:04:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-27 18:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-08-27 19:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-27 19:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-27 20:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-27 20:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-27 21:04:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-27 21:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-27 22:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-27 22:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-27 23:34:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-28 00:04:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-28 00:34:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-28 01:04:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-28 01:34:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-28 02:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-28 02:34:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-28 03:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-28 03:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-28 04:04:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-28 04:34:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-28 05:04:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-28 05:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-28 06:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-28 06:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-28 07:04:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-28 07:34:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-28 08:04:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-28 08:34:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-28 09:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-28 09:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-28 10:04:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-28 10:34:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-28 11:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-28 11:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-28 12:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-28 12:34:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-28 13:04:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-28 13:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-28 14:04:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-28 14:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-28 15:04:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-28 16:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-28 16:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-28 17:04:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-28 17:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-28 18:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-28 18:34:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-28 19:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-28 19:34:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-28 20:04:00","xvalue":"970","yvalue":"4","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-28 20:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-28 21:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-28 21:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-28 22:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-28 22:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-28 23:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-28 23:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-29 00:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 00:34:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 01:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 01:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 02:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 02:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 03:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 03:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 04:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 04:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 05:04:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 05:34:00","xvalue":"970","yvalue":"5","zvalue":"63","mvalue":"3083"},{"timestamp":"2014-08-29 06:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 06:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 07:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 07:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 08:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 08:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 09:04:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 09:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 10:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3030"},{"timestamp":"2014-08-29 10:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 11:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 11:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 12:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-08-29 12:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 13:04:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 13:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 14:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 14:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 15:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 15:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-29 16:04:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"2999"},{"timestamp":"2014-08-29 16:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-29 17:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-29 17:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-29 18:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-29 18:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-29 19:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-29 19:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-29 20:04:00","xvalue":"970","yvalue":"4","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-29 20:34:00","xvalue":"970","yvalue":"5","zvalue":"63","mvalue":"3052"},{"timestamp":"2014-08-29 21:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-29 21:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-29 22:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-29 22:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-29 23:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-29 23:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-30 00:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-30 00:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-30 01:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-30 01:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-30 02:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-30 02:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-08-30 03:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-30 03:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-30 04:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-30 04:34:00","xvalue":"970","yvalue":"5","zvalue":"63","mvalue":"3052"},{"timestamp":"2014-08-30 05:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3052"},{"timestamp":"2014-08-30 05:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-30 06:04:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"3083"},{"timestamp":"2014-08-30 06:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-09-01 15:34:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"2967"},{"timestamp":"2014-09-01 16:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-01 16:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-01 17:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-01 17:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-01 18:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-01 18:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-01 19:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-01 19:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-01 20:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-01 20:34:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-01 21:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-01 21:34:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"2999"},{"timestamp":"2014-09-01 22:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-01 23:04:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-01 23:34:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-02 00:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-02 00:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-02 01:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-02 01:34:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-02 02:04:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-02 02:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-02 03:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-02 03:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-02 04:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-02 04:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-02 05:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-02 05:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-02 06:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-02 06:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-02 07:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-02 07:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-02 08:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-02 08:34:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-02 09:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-02 09:34:00","xvalue":"970","yvalue":"6","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-02 10:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-02 10:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-02 11:04:00","xvalue":"970","yvalue":"6","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-02 11:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-02 12:04:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-02 12:34:00","xvalue":"971","yvalue":"6","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-02 13:04:00","xvalue":"970","yvalue":"6","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-02 13:34:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-02 14:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-02 14:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-02 15:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-02 15:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-02 16:04:00","xvalue":"971","yvalue":"6","zvalue":"60","mvalue":"2967"},{"timestamp":"2014-09-02 16:34:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-02 17:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-02 17:34:00","xvalue":"971","yvalue":"6","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-02 18:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-02 18:34:00","xvalue":"971","yvalue":"6","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-02 19:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-02 19:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-02 20:04:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-02 20:34:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-02 21:04:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-02 21:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-02 22:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-02 22:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-02 23:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-02 23:34:00","xvalue":"971","yvalue":"6","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-03 00:04:00","xvalue":"971","yvalue":"6","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-03 00:34:00","xvalue":"971","yvalue":"6","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-03 01:04:00","xvalue":"971","yvalue":"6","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-03 01:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-03 02:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-03 02:34:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-03 03:04:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-03 03:34:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-03 04:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-03 05:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-03 05:34:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-03 06:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-03 06:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-03 07:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-03 07:34:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-03 08:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-03 08:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-03 09:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"2967"},{"timestamp":"2014-09-03 09:34:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-03 10:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-03 10:34:00","xvalue":"970","yvalue":"5","zvalue":"62","mvalue":"2967"},{"timestamp":"2014-09-03 11:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-03 11:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-03 12:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-03 12:34:00","xvalue":"971","yvalue":"6","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-03 13:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"2967"},{"timestamp":"2014-09-03 13:34:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-03 14:04:00","xvalue":"971","yvalue":"6","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-03 14:34:00","xvalue":"971","yvalue":"6","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-03 15:04:00","xvalue":"971","yvalue":"6","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-03 15:34:00","xvalue":"971","yvalue":"6","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-03 16:04:00","xvalue":"971","yvalue":"6","zvalue":"61","mvalue":"2935"},{"timestamp":"2014-09-03 16:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-03 17:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-03 17:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-03 18:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-03 18:34:00","xvalue":"971","yvalue":"6","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-03 19:04:00","xvalue":"970","yvalue":"6","zvalue":"61","mvalue":"2956"},{"timestamp":"2014-09-03 19:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-03 20:04:00","xvalue":"971","yvalue":"6","zvalue":"61","mvalue":"2903"},{"timestamp":"2014-09-03 20:34:00","xvalue":"971","yvalue":"6","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-03 21:04:00","xvalue":"971","yvalue":"6","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-03 22:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-03 22:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-03 23:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-03 23:34:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-04 00:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 00:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 01:04:00","xvalue":"971","yvalue":"6","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-04 01:34:00","xvalue":"970","yvalue":"6","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 02:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"2999"},{"timestamp":"2014-09-04 02:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-04 03:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3083"},{"timestamp":"2014-09-04 03:34:00","xvalue":"971","yvalue":"6","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-04 04:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 04:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 05:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 05:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-04 06:04:00","xvalue":"971","yvalue":"6","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-04 06:34:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-04 07:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 07:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3020"},{"timestamp":"2014-09-04 08:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 08:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 09:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 09:34:00","xvalue":"970","yvalue":"6","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 10:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 10:34:00","xvalue":"971","yvalue":"6","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 11:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 11:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 12:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 12:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 13:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 13:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 14:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 14:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 15:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 15:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 16:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 16:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-04 17:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 17:34:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-04 18:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 18:34:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"2999"},{"timestamp":"2014-09-04 19:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 19:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 20:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"2999"},{"timestamp":"2014-09-04 20:34:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-04 21:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"2999"},{"timestamp":"2014-09-04 21:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-04 22:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-04 22:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-04 23:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-04 23:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-05 00:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-05 00:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-05 01:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-05 01:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-05 02:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-05 02:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-05 03:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-05 03:34:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-05 04:04:00","xvalue":"971","yvalue":"6","zvalue":"60","mvalue":"2999"},{"timestamp":"2014-09-05 04:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-05 05:04:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-05 05:34:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"2999"},{"timestamp":"2014-09-05 06:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-05 06:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-05 07:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"2999"},{"timestamp":"2014-09-05 07:34:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"2999"},{"timestamp":"2014-09-05 08:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-05 09:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-05 09:34:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-05 10:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-05 10:34:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"3052"},{"timestamp":"2014-09-05 11:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"2999"},{"timestamp":"2014-09-05 11:34:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-05 12:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"3052"},{"timestamp":"2014-09-05 12:34:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"2999"},{"timestamp":"2014-09-05 13:04:00","xvalue":"971","yvalue":"5","zvalue":"61","mvalue":"2999"},{"timestamp":"2014-09-05 13:34:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-05 14:04:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"2988"},{"timestamp":"2014-09-05 14:34:00","xvalue":"971","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-05 15:04:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-05 15:34:00","xvalue":"970","yvalue":"5","zvalue":"60","mvalue":"3020"},{"timestamp":"2014-09-05 17:04:00","xvalue":"970","yvalue":"5","zvalue":"61","mvalue":"2999"}];
/*
    Morris.Area({
        element: 'morris-area-chart',
        data: senslopeAccel,
        xkey: 'timestamp',
        ykeys: ['xvalue', 'yvalue', 'zvalue', 'mvalue'],
        labels: ['X', 'Y', 'Z', 'Moisture'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });
*/
    // Donut Chart
    Morris.Donut({
        element: 'morris-donut-chart',
        data: [{
            label: "Download Sales",
            value: 12
        }, {
            label: "In-Store Sales",
            value: 30
        }, {
            label: "Mail-Order Sales",
            value: 20
        }],
        resize: true
    });

var totalVisits = [{
            d: '2012-10-01',
            visits: 802
        }, {
            d: '2012-10-02',
            visits: 783
        }, {
            d: '2012-10-03',
            visits: 820
        }, {
            d: '2012-10-04',
            visits: 839
        }, {
            d: '2012-10-05',
            visits: 792
        }, {
            d: '2012-10-06',
            visits: 859
        }, {
            d: '2012-10-07',
            visits: 790
        }, {
            d: '2012-10-08',
            visits: 1680
        }, {
            d: '2012-10-09',
            visits: 1592
        }, {
            d: '2012-10-10',
            visits: 1420
        }, {
            d: '2012-10-11',
            visits: 882
        }, {
            d: '2012-10-12',
            visits: 889
        }, {
            d: '2012-10-13',
            visits: 819
        }, {
            d: '2012-10-14',
            visits: 849
        }, {
            d: '2012-10-15',
            visits: 870
        }, {
            d: '2012-10-16',
            visits: 1063
        }, {
            d: '2012-10-17',
            visits: 1192
        }, {
            d: '2012-10-18',
            visits: 1224
        }, {
            d: '2012-10-19',
            visits: 1329
        }, {
            d: '2012-10-20',
            visits: 1329
        }, {
            d: '2012-10-21',
            visits: 1239
        }, {
            d: '2012-10-22',
            visits: 1190
        }, {
            d: '2012-10-23',
            visits: 1312
        }, {
            d: '2012-10-24',
            visits: 1293
        }, {
            d: '2012-10-25',
            visits: 1283
        }, {
            d: '2012-10-26',
            visits: 1248
        }, {
            d: '2012-10-27',
            visits: 1323
        }, {
            d: '2012-10-28',
            visits: 1390
        }, {
            d: '2012-10-29',
            visits: 1420
        }, {
            d: '2012-10-30',
            visits: 1529
        }, {
            d: '2012-10-31',
            visits: 1892
        }, ];

    // Line Chart

    Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'morris-line-chart',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: totalVisits,
        // The name of the data record attribute that contains x-visitss.
        xkey: 'd',
        // A list of names of data record attributes that contain y-visitss.
        ykeys: ['visits'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Visits'],
        // Disables line smoothing
        smooth: false,
        resize: true
    });

/*
    Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'morris-line-chart',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: senslopeAccel,
        // The name of the data record attribute that contains x-visitss.
        xkey: 'timestamp',
        // A list of names of data record attributes that contain y-visitss.
        ykeys: ['xvalue', 'yvalue', 'zvalue', 'mvalue'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['X', 'Y', 'Z', 'Moisture'],
        // Disables line smoothing
        smooth: false,
        resize: true
    });
*/
    // Bar Chart
    Morris.Bar({
        element: 'morris-bar-chart',
        data: [{
            device: 'iPhone',
            geekbench: 136
        }, {
            device: 'iPhone 3G',
            geekbench: 137
        }, {
            device: 'iPhone 3GS',
            geekbench: 275
        }, {
            device: 'iPhone 4',
            geekbench: 380
        }, {
            device: 'iPhone 4S',
            geekbench: 655
        }, {
            device: 'iPhone 5',
            geekbench: 1571
        }],
        xkey: 'device',
        ykeys: ['geekbench'],
        labels: ['Geekbench'],
        barRatio: 0.4,
        xLabelAngle: 35,
        hideHover: 'auto',
        resize: true
    });


});
