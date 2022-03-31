// Setup
function $(sel) { return document.querySelector(sel); }
function dom(id) { return document.getElementById(id); }
const elCube = dom('cube');
const elScene = dom('scene');
const elControls = dom('controls');

var mouseX;
var mouseY;

var saved = {
    "u": [
        [
            "5",
            "2",
            "2"
        ],
        [
            "1",
            0,
            "2"
        ],
        [
            "5",
            0,
            "4"
        ]
    ],
    "d": [
        [
            "2",
            1,
            1
        ],
        [
            "3",
            1,
            "3"
        ],
        [
            "5",
            "3",
            1
        ]
    ],
    "f": [
        [
            "2",
            "5",
            "0"
        ],
        [
            "2",
            4,
            "1"
        ],
        [
            "0",
            "3",
            "3"
        ]
    ],
    "b": [
        [
            "1",
            "1",
            "2"
        ],
        [
            "0",
            5,
            "0"
        ],
        [
            "3",
            5,
            "0"
        ]
    ],
    "l": [
        [
            "1",
            "4",
            "0"
        ],
        [
            "2",
            3,
            "5"
        ],
        [
            3,
            "4",
            "4"
        ]
    ],
    "r": [
        [
            "3",
            "4",
            "4"
        ],
        [
            "5",
            "2",
            "4"
        ],
        [
            "4",
            "0",
            "5"
        ]
    ]
}

