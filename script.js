// Setup
function $(selector) { return document.querySelector(selector); }
function $$(selector) { return document.querySelectorAll(selector); }
/** Get JSON - https://stackoverflow.com/a/22790025/11039898
 * @param {string} url JSON file URL
 * @param {boolean} parse Whether or not to convert into a JS object
 * @returns 
 */
function get(url, parse=true){
    var rq = new XMLHttpRequest(); // a new request
    rq.open("GET", url, false);
    rq.send(null);
    return parse ? JSON.parse(rq.responseText) : rq.responseText;          
}


// Data
const templates = get('./data/3x3.json');


// DOM
const elCube = $('#cube');
const elSceneContainer = $('#scene_container');
const elControls = $('#controls');
const button_shuffle = $('#button_shuffle');

var mouseX = 0;
var mouseY = 0;
var pressed = {};






// Cube
function populate(templateName="3x3") {
    let html = '';
    let template = templates[templateName];
    for(let part of template) {
        let [rX, rY, rZ] = part.rot;
        html += `
        <div class="part ${part.type}"
            data-x="${rX}"
            data-y="${rY}"
            data-z="${rZ}"
            style="transform:
                rotateX(${rX}deg)
                rotateZ(${rZ}deg)
                rotateY(${rY}deg)
                translateZ(1em)"
        >`;

        for(let square of part.squares) {
            html += `<div class="square ${square}"></div>`;
        }

        html += '</div>';
    }

    elCube.innerHTML = html;
}
populate();


let brush = 'red';


$$('#cube .square').forEach(el => el.addEventListener('click', event => {
    console.log(event.target);
    event.target.className = `square ${brush}`;
}));



function setPaintColor(color) {
    brush = color;
    console.log(brush);
}


// Controls
var keyFiring = false;
document.addEventListener('keydown', event => {
    let key = event.key;
    pressed[key] = true;
    if((key == 'z' || key == 'Z') && event.ctrlKey == true) undo();
    else if(key == 'Shift'/* && !shuffling*/) {
        button_shuffle.innerText = "Fast Shuffle";
        body.classList.add('shift_key');
    };
});

document.addEventListener('keyup', event => {
    let key = event.key;
    pressed[key] = false;
    if(key == 'Shift'/* && !shuffling*/) {
        button_shuffle.innerText = "Shuffle";
        body.classList.remove('shift_key');
    };
});

/** Camera rotation */
var camera = {
    y: -45,
    x: -35,
}


function ticker() {
    // let dir = -4;
    if(pressed['w']) camera.x += 2;
    if(pressed['a']) camera.y += -2;
    if(pressed['s']) camera.x -= 2;
    if(pressed['d']) camera.y += 2;

    updateCubeRot();
    requestAnimationFrame(ticker);
}
ticker();

// Function that returns a Promise for the FPS
const getFPS = () =>
  new Promise(resolve =>
    requestAnimationFrame(t1 =>
      requestAnimationFrame(t2 => resolve(1000 / (t2 - t1)))
    )
  )

// Calling the function to get the FPS
getFPS().then(fps => console.log(fps));

function updateCubeRot() {
    requestAnimationFrame(() => {
        elCube.style.transform = `rotateX(${camera.x}deg) rotateY(${camera.y}deg) `;
        // Brightness
        // $('#u').style.filter = `brightness(${loopRot(rotation.x - 45) / 3}%)`;
        // $('#d').style.filter = `brightness(${loopRot(rotation.x + 180) / 3}%)`;
        // $('#f').style.filter = `brightness(${loopRot(rotation.y - 360 / 3)}%)`;
    });
}

// function loopRot(rot) {
//     let a = rot;
//     while(a < 1 || a > 360) {
//         if(a < 1) a += 360;
//         else if(a > 360) a -= 360;
//     }
//     return a;
// }

