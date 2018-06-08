//global variable
var imagesloc = 'art/';
var cheight = 600;
var cwidth = 800;
var theCanvas;
var context;
var mouseX; //location of mouse x
var mouseY; //location of mouse y
var xx = 75; // location of character images
var yy = 350;
var text_title_x = 60; //text caption x location
var text_title_y = 110; //text caption y location
var caption_font_size = 20; // text caption font size
var aint; //animation
var state=1; //tell if a there is a scene, or a button has been activated 0 for ongoing scene and 1 for button
//on page load
var mv, mc;
var sources = {
    pb: 'play_button.png',
    logo: 'utc_logo.gif',
    pbo: 'play_button_over.png',
    rfl: 'repeat_frame_linear.png',
    bs: 'bob_sprite.png',
    m: 'mel.png',
    ms: 'mel_with_server.png',
    a: 'alice.png',
    mr: 'mel_red.png',
    ss: 'server_small.png',
    db: 'database.png',
    bx: 'box.png',
    i2: 'info_2.png',
    ck: 'cookie.png',
    sus: 'submit_site.png',
    isb: 'info_site_for_bob.png',
    ism: 'info_site_for_mel.png',
    ba: 'bob_ad.png',
    mg: 'magnifying_glass.png',
    sk: 'skull.png',
    ob: 'open_box.png',
    is: 'info_skull.png',
    cb: 'closed_box.png',
    isa: 'info_site_for_alice.png',
    ma: 'mel_ad.png',
    cr: 'cookie_red.png',
    api: 'alice_personal_info.png',
    piggy: 'piggybank_login.png',
};
var images = {};

window.addEventListener('load', eventWindowLoaded, false);

//preset on page load and start initiating background
function eventWindowLoaded() {
    theCanvas = document.getElementById('icanvas');
    context = theCanvas.getContext('2d');
    preload();
}

function preload() {
    var loadedImages = 0;
    var numImages = 0;
    for (var src in sources) {
        numImages++;
    }
    context.fillStyle = '#333333';
    context.fillRect(0, 0, 800, 600);
    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function () {
            if (++loadedImages >= numImages) {
                context.fillStyle = '#333333';
                context.fillRect(0, 0, 800, 600);
                context.fillStyle = '#cccccc';
                context.fillRect(0, 500, (loadedImages / numImages) * 800, 20);
                loadintial();
            } else {
                context.fillStyle = '#333333';
                context.fillRect(0, 0, 800, 600);
                context.fillStyle = '#cccccc';
                context.fillRect(0, 500, (loadedImages/numImages)*800, 15);
            }
        };
        images[src].src = 'art/' + sources[src];
    }
}

function goTo(s)
{
    if (state == 1) {
        console.log(mc + " mc value");
        window.removeEventListener('keyup', mc, false);
        window.removeEventListener('mousemove', mv, false);
    }
    if (state == 0) {
        clearInterval(aint);
    }
    switch (s)
    {
        case 1:
            playIntro(); break;
        case 2:
            xss_bob(); break;
        case 3:
            mel_scene_1(); break;
        case 4:
            mel_scene_5(); break;
        case 5:
            alice_scene_1(); break;
        case 6:
            alice_scene_5(); break;
        case 7:
            melice_scene_1(); break;
        case 8:
            countermeasure(); break;
        case 9:
            summary_scene(); break;
    }
}

function loadintial() {
    //load background
    var play;
    function start_frame(img) {
        //set background color
        context.fillStyle = '#333333';
        context.fillRect(0, 0, 800, 600);
        context.fillStyle = '#ffffff';
        context.fillRect(0, 550, 800, 50);
        //place play image
        play = new Image();

        play.src = imagesloc + img;
        context.drawImage(play, cwidth / 2 - play.width / 2, cheight / 2 - play.height / 2);
        //place utc logo
        var logo = new Image();
        logo.src = imagesloc + 'utc_logo.gif';
        context.drawImage(logo, cwidth - logo.width - 20, cheight - logo.height - 20);
        //place title text
        context.font = "50px serif";
        var message = "Cross Site Request Forgery";
        var metrics = context.measureText(message);
        context.fillStyle = '#999999';
        context.fillText(message, cwidth / 2 - metrics.width / 2, 150);
        context.font = "40px serif";
        //place pretitle text
        message = "CSRF";
        metrics = context.measureText(message);
        context.fillText(message, cwidth / 2 - metrics.width / 2, 200);
        context.font = "40px serif";
        //place info text
        message = "Interactive Demo";
        metrics = context.measureText(message);
        context.fillText(message, cwidth / 2 - metrics.width / 2, 450);
    }
    start_frame('play_button.png');
    var change = false;
    //event listener mouse move
    mv = function (e)
    {
        mouseX = e.pageX - theCanvas.offsetLeft;
        mouseY = e.pageY - theCanvas.offsetTop;
        if (btnPlay.checkOver()) {
            change = true;
            start_frame('play_button_over.png');
            document.body.style.cursor = "pointer";
        } else {
            if (change) {
                start_frame('play_button.png');
                document.body.style.cursor = "default";
                change = false;
            }
        }
    }
    //event listener mouse click
    mc = function (e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if (key == 39)
        {
            console.log('checkclicked');
            document.body.style.cursor = "default";
            window.removeEventListener('keyup', arguments.callee, false);
            window.removeEventListener('mousemove', mv, false);
            playIntro();
        }
    }


    var btnPlay = new Button(cwidth / 2 - play.width / 2, cwidth / 2 + play.width / 2, cheight / 2 - play.height / 2, cheight / 2 + play.height / 2);
    state = 1;
    window.addEventListener('keyup', mc, false);
    window.addEventListener('mousemove', mv, false);
}

function tmp() {
    console.log('tmp');
    context.fillStyle = "#000000";
    context.fillRect(0, 0, 800, 600);
}

function Button(xL, xR, yT, yB) {
    this.xLeft = xL;
    this.xRight = xR;
    this.yTop = yT;
    this.yBottom = yB;
}

Button.prototype.checkClicked = function ()
{
    if (this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom) return true;
};
Button.prototype.checkOver = function () {
    if (this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom) return true;
};

//csrf demo frame
function loadframe(tmp) {
    var message;
    var metrics;
    context.fillStyle = "#333333";
    context.fillRect(0, 0, cwidth, cheight);
    context.fillStyle = '#111111';
    context.fillRect(0, 0, 800, 75);
    context.font = "bold 30px arial";
    context.fillStyle = '#999999';
    message = tmp;
    metrics = context.measureText(message);
    context.fillText(message, cwidth/2-metrics.width/2, 50);/*
    context.strokeStyle = "#999999";
    context.lineWidth = 2;
    context.strokeRect(cwidth/2-metrics.width/2-10, 10, metrics.width + 20, 50);*/
    var fra_1 = new Image();
    fra_1.src = imagesloc + 'repeat_frame_linear.png';
    //console.log('width:' + fra_1.width);

    for (var i = 0; i < 800; i = i + 25) {
        context.drawImage(fra_1, i, 75);
    }
    //console.log("setintervalinside");
}

function playIntro() {
    load_text_1();
}
var refresh;
//draw line - linecolor, linewidth, linetype, fromx, from y, tox, toy
function draw_line() {
    context.strokeStyle = 'white';
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(690, 250);
    context.lineTo(720 - 9 * cframe, 250)
    context.stroke();
    context.closePath();
}

function drawroundedrectangle(locx, locy, rwidth, rlength, cornersize, rfill) {
    context.fillStyle = rfill;
    context.beginPath();
    context.moveTo(locx + cornersize, locy);
    context.lineTo(locx + rwidth - cornersize, locy);
    context.quadraticCurveTo(locx + rwidth, locy, locx + rwidth, locy + cornersize);
    context.lineTo(rwidth + locx, rlength + locy - cornersize);
    context.quadraticCurveTo(rwidth + locx, rlength + locy, locx + rwidth - cornersize, locy + rlength);
    context.lineTo(locx + cornersize, locy + rlength);
    context.quadraticCurveTo(locx, locy + rlength, locx, locy + rlength - cornersize);
    context.lineTo(locx, locy + cornersize);
    context.quadraticCurveTo(locx, locy, locx + cornersize, locy);
    context.fill();
    context.stroke();
    context.closePath();
}

function load_caption(t_message, t_x, t_y) {
    context.font = caption_font_size + "px serif";
    context.fillStyle = 'white';
    m2 = context.measureText(t_message);
    context.fillText(t_message, t_x, t_y);
}

//load_text message, font size, font color, locationx, locationy, rate move
function load_text_1() {
    //console.log('loadingtext');
    var cframe = 0;
    var endmessage = "What is CSRF??";
    var cc=4;
    var eframe = endmessage.length * cc + 1 * 12;
    var message = '';
    var metrics;
    context.font = "70px serif";
    context.fillStyle = 'white';
    metrics = context.measureText(endmessage);
    var counter = 0;
    var rate = 0;
    loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
    function loseseconds(ti) {
        var refresh2;
        var i = 0;
        delay = 500;
        refresh2 = setInterval(function () {
            //load_progress(0, i);
            if (delay * i >= ti*1000) {
                clearInterval(refresh2);
                anim();
            }
            i++;
        }, delay);
    }
    loseseconds(1);

    function anim() {
        state = 0;
        aint = setInterval(function () {
            //console.log("setinterval");
            if (eframe == cframe) {
                //console.log("cframe");
                //context.font = "80px serif";
                //context.fillStyle = 'white';
                //context.fillText(endmessage, cwidth / 2 - metrics.width / 2, 200);
                clearInterval(aint);
                load_text_2();
            }
            //load_progress();
            //loadframe('InterSecVis: Cross Site Sripting (XSS)');
            //console.log("setinterval2");
            if ((cframe - counter * cc) == 0 && counter < endmessage.length && endmessage.charAt(counter) != ' ') {
                loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
                //load_progress();
                //console.log("test 0");
                //metrics2 = context.measureText(message);
                context.font = "80px serif";
                context.fillStyle = 'white';
                context.fillText(message, cwidth / 2 - metrics.width / 2, 200);
                var tmp = endmessage.charAt(counter);
                //metrics = context.measureText(tmp);
                metrics2 = context.measureText(message);
                context.font = "500px serif";
                context.fillStyle = 'white';
                context.fillText(tmp, cwidth / 2 - metrics.width / 2 + metrics2.width - 4, 200);
            } else if ((cframe - counter * cc) == 1 && counter < endmessage.length && endmessage.charAt(counter) != ' ') {
                loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
                //load_progress();
                // console.log("test 1");
                //metrics = context.measureText(message);
                context.font = "80px serif";
                context.fillStyle = 'white';
                context.fillText(message, cwidth / 2 - metrics.width / 2, 200);
                var tmp = endmessage.charAt(counter);
                metrics2 = context.measureText(message);
                //metrics = context.measureText(tmp);
                context.font = "250px serif";
                context.fillStyle = 'white';
                context.fillText(tmp, cwidth / 2 - metrics.width / 2 + metrics2.width - 6, 200);
            } else if ((cframe - counter * cc) == 2 && counter < endmessage.length && endmessage.charAt(counter) != ' ') {
                loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
                //load_progress();
                //console.log("test 2");
                //metrics = context.measureText(message);
                context.font = "80px serif";
                context.fillStyle = 'white';
                context.fillText(message, cwidth / 2 - metrics.width / 2, 200);
                var tmp = endmessage.charAt(counter);
                metrics2 = context.measureText(message);
                //metrics = context.measureText(tmp);
                context.font = "120px serif";
                context.fillStyle = 'white';
                context.fillText(tmp, cwidth / 2 - metrics.width / 2 + metrics2.width - 8, 200);
            } else if ((cframe - counter * cc) == 3 && counter < endmessage.length && endmessage.charAt(counter) != ' ') {
                loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
                //load_progress();
                // console.log("test 3");
                //metrics = context.measureText(message);
                context.font = "80px serif";
                context.fillStyle = 'white';
                context.fillText(message, cwidth / 2 - metrics.width / 2, 200);
                var tmp = message.charAt(counter);
                metrics2 = context.measureText(message);
                //metrics = context.measureText(tmp);
                context.font = "100px serif";
                context.fillStyle = 'white';
                context.fillText(tmp, cwidth / 2 - metrics.width / 2 + metrics2.width - 10, 200);
            } else if ((cframe - counter * cc) == 4 && counter < endmessage.length && endmessage.charAt(counter) != ' ') {
                loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
                //load_progress();
                message += endmessage.charAt(counter);
                context.font = "80px serif";
                context.fillStyle = 'white';
                context.fillText(message, cwidth / 2 - metrics.width / 2, 200);
                counter++;
            } else if (endmessage.charAt(counter) == ' ') {
                message += endmessage.charAt(counter);
                counter++;
            }
            cframe++;
        }, 75);
    }
}

function frame_xss_intro_with_text() {
    var metrics;
    var message;
    loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
    message = 'What is CSRF??';
    context.font = "70px serif";
    context.fillStyle = 'white';
    metrics = context.measureText(message);
    context.fillText(message, cwidth / 2 - metrics.width/2, 200);
}

