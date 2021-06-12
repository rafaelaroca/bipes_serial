//Code that exclusively handles the ui.
function get (e) {return document.querySelector (e); }
function getIn (a, b) {return a.querySelector (b); }
function getAll (e, f) {return get (e).querySelectorAll (f); }
function style (e) {return get (e).style; }
function fx (e, vfx) {e.style.Transition = vfx; }

$em = 16; // size of 1em

function panel (button_, panel_) {
  this.panel_ = panel_;
  this.button = get (button_);
  this.panel = get (panel_);
  this.button.onclick = () => {this.showPanel ()};
}
panel.prototype.showPanel = function () {
  let panel_ = BIPES ['responsive'].panels.find ( ({name}) => name === this.panel_);
  if(!panel_.show) {
    this.panel.id = 'show';
    if(panel_.name == '.notify-panel')
      BIPES ['notify'].container.id = '';
 } else
    this.panel.id = '';
  panel_.show = !panel_.show;
}


language.prototype = Object.create (panel.prototype);
function language (button_, panel_) {
	panel.call (this, button_, panel_);
  this.panel.appendChild(document.createTextNode(MSG['languageTooltip']));
}

function notify () {
  this.panel_ = '.notify-panel'
	this.container = get ('.notify');
	this.panel = get (this.panel_);
  this.messages = [];
  this.timeOut;
  this.timeOut2;
}
notify.prototype.send = function (message) {
  console.log (message);
  this.messages.push({timestamp: +new Date, message: message});
  let this_message = this.messages [this.messages.length-1];
  let closeButton_ = document.createElement ('span');
  this_message.div = document.createElement ('span');
  this_message.div.appendChild(document.createTextNode(message));
  this_message.div.appendChild(closeButton_);
  // remove notification on click
  this_message.div.onclick = (ev) => {try {this.panel.removeChild(ev.target.parentNode)}catch(e){};};
  this.panel.appendChild(this_message.div);

  let panel_ = BIPES ['responsive'].panels.find ( ({name}) => name === this.panel_);
  if(!panel_.show) {
    this.container.innerHTML = message + "<p>" + this.container.innerHTML;
    this.container.id = 'show';

    clearTimeout(this.TimeOut);
    clearTimeout(this.TimeOut2);
    this.timeOut = setTimeout( () => {
      this.container.id = '';
      this.timeOut2 = setTimeout( () => {
      this.container.innerHTML = '';}, 150);
    }, 5000);
  }
}


function responsive () {
  this.body = get ('body');
	this.panels = [{name:'.toolbar',x:$em*18.5, y:$em*7.5, show:false},
	               {name:'.notify-panel',x:$em*18.5, y:0, show:false},
	               {name:'.language-panel',x:$em*18.5, y:$em*13, show:false}];
  this.binded = false;

  this.body.onclick = (ev) => {this.hidePanels (ev)};
}

function xhrGET (filename, onsuccess, onfail) {
  let xmlHTTP = new XMLHttpRequest ();

	xmlHTTP.open ('GET', filename, false);
	xmlHTTP.onload = function () {
    if (this.status == 200)
      onsuccess (this.responseText);
    else
      onfail ();
	}
	xmlHTTP.send(null);
}
responsive.prototype.hidePanels = function (ev) {
  if (ev.x !== 0 && ev.y !== 0) {
    let minx = 0;
    let miny = 0;
    this.panels.forEach ((item) => {
      if (item.show === true) {
        if (item.x > minx)
          minx = item.x;
        if (item.y > miny)
          miny = item.y;
        if (item.y === 0)
          miny = window.innerHeight;
      }
    });
    this.panels.forEach ((item) => {
      if (((window.innerWidth - minx) > (ev.x) || miny < (ev.y)) && item.show === true) {
        BIPES [item.name].panel.id='';
        item.show = false;
      }
    });
  }
}


function workspace () {
    this.selector = get('#device_selector');
    this.content = get('#content_device');
    this.device_title = getIn(this.content, '#device_title'),
    this.device_img = getIn(this.content, '#device_img'),
    this.device_desc = getIn(this.content, '#device_desc');
    this.toolbox = get('#toolbox');

    // setup, could be used and external JSON file instead.
    this.devices = [
			{name:'ESP8266',
      title:'<b>ESP8266</b><br>',
      img:'../../beta2/ui/devinfo/Node-MCU-ESP-12E-Pin-Out-Diagram2.jpg',
      description:"To use ESP8266, simply connecto to MicroPython board using Wifi. Micropython must be previously installed.",
      toolbox:'toolbox_esp8266.xml'},

			{name:'ESP32',
			title:'<b>ESP32</b><br>',
			img:'../../beta2/ui/devinfo/ESP32-Pinout.jpg',
			description:"",
			toolbox:'toolbox_esp32.xml'},

			{name:'Nucleo',
			title:'<b>mBed: NUCLEO-F446RE</b><br>',
			img:'../../beta2/ui/devinfo/NUCLEO-F446RE-3-500x500.png',
			description:"",
			toolbox:'toolbox_stm32.xml'},

			{name:'BBBlack',
			title:'<b>Beagle Bone Black</b><br>',
			img:'../../beta2/ui/devinfo/cape-headers.png',
			description:"",
			toolbox:'toolbox_bbblack.xml'},

			{name:'RPI',
			title:'',
			img:'',
			description:"",
			toolbox:''},

			{name:'RPI_Pico',
			title:'<b>Raspberry Pi Pico</b><br>Image: https://microcontrollerslab.com/raspberry-pi-pico-pinout-features-programming-peripherals/<br>',
			img:'https://microcontrollerslab.com/wp-content/uploads/2021/01/Raspberry-Pi-Pico-pinout-diagram.svg',
			description:"More info: https://microcontrollerslab.com/raspberry-pi-pico-pinout-features-programming-peripherals/ <br><br>https://www.raspberrypi.org/products/raspberry-pi-pico/",
			toolbox:'toolbox_rpi_pico.xml'},

			{name:'UNO',
			title:'<b>Arduino UNO. Image source: https://content.arduino.cc/assets/Pinout-UNOrev3_latest.png</b><br>',
			img:'https://content.arduino.cc/assets/Pinout-UNOrev3_latest.png',
			description:"",
			toolbox:'toolbox_arduino.xml'}

      /* Template
      {name:'',
      title:'',
      img:'',
      description:"",
      toolbox:''},
      */
    ];

    this.selector.onchange = () => {this.change ()};

}

workspace.prototype.change = function () {
  let selected = this.devices.find ( ({name}) => name === this.selector.value)
  if (selected != undefined) {
    this.device_title.innerHTML = selected.title,
    this.device_img.src = selected.img,
    this.device_desc.innerHTML = selected.description;

    if (!!selected.toolbox) { // checks if toolbox is set
       xhrGET(selected.toolbox, (response) => {
        this.toolbox.innerHTML = response;
        Code.workspace.updateToolbox(this.toolbox);
      }, () => {
         BIPES ['notify'].send(MSG['ErrorGET']);
      });
    } else
        BIPES ['notify'].send(MSG['noToolbox']);
  } else
    BIPES ['notify'].send(MSG['invalidDevice']);
}
