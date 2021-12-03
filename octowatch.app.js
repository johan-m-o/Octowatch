/* Octonauts Octowatch v1.01 for the Bangle.js 1 - by Johan Oscarsson
   Works for the Bangle.js 2 as well, but will not look
   quite as nice due to the low-bit display.

   Not released under any licence, since I do not own the
   images used, but feel free to use the code however you'd like...
   All images are collected from the Octonauts Fandom Wiki.
   https://octonauts.fandom.com/wiki/Octonauts_Wiki */

// Variables
var cntV = 0;
var cntA = 0;
var cntTime = 0;
var active = 0;
var alertID = 0;
var callID = 0;
var W = g.getWidth();
var H = g.getHeight();
var center = {x:W/2, y:H/2};
var sStart = 0;
var sApp = 'setting.app.js';
var s = require('Storage').readJSON('setting.json',1);
var ctrlPhone = 0;

// Image size and placement, etc
var imgScale = W/240; // Scale the image for Bangle.js v2
var backDraw = 0;

// Timing
var intL = 100; // Interval length. I've found 100 ms to be perfect on the Bangle.js 1: not too slow, not too fast.
var alertL = (30*1000)/intL; // Alert length

// Colours
var tmpC = '';
var tmpI = 0;
var cW = '#ffffff';
var cB = '#3399cc';
var cG = '#00ff00';
var cA1 = '#ff6600';
var cA2 = '#ff9900';
var cA3 = '#ffcc00';

// Buzz
if (process.env.HWVERSION==1) {
  var buzzStrength = 0.5;
} else {
  var buzzStrength = 1;
}

// Audio
var aTime = intL; // Use the same time as the interval length
var aFreq = 2500; // Frequency used for the alarm
var tmpFreq = aFreq;
var phoneFreq = 3000; // Frequency used for the phone call