function load_text_2() {
    var cframe = 0;
    var refresh;
    var m2;
    var i = 0;
    var j = 0;
    console.log('tmp1');
    var tmp_message1 = '';
    var tmp_message2 = '';
    state = 0;
    aint = setInterval(function() {
        frame_xss_intro_with_text();
        //load_progress(0, cframe);
        if (cframe >= 0) {
            var endmessage = "CSRF occurs when an unwanted action happens on a trusted site for which the user is currently authenticated";
            context.font = "17px serif";
            context.fillStyle = 'white';
            m2 = context.measureText(endmessage);
            if (cframe > endmessage.length) {
                context.fillText(endmessage, cwidth / 2 - m2.width / 2, 250);
            } else {
                tmp_message1 += endmessage.charAt(cframe);
                context.fillText(tmp_message1, cwidth / 2 - m2.width / 2, 250);
            }
        }
        if (cframe >= 120) {
            var endmessage2 = 'Next, we will demonstrate step by step how csrf works in the real world';
            context.font = "20px serif";
            context.fillStyle = 'white';
            m2 = context.measureText(endmessage2);
            if ((cframe-30) > endmessage2.length) {
                context.fillText(endmessage2, cwidth / 2 - m2.width / 2, 390);
            } else {
                tmp_message2 += endmessage2.charAt(cframe-50);
                context.fillText(tmp_message2, cwidth / 2 - m2.width / 2, 390);
            }
        }
        if (cframe > 250) {
            clearInterval(aint);
            xss_bob();
        }
        cframe ++;
    }, 50);
}

function drawaline(color, linewidth, linecap, ox, oy, ex, ey)
{
    var original_stroke;
    original_stroke = context.lineWidth;
    context.strokeStyle = color;
    context.lineWidth = linewidth;
    context.lineCap = linecap;
    context.beginPath();
    context.moveTo(ox, oy);
    context.lineTo(ex, ey);
    context.stroke();
    context.closePath();
    context.lineWidth = original_stroke;
}

function load_progress(loc, frame, totalframe)
{
    var oldalpha = context.globalAlpha;
    context.globalAlpha = 0.6;
    context.fillStyle = "#999999";
    context.fillRect(0, cheight - 30, 800, 30);
    context.globalAlpha = oldalpha;
    context.lineWidth = 2;
    context.lineCap = "square";
    context.strokeStyle = "white";
    for(var i=1; i<8; i++) {
        context.beginPath();
        context.moveTo(100*i, cheight - 29);
        context.lineTo(100*i, cheight);
        context.stroke();
        context.closePath();
    }
}

function load_bob(frame) {
    var bobimage = new Image();
    bobimage.src = imagesloc + 'alice.png';

    if (((frame % 100) == 0 || close == true) && frame != 0) {
        if (count > 10) {
            count = 0;
            close = false;
        } else {
            count++;
            close = true;
        }
        context.drawImage(bobimage, 275, 0, 274, 200, xx, yy, 274, 200);
    } else {
        context.drawImage(bobimage, 0, 0, 274, 200, xx, yy, 274, 200);
    }

    context.strokeStyle = "#999999";
    context.lineWidth = 2;
    context.strokeRect(xx - 5, yy - 5, 273 + 10, 198 + 10);
    var message_box = 'Alice';
    context.font = "30px serif";
    var metrics_2 = context.measureText(message_box);
    var originalalpha = context.globalAlpha;
    context.globalAlpha = 0.8;
    context.strokeStyle = "#999999";
    drawroundedrectangle(xx - metrics_2.width / 2 - 3, yy + 25 - 3, metrics_2.width + 6, 30 + 6, 5, "yellow");
    context.globalAlpha = originalalpha;
    context.fillStyle = 'black';
    context.fillText(message_box, xx - metrics_2.width / 2, yy + 50);
}

function load_mel(imagename)
{
    var melimage = new Image();
    melimage.src = imagesloc + "/" + imagename;
    context.drawImage(melimage, xx + 5, yy + 5);
    /******outline***************/
    context.strokeStyle = "#999999";
    context.lineWidth = 2;
    context.strokeRect(xx - 5, yy - 5, melimage.width + 10, melimage.height + 10);
    /******mel_name_title********/
    var message_box = 'MEL';
    context.font = "30px serif";
    var metrics_2 = context.measureText(message_box);
    var originalalpha = context.globalAlpha;
    context.globalAlpha = 0.8;
    context.strokeStyle = "#999999";
    drawroundedrectangle(xx - metrics_2.width / 2 - 3, yy + 25 - 3, metrics_2.width + 6, 30 + 6, 5, "yellow");
    context.globalAlpha = originalalpha;
    context.fillStyle = 'black';
    context.fillText(message_box, xx - metrics_2.width / 2, yy + 50);
}

function load_mel_2()
{
    var xx=65;
    var yy=180;
    //load mel graphics
    /******image************/
    var melimage = new Image();
    melimage.src = imagesloc + "/" + "mel_with_server.png";
    context.drawImage(melimage, xx + 5, yy + 5);
    /******outline***************/
    context.strokeStyle = "#999999";
    context.lineWidth = 2;
    context.strokeRect(xx - 5, yy - 5, melimage.width + 10, melimage.height + 10);
    /******mel_name_title********/
    var message_box = 'MEL';
    context.font = "20px serif";
    var metrics_2 = context.measureText(message_box);
    var originalalpha = context.globalAlpha;
    context.globalAlpha = 0.8;
    context.strokeStyle = "#999999";
    drawroundedrectangle(xx - metrics_2.width / 2 - 3, yy + 30 - 3, metrics_2.width + 6, 25 + 6, 5, "yellow");
    context.globalAlpha = originalalpha;
    context.fillStyle = 'black';
    context.fillText(message_box, xx - metrics_2.width / 2, yy + 50);
}

function load_alice()
{
    var aliceimage = new Image();
    aliceimage.src = imagesloc + "/" + "alice.png";
    context.drawImage(aliceimage, xx + 5, yy + 5+20);
    /******outline***************/
    context.strokeStyle = "#999999";
    context.lineWidth = 2;
    context.strokeRect(xx - 5, yy - 5 + 20, aliceimage.width + 10, aliceimage.height + 10);
    /******mel_name_title********/
    var message_box = 'ALICE';
    context.font = "30px serif";
    var metrics_2 = context.measureText(message_box);
    var originalalpha = context.globalAlpha;
    context.globalAlpha = 0.8;
    context.strokeStyle = "#999999";
    drawroundedrectangle(xx - metrics_2.width / 2 - 3-20, yy + 25 - 3+20, metrics_2.width + 6, 30 + 6, 5, "yellow");
    context.globalAlpha = originalalpha;
    context.fillStyle = 'black';
    context.fillText(message_box, xx - metrics_2.width / 2-20, yy + 50+20);
}

// function load_melice()
// {
//     var melimage = new Image();
//     melimage.src = imagesloc + "/" + "mel_red.png";
//     context.drawImage(melimage, xx + 5, yy + 5);
//     /******outline***************/
//     context.strokeStyle = "#999999";
//     context.lineWidth = 2;
//     context.strokeRect(xx - 5, yy - 5, melimage.width + 10, melimage.height + 10);
//     /******mel_name_title********/
//     var message_box = 'MELICE';
//     context.font = "bold 20px serif";
//     var metrics_2 = context.measureText(message_box);
//     var originalalpha = context.globalAlpha;
//     context.globalAlpha = 0.8;
//     context.strokeStyle = "#999999";
//     drawroundedrectangle(xx - metrics_2.width / 2 - 3, yy + 25 - 3, metrics_2.width + 6, 20 + 6, 5, "yellow");
//     context.globalAlpha = originalalpha;
//     context.fillStyle = 'black';
//     context.fillText(message_box, xx - metrics_2.width / 2, yy + 42);
// }


function xss_bob()
{
    function loseseconds(ti,par)
    {
        var refresh2;
        var i = 0;
        delay = 500;
        state = 0;
        aint = setInterval(function () {
            if (delay * i >= ti * 1000) {
                clearInterval(aint);
                par();
            }
            i++;
        }, delay);
    }

    tmp8 = function displaybob() {
        var cframe = 0;
        var rate = 50;
        var tseconds = 50;
        var eframe = 350;
        //var eframe = tseconds * 1000 / rate;
        var xx = 75;
        var yy = 350;
        var count = 0;
        var close = false;
        var b_title_t = 0;
        var tmp_message = '';
        var text_title_x = 60;
        var text_title_y = 140;

        function load_bob(frame)
        {
            var bobimage = new Image();
            bobimage.src = imagesloc + 'alice.png';

            if (((frame % 100) == 0 || close == true) && frame != 0) {
                if (count > 10) {
                    count = 0;
                    close = false;
                } else {
                    count++;
                    close = true;
                }
                context.drawImage(bobimage, 275, 0, 274, 200, xx, yy, 274, 200);
            } else {
                context.drawImage(bobimage, 0, 0, 274, 200, xx, yy, 274, 200);
            }

            context.strokeStyle = "#999999";
            context.lineWidth = 2;
            context.strokeRect(xx - 5, yy - 5, 273 + 10, 198 + 10);
            var message_box = 'BOB';
            context.font = "30px serif";
            var metrics_2 = context.measureText(message_box);
            var originalalpha = context.globalAlpha;
            //context.fillStyle = "yellow";
            context.globalAlpha = 0.8;
            //context.fillRect(xx - metrics_2.width / 2-3, yy+25-3, metrics_2.width+6, 30+6);
            context.strokeStyle = "#999999";
            drawroundedrectangle(xx - metrics_2.width / 2 - 3, yy + 25 - 3, metrics_2.width + 6, 30 + 6, 5, "yellow");
            context.globalAlpha = originalalpha;
            context.fillStyle = 'black';
            context.fillText(message_box, xx - metrics_2.width / 2, yy + 50);
        }

        function load_bob_text_title(t_message, t_x, t_y)
        {
            if (b_title_t < 30) {
                b_title_t+=5;
            }

            context.font = b_title_t+"px serif";
            context.fillStyle = 'white';
            m2 = context.measureText(t_message);
            context.fillText(t_message, t_x, t_y);
        }
        state = 0;
        aint = setInterval(function () {
            if (cframe == eframe) {
                loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
                console.log('done');
                clearInterval(aint);
                break_scene();
            }
            loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
            load_alice(cframe);
            //load_progress(1, cframe);
            if (cframe > 20 && cframe < 55) {
                load_bob_text_title('This is Alice', text_title_x, text_title_y);
            }
            if (cframe >= 60 && cframe < 120) {
                var ti_message = 'Alice has a bank account at Piggy Bank ';
                if (cframe - 60 >= ti_message.length) {
                    load_bob_text_title(ti_message, text_title_x, text_title_y);
                    tmp_message = '';
                } else {
                    tmp_message += ti_message.charAt(cframe - 60);
                    load_bob_text_title(tmp_message, text_title_x, text_title_y);
                }
            }
            if (cframe >= 130 && cframe < 200) {
                var ti_message = 'She goes to the bank\'s website by entering the URL';
                if (cframe - 130 >= ti_message.length) {
                    load_bob_text_title(ti_message, text_title_x, text_title_y);
                    tmp_message = '';
                } else {
                    tmp_message += ti_message.charAt(cframe - 130);
                    load_bob_text_title(tmp_message, text_title_x, text_title_y);
                }
            }
            if (cframe > 220) {
                var server_img = new Image();
                var originalalpha;
                server_img.src = imagesloc + 'server_small.png';
                if (cframe > 230 && cframe <= 240) {
                    originalalpha = context.globalAlpha;
                    context.globalAlpha = (cframe-230)/10;
                    context.drawImage(server_img, 656 + (240 - cframe) * 2.5, 387);
                    context.globalAlpha = originalalpha;
                } else {
                    context.drawImage(server_img, 656, 387);
                }
            }
            if (cframe > 260) {
                var database_img = new Image();
                var originalalpha;
                database_img.src = imagesloc + 'database.png';
                if (cframe > 270 && cframe <= 280) {
                    originalalpha = context.globalAlpha;
                    context.globalAlpha = (cframe-270)/10;
                    context.drawImage(database_img, 639 + (280 - cframe) * 2.5, 167);
                    context.globalAlpha = originalalpha;
                } else {
                    context.drawImage(database_img, 639, 167);
                }
            }
            if (cframe > 260) {
                var message_box = 'SERVER';
                context.font = "bold 20px arial";
                var metrics_2 = context.measureText(message_box);
                context.fillStyle = 'yellow';
                context.fillText(message_box, 663, 364);
            }
            if (cframe > 280) {
                var message_box = 'DATABASE';
                context.font = "bold 20px arial";
                var metrics_2 = context.measureText(message_box);
                context.fillStyle = 'yellow';
                context.fillText(message_box, 645, 154);
            }
            if (cframe > 290) {
                context.font = "25px serif";
                context.fillStyle = 'red';
                var t_message = "Press the right arrow key to Continue....";
                context.fillText(t_message, 50, 250);
            }
            cframe++;
        }, rate);
    };
    loseseconds(1.5, tmp8);

    function break_scene()
    {
        var m2;
        var change = false;
        mc = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 39) {
                console.log('checkclicked');
                document.body.style.cursor = "default";
                window.removeEventListener('keyup', mc, false);
                window.removeEventListener('mousemove', mv, false);
                bobscene_2();
            }
        }
       mv = function (e) {
            mouseX = e.pageX - theCanvas.offsetLeft;
            mouseY = e.pageY - theCanvas.offsetTop;
            if (btnPlay_comp.checkOver()) {
                change = true;
                document.body.style.cursor = "pointer";
            } else {
                if (change) {
                    document.body.style.cursor = "default";
                    change = false;
                }
            }
        }

        var btnPlay_comp = new Button(200, 290, 365, 440);
        window.addEventListener('keyup', mc, false);
        window.addEventListener('mousemove', mv, false);
    }
}

