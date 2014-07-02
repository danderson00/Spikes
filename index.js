$(function () {
    var mouseIsDown = false;
    $('.control')
        .on('touchstart', function (e) {
            var octant = getTouchOctant(e);
            start(octant);
            scroll(octant);
        })
        .on('touchmove', function (e) {
            move(getTouchOctant(e));
            e.preventDefault();
        })
        .on('touchend', end);


    $('.toolbar div').on('touchstart', function () {
        var element = $(this).addClass('active');
        setTimeout(function () {
            element.css('transition', 'background-color 500ms linear').removeClass('active');
            setTimeout(function () {
                element.css('transition', '');
            }, 500);
        }, 20);
    });


    function scroll(octant) {
        var left = $('.contentContainer').scrollLeft(),
            top = $('.contentContainer').scrollTop();

        switch (octant) {
            case 0: $('.contentContainer').scrollTop(top - 20); break;
            case 1: $('.contentContainer').scrollTop(top - 20).scrollLeft(left + 20); break;
            case 2: $('.contentContainer').scrollLeft(left + 20); break;
            case 3: $('.contentContainer').scrollTop(top + 20).scrollLeft(left + 20); break;
            case 4: $('.contentContainer').scrollTop(top + 20); break;
            case 5: $('.contentContainer').scrollTop(top + 20).scrollLeft(left - 20); break;
            case 6: $('.contentContainer').scrollLeft(left - 20); break;
            case 7: $('.contentContainer').scrollTop(top - 20).scrollLeft(left - 20); break;
        }
    }

    var current;

    function start(octant) {
        show(octant);
        current = octant;
    }

    function move(octant) {
        if (current !== octant) {
            hide(current);
            current = octant;
            show(current);
        }
    }

    function end() {
        hide(current);
        current = undefined;
    }

    function show(octant) {
        var element = $('.' + getClass(octant));
        element.addClass('opaque');
    }

    function hide(octant) {
        var element = $('.' + getClass(octant))
            .css('transition', 'opacity 500ms linear')
            .removeClass('opaque');

        setTimeout(function () {
            element.css('transition', '');
        }, 500);
    }

    function getTouchOctant(e) {
        var touch = e.originalEvent.touches[0];
        return getElementOctant('body', touch.pageX, touch.pageY);
    }

    function getClass(octant) {
        switch (octant) {
            case 0: return 'n';
            case 1: return 'ne';
            case 2: return 'e';
            case 3: return 'se';
            case 4: return 's';
            case 5: return 'sw';
            case 6: return 'w';
            case 7: return 'nw';
        }
    }
});

function getElementOctant(element, pageX, pageY) {
    element = $(element);
    var height = element.height(),
        width = element.width(),
        offset = element.offset(),
        x = pageX - offset.left,
        y = pageY - offset.top;

    return getRectangleOctant(height, width, x, y);
}

// only works for height > width...
function getRectangleOctant(height, width, x, y) {
    var start = (height - width) / 2,
        end = height - start;

    // we will only apply our octant to a box in the centre of the screen
    // for above and below, divide into three regions
    if (y < start)
        return (Math.floor(x / (width / 3)) + 7) % 8;

    if (y > end)
        return 5 - Math.floor(x / (width / 3));

    // this DOES work with height > width...
    // adjust our x and y to be relative to the center of the screen
    return getOctant(x - width / 2, y - height / 2);
}

function getOctant(x, y) {
    var baseAngle = Math.atan2(y, x) * 180 / Math.PI,
        // baseAngle starts in the second quadrant, adjust so the 
        // first octant is 22.5 degrees either side of north
        angle = (baseAngle + 360 + 112.5) % 360,

        // we don't want exactly even octants, these are the angles
        octantAngles = [45, 30, 75, 30, 45, 30, 75, 30],
        octantAngle = 0;

    for (var i = 0; i < 8; i++) {
        octantAngle += octantAngles[i];
        if (angle < octantAngle)
            return i;
    }
}
