
function Fretboard () {}

var DFT = {
  width: 510,
  height: 128,
  stringCount: 6,
  fretCount: 23,
  color: '#EEEEEE', //no influence
  marginx: 24,
  marginy:3
}

var fb;
var ctx;

var StringsClr = '#565';
var HitStringClr = '#C00';
var FretClr = '#000';
var GuitarCircClr='#448';

Fretboard.init = function (canvas, fretboard) {
  if (Array.isArray(fretboard))
      return Fretboard.init(canvas, { notes: fretboard })
  fb = fretboard ? Object.assign({}, DFT, fretboard) : DFT
  fb.width= $('#topriff').width()-10;

  calcFretboard(fb)
  //console.log(fb)

  ctx = canvas.getContext('2d')
  canvas.width = $('#topriff').width()-10; // ;DFT.width
  canvas.height = fb.height
  ctx.clearRect(0, 0, fb.width, fb.height);
  ctx.font = "16px helvetica-neue, sans-serif";

  drawStrings(ctx, fb, null)
  drawFrets(ctx, fb)
  if (fb.notes)
      drawNotes(ctx, fb)
}

function calcFretboard (fb) {
  if (fb.notes) {
    fb.stringCount = fb.notes.length
    if (fb.stringCount) fb.fretCount = fb.notes[0].length
  }

  fb.stringDist = fb.height / fb.stringCount
  fb.marginY = Math.floor(fb.stringDist / 2) ;
  fb.fretSize = fb.width / fb.fretCount;
  fb.colorNames = fb.noteColors ? Object.keys(fb.noteColors) : []
}

function drawNotes (ctx, fb) {
  var note, x, y
  var r = Math.floor(fb.stringDist / 2)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (var s = 0; s < fb.stringCount; s++)
  {
    for (var f = 0; f < fb.fretCount; f++)
    {
        note = fb.notes[s][f]
        if (note)
        {
            x = DFT.marginx+(f * fb.fretSize + fb.fretSize / 2)
            y = DFT.marginy+(fb.height - (s * fb.stringDist + fb.marginY))
            ctx.fillStyle = getNoteColor(note, fb)
            drawCircle(ctx, x, y, r)
            ctx.fillStyle = '#000'
            ctx.fillText(note, x, y)
        }
    }
  }
}

function getNoteColor (note, fb) {
  if (!fb.colorNames.length) return fb.color
  for (var i = 0; i < fb.colorNames.length; i++) {
    var name = fb.colorNames[i]
    if (note.indexOf(name) === 0) return fb.noteColors[name]
  }
  return fb.color
}

function drawStrings (ctx, fb, strings) {
  ctx.strokeStyle = StringsClr; //#F9C
  for (var i = 0; i < fb.stringCount; i++) {
    var y = DFT.marginy+(i * fb.stringDist + 0.5 + fb.marginY)
        ctx.lineWidth = (i/3)+1;
        drawLine(ctx, DFT.marginx, y, fb.width, y)
  }
}


function drawString (ctx, fb, i, x)
{
     i=5-i;
     ctx.strokeStyle = HitStringClr; // '#FFF'
     var y = DFT.marginy+((i) * fb.stringDist + 0.5 + fb.marginY)
     ctx.lineWidth = (i/3)+1;
     drawLine(ctx, DFT.marginx+x, y, fb.width, y)
}


function drawFrets (ctx, fb) {
  for (var n = 0; n < fb.fretCount; n++) {
    var x = DFT.marginx+ (n * fb.fretSize + 0.5)

    ctx.strokeStyle = FretClr;//'#0F0';
    drawLine(ctx, x, fb.marginY+(DFT.marginy), x, fb.height - (fb.marginY-DFT.marginy))
    if(n==0)
        drawLine(ctx, x-2, fb.marginY+(DFT.marginy), x-2, fb.height - (fb.marginY-DFT.marginy))
    ctx.fillStyle = GuitarCircClr; //FretClr;//'#0F0'

    if (n==3||n==5||n==7||n==9 || n==15 || n==17 || n==19)
    {
        var x = DFT.marginx+(n * fb.fretSize - fb.fretSize/2)
        y = DFT.marginy+(fb.height/2)
        drawCircle(ctx, x, y, 5)
    }
    else if (n==12)
    {
        var x = DFT.marginx+(n * fb.fretSize - fb.fretSize/2)
        y = DFT.marginy+(fb.height/3)
        drawCircle(ctx, x, y, 5)
        y = DFT.marginy+(2*fb.height/3)
        drawCircle(ctx, x, y, 5)
    }
  }
}