function processinfo(num, locx, locy, rad) {
    var tmp = num / 3; //+ num % 4;
    var deg2 = tmp % 8;
    var deg = 8;
    var oalpha = context.globalAlpha;
    for (var i = 0; i < deg; i++) {
        context.globalAlpha = (i) / deg;
        context.beginPath();
        context.fillStyle = "#999999";
        context.lineWidth = 0;
        context.arc(locx + rad * Math.cos((deg2 - i) * Math.PI / 4), locy + rad * Math.sin((deg2 - i) * Math.PI / 4), rad / 4, 0, Math.PI * 2, false);
        context.closePath();
        context.fill();
    }
    context.globalAlpha = oalpha;
}

function load_firewall() {
    var server_img = new Image();
    var originalalpha;
    var database_img = new Image();
    var originalalpha;
    var messag_box;
    var metrics_2;

    originalalpha = context.globalAlpha;
    context.globalAlpha = 0.2;
    //drawaline('black', 6, 'round', 541+5, cheight / 4 + 5, 541+5, 555 + 5);
    context.globalAlpha = originalalpha;
    originalalpha = context.globalAlpha;
    //context.globalAlpha = 0.7;
    //drawaline('red', 6, 'round', 541, cheight / 4, 541, 555);
    context.globalAlpha = originalalpha;
    /***************************draw server image*************/
    server_img.src = imagesloc + 'server_small.png';
    //context.drawImage(server_img, ((3 * cwidth / 4) - (server_img.width / 2)) + 100, 400);
    context.drawImage(server_img, 656, 387);
    /***************************draw database image*************/
    database_img.src = imagesloc + 'database.png';
    //context.drawImage(database_img, ((3 * cwidth / 4) - (database_img.width / 2)) + 100, 200);
    context.drawImage(database_img, 639, 167);
    /***********Load Server Text************/
    message_box = 'SERVER';
    context.font = "bold 20px arial";
    metrics_2 = context.measureText(message_box);
    context.fillStyle = 'yellow';
    //context.fillText(message_box, ((3 * cwidth / 4) - (server_img.width / 2)) + 100 - metrics_2.width / 2, 400 - 30);
    context.fillText(message_box, 663, 364);
    /***********Load Database Text************/
    message_box = 'DATABASE';
    context.font = "bold 20px arial";
    metrics_2 = context.measureText(message_box);
    context.fillStyle = 'yellow';
}

function load_bob(frame)
{
    var bobimage = new Image();
    bobimage.src = imagesloc + 'alice.png';

    if (((frame % 100) == 0 || close == true) && frame != 0) {
        if (count > 10) {
            count = 0;
            close = false;
        } else {
            count++;
            close = true;
        }
        context.drawImage(bobimage, 275, 0, 274, 200, xx, yy, 274, 200);
    } else {
        context.drawImage(bobimage, 0, 0, 274, 200, xx, yy, 274, 200);
    }

    context.strokeStyle = "#999999";
    context.lineWidth = 2;
    context.strokeRect(xx - 5, yy - 5, 273 + 10, 198 + 10);
    var message_box = 'Alice';
    context.font = "30px serif";
    var metrics_2 = context.measureText(message_box);
    var originalalpha = context.globalAlpha;
    //context.fillStyle = "yellow";
    context.globalAlpha = 0.8;
    //context.fillRect(xx - metrics_2.width / 2-3, yy+25-3, metrics_2.width+6, 30+6);
    context.strokeStyle = "#999999";
    drawroundedrectangle(xx - metrics_2.width / 2 - 3, yy + 25 - 3, metrics_2.width + 6, 30 + 6, 5, "yellow");
    context.globalAlpha = originalalpha;
    context.fillStyle = 'black';
    context.fillText(message_box, xx - metrics_2.width / 2, yy + 50);
}

function bobscene_2() {
    var rate = 50;
    var cframe = 0;
    var text_title_x = 60;
    var text_title_y = 90;
    var eframe = 300;
    var count = 0;
    var close = false;
    var b_title_t = 0;
    var tmp_message = '';
    function load_bob_text_title(t_message, t_x, t_y) {
        context.font = "30px serif";
        context.fillStyle = 'white';
        m2 = context.measureText(t_message);
        context.fillText(t_message, t_x, t_y);
    }
    state = 0;
    aint = setInterval(function () {
        if (cframe == eframe) {
            loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
            console.log('done');
            clearInterval(aint);
            break_scene();
        }
        loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
        load_alice();
        //load_progress(1, cframe);
        load_firewall();
        if (cframe >= 0 && cframe < 80) {
            var ti_message = "The HTTP request is sent to the server";
            if (cframe  >= ti_message.length) {
                load_bob_text_title(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe);
                load_bob_text_title(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe >= 30 && cframe < 100) {
            var box = new Image()
            box.src = imagesloc + 'box.png';
            context.drawImage(box, 193, 0, 266, 163, 225, 275, 125, 77);
        }
        if (cframe > 30 && cframe < 85) {
            var originalalpha = context.globalAlpha;
            var info = new Image()
            info.src = imagesloc + 'info_2.png';
            if (cframe <= 40) {
                context.globalAlpha = (cframe - 30) / 10;
                context.drawImage(info, 200, 300);
            }
            if (cframe >= 75 && cframe < 85) {
                context.globalAlpha = (85 - cframe) / 10;
                context.drawImage(info, 265, 245);
            }
            if (cframe >= 65 && cframe < 75) {
                //context.globalAlpha = (100 - cframe) / 10;
                context.drawImage(info, 265, 245);
            }
            if (cframe > 40 && cframe < 65) {
                var t = (cframe - 40) / 25;
                //cubic bezier curve movement
                var p0 = { x: 200, y: 300 };
                var p1 = { x: 227, y: 225 };
                var p2 = { x: 237, y: 225 };
                var p3 = { x: 265, y: 245 };
                var cx = 3 * (p1.x - p0.x);
                var bx = 3 * (p2.x - p1.x);
                var ax = p3.x - p0.x - cx - bx;
                var cy = 3 * (p1.y - p0.y);
                var by = 3 * (p2.y - p1.y);
                var ay = p3.y - p0.y - cy - by;
                var xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
                var yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;
                context.drawImage(info, xt, yt);
            }
            context.globalAlpha = originalalpha;
        }
        if (cframe >= 100 && cframe < 120) {
            var box = new Image()
            box.src = imagesloc + 'box.png';
            context.drawImage(box, 0, 0, 193, 163, 225 + 16, 275, 92, 77);
        }
        if (cframe >= 120 && cframe < 160) {//drive box forward
            var box = new Image()
            box.src = imagesloc + 'box.png';
            context.drawImage(box, 0, 0, 193, 163, 225 + (cframe - 120) * 6.875, 275, 92, 77);
        }
        if (cframe >= 160 && cframe < 170) { //leave box close for little time
            var box = new Image()
            box.src = imagesloc + 'box.png';
            context.drawImage(box, 0, 0, 193, 163, 500, 275, 92, 77);
        }
        if (cframe >= 170 && cframe < 400) { //open the box
            var box = new Image()
            box.src = imagesloc + 'box.png';
            context.drawImage(box, 193, 0, 265, 163, 500 - 16, 275, 125, 77);
        }
        if (cframe > 200 && cframe < 270) {
            var originalalpha = context.globalAlpha;
            var info = new Image();
            info.src = imagesloc + 'info_2.png';
            if (cframe <= 210) {
                context.globalAlpha = (cframe - 200) / 10;
                context.drawImage(info, 540, 270);
            }
            if (cframe >= 260 && cframe < 270) {
                context.globalAlpha = (270 - cframe) / 10;
                context.drawImage(info, 670, 390);
            }
            if (cframe >= 250 && cframe < 260) {
                //context.globalAlpha = (100 - cframe) / 10;
                context.drawImage(info, 670, 390);
            }
            if (cframe > 210 && cframe < 250) {
                var t = (cframe - 210) / 40;
                //cubic bezier curve movement
                var p0 = { x: 540, y: 270 };
                var p1 = { x: 560, y: 220 };
                var p2 = { x: 640, y: 220 };
                var p3 = { x: 670, y: 390 };
                var cx = 3 * (p1.x - p0.x);
                var bx = 3 * (p2.x - p1.x);
                var ax = p3.x - p0.x - cx - bx;
                var cy = 3 * (p1.y - p0.y);
                var by = 3 * (p2.y - p1.y);
                var ay = p3.y - p0.y - cy - by;
                var xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
                var yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;
                context.drawImage(info, xt, yt);
            }

            context.globalAlpha = originalalpha;
        }
        if (cframe > 299) {
            context.font = "25px serif";
            context.fillStyle = 'red';
            var t_message = "Press the right arrow key to Continue....";
            context.fillText(t_message, 50, 250);
        }
        cframe++;
    }, rate);

    function break_scene()
    {
        console.log("check");
        var m2;
        var change = false;
        mc = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 39) {
                console.log('checkclicked');
                document.body.style.cursor = "default";
                window.removeEventListener('keyup', mc, false);
                window.removeEventListener('mousemove', mv, false);
                bobscene_3();
            }
        }
        mv = function (e) {
            mouseX = e.pageX - theCanvas.offsetLeft;
            mouseY = e.pageY - theCanvas.offsetTop;
            if (btnPlay_server.checkOver()) {
                change = true;
                document.body.style.cursor = "pointer";
            } else {
                if (change) {
                    document.body.style.cursor = "default";
                    change = false;
                }
            }
        }
        var btnPlay_server = new Button(650, 745, 400, 550);
        window.addEventListener('keyup', mc, false);
        window.addEventListener('mousemove', mv, false);
    }
}