// Octopus image
var imgOcto = require("heatshrink").decompress(atob("+HwwIQNg////wFrAcCAAPgDq4cDAAOADisfDov4DikBDgo8Wh4dHTCl/Do/+DiUDDg4AB4CTW8DUES6RYDR4SbDLSIVD8BhHWqBSC/gJFn4mGOxyMGHgR4QOwI6GBQZ4POwXwMhR4OCJYpCPBx2BLBCXDPBwQBLBAABh4qLAAaxIWowcMB5wrMSgZpMM4KWMSgJ2KFiRKMNAKWMv6GNPAP+BhT/BYRxLBwBJLfxyHBNJSFBUZgQOh6UNJgbDKMwIcNSwSIKv6iLCKCUPSwbQKMo6AIBALSIQYKhGVQIABBI6nIBRF/DoRGFJwLSIIwJDHAASOGaRMfCIyKBAAY0Fv6oIn7cGDgi/GCY4nILAhaHJ45jIPwIAFZYiLHT5E/DowNEY4LwGKILQFZ4Z4ICg4mHIQIAGR4jwIMQwkBAA7wMh6eFSg6WGv4dGj7aFj4dIKYk/cwoHHWQ4ABGogzGIY6yHWgxvGP4KdFDhC0FUgIdGbIjgBABA1EB4IcEbIIdEaBLSFCwK6EEgIGEDpYQDGhDuOAAIXERwsHTgruJeA1/AokPbAruJeA0/exbuJeA0/AokfAojuKeAwXFIIodROIp9FYAIAKU4kHDpT1BABbLJboodRCIIdJg4dMwAdHOAIKDDpwwDDAgEBWQkPDqBUBDoReFDpyoEEYaaFfYIdRv4dX+DqHh70EDqc/AoUP/AdEn4dqCYkfDoQDDMgYdRG4YddLoYdQVIkHAoU/bYgdXaoYACDhgdG/wdC4AdHgIdJC4QABgYdLF4IaG4YdH/4WCwAdGUILzGQYQdEJYIdKXYIdFIYIHBDo4gDDoqdBj7rGA4IdEHAQdGSIQdBh4dGA4IdZMIIHCDoy2DDoq7BDo8HDozOBDqJDBDpSiBDrUHDpB3HDpM/8AdeYAIdId4qVJj/gh4dICoIdHaI8f+AdJBAM/Dq75B/6ABv4dECAJDBcwodCFQIdGCIIcEEoRDBDoobBD4IdH//HDooZBIYIdG/AdKAA+BEIYdYH4gADdoLTBDqZ7BDos/Dpn8bIQdK/gdHZopmBA4odV4DNCDpgQBDpWAU4IHE/ATEgYdIGYovCDrLICDpt/DpZuCgadGDon+Do8fDotwaQodVgLwGZAodCUwIdJ/EH/wdLgIdIZIgdBWoL3GDqYFBDqrJEDoWADogUFDrwIHc4odICYodnZIizH/wdPCojvCA4n8CZAdL/kD/xDEDqN/Con4MIodIBA0An4zFTonwDqiNCDongDqEfZIq1BAAXADqDqBAASEBAwgdRGgxCEY5IdHOAy6DCZAJFngDCZQoFETgQdKCQIKFAA7YCDpRyBNAZTEAAn4DpiJBcAbwDAAvwDpgXBB4atEAAjQHDoRUCKYJLDDpLQHDoppFDpIcHYAQdBAgSlDDpCyEn5eCDo7hDSpCyEAoYdF/0fDqAYBIIQEBv53C+EPXIodKgZ9DDosAg4dQCIJUEDogpBAgTXBDpRNBDpJCBeoizKj/8DAQdZRYIdEa4QdFDg4dEn/gOAYdFDIIFCDpgWEDpT6CAAz8DDo0/Do7hCDpbKEDo1/MwIdNcQYSB/gdIf4QAHDpScDDob/CDpKEBCocHDo/wcIIdJOYJxBDpc//AgBDqcfDov8aBIABRQIXBDon4DopWKAASECDo5xBDqASBNIQACh4dUHAP/Do0PDojOKAAeDDo3wD4JhEDppcDKIYdXVYodGgYdWbIrtLeQwdD8Adbn4dGYQIAOwAdFgYdFv4dOCggdC/wIEj4cNCgt/4AdGh4dNKA3AR4IIEaQpfIcwgdBwAdGBIIZC/wdI+CqFDpCXDDoYhFaAgdCAQYdKv4dERYo4DDpX8DoX8n5XHDpn/94dCHIIdKVIK2DDo3HDon4DoSxFDoJgCDpGHDoQ5BDp0/8AdGg4VBDocfDpEH/gdJ/wdDHIIdC+4VCDo8fQY38DpHzDo0PDpMB/AdB+ABBj4dC+IdHMIQDDAAfwDofgDoMPAwIdGBYIdJBAIdIvgdGKoRdDDo3g//ADof4jgQFn4dCg7VCDo3h/+AJIKcCCAzNDDpXBDopMHv4dCgf/BgysBDoIrBDoQuHM4LKCDpOBC4IdBFoIdIwAdDAgRmE/+DKYMDDoQuGDAodJgKPBAQIUBCAxUFLwaEEBoIJCYoIdBCAqQFTQYlEN4wlBc4QACZgodGJALJGDoIIFDos/FQpIBDoy7BSwsPB4kfRYIME/4HFBARaFC4sfGYoyBIYpRBDoJTFDohBFNwSdGaQTTEOIp9FCYTZGE4QKEVopJBNowcGSwYdDJYqsBI4YwBdwwQDDoZMBJYgGBDoSKCWQw8EDog0DIQQLCLASUGAAccKRBgFNYQMFABCOFOQS6Cn52JAA0PCAz2DDoLdEABUf/gHJDoJYOGYgdEIYUPSZRvGDoyvBDJ6rENQydBKp4ACdwJNGbILwCDqIUGExDuNKA7NQRhieHdxjICbQz4GdxgTIE5LuReCqLJeCTHKeCQSKFALSQNgJOJ/7SQj6KKv60Qn4RKn60Q/7uII4a0ORIJrKaQK/ICA6nKX4KWOWQLjKJAJmKRApqL/6WOB5orBJJRLQWgKWMSgKHMBxwsOWgP+Bxd/NBqGCUhR2BUhwtBfxRnBJJhpDUpTBBQpguDJhQLBShhqECJApCShovDLRBYBShwSEGAxGCQZQAFh4TBRQygBX5YxIHgsDBAT7KeJDlFA47xPAASdDMRAALKIYAGZ57TFAAxYSLQxYWWooAEWKI8K/gcUHg46VAAMPDgfwDixbESRo"));

