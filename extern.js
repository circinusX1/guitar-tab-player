var eLOADING=false;

function overlay_message(overlay, text, title)
{
    var html = "<div class='msg-overlay'><div class='msg-title'>"+title+"</div>";
    html += "<div class='msg-content'>"+ text + "</div></div>";
    overlay.style.display = "flex";
    overlay.innerHTML=html;
}


function extern_copyright(overlay, copy)
{
    var y = document.getElementsByClassName("at-main alphaTab");
    if(y != null)
    {
        var main = y[0];
        main.classList.add("blu2");
    }
    copy = copy.split(",").join("");
    copy = copy.split("@").join("");
    copy = copy.replace(/[\u{0080}-\u{10FFFF}]/gu,"?");
    const content ="Looks like someone shared a copyrighted Tab.<br>"+
            "I cannot play a coyrighted Tablature. <br>"+
            "The tab owner can enable the tab for everyone at <br>"+
             "<a target='_blank' href='https://guitarminenu.blogspot.com/2021/01/"+
             "error-error-online-midi-score-player.html#comments'>"+
             "Feeback & Contact</a> by adding a post as:<br>"+
            "<sub class='text-dark bg-white'>unlock:"+copy+"</sub><br>"+
             "You can search again or goto <a href='index.php'>Main</a> page";
    overlay_message(overlay, content, "Copyright: " + copy);
    setTimeout(function() {
        overlay_message(overlay, content, "Copyright: " + copy);
    }, 3000);
    return true;
}

function extern_corupted(overlay)
{
    if(eLOADING==false)
        overlay_message(overlay, "<a href='index.php'>Continue</a><br>Please avoid this Tab","Tab is corrupted");
}

function extern_taberr(overlay)
{
    if(eLOADING==false)
        overlay_message(overlay, "<a href='index.php'>Continue</a><br>Please avoid this Tab","Tab is corrupted");
}

function extern_select(overlay,startstop)
{

}

function extern_loading(perc)
{
    var y = document.getElementById("ploading");
    var el = document.getElementById("mloading");
    if(el===null || y===null)
        return;
    if(isNaN(perc)){
        eLOADING=false;
        document.getElementById("pp").innerHTML="<font color='red'>FX-ERR</font>";
        extern_corupted(y);
        return;
    }

    if(perc>=98 || perc==0){
        eLOADING=false;
        el.style.width="100px";
        y.style.display="none";
    }else{
        if( y.style.display!=="flex"){
             y.style.display="flex";
        }
        el.style.width=perc+"px";
        eLOADING=true;
    }
}

function extern_noplay(overlay)
{
    overlay_message(overlay, "<a href='index.php'>Continue</a>","Tab is copyrighted");
    setTimeout(function() {
        overlay.style.display = "none";
        overlay.innerHTML="";
    }, 4000);
}

function extern_noprint(overlay)
{
    overlay_message(overlay, "<a href='index.php'>Continue</a>","Tab is copyrighted");
    setTimeout(function() {
       overlay.style.display = "none";
        overlay.innerHTML="";
    }, 4000);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function extern_toggleinstr(score,instrid)
{
    document.getElementById("topriff").style.display="none";
    document.getElementById("piano").style.display="none";
    document.getElementById("drumkit").style.display="none";

    if (instrid != "none") {
        if(document.getElementById(instrid)!==null){
            newh="80vh";

            document.getElementById(instrid).style.display="flex";
            if(instrid=="topriff")
            {
                Fretboard.init(document.getElementById('fretboard'),
                {
                    color: '#000000',
                    width: ($(window).width()/2)+92,
                })
            }else if(instrid=="piano")
            {
                newh="76vh";
                document.getElementById("piano").style.display="flex";
                piano_init();
            }
            else // drum
            {
                newh="49vh";
            }
            redraw_instr(instrid);
            score.style.height = newh;
        }
    } else {
        score.style.height = "99vh";
    }
}


function extern_as(vpitch,soundfont,renderstr,wrapper,gtune,transposed)
{
    const views =   [alphaTab.StaveProfile.ScoreTab,
                     alphaTab.StaveProfile.Score,
                     alphaTab.StaveProfile.Tab,
                     alphaTab.StaveProfile.Tab,
                     alphaTab.StaveProfile.ScoreTab];
    const notat = [0, 0, 0,
    				alphaTab.TabRhythmMode.ShowWithBars, 
    				alphaTab.TabRhythmMode.ShowWithBars];
    var   vsel = 0;
    var   zoom = 1.00;
    var sfont = "default.sf2";
    if($.cookie("at-staff")!==undefined)
    {
        vsel = parseInt($.cookie("at-staff"));
    }
    if($.cookie("at-zoom")!==undefined)
    {
        zoom = parseFloat(parseInt($.cookie("at-zoom"))/100.0);
    }
    if($.cookie("at-sfont")!==undefined)
    {
        sfont = $.cookie("at-sfont");
    }
//    alert (sfont);
    var atvp = wrapper.querySelector('.at-viewport');
    const pheight = atvp.clientHeight;
    var settings = {
        file: "_fake.php",
        player: {
             ScrollOffsetY: -pheight/4,
             enablePlayer: true,
             soundFont: "./synth/"+sfont,
             scrollElement: wrapper.querySelector('.at-viewport')
        },
        notation: {
            transpositionPitches:[vpitch],
        },
        core: {
            engine: renderstr,
        },
        display:{
            staveProfile: views[vsel],
            scale: zoom,
        },
        notation:{
            rhythmMode: notat[vsel],
        },
        mco_tune: gtune,
        mco_transpose: transposed,
    };
    return settings;
}

function extern_sfont(api,sfont){
//    api.settings.player.soundFont = "./synth/"+sfont;
  //  api.updateSettings();
  //  api.load();
   // api.render();
   // api.renderScore();
    return false;
}