function bobscene_3() {
    var rate = 50;
    var cframe = 0;
    var text_title_x = 60;
    var text_title_y = 90;
    var eframe = 651;
    var xx = 75;
    var yy = 350;
    var count = 0;
    var close = false;
    var b_title_t = 0;
    var tmp_message = '';

    function load_bob_text_title(t_message, t_x, t_y) {
        context.font = "30px serif";
        context.fillStyle = 'white';
        m2 = context.measureText(t_message);
        context.fillText(t_message, t_x, t_y);
    }
    state = 0;
    aint = setInterval(function () {
        if (cframe == eframe) {
            loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
            console.log('done');
            clearInterval(aint);
            break_scene();
        }
        loadframe('InterSecVis: Cross Site Requet Forgery (CSRF)');
        load_bob();
        load_firewall();
        if (cframe >= 0 && cframe < 330) { //open box
            var box = new Image()
            box.src = imagesloc + 'box.png';
            context.drawImage(box, 193, 0, 265, 163, 500 - 16, 275, 125, 77);
        }
        if (cframe >= 20 && cframe < 70) {
            var ti_message = 'The request is processed by the server';
            if (cframe - 20 >= ti_message.length) {
                load_bob_text_title(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 20);
                load_bob_text_title(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe >= 70 && cframe < 220) {
            processinfo(cframe-70, 745, 425, 32);
        }
        if (cframe >= 90 && cframe < 140) {
            var ti_message = 'The server loads information from the database';
            if (cframe - 90 >= ti_message.length) {
                load_bob_text_title(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 90);
                load_bob_text_title(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe >= 150 && cframe <= 190) {
            var info = new Image();
            var oalpha = context.globalAlpha;
            info.src = imagesloc + 'info_2.png';
            if (cframe >= 150 && cframe <= 160) {
                context.globalAlpha = (cframe - 150) / 10;
                context.drawImage(info, 690, 220);
            }
            if (cframe >160 && cframe < 180) {
                context.drawImage(info, 690 - 7.5*(cframe-160), 220+2.5*(cframe-160));
            }
            if (cframe >= 180 && cframe <= 190) {
                context.globalAlpha = (190 - cframe) / 10;
                context.drawImage(info, 540, 270);
            }
            context.globalAlpha = oalpha;
        }
        if (cframe >= 170 && cframe <= 210) {
            var info = new Image();
            var oalpha = context.globalAlpha;
            info.src = imagesloc + 'info_2.png';
            if (cframe >= 170 && cframe <= 180) {
                context.globalAlpha = (cframe - 170) / 10;
                context.drawImage(info, 690, 220);
            }
            if (cframe > 180 && cframe < 200) {
                context.drawImage(info, 690 - 7.5*(cframe-180), 220+2.5*(cframe-180));
            }
            if (cframe >= 200 && cframe <= 210) {
                context.globalAlpha = (210 - cframe) / 10;
                context.drawImage(info, 540, 270);
            }
            context.globalAlpha = oalpha;
        }
        if (cframe >= 190 && cframe <= 230) {
            var info = new Image();
            var oalpha = context.globalAlpha;
            info.src = imagesloc + 'info_2.png';
            if (cframe >= 190 && cframe <= 200) {
                context.globalAlpha = (cframe - 190) / 10;
                context.drawImage(info, 690, 220);
            }
            if (cframe >200 && cframe < 220) {
                context.drawImage(info, 690 - 7.5*(cframe-200), 220+2.5*(cframe-200));
            }
            if (cframe >= 220 && cframe <= 230) {
                context.globalAlpha = (230 - cframe) / 10;
                context.drawImage(info, 540, 270);
            }
            context.globalAlpha = oalpha;
        }
        if (cframe >= 160 && cframe < 250) {
            var ti_message = 'The site uses a cookie to track Alice\'s session';
            if (cframe - 160 >= ti_message.length) {
                load_bob_text_title(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 160);
                load_bob_text_title(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe >= 200 && cframe <= 290) {
            var oalpha = context.globalAlpha;
            var cookieI = new Image();
            cookieI.src = imagesloc + 'cookie.png';
            if (cframe <= 210) {
                context.globalAlpha = (cframe - 225) / 10;
                context.drawImage(cookieI, 670, 460);
            }
            if (cframe > 210 && cframe <= 235) {
                context.drawImage(cookieI, 670, 460);
            }
            if (cframe > 235 && cframe < 275) {
                var t = (cframe - 235) / 40;
                //cubic bezier curve movement
                var p0 = { x: 670, y: 460 };
                var p1 = { x: 650, y: 230 };
                var p2 = { x: 530, y: 230 };
                var p3 = { x: 530, y: 270 };
                var cx = 3 * (p1.x - p0.x);
                var bx = 3 * (p2.x - p1.x);
                var ax = p3.x - p0.x - cx - bx;
                var cy = 3 * (p1.y - p0.y);
                var by = 3 * (p2.y - p1.y);
                var ay = p3.y - p0.y - cy - by;
                var xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
                var yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;
                context.drawImage(cookieI, xt, yt);
            }
            if (cframe >= 275 && cframe < 280) {
                context.drawImage(cookieI, 530, 270);;
            }
            if (cframe >=280 && cframe <=290) {
                context.globalAlpha = (290 - cframe) / 10;
                context.drawImage(cookieI, 530, 270);
            }
            context.globalAlpha = oalpha;
        }
        if (cframe >= 330 && cframe < 350) { //close the box
            var box = new Image()
            box.src = imagesloc + 'box.png';
            context.drawImage(box, 0, 0, 193, 163, 500, 275, 92, 77);
        }
        if (cframe >= 350 && cframe < 390) {//drive box back
            var box = new Image()
            box.src = imagesloc + 'box.png';
            context.drawImage(box, 0, 0, 193, 163, 500 + (cframe - 350) * -6.875, 275, 92, 77);
        }
        if (cframe >= 390 && cframe < 410) { // leave the box close for little time
            var box = new Image()
            box.src = imagesloc + 'box.png';
            context.drawImage(box, 0, 0, 193, 163, 225 + 16, 275, 92, 77);
        }
        if (cframe >= 410 && cframe < 650) { // open the box
            var box = new Image()
            box.src = imagesloc + 'box.png';
            if (cframe < 640) {
                context.drawImage(box, 193, 0, 266, 163, 225, 275, 125, 77);
            } else {
                var oalpha = context.globalAlpha;
                context.globalAlpha = (650 - cframe) / 10;
                context.drawImage(box, 193, 0, 266, 163, 225, 275, 125, 77);
                context.globalAlpha = oalpha;
            }
        }
        if (cframe >= 400 && cframe < 480) {
            var ti_message = 'First the cookie from packet is loaded into Alice\'s computer';
            if (cframe - 400 >= ti_message.length) {
                load_bob_text_title(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 400);
                load_bob_text_title(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe >= 450 && cframe <= 520) {
            var oalpha = context.globalAlpha;
            var cookieI = new Image();
            cookieI.src = imagesloc + 'cookie.png';
            if (cframe <= 460) {
                context.globalAlpha = (cframe - 460) / 10;
                context.drawImage(cookieI, 280, 280);
            }
            if (cframe > 460 && cframe < 500) {
                var t = (cframe - 460) / 40;
                //cubic bezier curve movement
                var p0 = { x: 280, y: 280 };
                var p1 = { x: 280, y: 230 };
                var p2 = { x: 220, y: 230 };
                var p3 = { x: 220, y: 390 };
                var cx = 3 * (p1.x - p0.x);
                var bx = 3 * (p2.x - p1.x);
                var ax = p3.x - p0.x - cx - bx;
                var cy = 3 * (p1.y - p0.y);
                var by = 3 * (p2.y - p1.y);
                var ay = p3.y - p0.y - cy - by;
                var xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
                var yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;
                context.drawImage(cookieI, xt, yt);
            }
            if (cframe >= 500 && cframe < 510) {
                context.drawImage(cookieI, 220, 390);;
            }
            if (cframe >= 510 && cframe <= 520) {
                context.globalAlpha = (520 - cframe) / 10;
                context.drawImage(cookieI, 220, 390);
            }
            context.globalAlpha = oalpha;
        }
        if (cframe >= 530 && cframe < 580) {
            var ti_message = 'Second the data for the webpage is loaded';
            if (cframe - 530 >= ti_message.length) {
                load_bob_text_title(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 530);
                load_bob_text_title(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe >= 560 && cframe <= 630) {
            var oalpha = context.globalAlpha;
            var info = new Image();
            info.src = imagesloc + 'info_2.png';
            if (cframe <= 570) {
                context.globalAlpha = (cframe - 560) / 10;
                context.drawImage(info, 280, 280);
            }
            if (cframe > 570 && cframe < 610) {
                var t = (cframe - 570) / 40;
                //cubic bezier curve movement
                var p0 = { x: 280, y: 280 };
                var p1 = { x: 280, y: 230 };
                var p2 = { x: 220, y: 230 };
                var p3 = { x: 220, y: 390 };
                var cx = 3 * (p1.x - p0.x);
                var bx = 3 * (p2.x - p1.x);
                var ax = p3.x - p0.x - cx - bx;
                var cy = 3 * (p1.y - p0.y);
                var by = 3 * (p2.y - p1.y);
                var ay = p3.y - p0.y - cy - by;
                var xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
                var yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;
                context.drawImage(info, xt, yt);
            }
            if (cframe >= 610 && cframe < 620) {
                context.drawImage(info, 220, 390);;
            }
            if (cframe >= 620 && cframe <= 630) {
                context.globalAlpha = (630 - cframe) / 10;
                context.drawImage(info, 220, 390);
            }
            context.globalAlpha = oalpha;
        }
        if (cframe > 650) {
            context.font = "25px serif";
            context.fillStyle = 'red';
            var t_message = "Press the right arrow key to continue...";
            context.fillText(t_message, 50, 250);
        }
        cframe++;
    }, rate);

    function break_scene() {
        console.log("check");
        var m2;
        var change = false;
        mc = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 39) {
                console.log('checkclicked');
                document.body.style.cursor = "default";
                window.removeEventListener('keyup', mc, false);
                window.removeEventListener('mousemove', mv, false);
                bobscene_4();
            }
        }
        mv = function (e) {
            mouseX = e.pageX - theCanvas.offsetLeft;
            mouseY = e.pageY - theCanvas.offsetTop;
            if (btnPlay_c2.checkOver()) {
                change = true;
                document.body.style.cursor = "pointer";
            } else {
                if (change) {
                    document.body.style.cursor = "default";
                    change = false;
                }
            }
        }
        var btnPlay_c2 = new Button(200, 290, 365, 440);
        window.addEventListener('keyup', mc, false);
        window.addEventListener('mousemove', mv, false);
    }
}

function bobscene_4() {
    var rate = 50;
    var cframe = 0;
    var text_title_x = 60;
    var text_title_y = 90;
    var eframe = 150;
    var xx = 75;
    var yy = 350;
    var count = 0;
    var close = false;
    var b_title_t = 0;
    var tmp_message = '';

    function load_bob_text_title(t_message, t_x, t_y) {
        context.font = "30px serif";
        context.fillStyle = 'white';
        m2 = context.measureText(t_message);
        context.fillText(t_message, t_x, t_y);
    }
    state = 0;
    aint = setInterval(function () {
        if (cframe == eframe) {
            loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
            console.log('done');
            clearInterval(aint);
            break_scene_bob();
        }
        loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
        load_bob();

        load_firewall();
        if (cframe <= 10) {
            var site = new Image();
            var oalpha = context.globalAlpha;
            site.src = imagesloc + "/" + "piggybank_login.png";
            context.globalAlpha = (cframe) / 10;
            context.drawImage(site, cwidth / 2 - site.width / 2, cheight / 2 - site.height / 2);
            context.globalAlpha = oalpha;
        } else {
            var site = new Image();
            site.src = imagesloc + "/" + "piggybank_login.png";
            context.drawImage(site, cwidth / 2 - site.width / 2, cheight / 2 - site.height / 2);
        }
        if (cframe >= 50 && cframe < 120) {
            var ti_message = 'Alice uses her username and password to login.';
            if (cframe - 50 >= ti_message.length) {
                load_bob_text_title(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 50);
                load_bob_text_title(tmp_message, text_title_x, text_title_y);
            }
        }

        if (cframe >= 130) {
            var ti_message = "Alice" ;
            if (cframe == 130) tmp_message = '';
            if (cframe - 130 >= ti_message.length) {
                context.font = "15px serif";
                context.fillStyle = 'white';
                context.fillText(ti_message, 375, 322);
            } else {
                tmp_message += ti_message.charAt(cframe - 130);
                context.font = "15px serif";
                context.fillStyle = 'white';
                context.fillText(tmp_message, 375, 322);
            }
        }
        if (cframe >= 140) {
            var ti_message = "************";
            if (cframe == 140) tmp_message = '';
            if (cframe - 140 >= ti_message.length) {
                context.font = "20px serif";
                context.fillStyle = 'white';
                context.fillText(ti_message, 375, 355);
            } else {
                context.font = "20px serif";
                context.fillStyle = 'white';
                tmp_message += ti_message.charAt(cframe - 140);
                context.fillText(tmp_message, 375, 355);
            }
        }
        if (cframe >= 145) {
            context.font = "25px serif";
            context.fillStyle = 'red';
            var t_message = "Press the right arrow key to continue";
            context.fillText(t_message, 190, 450);
        }
        cframe++;
    }, rate);

    function break_scene_bob()
    {
        var m2;
        var change = false;
        mc = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 39)
            {
                console.log('checkclicked');
                document.body.style.cursor = "default";
                window.removeEventListener('keyup', mc, false);
                window.removeEventListener('mousemove', mv, false);
                bobscene_5();
            }
        }
        mv = function (e) {
            mouseX = e.pageX - theCanvas.offsetLeft;
            mouseY = e.pageY - theCanvas.offsetTop;
            if (btnPlay_ne.checkOver()) {
                change = true;
                document.body.style.cursor = "pointer";
            } else {
                if (change) {
                    document.body.style.cursor = "default";
                    console.log('changing to default');
                    change = false;
                }
            }
        }
        var btnPlay_ne = new Button(280, 520, 350, 420);
        state = 1;
        window.addEventListener('keyup', mc, false);
        window.addEventListener('mousemove', mv, false);
    }
}

function bobscene_5()
{
    var rate = 50;
    var cframe = 0;
    var text_title_x = 60;
    var text_title_y = 90;
    var eframe = 190;
    var xx = 75;
    var yy = 350;
    var count = 0;
    var close = false;
    var b_title_t = 0;
    var tmp_message = '';

    function load_bob_text_title(t_message, t_x, t_y) {
        context.font = "30px serif";
        context.fillStyle = 'white';
        m2 = context.measureText(t_message);
        context.fillText(t_message, t_x, t_y);
    }
    state = 0;
    aint = setInterval(function () {
        if (cframe == eframe) {
            loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
            clearInterval(aint);
            break_scene();
        }
        loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
        load_bob();
        //load_progress(1, cframe);
        load_firewall();
        if (cframe <= 10) {
            var site = new Image();
            var oalpha = context.globalAlpha;
            site.src = imagesloc + "piggybank_transfer.png";
            context.globalAlpha = (cframe) / 10;
            context.drawImage(site, cwidth / 2 - site.width / 2, cheight / 2 - site.height / 2);
            context.globalAlpha = oalpha;
            processinfo(cframe, 175, 140, 32);
        } else {
            var site = new Image();
            site.src = imagesloc + "piggybank_transfer.png";
            context.drawImage(site, cwidth / 2 - site.width / 2, cheight / 2 - site.height / 2);
        }
        if (cframe >= 30 && cframe < 120) {
            var ti_message = 'She types the information needed for the transfer';
            if (cframe - 30 >= ti_message.length) {
                load_bob_text_title(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 30);
                load_bob_text_title(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe >= 150) {
            var ti_message = "Bob's Account" ;
            if (cframe == 150) tmp_message = '';
            if (cframe - 150 >= ti_message.length) {
                context.font = "15px serif";
                context.fillStyle = 'white';
                context.fillText(ti_message, 365, 315);
            } else {
                tmp_message += ti_message.charAt(cframe - 150);
                context.font = "15px serif";
                context.fillStyle = 'white';
                context.fillText(tmp_message, 365, 315);
            }
        }
        if (cframe >= 170) {
            var ti_message = "$10.00";
            if (cframe == 180) tmp_message = '';
            if (cframe - 180 >= ti_message.length) {
                context.font = "20px serif";
                context.fillStyle = 'white';
                context.fillText(ti_message, 365, 355);
            } else {
                context.font = "20px serif";
                context.fillStyle = 'white';
                tmp_message += ti_message.charAt(cframe - 180);
                context.fillText(tmp_message, 365, 355);
            }
        }
        if (cframe > 185) {
            context.font = "25px serif";
            context.fillStyle = 'red';
            var t_message = "Press the right arrow key to continue...";
            context.fillText(t_message, 210, 450);
        }
        cframe++;
    }, rate);

    function break_scene()
    {
        console.log("check");
        var m2;
        var change = false;
        mc = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 39) {
                document.body.style.cursor = "default";
                window.removeEventListener('keyup', mc, false);
                window.removeEventListener('mousemove', mv, false);
                bobscene_6();
            }
        }
        mv = function (e) {
            mouseX = e.pageX - theCanvas.offsetLeft;
            mouseY = e.pageY - theCanvas.offsetTop;
            if (btnPlay_sub.checkOver()) {
                change = true;
                document.body.style.cursor = "pointer";
            } else {
                if (change) {
                    document.body.style.cursor = "default";
                    change = false;
                }
            }
        }
        var btnPlay_sub = new Button(280, 520, 350, 420);
        state = 1;
        window.addEventListener('keyup', mc, false);
        window.addEventListener('mousemove', mv, false);
    }
}

function bobscene_6()
{
    var rate = 50;
    var cframe = 0;
    var text_title_x = 60;
    var text_title_y = 90;
    var eframe = 550;
    var xx = 75;
    var yy = 350;
    var count = 0;
    var close = false;
    var b_title_t = 0;
    var tmp_message = '';

    function load_bob_text_title(t_message, t_x, t_y)
    {
        context.font = "30px serif";
        context.fillStyle = 'white';
        m2 = context.measureText(t_message);
        context.fillText(t_message, t_x, t_y);
    }
    state = 0;
    aint = setInterval(function () {
        if (cframe == eframe) {
            loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
            console.log('done');
            clearInterval(aint);
            mel_scene_1();
        }
        loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
        load_bob();

        load_firewall();
        if (cframe <= 60) {
            var site = new Image();
            var oalpha = context.globalAlpha;

            // CHANGE THIS TO SUCCESSFUL TRANSFER PAGE!
            site.src = imagesloc + "piggybank_success.png";
            context.globalAlpha = (60-cframe) / 60;
            context.drawImage(site, cwidth / 2 - site.width / 2, cheight / 2 - site.height / 2);
            context.globalAlpha = oalpha;
            processinfo(cframe, 175, 140, 32);
        }
        if (cframe >= 60 && cframe < 150) {
            var ti_message = 'The information is then loaded into packet';
            if (cframe - 30 >= ti_message.length) {
                load_bob_text_title(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 30);
                load_bob_text_title(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe >= 60 && cframe < 70) { // leave the box close for little time
            var box = new Image()
            box.src = imagesloc + 'box.png';
            context.drawImage(box, 0, 0, 193, 163, 225 + 16, 275, 92, 77);
        }
        if (cframe >= 70 && cframe < 200) { // open the box
            var box = new Image()
            box.src = imagesloc + 'box.png';
            context.drawImage(box, 193, 0, 266, 163, 225, 275, 125, 77);
        }
        if (cframe >= 220 && cframe < 400) {
            var ti_message = 'The transfer is performed by the database';
            if (cframe - 220 >= ti_message.length) {
                load_bob_text_title(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 220);
                load_bob_text_title(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe >= 120 && cframe <= 190) {
            var oalpha = context.globalAlpha;
            var info = new Image();
            info.src = imagesloc + 'info_2.png';
            if (cframe <= 130) {
                context.globalAlpha = (cframe - 120) / 10;
                context.drawImage(info, 220, 390);
            }
            if (cframe > 130 && cframe < 170) {
                var t = (cframe - 130) / 40;
                //cubic bezier curve movement
                var p0 = { x: 220, y: 390 };
                var p1 = { x: 220, y: 230 };
                var p2 = { x: 280, y: 230 };
                var p3 = { x: 280, y: 280 };
                var cx = 3 * (p1.x - p0.x);
                var bx = 3 * (p2.x - p1.x);
                var ax = p3.x - p0.x - cx - bx;
                var cy = 3 * (p1.y - p0.y);
                var by = 3 * (p2.y - p1.y);
                var ay = p3.y - p0.y - cy - by;
                var xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
                var yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;
                context.drawImage(info, xt, yt);
            }
            if (cframe >= 170 && cframe < 180) {
                context.drawImage(info, 280, 280);;
            }
            if (cframe >= 180 && cframe <= 190) {
                context.globalAlpha = (190 - cframe) / 10;
                context.drawImage(info, 280, 280);
            }
            context.globalAlpha = oalpha;
        }
        if (cframe >= 200 && cframe < 220) { // close the box
            var box = new Image()
            box.src = imagesloc + 'box.png';
            context.drawImage(box, 0, 0, 193, 163, 225 + 16, 275, 92, 77);
        }
        if (cframe >= 220 && cframe < 260) {//drive box forward
            var box = new Image()
            box.src = imagesloc + 'box.png';
            context.drawImage(box, 0, 0, 193, 163, 225 + (cframe - 220) * 6.875, 275, 92, 77);
        }
        if (cframe >= 260 && cframe < 270) { //leave box close for little time
            var box = new Image()
            box.src = imagesloc + 'box.png';
            context.drawImage(box, 0, 0, 193, 163, 500, 275, 92, 77);
        }
        if (cframe >= 270 && cframe < 370) { //open the box
            var box = new Image()
            box.src = imagesloc + 'box.png';
            context.drawImage(box, 193, 0, 265, 163, 500 - 16, 275, 125, 77);
        }
        if (cframe > 300 && cframe < 370) {
            var originalalpha = context.globalAlpha;
            var info = new Image();
            info.src = imagesloc + 'info_2.png';
            if (cframe <= 310) {
                context.globalAlpha = (cframe - 300) / 10;
                context.drawImage(info, 540, 270);
            }
            if (cframe >= 360 && cframe < 370) {
                context.globalAlpha = (370 - cframe) / 10;
                context.drawImage(info, 670, 390);
            }
            if (cframe >= 350 && cframe < 360) {

                context.drawImage(info, 670, 390);
            }
            if (cframe > 310 && cframe < 350) {
                var t = (cframe - 310) / 40;
                //cubic bezier curve movement
                var p0 = { x: 540, y: 270 };
                var p1 = { x: 560, y: 220 };
                var p2 = { x: 640, y: 220 };
                var p3 = { x: 670, y: 390 };
                var cx = 3 * (p1.x - p0.x);
                var bx = 3 * (p2.x - p1.x);
                var ax = p3.x - p0.x - cx - bx;
                var cy = 3 * (p1.y - p0.y);
                var by = 3 * (p2.y - p1.y);
                var ay = p3.y - p0.y - cy - by;
                var xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
                var yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;
                context.drawImage(info, xt, yt);
            }
            context.globalAlpha = originalalpha;
        }
        if (cframe >= 370 && cframe < 420) {
            processinfo(cframe - 370, 745, 425, 32);
        }
        if (cframe >= 410 && cframe < 420) {
            var info = new Image();
            info.src = imagesloc + 'info_2.png';
            var originalalpha = context.globalAlpha;
            context.globalAlpha = (cframe - 410) / 10;
            context.drawImage(info, 670, 390);
            context.globalAlpha = originalalpha;
        }
        if (cframe >= 425 && cframe < 465) {
            var info = new Image();
            info.src = imagesloc + 'info_2.png';
            context.drawImage(info, 670, 390-(cframe-425)*5);
        }
        if (cframe >= 465 && cframe < 480) {
            var info = new Image();
            info.src = imagesloc + 'info_2.png';
            context.drawImage(info, 670, 190);
        }
        if (cframe >= 480 && cframe < 490) {
            var info = new Image();
            info.src = imagesloc + 'info_2.png';
            var originalalpha = context.globalAlpha;
            context.globalAlpha = (490-cframe) / 10;
            context.drawImage(info, 670, 190);
            context.globalAlpha = originalalpha;
        }
        cframe++;
    }, rate);
}

function mel_scene_1() {
    var rate = 50;
    var cframe = 0;
    var eframe = 331;
    var tmp_message = '';
    state = 0;
    aint = setInterval(function () {
        if (cframe == eframe) {
            console.log('done mel scene 1');
            clearInterval(aint);
            break_scene();
        }
        loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
        load_mel("mel.png");
        if (cframe >= 40 && cframe < 115) {
            var ti_message = 'This is Mel';
            if (cframe - 40 >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 40);
                load_caption(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe >= 120 && cframe < 170) {
            var ti_message = 'Mel is looking for a website to hack';
            if (cframe - 120 >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 120);
                load_caption(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe >= 175 && cframe < 230) {
            var ti_message = "He is also a customer of Piggy Bank";
            if (cframe - 175 >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 175);
                load_caption(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe >= 240 && cframe <= 320) {
            var ti_message = ' and he notices how the URLs are formed when transfering money';
            if (cframe - 240 >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 240);
                load_caption(tmp_message, text_title_x, text_title_y);
            }
        }

        if (cframe > 330) {
            context.font = "25px serif";
            context.fillStyle = 'red';
            var t_message = "Press the right arrow key to continue....";
            context.fillText(t_message, 50, 250);
        }
        cframe++;
    }, rate);

    function break_scene()
    {
        var m2;
        var change = false;
        mc = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 39) {
                console.log('checkclicked');
                document.body.style.cursor = "default";
                window.removeEventListener('keyup', mc, false);
                window.removeEventListener('mousemove', mv, false);
                mel_scene_2();
            }
        }
        mv = function (e) {
            mouseX = e.pageX - theCanvas.offsetLeft;
            mouseY = e.pageY - theCanvas.offsetTop;
            if (btnPlay_c2.checkOver()) {
                change = true;
                document.body.style.cursor = "pointer";
            } else {
                if (change) {
                    document.body.style.cursor = "default";
                    change = false;
                }
            }
        }
        var btnPlay_c2 = new Button(190, 280, 390, 460);
        window.addEventListener('keyup', mc, false);
        window.addEventListener('mousemove', mv, false);
    }
}


function mel_scene_2()
{
    var rate = 50;
    var cframe = 0;
    var eframe = 210;
    var tmp_message = '';
    state = 0;
    aint = setInterval(function ()
    {
        if (cframe == eframe) {
            clearInterval(aint);
            break_scene();
        }

        loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
        load_mel("mel.png");
        load_firewall();


        if (cframe >= 40 && cframe <= 115) {
            var ti_message = 'Mel tries forming a URL and running it on his acount which is 12345';
            if (cframe - 40 >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 40);
                load_caption(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe >= 115 && cframe < 140) {
            var site = new Image();
            var oalpha = context.globalAlpha;
            site.src = imagesloc + "/" + "piggybank_transfer_empty.png";
            context.globalAlpha = (cframe) / 10;
            context.drawImage(site, cwidth / 2 - site.width / 2, cheight / 2 - site.height / 2);
            context.globalAlpha = oalpha;
            processinfo(cframe, 175, 140, 32);
        } else {
            var site = new Image();
            site.src = imagesloc + "/" + "piggybank_transfer_empty.png";
            context.drawImage(site, cwidth / 2 - site.width / 2, cheight / 2 - site.height / 2);
        }

        if (cframe >= 150) {
            var ti_message = "www.piggybank.com/transfer/?account=12345&amount=5.00";
            if (cframe == 150) tmp_message = '';
            if (cframe - 150 >= ti_message.length) {
                context.font = "15px serif";
                context.fillStyle = 'grey';
                context.fillText(ti_message, 262, 180);
            } else {
                tmp_message += ti_message.charAt(cframe - 150);
                context.font = "15px serif";
                context.fillStyle = 'grey';
                context.fillText(tmp_message, 262, 180);
            }
        }
        if (cframe >= 190) {
            context.font = "25px serif";
            context.fillStyle = 'red';
            var t_message = "Press the right arrow key to continue";
            context.fillText(t_message, 200, 450);
        }
        cframe++;
    }, rate);

    function break_scene() {
        console.log("check mel scene 1");
        var m2;
        var change = false;
        mc = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 39) {
                console.log('checkclicked');
                document.body.style.cursor = "default";
                window.removeEventListener('keyup', mc, false);
                window.removeEventListener('mousemove', mv, false);
                mel_scene_3();
            }
        }
        mv = function (e) {
            mouseX = e.pageX - theCanvas.offsetLeft;
            mouseY = e.pageY - theCanvas.offsetTop;
            if (btnPlay_c2.checkOver()) {
                change = true;
                document.body.style.cursor = "pointer";
            } else {
                if (change) {
                    document.body.style.cursor = "default";
                    change = false;
                }
            }
        }
        var btnPlay_c2 = new Button(280, 520, 350, 420);
        window.addEventListener('keyup', mc, false);
        window.addEventListener('mousemove', mv, false);
    }
}


function mel_scene_3() {
    var rate = 50;
    var cframe = 0;
    var eframe = 410;
    var tmp_message = '';
    var lastx;
    var lasty;
    var loci = 0;
    var lasta = 0;
    state = 0;
    aint = setInterval(function () {
        if (cframe == eframe) {
            console.log('done mel scene 3');
            clearInterval(aint);
            break_scene();
        }

        loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
        if (cframe < 250) {
            load_mel("mel.png");
        }
        load_firewall();

        if (cframe >= 250) {
            load_mel("mel_2.png");
        }

        if (cframe >= 20 && cframe <= 30) {
            var site = new Image();
            var oalpha = context.globalAlpha;
            site.src = imagesloc + "/" + "piggybank_success.png";
            context.globalAlpha = (cframe-20) / 10;
            context.drawImage(site, cwidth / 2 - site.width / 2, cheight / 2 - site.height / 2);
            context.globalAlpha = oalpha;
            processinfo(cframe, 175, 140, 32);
        }
        if(cframe > 30 && cframe < 350) {
            var site = new Image();
            site.src = imagesloc + "/" + "piggybank_success";
            context.drawImage(site, cwidth / 2 - site.width / 2, cheight / 2 - site.height / 2);
        }

        if (cframe >= 40 && cframe < 140) {
            var ti_message = 'Mel checks his account to see that the transfer worked since he was already logged in';
            if (cframe - 40 >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 40);
                load_caption(tmp_message, text_title_x, text_title_y);
            }
        }

        if (cframe >= 160 && cframe < 260) {
            var skull = new Image();
            skull.src = imagesloc + "/" + "skull.png";
            var oalpha = context.globalAlpha;
            if (cframe % 3 == 0) {
                context.globalAlpha = lasta / 10;
                context.drawImage(skull, 50, 260);
                context.font = "25px serif";
                context.fillStyle = 'red';
                var t_message = "Exploitable";
                context.fillText(t_message, 50, 250);
                lasta++;
                if (lasta == 11) lasta = 0;
            } else {
                context.globalAlpha = lasta / 10;
                context.font = "25px serif";
                context.fillStyle = 'red';
                var t_message = "Exploitable";
                context.fillText(t_message, 50, 250);
                context.drawImage(skull, 50, 260);
            }
            context.globalAlpha = oalpha;
        }
        if (cframe >= 280 && cframe < 380) {
            var ti_message = 'Mel has found a way to exploit a user';
            if (cframe - 330 >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 330);
                load_caption(tmp_message, text_title_x, text_title_y);
            }
        }

        if (cframe >= 410) {
            context.font = "25px serif";
            context.fillStyle = 'red';
            var t_message = "Press the right arrow key to continue...";
            context.fillText(t_message, 180, 250);
        }
        cframe++;
    }, rate);

    function break_scene() {
        console.log("check mel scene 1");
        var m2;
        var change = false;
        mc = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 39) {
                console.log('checkclicked');
                document.body.style.cursor = "default";
                window.removeEventListener('keyup', mc, false);
                window.removeEventListener('mousemove', mv, false);
                mel_scene_4();
            }
        }
        mv = function (e) {
            mouseX = e.pageX - theCanvas.offsetLeft;
            mouseY = e.pageY - theCanvas.offsetTop;
            if (btnPlay_c2.checkOver()) {
                change = true;
                document.body.style.cursor = "pointer";
            } else {
                if (change) {
                    document.body.style.cursor = "default";
                    change = false;
                }
            }
        }
        var btnPlay_c2 = new Button(190, 280, 390, 460);
        window.addEventListener('keyup', mc, false);
        window.addEventListener('mousemove', mv, false);
    }
}

function mel_scene_4() {
    var rate = 50;
    var cframe = 0;
    var eframe = 650;
    var tmp_message = '';
    state = 0;
    aint = setInterval(function () {
        if (cframe == eframe) {
            console.log('done mel scene 4');
            clearInterval(aint);
            mel_scene_5();
        }
        loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
        load_mel("mel.png");
        load_firewall();

        if (cframe >= 20) {
            var ti_message = 'Mel uses this information to create an HTML email to Alice';
            if (cframe - 20 >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y);
            } else {
                tmp_message += ti_message.charAt(cframe - 20);
                load_caption(tmp_message, text_title_x, text_title_y);
            }
        }

        if (cframe >= 80 && cframe <=520) {
            var site = new Image();
            var oalpha = context.globalAlpha;
            site.src = imagesloc + "/" + "mel_email.png";
            context.globalAlpha = (20-cframe) / 10;
            context.drawImage(site, cwidth / 2 - site.width / 2, cheight / 2 - site.height / 2);
            context.globalAlpha = oalpha;
        }


        if (cframe >= 100 && cframe <= 520)
        {
            var ti_message = "Alice@domain.com";
            if (cframe == 100) tmp_message = '';
            if (cframe - 100 >= ti_message.length) {
                context.font = "14px serif";
                context.fillStyle = 'black';
                context.fillText(ti_message, 220, 194);
            }
            else
            {
                tmp_message += ti_message.charAt(cframe - 100);
                context.font = "14px serif";
                context.fillStyle = 'black';
                context.fillText(tmp_message, 220, 194);
            }
        }
        if(cframe >= 120 && cframe <= 520)
        {
            var ti_message="Free Money at Piggy Bank!!!";
            if(cframe == 120) tmp_message = '';
            if(cframe - 120 >= ti_message.length){
                context.font = "14px serif";
                context.fillStyle = 'black';
                context.fillText(ti_message, 220, 240);
            }
            else
            {
                tmp_message += ti_message.charAt(cframe - 120);
                context.font = "14px serif";
                context.fillStyle = 'black';
                context.fillText(tmp_message, 220, 240);
            }
        }

        if(cframe >= 180 && cframe <= 520)
        {
            var ti_message='To recieve your free money click the picture below!';
            if(cframe == 180) tmp_message = '';
            if(cframe - 180 >= ti_message.length){
                context.font = "15px serif";
                context.fillStyle = 'black';
                context.fillText(ti_message, 180, 280);
            }
            else
            {
                tmp_message += ti_message.charAt(cframe - 180);
                context.font = "15px serif";
                context.fillStyle = 'black';
                context.fillText(tmp_message, 180, 280);
            }
        }

        if(cframe >= 240 && cframe <= 520)
        {
            var ti_message='<html>';
            if(cframe == 240) tmp_message = '';
            if(cframe - 240 >= ti_message.length){
                context.font = "15px serif";
                context.fillStyle = 'black';
                context.fillText(ti_message, 180, 300);
            }
            else
            {
                tmp_message += ti_message.charAt(cframe - 240);
                context.font = "15px serif";
                context.fillStyle = 'black';
                context.fillText(tmp_message, 180, 300);
            }
        }

        if(cframe >= 300 && cframe <= 520)
        {
            var ti_message='<a href="www.piggybank.com/transfer/?account=12345&amount=100.00">';
            if(cframe == 300) tmp_message = '';
            if(cframe - 300 >= ti_message.length){
                context.font = "15px serif";
                context.fillStyle = 'black';
                context.fillText(ti_message, 180, 320);
            }
            else
            {
                tmp_message += ti_message.charAt(cframe - 300);
                context.font = "15px serif";
                context.fillStyle = 'black';
                context.fillText(tmp_message, 180, 320);
            }
        }

        if(cframe >= 380 && cframe < 520)
        {
            var ti_message='<img src="Official_Bank_Logo.png"></a>';
            if(cframe == 380) tmp_message = '';
            if(cframe - 380 >= ti_message.length){
                context.font = "15px serif";
                context.fillStyle = 'black';
                context.fillText(ti_message, 200, 340);
            }
            else
            {
                tmp_message += ti_message.charAt(cframe - 380);
                context.font = "15px serif";
                context.fillStyle = 'black';
                context.fillText(tmp_message, 200, 340);
            }
        }

        if(cframe >= 450 && cframe < 520)
        {
            var ti_message='</html>';
            if(cframe == 380) tmp_message = '';
            if(cframe - 380 >= ti_message.length){
                context.font = "15px serif";
                context.fillStyle = 'black';
                context.fillText(ti_message, 180, 360);
            }
            else
            {
                tmp_message += ti_message.charAt(cframe - 380);
                context.font = "15px serif";
                context.fillStyle = 'black';
                context.fillText(tmp_message, 180, 360);
            }
        }

        if (cframe >= 520 && cframe <= 600) {
            var openbox = new Image();
            var oalpha = context.globalAlpha;
            openbox.src = imagesloc + "/" + "closed_email.png";
            context.globalAlpha = (cframe - 20) / 10;
            context.drawImage(openbox, 300, 320);
            context.globalAlpha = oalpha;
        }
        if (cframe > 600 && cframe < 650) {
            var openbox = new Image();
            openbox.src = imagesloc + "/" + "closed_email.png";
            context.drawImage(openbox, 300, 320);
        }

        // this is the part where the email moves across the screen.
        if (cframe >= 550 && cframe < 650)
        {
            console.log('is this flying yet?');
            var openbox = new Image()
            openbox.src = imagesloc + 'closed_email.png';
            context.drawImage(openbox, 0, 0, 193, 163, 225 + (cframe + 100) * 6.875, 275, 92, 77);
        }
        cframe++;
    }, rate);
}

// USEFUL FOR EXPLAINING THE URL FORM
function mel_scene_5() {
    var rate = 50;
    var cframe = 0;
    var eframe = 851;
    var tmp_message = '';
    var lastx;
    var lasty;
    var loci = 0;
    var lasta = 0;
    var seq;
    state = 0;
    aint = setInterval(function ()
    {
        if (cframe == eframe) {
            console.log('done mel scene 3');
            clearInterval(aint);
            break_scene();
        }

        loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
        seq=20;
        if (cframe >= seq && cframe <= 170) {
            var ti_message = "Let's look at Mel's email in detail...";
            if (cframe == seq) tmp_message = '';
            if (cframe - seq >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y + 60);
            } else {
                tmp_message += ti_message.charAt(cframe - seq);
                load_caption(tmp_message, text_title_x, text_title_y + 60);
            }
        }

        seq=60;
        if (cframe >= seq) {
            context.font = "18px courier";
            context.fillStyle = 'white';
            var ti_message = '<html>';
            if (cframe == seq) tmp_message = '';
            if (cframe - seq >= ti_message.length) {
                if (cframe > 200) {
                    context.fillStyle = 'red';
                    context.font = "bold 18px courier";
                }
                context.fillText(ti_message, 30, 225);

            } else {
                tmp_message += ti_message.charAt(cframe - seq);
                context.fillText(tmp_message, 30, 225);
            }
        }
        seq = 80;
        if (cframe>=seq) {
            context.font = "18px courier";
            context.fillStyle = 'white';
            var ti_message = '<a href="www.piggybank.com/transfer/?account=12345&amount=100.00">';
            if (cframe == seq) tmp_message = '';
            if (cframe - seq >= ti_message.length) {
                if (cframe > 450) {
                    context.fillStyle = 'green';
                    context.font = "bold 18px courier";
                }
                context.fillText(ti_message, 30+15, 250);
            } else {
                tmp_message += ti_message.charAt(cframe - seq);
                context.fillText(tmp_message, 30+15, 250);
            }
        }
        seq = 110;
        if (cframe>=seq) {
            context.font = "18px courier";
            context.fillStyle = 'white';
            var ti_message = '<img src="Official_Bank_Logo.png"></a>';
            if (cframe == seq) tmp_message = '';
            if (cframe - seq >= ti_message.length) {
                if (cframe > 700) {
                    context.fillStyle = 'yellow';
                    context.font = "bold 18px courier";
                }
                context.fillText(ti_message, 30+15, 275);

            } else {
                tmp_message += ti_message.charAt(cframe - seq);
                context.fillText(tmp_message, 30+15, 275);
            }
        }

        seq = 165;
        if (cframe>=seq) {
            context.font = "18px courier";
            context.fillStyle = 'white';
            var ti_message = '</html>';
            if (cframe == seq) tmp_message = '';
            if (cframe - seq >= ti_message.length) {
                if (cframe > 200) {
                    context.fillStyle = 'red';
                    context.font = "bold 18px courier";
                }
                context.fillText(ti_message, 30, 300);

            } else {
                tmp_message += ti_message.charAt(cframe - seq);
                context.fillText(tmp_message, 30, 300);
            }
        }

        seq=200;
        if (cframe >= seq && cframe < 440) {
            var ti_message = "Since HTML elements are allowed in emails,";
            if (cframe == seq) tmp_message = '';
            if (cframe - seq >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y + 20);
            } else {
                tmp_message += ti_message.charAt(cframe - seq);
                load_caption(tmp_message, text_title_x, text_title_y + 20);
            }
        }

        seq=270;
        if (cframe >= seq && cframe < 440) {
            var ti_message = "when the user is viewing anything between the <html>";
            if (cframe == seq) tmp_message = '';
            if (cframe - seq >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y + 40);
            } else {
                tmp_message += ti_message.charAt(cframe - seq);
                load_caption(tmp_message, text_title_x, text_title_y + 40);
            }
        }

        seq=340;

        if (cframe >= seq && cframe < 440) {
            var ti_message = "tag, it will be treated similar to a webpage.";
            if (cframe == seq) tmp_message = '';
            if (cframe - seq >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y + 60);
            } else {
                tmp_message += ti_message.charAt(cframe - seq);
                load_caption(tmp_message, text_title_x, text_title_y + 60);
            }
        }

        seq=450;
        if (cframe >= seq && cframe <= 695) {
            var ti_message = "Mel uses the trick to create a Dummy Image";
            if (cframe == seq) tmp_message = '';
            if (cframe - seq >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y + 20);
            } else {
                tmp_message += ti_message.charAt(cframe - seq);
                load_caption(tmp_message, text_title_x, text_title_y + 20);
            }
        }

        seq=520;
        if (cframe >= seq && cframe <= 695) {
            var ti_message = "The Image masks the actual URL from being viewed";
            if (cframe == seq) tmp_message = '';
            if (cframe - seq >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y + 40);
            } else {
                tmp_message += ti_message.charAt(cframe - seq);
                load_caption(tmp_message, text_title_x, text_title_y + 40);
            }
        }

        seq=590;
        if (cframe >= seq && cframe <= 695) {
            var ti_message = "If already logged in the URL will automatically run the transfer";
            if (cframe == seq) tmp_message = '';
            if (cframe - seq >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y + 60);
            } else {
                tmp_message += ti_message.charAt(cframe - seq);
                load_caption(tmp_message, text_title_x, text_title_y + 60);
            }
        }

        seq=700;
        if (cframe >= seq) {
            var ti_message = "The second statement creates an image to mask the link with an official bank logo";
            if (cframe == seq) tmp_message = '';
            if (cframe - seq >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y + 20);
            } else {
                tmp_message += ti_message.charAt(cframe - seq);
                load_caption(tmp_message, text_title_x, text_title_y + 20);
            }
        }

        if (cframe >= 850) {
            drawroundedrectangle(335, 405, 465-335, 428-405, 4, '#999999');
            context.font = "25px serif";
            context.fillStyle = 'black';
            var t_message = "NEXT";
            context.fillText(t_message, 365, 425);
        }
        cframe++;
    }, rate);


    function break_scene() {
        console.log("check mel scene 1");
        var m2;
        var change = false;
        mc = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 39) {
                console.log('checkclicked');
                document.body.style.cursor = "default";
                window.removeEventListener('keyup', mc, false);
                window.removeEventListener('mousemove', mv, false);
                alice_scene_1();
            }
        }
        mv = function (e) {
            mouseX = e.pageX - theCanvas.offsetLeft;
            mouseY = e.pageY - theCanvas.offsetTop;
            if (btnPlay_c2.checkOver()) {
                change = true;
                document.body.style.cursor = "pointer";
            } else {
                if (change) {
                    document.body.style.cursor = "default";
                    change = false;
                }
            }
        }
        var btnPlay_c2 = new Button(335, 465, 405, 428);
        window.addEventListener('keyup', mc, false);
        window.addEventListener('mousemove', mv, false);
    }
}