// Phone image
var imgPhone = require("heatshrink").decompress(atob("+HwwJC/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AB3//wcav////8DjEfDgIAB+AcWgIcDAAIdWh4dF8B1YAAZ5VLAxaWLAxaWn4dH/AdTDg///wcSgYdI/+AOy38W4h4Sj4WFEgfwdqjpEA46UQKIg8CSyKUCCgyWTg7nIe4XASiQTGE4SWQGIQJGgJFIWRapIBRQwJJxBkCWSKKIPAS0OCIRHLWh0Pdo7xF8DQPU5S/BaRwQMFRjFFNRSEBaRymMYAKEKUwoNYFoZLMM4LwMNIKHMUYLwMdwLDMWgLwMDoIObFgJKMNAJKMNAKGMUgKGMUgLgOYRr+NgAdNBpotOJIJnMQ4YdoUYLBMcIbDKb4L9MAAMPf5YdBBhQQQFRhMQMxiIQDoIcNYgQdKYBjiQn/+Dp0ADpd//gdPCJYddI5ZrRDri/McaAdf8AdPh4dJgYdTwAdJ4AdPg4dJBQIdSCRAoKJyQddQRSoSXxTkSDrsf/wdQgH/+Ad/DpaoBAAS+GDpM//j2GAAjoFv/4DpqmBAAwdUj4dHKYgdKBIY6IHgoTEDpMPDpPgDqIcJ/7CDDpJjDWAy2IY4wdGSZCXGDpQNCv4dLDIUfDpgcLPAYdMZ5TTFDpkDDpuADpqyMWgYdJUYQdRegYdlh6qGXg3gHaQTBAAQnELKYTBAAQJGDqLHBAATbEDphSBDqEPDqAMEgIduO4wdLSphtEDpKBBDqAPGDv4dpv4dBRYYdKAoMf/gd/DowTDB41/E4gdNCYQdJBIQdK/ADBn4TBAoQADBIs/DpgAPDpM/DqYTIDvhjIABKLJDvcf/wdR//wDv4dhh//DiEB//gDs+ADp8DDpMHDqfADs4KICSQoKJySCKVCS+KciQdB+AdPj4dngH//AdPn/+Ds9//gdPCJYddI5ZrRn6hKYowdKX5bjRDoOADpsDDpcP//ADpsH//gBhYdQCBQqMJiBmMRCDAMcSAddgH//gdNv/+BrItPv5JMNIQdMM4KjKYYaHMYILfKf4bhMfoPgBzgsMJQIdMJQJoMQwJoMQwLCOUhjCBaRYNNfwYtLJIP+DppLBNJSFBM5iHDWhSyBUZgQOFRjwFNRSEBdxhqDUxKyCdximDCJIpCdxgvENZCDBdxzSDYpAKKU5IwHIwTQOJwh4GOwTQOCYgxGIoSyOWgjxGBAKyPCgvgA4cPExC0NVQoHHSyA8DHQSURCwo1BHIRhGSyAAHSiKWEAAqUSc4gAFe4x4SOywABgIdHDibpEW4gdVLQxYULRAcVAAMfDgfwDq55DOqwAE//+DjQA/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/AH4A/ACAA="));

// Draw the watch face
function drawFace(back,octo) {
  if (backDraw == 0) {
    backDraw = 1;
    g.setColor(back);
    g.fillCircle(center.x,center.y,center.x-center.x*0.05);
  }
  g.setColor(octo);
  g.drawImage(imgOcto,0,0,{scale:imgScale});
}