// Cube data
const cube3x3 = {
    u: [ // up, white
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ],
    d: [ // down, yellow
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
    ],
    f: [ // front, green
        [4, 4, 4],
        [4, 4, 4],
        [4, 4, 4],
    ],
    b: [ // back, blue
        [5, 5, 5],
        [5, 5, 5],
        [5, 5, 5],
    ],
    l: [ // left, orange
        [3, 3, 3],
        [3, 3, 3],
        [3, 3, 3],
    ],
    r: [ // right, red
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 2],
    ],
};
const cube4x4 = {
    u: [ // up, white
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    d: [ // down, yellow
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
    ],
    f: [ // front, red
        [2, 2, 2, 2],
        [2, 2, 2, 2],
        [2, 2, 2, 2],
        [2, 2, 2, 2],
    ],
    b: [ // back, orange
        [3, 3, 3, 3],
        [3, 3, 3, 3],
        [3, 3, 3, 3],
        [3, 3, 3, 3],
    ],
    l: [ // left, green
        [4, 4, 4, 4],
        [4, 4, 4, 4],
        [4, 4, 4, 4],
        [4, 4, 4, 4],
    ],
    r: [ // right, blue
        [5, 5, 5, 5],
        [5, 5, 5, 5],
        [5, 5, 5, 5],
        [5, 5, 5, 5],
    ],
};
var cube3x3map
var cube = false;
const colors = ["white", "yellow", "red", "orange", "green", "blue"];
var paintColor = -1;

// Loop sides

function populateCube(template = cube3x3) {
    cube = cube == false ? JSON.parse(JSON.stringify(template)) : cube;
    var html = '';
    for(key in cube) {
        let side = cube[key];
        html += `<div class="side ${key}" id="${key}">`;
    
        // Loop rows
        for(ri = 0; ri < side.length; ri++) {
            // Loop squares
            let row = side[ri];
            html += `<div class="row">`;
            for(si = 0; si < side.length; si++) {
                let square = row[si];
                // html += `<div class="square ${colors[square]}" onclick="console.log('${`${key} (${ri}, ${si})`}')"></div>`;
                html += `<div class="square ${colors[square]}" onclick="paint('${key}', ${ri}, ${si})"></div>`;
            }
            html += `</div>`;
        }
    
        html += `</div>`;
    
        elCube.innerHTML = html;
    }

    // holdStart();

}



var mhistory = [];
var at = -1;
function move(sidekey, counter = false, nohistory = false) {
    let side = cube[sidekey];
    // console.log(side);
    console.log(side, counter);

    if(counter == false) {
        cube[sidekey] = side[0].map((val, index) => side.map(row => row[index]).reverse());
        switch(sidekey) {
            case 'u':
                [
                    [ cube.f[0][0], cube.f[0][1], cube.f[0][2] ],
                    [ cube.r[0][0], cube.r[0][1], cube.r[0][2] ],
                    [ cube.b[0][0], cube.b[0][1], cube.b[0][2] ],
                    [ cube.l[0][0], cube.l[0][1], cube.l[0][2] ],
                ] = [
                    [ cube.r[0][0], cube.r[0][1], cube.r[0][2] ],
                    [ cube.b[0][0], cube.b[0][1], cube.b[0][2] ],
                    [ cube.l[0][0], cube.l[0][1], cube.l[0][2] ],
                    [ cube.f[0][0], cube.f[0][1], cube.f[0][2] ],
                ]
                break;
            case 'd':
                [
                    [ cube.f[2][0], cube.f[2][1], cube.f[2][2] ],
                    [ cube.r[2][0], cube.r[2][1], cube.r[2][2] ],
                    [ cube.b[2][0], cube.b[2][1], cube.b[2][2] ],
                    [ cube.l[2][0], cube.l[2][1], cube.l[2][2] ],
                ] = [
                    [ cube.l[2][0], cube.l[2][1], cube.l[2][2] ],
                    [ cube.f[2][0], cube.f[2][1], cube.f[2][2] ],
                    [ cube.r[2][0], cube.r[2][1], cube.r[2][2] ],
                    [ cube.b[2][0], cube.b[2][1], cube.b[2][2] ],
                ]
                break;
            case 'f':
                [
                    [ cube.u[2][0], cube.u[2][1], cube.u[2][2] ],
                    [ cube.r[0][0], cube.r[1][0], cube.r[2][0] ],
                    [ cube.d[0][2], cube.d[0][1], cube.d[0][0] ],
                    [ cube.l[2][2], cube.l[1][2], cube.l[0][2] ],
                ] = [
                    [ cube.l[2][2], cube.l[1][2], cube.l[0][2] ],
                    [ cube.u[2][0], cube.u[2][1], cube.u[2][2] ],
                    [ cube.r[0][0], cube.r[1][0], cube.r[2][0] ],
                    [ cube.d[0][2], cube.d[0][1], cube.d[0][0] ],
                ];
                break;
            case 'b':
                [
                    [ cube.u[0][2], cube.u[0][1], cube.u[0][0] ],
                    [ cube.l[0][0], cube.l[1][0], cube.l[2][0] ],
                    [ cube.d[2][0], cube.d[2][1], cube.d[2][2] ],
                    [ cube.r[2][2], cube.r[1][2], cube.r[0][2] ],
                ] = [
                    [ cube.r[2][2], cube.r[1][2], cube.r[0][2] ],
                    [ cube.u[0][2], cube.u[0][1], cube.u[0][0] ],
                    [ cube.l[0][0], cube.l[1][0], cube.l[2][0] ],
                    [ cube.d[2][0], cube.d[2][1], cube.d[2][2] ],
                ];
                break;
            case 'r':
                [
                    [ cube.u[2][2], cube.u[1][2], cube.u[0][2] ],
                    [ cube.b[0][0], cube.b[1][0], cube.b[2][0] ],
                    [ cube.d[2][2], cube.d[1][2], cube.d[0][2] ],
                    [ cube.f[2][2], cube.f[1][2], cube.f[0][2] ],
                ] = [
                    [ cube.f[2][2], cube.f[1][2], cube.f[0][2] ],
                    [ cube.u[2][2], cube.u[1][2], cube.u[0][2] ],
                    [ cube.b[0][0], cube.b[1][0], cube.b[2][0] ],
                    [ cube.d[2][2], cube.d[1][2], cube.d[0][2] ],
                ];
                break;
            case 'l':
                [
                    [ cube.u[0][0], cube.u[1][0], cube.u[2][0] ],
                    [ cube.f[0][0], cube.f[1][0], cube.f[2][0] ],
                    [ cube.d[0][0], cube.d[1][0], cube.d[2][0] ],
                    [ cube.b[2][2], cube.b[1][2], cube.b[0][2] ],
                ] = [
                    [ cube.b[2][2], cube.b[1][2], cube.b[0][2] ],
                    [ cube.u[0][0], cube.u[1][0], cube.u[2][0] ],
                    [ cube.f[0][0], cube.f[1][0], cube.f[2][0] ],
                    [ cube.d[0][0], cube.d[1][0], cube.d[2][0] ],
                ];
                break;
            default:
                console.warn(sidekey);
                break;
        }
    } else {
        cube[sidekey] = side[0].map((val, index) => side.map(row => row[row.length-1-index]));
        switch(sidekey) {
            case 'u':
                [
                    [ cube.f[0][0], cube.f[0][1], cube.f[0][2] ],
                    [ cube.r[0][0], cube.r[0][1], cube.r[0][2] ],
                    [ cube.b[0][0], cube.b[0][1], cube.b[0][2] ],
                    [ cube.l[0][0], cube.l[0][1], cube.l[0][2] ],
                ] = [
                    [ cube.l[0][0], cube.l[0][1], cube.l[0][2] ],
                    [ cube.f[0][0], cube.f[0][1], cube.f[0][2] ],
                    [ cube.r[0][0], cube.r[0][1], cube.r[0][2] ],
                    [ cube.b[0][0], cube.b[0][1], cube.b[0][2] ],
                ]
                break;
            case 'd':
                [
                    [ cube.f[2][0], cube.f[2][1], cube.f[2][2] ],
                    [ cube.r[2][0], cube.r[2][1], cube.r[2][2] ],
                    [ cube.b[2][0], cube.b[2][1], cube.b[2][2] ],
                    [ cube.l[2][0], cube.l[2][1], cube.l[2][2] ],
                ] = [
                    [ cube.r[2][0], cube.r[2][1], cube.r[2][2] ],
                    [ cube.b[2][0], cube.b[2][1], cube.b[2][2] ],
                    [ cube.l[2][0], cube.l[2][1], cube.l[2][2] ],
                    [ cube.f[2][0], cube.f[2][1], cube.f[2][2] ],
                ]
                break;
            case 'f':
                [
                    [ cube.u[2][0], cube.u[2][1], cube.u[2][2] ],
                    [ cube.r[0][0], cube.r[1][0], cube.r[2][0] ],
                    [ cube.d[0][2], cube.d[0][1], cube.d[0][0] ],
                    [ cube.l[2][2], cube.l[1][2], cube.l[0][2] ],
                ] = [
                    [ cube.r[0][0], cube.r[1][0], cube.r[2][0] ],
                    [ cube.d[0][2], cube.d[0][1], cube.d[0][0] ],
                    [ cube.l[2][2], cube.l[1][2], cube.l[0][2] ],
                    [ cube.u[2][0], cube.u[2][1], cube.u[2][2] ],
                ];
                break;
            case 'b':
                [
                    [ cube.u[0][2], cube.u[0][1], cube.u[0][0] ],
                    [ cube.l[0][0], cube.l[1][0], cube.l[2][0] ],
                    [ cube.d[2][0], cube.d[2][1], cube.d[2][2] ],
                    [ cube.r[2][2], cube.r[1][2], cube.r[0][2] ],
                ] = [
                    [ cube.l[0][0], cube.l[1][0], cube.l[2][0] ],
                    [ cube.d[2][0], cube.d[2][1], cube.d[2][2] ],
                    [ cube.r[2][2], cube.r[1][2], cube.r[0][2] ],
                    [ cube.u[0][2], cube.u[0][1], cube.u[0][0] ],
                ];
                break;
            case 'r':
                [
                    [ cube.u[2][2], cube.u[1][2], cube.u[0][2] ],
                    [ cube.b[0][0], cube.b[1][0], cube.b[2][0] ],
                    [ cube.d[2][2], cube.d[1][2], cube.d[0][2] ],
                    [ cube.f[2][2], cube.f[1][2], cube.f[0][2] ],
                ] = [
                    [ cube.b[0][0], cube.b[1][0], cube.b[2][0] ],
                    [ cube.d[2][2], cube.d[1][2], cube.d[0][2] ],
                    [ cube.f[2][2], cube.f[1][2], cube.f[0][2] ],
                    [ cube.u[2][2], cube.u[1][2], cube.u[0][2] ],
                ];
                break;
            case 'l':
                [
                    [ cube.u[0][0], cube.u[1][0], cube.u[2][0] ],
                    [ cube.f[0][0], cube.f[1][0], cube.f[2][0] ],
                    [ cube.d[0][0], cube.d[1][0], cube.d[2][0] ],
                    [ cube.b[2][2], cube.b[1][2], cube.b[0][2] ],
                ] = [
                    [ cube.f[0][0], cube.f[1][0], cube.f[2][0] ],
                    [ cube.d[0][0], cube.d[1][0], cube.d[2][0] ],
                    [ cube.b[2][2], cube.b[1][2], cube.b[0][2] ],
                    [ cube.u[0][0], cube.u[1][0], cube.u[2][0] ],
                ];
                break;
            default:
                console.warn(sidekey);
                break;
        }
    }
    
    // Solved check
    // let sidesSolved = 0;
    // let solved = false;
    // for(key in cube) {
    //     // Loop rows
    //     let side = cube[key];
    //     for(ri = 0; ri < side.length; ri++) {
    //         // Loop squares
    //         let row = side[ri];

    //         for(si = 0; si < side.length; si++) {
    //             let square = row[si];

    //         }
    //         console.log(samecount);
    //     }
    // }
    // if(sidesSolved = 6) {
    //     console.log('CUBE IS SOLVED');
    // }

    // Erase alternate timeline
    // if(at + 1 < mhistory.length && at != 1) {
    //     mhistory.splice(at, mhistory.length - 1);
    // }


    // Normal move add to history
    if(nohistory == false) {
        at++;
        mhistory.push(`${sidekey}${counter == false ? "" : "'"}`);
    }

    populateCube();
}

function undo(redo = false) {
    if(at > -1) {
        let lastMove = mhistory[at];
        console.log(lastMove);
        let s = lastMove[0];
        let d = lastMove[1] == "'" ? false : true;
        at--;
        move(s, d, true);
    } else {
        console.warn('No more undos available');
    }
}


function shuffle(movecount = false) {
    let moves = movecount == false ? Math.floor(Math.random() * 10) + 40 : movecount - 1;
    for(i = 0; i <= moves; i++) {
        let sides = Object.keys(cube);
        let s = sides[Math.floor(Math.random() * sides.length)];
        // let d = Math.floor(Math.random() * 2) == 0 ? false : true;
        setTimeout(() => {
            move(s);
            console.log(s);
        }, 200 * i);
    }
}

function setPaintColor(c) {
    document.querySelectorAll('.swatch').forEach(e => {
        e.classList.remove('sel');
    });
    this.event.srcElement.classList.add('sel');
    paintColor = c;
}

// var helper = '[ ';
// var hi = 0;
function paint(key, ri, si) {
    console.log(`${`${key} (${ri}, ${si})`}`);
    // helper += `cube.${key}[${ri}][${si}]`;
    // hi++;
    // if(hi > 2) {
        // helper += ' ],\n[ ';
        // hi = 0;
    // } else {
        // helper += ', ';
    // }
    // console.log(helper);
    if(paintColor == -1) return;
    // console.log(key);
    // console.log(cube[key][ri][si]);
    cube[key][ri][si] = paintColor;
    populateCube();
}

function reset() {
    console.log('Resetting');
    cube = false;
    at = -1;
    mhistory = [];
    // cube = false;
    populateCube();
}



// Populate buttons
function populateButtons() {
    var html = '';
    for(side in cube) {
        html += `<button onclick="move('${side}')">${side}</button>`;
    }
    html += '<br/>';
    for(side in cube) {
        html += `<button onclick="move('${side}', true)">${side}'</button>`;
    }
    elControls.innerHTML = html;
}

populateCube();
populateButtons();




// Controls
var keyFiring = false;
document.addEventListener('keydown', event => {
    let key = event.key;
    if(key == "w" || key == "a" || key == "s" || key == "d" && keyFiring == false) {
        keyFiring = key;
        holdStart(key);
    }
    else if((key == 'z' || key == 'Z') && event.ctrlKey == true) {
        undo();
    }
});

document.addEventListener('keyup', event => {
    let key = event.key;
    if(key == keyFiring) {
        keyFiring = false;
        holdStop();
    }
});

var rotation = {
    y: 0,
    x: 0,
}

// var holdDelay;
var holdClock;
// var holdReset = 0;
function holdStart() {
    let key = keyFiring;
    clearInterval(holdClock)
    holdClock = setInterval(() => {

        if(document.hidden || keyFiring == false) { clearInterval(holdClock); return; }
        // if(holdReset >= 30) { holdReset = 0; console.log('reset'); holdStart(); }
        // holdReset++;

        let dir = -4;
        if(key == 'd' || key == 'w') { dir = 4; }
        if(key == 'a' || key == 'd') { rotation.y += dir; }
        else { rotation.x += dir; }

        updateCubeRot();
    }, 1000 / 30);
}
function holdStop() {
    // holdReset = 0;
    clearInterval(holdClock);
}

function updateCubeRot() {
    requestAnimationFrame(() => {
        elCube.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) `;
        // Brightness
        // dom('u').style.filter = `brightness(${loopRot(rotation.x - 45) / 3}%)`;
        // dom('d').style.filter = `brightness(${loopRot(rotation.x + 180) / 3}%)`;
        // dom('f').style.filter = `brightness(${loopRot(rotation.y - 360 / 3)}%)`;
    });
}



function loopRot(rot) {
    let a = rot;
    while(a < 1 || a > 360) {
        if(a < 1) { a += 360; }
        else if(a > 360) { a -= 360; }
    }
    return a;
}








// Page
var rmode = 0;
function renderMode() {
    if(rmode == 0) {
        $('body').classList.add('semi_flat');
        if(rotation.y < -90 || rotation.y > 90) {
            rotation.y = 0;
            updateCubeRot();
        }
        rmode = 1;
    } else if(rmode == 1) {
        $('body').classList.remove('semi_flat');
        $('body').classList.add('render_flat');
        rmode = 2;
    } else if(rmode == 2) {
        $('body').classList.remove('render_flat');
        rmode = 0;
    }
}


const elPanel = dom('panel');
const elPanelToggle = dom('panel_toggle');
var panelVisible = true;
function togglePanel() {
    if(panelVisible == true) {
        elPanel.classList.add('hide');
        elPanelToggle.innerText = "⮝";
        panelVisible = false;
    } else {
        elPanel.classList.remove('hide');
        elPanelToggle.innerText = "⮟";
        panelVisible = true;
    }
}








// var mousedownInterval;
// var originX = rotation.x;
// var originY = rotation.y;
// var omX;
// var omY;
// document.addEventListener('mousedown', () => {
//     originX = rotation.x;
//     originY = rotation.y;
//     omX = mouseX;
//     omY = mouseY;

//     clearInterval(mousedownInterval);
//     mousedownInterval = setInterval(() => {
//         // console.log('a');
//         rotation.x = (originY + omY) * -0.5;
//         rotation.y = (originX + omX) * 0.5;
//         updateCubeRot();
//     }, 1000 / 30);
// });
// document.addEventListener('mouseup', () => { clearInterval(mousedownInterval); });
// document.addEventListener('mouseout', () => { clearInterval(mousedownInterval); });





// Mouse position handler
// CREDIT:
// https://stackoverflow.com/a/7790764
(function() {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }
        
        mouseX = event.pageX;
        mouseY = event.pageY;
    }
})();