function alice_scene_1() {
    var rate = 50;
    var cframe = 0;
    var eframe = 250;
    var tmp_message = '';
    state = 0;
    aint = setInterval(function () {
        if (cframe == eframe)
         {
            console.log('done alice scene 1');
            clearInterval(aint);
            alice_scene_2();
        }
        loadframe('CSRF ALICE');
        if (cframe < 10) {
            var oalpha = context.globalAlpha;
            context.globalAlpha = cframe / 10;
            load_alice();
            context.globalAlpha = oalpha;
        }
        if (cframe > 10) {
            load_alice();
        }
        load_firewall();


        if (cframe >= 140) {
            var site = new Image();
            var oalpha = context.globalAlpha;
            site.src = imagesloc + "/" + "csrf_email.png";
            context.globalAlpha = (20-cframe) / 10;
            context.drawImage(site, cwidth / 2 - site.width / 2, cheight / 2 - site.height / 2);
            context.globalAlpha = oalpha;
        }

        if (cframe >= 10 && cframe < 60) {
            var ti_message = 'Alice is at her computer again. ';
            if (cframe - 10 >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 10);
                load_caption(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe >= 70 && cframe < 120) {
            var ti_message = 'She is checking her email';
            if (cframe - 70 >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 70);
                load_caption(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe >= 140 && cframe < 240) {
            var ti_message = 'When she comes across a great deal offered by her Bank!';
            if (cframe - 140 >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 140);
                load_caption(tmp_message, text_title_x, text_title_y);
            }
        }
        cframe++;
    }, rate);


    function break_scene_alice() {
        console.log("check");
        var m2;
        var change = false;
        mc = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 39) {
                console.log('checkclicked');
                document.body.style.cursor = "default";
                window.removeEventListener('keyup', mc, false);
                window.removeEventListener('mousemove', mv, false);
                mel_scene_4();
            }
        }
        mv = function (e) {
            mouseX = e.pageX - theCanvas.offsetLeft;
            mouseY = e.pageY - theCanvas.offsetTop;
            if (btnPlay_sub.checkOver()) {
                change = true;
                document.body.style.cursor = "pointer";
            } else {
                if (change) {
                    document.body.style.cursor = "default";
                    change = false;
                }
            }
        }
        var btnPlay_sub = new Button(190, 280, 390, 460);
        state = 1;
        window.addEventListener('keyup', mc, false);
        window.addEventListener('mousemove', mv, false);
    }
}