// Run the Octo Alert
function alert() {
  cntV += 1;
  cntA += 1;
  cntTime += 1;

  // Colours
  if (cntV > 3) { // Change colour "down"
    tmpI = 2;
    cntV = 0;
  } else { // Change colour "up"
    tmpI = cntV;
  }
  tmpC = eval('cA'+tmpI); // Determine what colour variable to use
  drawFace(cW,tmpC);

  // Beep or buzz
  if (s.beep != false) {
    Bangle.beep(aTime,tmpFreq);
    if (cntA >= 10) { // Change frequency up
      cntA = 0;
      tmpFreq = aFreq;
    } else { // Change frequency down
      tmpFreq += 100;
    }
  } else if (s.buzz != false) {
    Bangle.buzz(intL, buzzStrength);
  }

  // Stop the alert when the set time is reached
  if (cntTime >= alertL) {
    trigger();
  }
}

// Start or stop the Octo Alert
function trigger() {
  sStart = 0;
  if (ctrlPhone != 1) { // No alert during call screen
    if (active == 1) { // Clear everything and set the default face
      clearInterval(alertID);
      g.clear();
      backDraw = 0;
      drawFace(cB,cW);
      active = 0;
      cntV = 0;
      cntA = 0;
      cntTime = 0;
      tmpFreq = aFreq;
      ctrlPhone = 0;
      Bangle.setLCDTimeout(10);
    } else { // Start Octo Alert
      Bangle.setLCDTimeout(0); // Keep screen on during alert
      backDraw = 0;
      alertID = setInterval(alert, intL);
      active = 1;
    }
  }
}

// Open settings after clicking BTN1 3 times
function settingsB() {
  if (sStart >= 2) {
    if (require("Storage").read(sApp) == undefined) {
      E.showMessage("Settings app\nNot found");
      setTimeout('load()', 2000);
    } else {
      load(sApp);
    }
  } else {
    sStart++;
  }
  if (sStart == 1) {
    setTimeout(function() {
      sStart = 0;
      if (process.env.HWVERSION==2) { // On Bangle.js v2 BTN1 calls a random Octonauts character if not pressed 3 times within the set time
        if (active == 0) { // No calls during an alert
          if (ctrlPhone == 0) {
            callScreen();
          } else if (ctrlPhone == 2) {
            ctrlPhone = 0;
            g.clear();
            backDraw = 0;
            drawFace(cB,cW);
          }
        }
      }
    }, 500);
  }
}

// Calling screen
function callScreen() {
  if (sStart < 2) {
    ctrlPhone = 1; // Don't let the call button do anything during the call screen
    Bangle.beep(1000, phoneFreq); // First dial tone

    g.clear();
    g.setColor(cG);
    g.drawImage(imgPhone,0,0,{scale:imgScale});

    callID = setInterval(function() {
      Bangle.beep(1000, phoneFreq);
    }, 2000);

    setTimeout(phoneCall, 5000);
  }
}

// Call a random Octonauts character
function phoneCall() {
  clearInterval(callID);
  ctrlPhone = 2;
  g.clear();

  var n = 0|((Math.random() * 11) + 1);
  var leading = "0";
  if (n > 9) {
    leading = "";
  }
  var img = require("Storage").read(leading+n+".img");

  g.drawImage(img,0,0,{scale:imgScale});
}

// Clicking BTN1 three times within 0.5 seconds opens settings
setWatch(settingsB, BTN1, { repeat: true, edge: "falling" });

if (process.env.HWVERSION==1) {
  // On the Bangle.js v1 the other buttons resets the button presses
  setWatch(function() {
    sStart = 0;
  }, BTN2, { repeat: true, edge: "falling"});
  setWatch(function() {
    sStart = 0;
    if (active == 0) { // No calls during an alert
      if (ctrlPhone == 0) {
        callScreen(); // On Bangle.js v1 BTN3 calls a random Octonauts character
      } else if (ctrlPhone == 2) {
        ctrlPhone = 0;
        g.clear();
        backDraw = 0;
        drawFace(cB,cW);
      }
    }
  }, BTN3, { repeat: true, edge: "falling"});
}

// Trigger alert when screen is touched
Bangle.on('touch',trigger,{repeat:true});

// Draw initial watch face
g.clear();
drawFace(cB,cW);