function drawCircle (ctx, x, y, r) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

function drawLine (ctx, x1, y1, x2, y2) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.closePath()
}

var lastN;
var fliP=0;
function drawPlay (ctx, fb, note, textover)
{
    var note, x, y,yo=0;
    var r = Math.floor(fb.stringDist / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.clearRect(0, 0, fb.width, fb.height);
    drawFrets (ctx, fb);
    drawStrings (ctx, fb, fb.notes);
    var maxx=10;
    var top=false;
    //alert("fb " + fb.notes.length);
    ++fliP;
    for (var s in fb.notes)
    {
        var f = fb.notes[s]-1;
        s--;
        x = DFT.marginx+(f * fb.fretSize + fb.fretSize / 2);
        y = DFT.marginy+(fb.height - (s * fb.stringDist + fb.marginY));
        top = 1;
		if(f===-1)
		{
			x+=34;
			if(x>maxx)maxx=x;
			drawString (ctx, fb, s, x);
			ctx.strokeStyle = '#FFFF00';
            top = 2;
		}
		else
		{
			drawString (ctx, fb, s, x);
			ctx.strokeStyle = '#C2EdFd';
			if(x>maxx)maxx=x;
      	}
		if(note==lastN)
		{
			if(fliP % 2 ==0)
				ctx.fillStyle = '#EE0000';
			else
				ctx.fillStyle = '#880000';
		}
		else
		{
			fliP = 0;
			ctx.fillStyle = '#EE0000';
		}
		if(textover)
		{
  			drawCircle(ctx, x, y, (r+5)/top);
			ctx.fillStyle = '#FFFFFF';
			ctx.fillText(note , x-2, y+2);
		}
		else{
  			drawCircle(ctx, x, y, r/top);
        }
    }
	lastN = note;
	if(!textover)
	{
		ctx.fillStyle = '#000';
		ctx.fillText(note , fb.width/4, 10); // notes on top
	}
}


function addNotes (notes, name, onnote)
{
    if(notes==null)
	{
        return;
	}
    fb.notes = new Array;

    for(var n=0;n<notes.length;n++)
    {
        fb.notes[notes[n].string]= notes[n].fret;
    }
    if(notes.length>0){
        drawPlay(ctx, fb, name, onnote);
    }
	delete 	fb.notes;
}


///////////////////////////////////////
function noteFromNeck(cord,fret)
{           //  0   1   1    3     4  5   6    7    8   9   10   11
    var notes=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    var notese=[" (do)"," (do#)"," (re)"," (re#)"," (mi)"," (fa)"," (fa#)"," (sol)"," (sol#)"," (la)"," (la#)"," (si)"];
    switch(cord)
    {
        case 1:
            return notes[(3 + (fret % 11)) % 11] + notese[(3 + (fret % 11)) % 11];
            break;
        case 2:
            return notes[(8 + (fret % 11)) % 11] + notese[(8 + (fret % 11)) % 11];
            break;
        case 3:
            return notes[(0 + (fret % 11)) % 11] + notese[(0 + (fret % 11)) % 11];
            break;
        case 4:
            return notes[(6 + (fret % 11)) % 11] + notese[(6 + (fret % 11)) % 11];
            break;
        case 5:
            return notes[(10 + (fret % 11)) % 11] + notese[(10 + (fret % 11)) % 11];
            break;
        case 6:
            return notes[(3 + (fret % 11)) % 11] + notese[(3 + (fret % 11)) % 11];
            break;
        default:
            break;
    }
    return "$";
}


///////////////////////////////////////
function fret_kick(score)
{
    if(score.notes.length)
    {
        var sn="";
        for(var n=0 ;n < score.notes.length; n++)
        {
            if(score.notes[n].string)
            {
                if(score.notes[n].string==-1)
                {
                    break;
                }
                sn +=noteFromNeck(score.notes[n].string,score.notes[n].fret) + ",";
            }
        }
        addNotes(score.notes,sn);
   }
}

var T=null;

function drum_kick( beat)
{
    var dk=document.getElementById("drumkit");
    var any = document.getElementById("k39");
    var t = false;
    for(var n=0 ;n < beat.notes.length; n++)
    {
        const b = beat.notes[n].percussionArticulation;
        var tom = document.getElementsByClassName("k"+b);
        if(tom!==null){
             tom[0].classList.add('playing');
             t=true;
        }else{
             any.classList.add('playing');
             any.innerHTML=b;
             t=true;
        }
    }

    if(t && T==null){
        T=setTimeout(function(){
            var els = document.getElementsByClassName("playing");
            if(els!==null){
                for(var i = 0; i < els.length; i++)
                {
                    els[i].classList.remove("playing");
                }
            }
            T=null;
        }, 32);
    }
}

/*
document.getElementById('drumkitw').onclick = function clickEvent(e) {
      // e = Mouse click event.
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left; //x position within the element.
      var y = e.clientY - rect.top;  //y position within the element.
      document.getElementById("logout").innerHTML="Left? : " + x + " ; Top? : " + y ;
    }
*/



// piano
var NOTES = [
    'C',
    'Cs',
    'D',
    'Ds',
    'E',
    'F',
    'Fs',
    'G',
    'Gs',
    'A',
    'As',
    'B'
];


var c, ctx;
var keyWidth;
var keys = [];

function draw_keys(kicked=false)
{
        for (var i = 0; i < keys.length; i++) {
              if(keys[i].type==1)keys[i].draw();
        }
        for (var i = 0; i < keys.length; i++) {
              if(keys[i].type==0)keys[i].draw();
        }
}


function drawPiano() {
    keys = [];
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "gray";
    var xpos = 0;
    for (var i = 0; i <= 12*6; i++)
    {
        var xname = NOTES[i%12];
        xname += (Math.floor((i+12)/12)).toString();
        if(NOTES[i%12].indexOf('s')==-1) /* not sharp*/
        {
            keys.push( new Key(xpos, 0, keyWidth, c.height, 1, xname));
            xpos += keyWidth;
        }
        else
        {
            xpos -= keyWidth / 4;
            keys.push( new Key(xpos, 0, keyWidth / 2, c.height / 2, 0, xname));
            xpos += keyWidth / 4;
        }
    }
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(c.width, 0)
    ctx.moveTo(0, c.height);
    ctx.lineTo(c.width, c.height);
    ctx.stroke();
    draw_keys();
}

function setCanvasSize() {
    c.width = $('#piano').width()-10;//window.innerWidth-(window.innerWidth/10)-4;
    c.height = $('#piano').height()-20//window.innerHeight / 6;
    keyWidth = c.width / 42;

    drawPiano();
}


function piano_init()
{
    c = document.getElementById("pianogl");
    if(c!==null){
        ctx = c.getContext("2d");
        setCanvasSize();
    }
}

class Key {
    constructor(x, y, width, height, type,name) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.kicked=false;
        this.name=name;
    }

    draw(kicked=false) {
        if(kicked){
             ctx.fillStyle = "#4AF";
             if (this.type == 0)
                 ctx.fillRect(this.x+2, this.y+10, this.width-4, 30);
             else 
                 ctx.fillRect(this.x+4, this.y+50, this.width-8, 30);
             this.kicked=true;
        }
        else{
            if (this.type ==0) {
                ctx.fillStyle = "black";
                ctx.fillRect(this.x, this.y, this.width, this.height);
            } else {
                if(this.kicked){
                    ctx.fillStyle = "white";
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                }
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x, this.y + this.height);
//                ctx.moveTo(this.x+this.width, this.y);
  //              ctx.lineTo(this.x+this.width, this.y + this.height);
                ctx.stroke();
            }
            this.kicked=false;
        }
        if(this.type==1){
            ctx.fillStyle = "grey";
            ctx.fillText(this.name, this.x+this.width/3, this.y+this.height-4);
        }
    }
}

function piano_kick( beat)
{
    draw_keys();
    for(var n=0; n < beat.notes.length; n++)
    {
        const  t = beat.notes[n].realValue-36;
        if(t < keys.length && t > 0)
            keys[t].draw(true);
    }
}

function redraw_instr(name)
{
    if(name=="piano")
        drawPiano();
}

if (typeof module === 'object' && module.exports) module.exports = Fretboard
if (typeof window !== 'undefined') window.Fretboard = Fretboard