function alice_scene_2() {
    var rate = 50;
    var cframe = 0;
    var eframe = 125;
    var tmp_message = '';
    state = 0;
    aint = setInterval(function () {
        if (cframe == eframe) {
            console.log('done alice scene 1');
            clearInterval(aint);
            break_scene_alice();
        }
        loadframe('CSRF ALICE');
        load_alice();
        load_firewall();

        if (cframe <= 10) {
            var site = new Image();
            var oalpha = context.globalAlpha;
            site.src = imagesloc + "/" + "csrf_email.png";
            context.globalAlpha = (cframe) / 10;
            context.drawImage(site, cwidth / 2 - site.width / 2, cheight / 2 - site.height / 2);
            context.globalAlpha = oalpha;
            processinfo(cframe, 175, 140, 32);
        } else {
            var site = new Image();
            site.src = imagesloc + "/" + "csrf_email.png";
            context.drawImage(site, cwidth / 2 - site.width / 2, cheight / 2 - site.height / 2);
        }

        if (cframe >= 50) {
            var ti_message = "Alice sees the email, and then clicks on the picture that says FREE MONEY!";
            if (cframe - 50 >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 50);
                load_caption(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe > 120) {
            context.font = "25px serif";
            context.fillStyle = 'red';
            var t_message = "Press the right arrow key to continue";
            context.fillText(t_message, 180, 475);

        }
        cframe++;
    }, rate);

    function break_scene_alice()
    {
        console.log("check");
        var m2;
        var change = false;
        mc = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 39) {
                console.log('checkclicked');
                document.body.style.cursor = "default";
                window.removeEventListener('keyup', mc, false);
                window.removeEventListener('mousemove', mv, false);
                alice_scene_3();
            }
        }
        mv = function (e) {
            mouseX = e.pageX - theCanvas.offsetLeft;
            mouseY = e.pageY - theCanvas.offsetTop;
            if (btnPlay_sub.checkOver()) {
                change = true;
                document.body.style.cursor = "pointer";
            } else {
                if (change) {
                    document.body.style.cursor = "default";
                    change = false;
                }
            }
        }
        var btnPlay_sub = new Button(300, 475, 150, 550);
        state = 1;
        window.addEventListener('keyup', mc, false);
        window.addEventListener('mousemove', mv, false);
    }
}