// Page
const render_label = $('#render_label');
var rmode = 'Cube';
function renderMode() {
    if(rmode == 'Cube') {
        body.classList.add('semi_flat');
        if(camera.y < -90 || camera.y > 90) {
            camera.y = 0;
            updateCubeRot();
        }
        rmode = 'Unfold';
    } else if(rmode == 'Unfold') {
        body.classList.remove('semi_flat');
        body.classList.add('render_flat');
        rmode = 'Flat';
    } else if(rmode == 'Flat') {
        body.classList.remove('render_flat');
        rmode = 'Cube';
    }
    render_label.innerText = rmode;
}


// const elPanel = $('#panel');
const body = document.querySelector('body');
const elPanelToggle = $('#panel_toggle');
var panelVisible = true;
function togglePanel() {
    if(panelVisible) {
        body.classList.add('hide');
        elPanelToggle.innerText = "⮝";
    } else {
        body.classList.remove('hide');
        elPanelToggle.innerText = "⮟";
    }
    panelVisible = !panelVisible;
}



// button_shuffle.addEventListener('click', shuffle);



var pointerType = undefined;
var mousedownInterval;
var originX;
var originY;
var omX;
var omY;

// Mouse down
elSceneContainer.addEventListener('mousedown', pointerStart);
elSceneContainer.addEventListener('touchstart', pointerStart);
function pointerStart(event) {
    // Mouse origin
    omX = mouseX;
    omY = mouseY;

    // Rotation origin
    originX = parseInt(camera.x);
    originY = parseInt(camera.y);

    clearInterval(mousedownInterval);
    // if(pointerType == 'touch') {
    //     mousedownInterval = setInterval(() => {

    //         rotation.x = originX + (mouseY - omY) * -0.3;
    //         rotation.y = originY + (mouseX - omX) *  0.5;
    //         updateCubeRot();
    //     }, 1000 / 30);
    // } else {
        mousedownInterval = setInterval(() => {
            // let multX = 0.5;
            // let absolute = Math.abs(rotation.x % 360);
            // if(absolute > 90 && absolute < 270) {console.log('yes'); multX = -0.5};
            camera.x = originX + (mouseY - omY) * -0.3;
            camera.y = originY + (mouseX - omX) *  0.5;
            updateCubeRot();
        }, 1000 / 30);
    // }
}

// Mouse up
document.addEventListener('mouseup', pointerEnd);
elSceneContainer.addEventListener('touchend', pointerEnd);
function pointerEnd(event) {
    clearInterval(mousedownInterval);
}
// document.addEventListener('mouseout', () => { clearInterval(mousedownInterval); });


// Mouse position handler
// CREDIT:
// https://stackoverflow.com/a/7790764
(function() {
    document.onmousemove = handleMouseMove;

    document.ontouchstart = handleMouseMove;
    document.ontouchmove = handleMouseMove;
    function handleMouseMove(event) {
        var eventDoc, doc, body;
        event = event || window.event; // IE-ism

        // Touch 
        if(event.type == 'touchstart' || event.type == 'touchmove' || event.type == 'touchend' || event.type == 'touchcancel'){
            var evt = (typeof event.originalEvent === 'undefined') ? event : event.originalEvent;
            var touch = evt.touches[0] || evt.targetTouches[0];
            mouseX = Number(touch.pageX.toFixed(0));
            mouseY = Number(touch.pageY.toFixed(0));
            pointerType = 'touch';
        }
        // Mouse
        else if(event.pageX == null && event.clientX != null && event.type == 'mousedown' || event.type == 'mouseup' || event.type == 'mousemove' || event.type == 'mouseover'|| event.type=='mouseout' || event.type=='mouseenter' || event.type=='mouseleave') {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0 );

            mouseX = event.pageX;
            mouseY = event.pageY;

            pointerType = 'mouse';
        }

        // Debug
        // document.getElementById('debug').innerText = `X ${mouseX}\nY ${mouseY}\noriginX ${originX}\noriginY ${originY}\nomX ${omX}\nomY ${omY}\n`;
    }
})();