function alice_scene_3() {
    var rate = 50;
    var cframe = 0;
    var eframe = 330;
    var tmp_message = '';
    state = 0;
    aint = setInterval(function () {
        if (cframe == eframe) {
            console.log('done alice scene 1');
            clearInterval(aint);
            break_scene_alice();
        }
        loadframe('CSRF ALICE');
        load_alice();
        load_firewall();

        if (cframe <= 10) {
            var site = new Image();
            var oalpha = context.globalAlpha;
            site.src = imagesloc + "/" + "piggybank_success.png";
            context.globalAlpha = (10-cframe) / 10;
            context.drawImage(site, cwidth / 2 - site.width / 2, cheight / 2 - site.height / 2);
            context.globalAlpha = oalpha;
            processinfo(cframe, 175, 140, 32);
        }

        if (cframe >= 20) {
            var ti_message = 'Transfer is made from Alice to Mel';
            if (cframe - 20 >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y);
                tmp_message = '';
            } else {
                tmp_message += ti_message.charAt(cframe - 20);
                load_caption(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe >= 20 && cframe <= 30) {
            var openbox = new Image();
            var oalpha = context.globalAlpha;
            openbox.src = imagesloc + "/" + "open_box.png";
            context.globalAlpha = (cframe - 20) / 10;
            context.drawImage(openbox, 300, 320);
            context.globalAlpha = oalpha;
        }
        if (cframe > 30 && cframe <= 155) {
            var openbox = new Image();
            openbox.src = imagesloc + "/" + "open_box.png";
            context.drawImage(openbox, 300, 320);
        }
        if (cframe > 30 && cframe < 85) {
            var originalalpha = context.globalAlpha;
            var info = new Image()
            info.src = imagesloc + 'cookie.png';
            if (cframe <= 40) { //+10
                context.globalAlpha = (cframe - 30) / 10;//0
                context.drawImage(info, 230, 410);
            }
            if (cframe >= 75 && cframe < 85) {//+45 to +10
                context.globalAlpha = (85 - cframe) / 10;
                context.drawImage(info, 350, 320);
            }
            if (cframe >= 65 && cframe < 75) { //+35 to +10
                context.drawImage(info, 350, 320);
            }
            if (cframe > 40 && cframe < 65) {//+10 to +25
                var t = (cframe - 40) / 25;
                //cubic bezier curve movement
                var p0 = { x: 230, y: 410 };
                var p1 = { x: 240, y: 300 };
                var p2 = { x: 340, y: 300 };
                var p3 = { x: 350, y: 320 };
                var cx = 3 * (p1.x - p0.x);
                var bx = 3 * (p2.x - p1.x);
                var ax = p3.x - p0.x - cx - bx;
                var cy = 3 * (p1.y - p0.y);
                var by = 3 * (p2.y - p1.y);
                var ay = p3.y - p0.y - cy - by;
                var xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
                var yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;
                context.drawImage(info, xt, yt);
            }
            context.globalAlpha = originalalpha;
        }
        if (cframe > 90 && cframe < 145) {
            var originalalpha = context.globalAlpha;
            var info = new Image()
            info.src = imagesloc + 'info_2.png';
            if (cframe <= 100) { //+10
                context.globalAlpha = (cframe - 90) / 10;//0
                context.drawImage(info, 230, 410);
            }
            if (cframe >= 135 && cframe < 145) {//+45 to +10
                context.globalAlpha = (145 - cframe) / 10;//+55
                context.drawImage(info, 350, 320);
            }
            if (cframe >= 125 && cframe < 135) { //+35 to +10
                context.drawImage(info, 350, 320);
            }
            if (cframe > 100 && cframe < 125) {//+10 to +25
                var t = (cframe - 100) / 25;//+10
                //cubic bezier curve movement
                var p0 = { x: 230, y: 410 };
                var p1 = { x: 240, y: 300 };
                var p2 = { x: 340, y: 300 };
                var p3 = { x: 350, y: 320 };
                var cx = 3 * (p1.x - p0.x);
                var bx = 3 * (p2.x - p1.x);
                var ax = p3.x - p0.x - cx - bx;
                var cy = 3 * (p1.y - p0.y);
                var by = 3 * (p2.y - p1.y);
                var ay = p3.y - p0.y - cy - by;
                var xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
                var yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;
                context.drawImage(info, xt, yt);
            }
            context.globalAlpha = originalalpha;
        }
        if (cframe > 155 && cframe <= 160) {
            var openbox = new Image();
            openbox.src = imagesloc + "/" + "closed_box.png";
            context.drawImage(openbox, 318, 322);
        }
        if (cframe > 160 && cframe < 200) {
            var openbox = new Image();
            openbox.src = imagesloc + "/" + "closed_box.png";
            context.drawImage(openbox, 318 + 6.05 * (cframe - 160), 322);
        }
        if (cframe >= 200 && cframe <= 205) {
            var openbox = new Image();
            openbox.src = imagesloc + "/" + "closed_box.png";
            context.drawImage(openbox, 560, 322);
        }
        if (cframe > 205 && cframe <= 345) {
            var openbox = new Image();
            openbox.src = imagesloc + "/" + "open_box.png";
            context.drawImage(openbox, 542, 320);
        }
        if (cframe > 210 && cframe < 265) {
            var originalalpha = context.globalAlpha;
            var info = new Image()
            info.src = imagesloc + 'cookie.png';
            if (cframe <= 220) { //+10
                context.globalAlpha = (cframe - 210) / 10;//0
                context.drawImage(info, 600, 320);
            }
            if (cframe >= 255 && cframe < 265) {//+45 to +10
                context.globalAlpha = (265 - cframe) / 10;
                context.drawImage(info, 700, 410);
            }
            if (cframe >= 245 && cframe < 255) { //+35 to +10
                context.drawImage(info, 700, 410);
            }
            if (cframe > 220 && cframe < 245) {//+10 to +25
                var t = (cframe - 220) / 25;
                //cubic bezier curve movement
                var p0 = { x: 600, y: 320 };
                var p1 = { x: 610, y: 300 };
                var p2 = { x: 690, y: 300 };
                var p3 = { x: 700, y: 410 };
                var cx = 3 * (p1.x - p0.x);
                var bx = 3 * (p2.x - p1.x);
                var ax = p3.x - p0.x - cx - bx;
                var cy = 3 * (p1.y - p0.y);
                var by = 3 * (p2.y - p1.y);
                var ay = p3.y - p0.y - cy - by;
                var xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
                var yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;
                context.drawImage(info, xt, yt);
            }
            context.globalAlpha = originalalpha;
        }
        if (cframe > 270 && cframe < 325) {
            var originalalpha = context.globalAlpha;
            var info = new Image()
            info.src = imagesloc + 'info_2.png';
            if (cframe <= 280) { //+10
                context.globalAlpha = (cframe - 270) / 10;//0
                context.drawImage(info, 600, 320);
            }
            if (cframe >= 315 && cframe < 325) {//+45 to +10
                context.globalAlpha = (265 - cframe) / 10;
                context.drawImage(info, 700, 410);
            }
            if (cframe >= 305 && cframe < 315) { //+35 to +10
                context.drawImage(info, 700, 410);
            }
            if (cframe > 280 && cframe < 305) {//+10 to +25
                var t = (cframe - 280) / 25;
                //cubic bezier curve movement
                var p0 = { x: 600, y: 320 };
                var p1 = { x: 610, y: 300 };
                var p2 = { x: 690, y: 300 };
                var p3 = { x: 700, y: 410 };
                var cx = 3 * (p1.x - p0.x);
                var bx = 3 * (p2.x - p1.x);
                var ax = p3.x - p0.x - cx - bx;
                var cy = 3 * (p1.y - p0.y);
                var by = 3 * (p2.y - p1.y);
                var ay = p3.y - p0.y - cy - by;
                var xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
                var yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;
                context.drawImage(info, xt, yt);
            }
            context.globalAlpha = originalalpha;
        }
        if (cframe > 325) {
            context.font = "25px serif";
            context.fillStyle = 'red';
            var t_message = "Press the right arrow key to continue";
            context.fillText(t_message, 180, 250);
        }
        cframe++;
    }, rate);
    function break_scene_alice() {
        console.log("check");
        var m2;
        var change = false;
        mc = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 39) {
                console.log('checkclicked');
                document.body.style.cursor = "default";
                window.removeEventListener('keyup', mc, false);
                window.removeEventListener('mousemove', mv, false);
                alice_scene_5();
            }
        }
        mv = function (e) {
            mouseX = e.pageX - theCanvas.offsetLeft;
            mouseY = e.pageY - theCanvas.offsetTop;
            if (btnPlay_sub.checkOver()) {
                change = true;
                document.body.style.cursor = "pointer";
            } else {
                if (change) {
                    document.body.style.cursor = "default";
                    change = false;
                }
            }
        }
        var btnPlay_sub = new Button(660, 740, 390, 530);
        state = 1;
        window.addEventListener('keyup', mc, false);
        window.addEventListener('mousemove', mv, false);
    }
}

function curve_cb(px0, py0, px1, py1, px2, py2, px3, py3, t) {
    var p0 = { x: px0, y: py0 };
    var p1 = { x: px1, y: py1 };
    var p2 = { x: px2, y: py2 };
    var p3 = { x: px3, y: py3 };
    var cx = 3 * (p1.x - p0.x);
    var bx = 3 * (p2.x - p1.x);
    var ax = p3.x - p0.x - cx - bx;
    var cy = 3 * (p1.y - p0.y);
    var by = 3 * (p2.y - p1.y);
    var ay = p3.y - p0.y - cy - by;
    var xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
    var yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;
    return { x: xt, y: yt };
}


function alice_scene_5() {
    var rate = 50;
    var cframe = 0;
    var eframe = 300;
    var tmp_message = '';
    state = 0;
    aint = setInterval(function ()
    {
        if (cframe == eframe) {
            console.log('done alice scene 4');
            clearInterval(aint);
            break_scene_alice();
        }
        loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
        load_alice();
        load_firewall();
        load_mel();
        if (cframe >= 20) {
            var ti_message = 'Exploitation: Alice\'s transfer is then processed';
            if (cframe - 20 >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y);
            } else {
                tmp_message += ti_message.charAt(cframe - 20);
                load_caption(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe == 75) tmp_message = '';
        if (cframe >= 75) {
            var ti_message = ' to Mel\'s account';
            if (cframe - 75 >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y + 25);
            } else {
                tmp_message += ti_message.charAt(cframe - 75);
                load_caption(tmp_message, text_title_x, text_title_y + 25);
            }
        }
        if (cframe == 130) tmp_message = '';

        if (cframe >= 110 && cframe <= 215) {
            var oalpha = context.globalAlpha;
            var cookie = new Image();
            cookie.src = imagesloc + 'cash.png';
            if (cframe >= 110 && cframe <= 120) {
                context.globalAlpha = (cframe - 110) / 10;
                context.drawImage(cookie, 190, 420);
            }
            if (cframe > 120 && cframe < 125) {
                context.drawImage(cookie, 190, 420);
            }
            if (cframe >= 125 && cframe <= 150) {
                context.drawImage(cookie, 190+10.4*(cframe-125), 420);
            }
            if (cframe > 150 && cframe <= 175) {
                context.drawImage(cookie, 450, 420-8.4*(cframe-150));
            }
            if (cframe > 175 && cframe <= 200) {
                context.drawImage(cookie, 450-8*(cframe-175), 210);
            }
            if (cframe > 200 && cframe < 205) {
                context.drawImage(cookie, 250, 210);
            }
            if (cframe >= 205 && cframe <= 215) {
                context.globalAlpha = (215 - cframe) / 10;
                context.drawImage(cookie, 250, 210);
            }
            context.globalAlpha = oalpha;
        }
        if (cframe >= 240) {
            context.font = "25px serif";
            context.fillStyle = 'red';
            var t_message = "Press the right arrow key to continue...";
            context.fillText(t_message, 125, 360);
        }
        cframe++;
    }, rate);
    function break_scene_alice() {
        console.log("check");
        var m2;
        var change = false;
        mc = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 39) {
                console.log('checkclicked');
                document.body.style.cursor = "default";
                window.removeEventListener('keyup', mc, false);
                window.removeEventListener('mousemove', mv, false);
                alice_scene_6();
            }
        }
        mv = function (e) {
            mouseX = e.pageX - theCanvas.offsetLeft;
            mouseY = e.pageY - theCanvas.offsetTop;
            if (btnPlay_sub.checkOver()) {
                change = true;
                document.body.style.cursor = "pointer";
            } else {
                if (change) {
                    document.body.style.cursor = "default";
                    change = false;
                }
            }
        }
        var btnPlay_sub = new Button(160, 230, 410, 470);
        state = 1;
        window.addEventListener('keyup', mc, false);
        window.addEventListener('mousemove', mv, false);
    }
}

//displays
function alice_scene_6() {
    var rate = 50;
    var cframe = 0;
    var eframe = 200;
    var tmp_message = '';
    console.log("hi");
    state = 0;
    aint = setInterval(function () {
        if (cframe == eframe) {
            console.log('done alice scene 4');
            clearInterval(aint);
            countermeasure();
        }
        loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
        load_alice();
        load_firewall();
        load_mel_2();
        if (cframe >= 20) {
            var ti_message = 'Exploitation: Alice is then redirected to the Banks website';
            if (cframe - 20 >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y);
            } else {
                tmp_message += ti_message.charAt(cframe - 20);
                load_caption(tmp_message, text_title_x, text_title_y);
            }
        }
        if (cframe >= 75) {
            var ti_message = '';
            if (cframe - 75 >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y + 25);
            } else {
                tmp_message += ti_message.charAt(cframe - 75);
                load_caption(tmp_message, text_title_x, text_title_y + 25);
            }
        }
        if (cframe >= 100 && cframe < 130) {
            processinfo(cframe, 160, 420, 18);
        }
        if (cframe >= 130 && cframe <= 160) {
            var site = new Image();
            var oalpha = context.globalAlpha;
            site.src = imagesloc + "piggybank_success.png";
            context.globalAlpha = (cframe-130) / 10;
            context.drawImage(site, cwidth / 2 - site.width / 2, cheight / 2 - site.height / 2);
            context.globalAlpha = oalpha;
        }
        if (cframe > 160) {
            var site = new Image();
            site.src = imagesloc + "/" + "piggybank_login.png";
            context.drawImage(site, cwidth / 2 - site.width / 2, cheight / 2 - site.height / 2);
        }
        cframe++;
    }, rate);
}

function countermeasure() {
    var rate = 50;
    var cframe = 0;
    var eframe = 450;
    var tmp_message = '';
    var lastx;
    var lasty;
    var loci = 0;
    var lasta = 0;
    var seq;
    state = 0;
    aint = setInterval(function ()
    {
        if (cframe == eframe) {
            console.log('done mel scene 3');
            clearInterval(aint);
            break_scene_mel();
        }

        loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');
        seq=20;
        if (cframe >= seq && cframe <= 60) {
            var ti_message = "Countermeasures!!!!";
            // https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet
            if (cframe == seq) tmp_message = '';
            if (cframe - seq >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y + 40);
            } else {
                tmp_message += ti_message.charAt(cframe - seq);
                load_caption(tmp_message, text_title_x, text_title_y + 40);
            }
        }

        seq=80;
        if (cframe >= seq) {
            var ti_message = "Developers are encouraged to adopt the Synchronizer Token Pattern ";
            if (cframe == seq) tmp_message = '';
            if (cframe - seq >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y + 20);
            } else {
                tmp_message += ti_message.charAt(cframe - seq);
                load_caption(tmp_message, text_title_x, text_title_y + 20);
            }
        }

        seq=150;
        if (cframe >= seq) {
            var ti_message = 'The pattern requires generation of random "challenge" tokens';
            if (cframe == seq) tmp_message = '';
            if (cframe - seq >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y + 40);
            } else {
                tmp_message += ti_message.charAt(cframe - seq);
                load_caption(tmp_message, text_title_x, text_title_y + 40);
            }
        }

        seq=220;
        if (cframe >= seq) {
            var ti_message = "These challenge tokens are then inserted within the HTML forms or links";
            if (cframe == seq) tmp_message = '';
            if (cframe - seq >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y + 60);
            } else {
                tmp_message += ti_message.charAt(cframe - seq);
                load_caption(tmp_message, text_title_x, text_title_y + 60);
            }
        }

        seq=290;
        if (cframe >= seq) {
            var ti_message = "Then the server should verify the existence and correctness of this token.";
            if (cframe == seq) tmp_message = '';
            if (cframe - seq >= ti_message.length) {
                load_caption(ti_message, text_title_x, text_title_y + 80);
            } else {
                tmp_message += ti_message.charAt(cframe - seq);
                load_caption(tmp_message, text_title_x, text_title_y + 80);
            }
        }
        if (cframe >= 350) {
            drawroundedrectangle(335, 405, 465-335, 428-405, 4, '#999999');
            context.font = "25px serif";
            context.fillStyle = 'black';
            var t_message = "NEXT";
            context.fillText(t_message, 365, 425);
        }
        cframe++;
    }, rate);


    function break_scene_mel() {
        console.log("check");
        var m2;
        var change = false;
        mc = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 39) {
                console.log('checkclicked');
                document.body.style.cursor = "default";
                window.removeEventListener('keyup', mc, false);
                window.removeEventListener('mousemove', mv, false);
                summary_scene();
            }
        }
        mv = function (e) {
            mouseX = e.pageX - theCanvas.offsetLeft;
            mouseY = e.pageY - theCanvas.offsetTop;
            if (btnPlay_sub.checkOver()) {
                change = true;
                document.body.style.cursor = "pointer";
            } else {
                if (change) {
                    document.body.style.cursor = "default";
                    change = false;
                }
            }
        }
        var btnPlay_sub = new Button(335, 465, 405, 428);
        state = 1;
        window.addEventListener('keyup', mc, false);
        window.addEventListener('mousemove', mv, false);
    }
}


// NEED A SUMMARY SCENE AS WELL!!
function summary_scene() {
    var rate = 50;
    var cframe = 0;
    var eframe = 150;
    var tmp_message = '';
    state = 0;
    aint = setInterval(function () {
        if (cframe == eframe) {
            console.log('done alice scene 4');
            clearInterval(aint);
        }
        loadframe('InterSecVis: Cross Site Request Forgery (CSRF)');

        if (cframe < 10) {
            var oalpha = context.globalAlpha;
            context.globalAlpha = cframe / 10;
            context.font = "bold 35px serif";
            context.fillStyle = 'red';
            var t_message = "Summary";
            context.fillText(t_message, 200, 130+50);
            context.globalAlpha = oalpha;
        }
        if (cframe >= 10) {
            context.font = "bold 35px serif";
            context.fillStyle = 'red';
            var t_message = "Summary";
            context.fillText(t_message, 200, 130+50);
        }
        if (cframe >= 20 && cframe < 30) {
            var oalpha = context.globalAlpha;
            context.globalAlpha = (cframe-20) / 10;
            context.font = "bold 30px serif";
            context.fillStyle = 'white';
            var t_message = "CSRF vulnerability";
            context.fillText(t_message, 200+cframe-20, 160+50);
            context.globalAlpha = oalpha;
        }
        if (cframe >= 30) {
            context.font = "bold 30px serif";
            context.fillStyle = 'white';
            var t_message = "CSRF vulnerability";
            context.fillText(t_message, 210, 160+50);
        }
        if (cframe >= 60 && cframe < 70) {
            var oalpha = context.globalAlpha;
            context.globalAlpha = (cframe - 60) / 10;
            context.font = "30px serif";
            context.fillStyle = 'white';
            var t_message = "easy to spot";
            context.fillText(t_message, 210 + (cframe - 60), 185+50);
            context.globalAlpha = oalpha;
        }
        if (cframe >= 70) {
            context.font = "30px serif";
            context.fillStyle = 'white';
            var t_message = "easy to spot";
            context.fillText(t_message, 220, 185+50);
        }
        if (cframe >= 100 && cframe < 110) {
            var oalpha = context.globalAlpha;
            context.globalAlpha = (cframe - 100) / 10;
            context.font = "30px serif";
            context.fillStyle = 'white';
            var t_message = "easy to exploit";
            context.fillText(t_message, 210 + cframe - 100, 215+50);
            context.globalAlpha = oalpha;
        }
        if (cframe >= 110) {
            context.font = "30px serif";
            context.fillStyle = 'white';
            var t_message = "easy to exploit";
            context.fillText(t_message, 220, 215+50);
        }
        if (cframe >= 140 && cframe < 150) {
            var oalpha = context.globalAlpha;
            context.globalAlpha = (cframe - 140) / 10;
            context.font = "30px serif";
            context.fillStyle = 'white';
            var t_message = "and can be deterimental";
            context.fillText(t_message, 210 + cframe - 140, 245+50);
            context.globalAlpha = oalpha;
        }
        if (cframe >= 150) {
            context.font = "30px serif";
            context.fillStyle = 'white';
            var t_message = "and can be detrimental";
            context.fillText(t_message, 220, 245+50);
        }
        cframe++;
    }, rate);
}
