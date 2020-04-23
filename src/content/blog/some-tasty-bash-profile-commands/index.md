---
title: Some Tasty Bash Profile / Bashrc Commands To Make Your Life Better
description:
date: "2018-04-09"
draft: false
starID: 16
postType: dev
---

# Bash Profile / Bashrc - Aliases, Terminal Prompt, Terminal Prompt Colors, the Works to Get Your Workflow to God-Like Levels!

This post is gonna get right to it - if you use machines that have a Bash terminal, you should build custom aliases to get around faster, do stuff faster, or just plain have a bit of fun! (you don't necessarily have to use mine, but these aliases and functions could get you started on your own machine - and hey, besides, my aliases are pretty intuitive right? :smile:)

For the following machines, the alias file can be found in these locations:

Mac: `~/.bash_profile`

Linux: `~/.bashrc`

Raspberry Pi (with raspbian and other linux style builds): `~/.bashrc`

Here's what I've got (compiled and selected as only the tastiest after 5+ of full stack dev work! oh also, the IPs for SSH and passwords for my databases / APIs have been _clearly_ modified, they won't work - what do you think I am, an idiot? :joy::joy::joy: )

```bash
# ~/.bashrc: executed by bash(1) for non-login shells.
# see /usr/share/doc/bash/examples/startup-files (in the package bash-doc)
# for examples

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# don't put duplicate lines or lines starting with space in the history.
# See bash(1) for more options
HISTCONTROL=ignoreboth

# append to the history file, don't overwrite it
shopt -s histappend

# for setting history length see HISTSIZE and HISTFILESIZE in bash(1)
HISTSIZE=1000
HISTFILESIZE=2000

# check the window size after each command and, if necessary,
# update the values of LINES and COLUMNS.
shopt -s checkwinsize

# If set, the pattern "**" used in a pathname expansion context will
# match all files and zero or more directories and subdirectories.
#shopt -s globstar

# make less more friendly for non-text input files, see lesspipe(1)
[ -x /usr/bin/lesspipe ] && eval "$(SHELL=/bin/sh lesspipe)"

# fancy directory prompt
PS1='\[\033[01;32m\]\u@\h\[\033[01;34m\] [\w]\[\033[00m\] '

# Add an "alert" alias for long running commands.  Use like so:
#   sleep 10; alert
alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)" "$(history|tail -n1|sed -e '\''s/^\s*[0-9]\+\s*//;s/[;&|]\s*alert$//'\'')"'

# Alias definitions.
# You may want to put all your additions into a separate file like
# ~/.bash_aliases, instead of adding them here directly.
# See /usr/share/doc/bash-doc/examples in the bash-doc package.

if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi

# enable programmable completion features (you don't need to enable
# this, if it's already enabled in /etc/bash.bashrc and /etc/profile
# sources /etc/bash.bashrc).
if ! shopt -oq posix; then
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi


##########################################
### BEGIN CUSTOM ALIASES AND FUNCTIONS ###
##########################################

###########
# aliases #
###########

# productivity
alias prof='atom /Users/chris/.bash_profile' # opens .bash_profile for editing
alias s='source /Users/chris/.bash_profile' # sources .bash_profile (should be done every time after changing profile)
alias lk='ls -lhkart'
alias show='open .'
alias back='cd ..'
alias prev='cd -'
alias home='cd'
alias boot='sudo reboot'
alias shut='sudo shutdown -h now'
alias hidedesk='gsettings set org.gnome.desktop.background show-desktop-icons false'
alias showdesk='gsettings set org.gnome.desktop.background show-desktop-icons true'
alias de='xdg-open /Users/chris/Desktop/DE.desktop'
alias en='xdg-open /Users/chris/Desktop/EN.desktop'
alias duo='/opt/google/chrome/google-chrome --profile-directory=Default --app-id=ekajaiihjemkjldcienbdonodmbiklnb'
alias whats='/opt/google/chrome/google-chrome --profile-directory=Default --app-id=hnpfjngllnobngcgfapefoaidbinmjnm'
alias sputnik='/opt/google/chrome/google-chrome --profile-directory=Default --app-id=dailkpkcmcieildpjbiinmpllifajeoh'
alias robo='/opt/google/chrome/google-chrome --profile-directory=Default --app-id=dailkpkcmcieildpjbiinmpllifajeoh'
alias roboton='/opt/google/chrome/google-chrome --profile-directory=Default --app-id=dailkpkcmcieildpjbiinmpllifajeoh'
alias slack='/opt/google/chrome/google-chrome --profile-directory=Default --app-id=niopebapoomkfgpbhanlddcancjkjnkl'
alias sd='down;show;prev'
alias ipy='ipython'
alias py='python'
alias youtubemp3='youtube-dl --extract-audio --audio-format mp3'
alias getlines='find . -name "*.*" | xargs wc -l'
alias disabledchromium='chromium-browser --disable-web-security --user-data-dir'
alias phpserver='php -S localhost:8000'
alias phpserver2='php -S localhost:8001'
alias serv='cd; cd personalwebsite; phpserver'
alias feldkirch='/opt/google/chrome/google-chrome --profile-directory=Default --app-id=mnmkkpdekllmopechbcfhhhdojafalin'
alias coderesources='cd /Users/chris/Documents/coderesources'
alias codestuff='cd /Users/chris/Documents/codestuff'
alias gladysroot='cd /usr/local/lib/node_modules/gladys'
alias studio='sh /usr/local/android-studio/bin/studio.sh'
alias pl='perl'
alias haskell='ghci'
alias nexus='emulator @Nexus_5X_API_26'
alias iphone5='/Applications/Xcode.app/Contents/Developer/Applications/Simulator.app/Contents/MacOS/Simulator -CurrentDeviceUDID EF585900-1164-4AF9-90FD-26B1DEC3DB66'
alias iphone6='/Applications/Xcode.app/Contents/Developer/Applications/Simulator.app/Contents/MacOS/Simulator -CurrentDeviceUDID 3DC7A4A6-489F-4305-AFE8-53A8D1302E65'
alias nodecode='cd /Users/chris/Documents/codestuff/node'
alias gittelluser='git config --global user.email'
alias nodesass='node-sass -wo ./src/styles ./src/styles-scss'
alias pj='cd /Users/chris/projects'
alias heroku-skillscout='heroku git:remote -a skillscout;git commit .;git push heroku master'
alias usbs='cd /Volumes/'
alias art='cd /Users/chris/Documents/Art'
alias datasets='cd /Users/chris/datasets'
alias npmgloballist='npm list -g --depth=0'

# folder locations
alias cfpaper='cd /Users/chris/cf_tracer'
alias down='cd /Users/chris/Downloads'
alias desk='cd /Users/chris/Desktop'
alias sap='cd /Users/chris/Documents/sap'
alias pic='cd /Users/chris/Pictures'
alias trans='ding'
alias lookup='grep -iR'
alias skimonitor='cd /Users/chris/personalwebsite/projects/skimonitor/skimonitor/webapp'
alias raphelper='cd /Users/chris/personalwebsite/projects/raphelper/raphelper/webapp'
alias ui5sdk='cd /Users/chris/Documents/OpenUI5/openui5-sdk-1.38.5'
alias play='cd /Users/chris/playground'

# Pi Logins - make sure to change IP when router IP changes!
alias pilocal='ssh pi@192.168.0.16'
alias pi='ssh pi@123.123.123.123 -p 22'
alias pidesk='ssh -XC pi@192.168.0.16 x2x -north -to :0.0'

# Linux Server Logins - make sure to change IP when router IP changes!
alias delllocal='ssh chris@192.168.0.20 -p 55555'
alias dell='ssh chris@123.123.123.123 -p 55555'

# Yoga Raiblocks
alias yoga='ssh chris@192.168.0.12 -p 44444'

# Devon's Server
alias stock='ssh devonsserverwhichiwontshowyouthenameorhost@host.com -p 24'

alias unlockiphone='sudo chmod 777 /var/lib/lockdown'

alias utorrent='utserver -settingspath /opt/utorrent-server-alpha-v3_3/'

alias vncconnect='ssh -L 5900:localhost:5900 pi@123.123.123.123 -p 1234'

function droiddev() {
    galaxy;
    react-native start;
    react-native run-android;
}

function vid2mp4() {
    ffmpeg -i $1 -vcodec mpeg4 $2
}

function video2x() {
    ffmpeg -i $1 -vcodec h264 -an -vf "fps=60, setpts=0.50*PTS" $2
}

# speed up input video by 4, export as 'outfast.ogv'
function video4x() {
    ffmpeg -i $1 -vcodec h264 -an -vf "fps=60, setpts=0.25*PTS" $2
}

function video10x() {
    ffmpeg -i $1 -vcodec h264 -an -vf "fps=60, setpts=0.1*PTS" $2
}

# put bdc data in correct format
function bdc() {
    awk '{for(i=1;i<=NF;i++)printf("\"%s\" ",$i);printf("\n");}' $1 > temp1; # wrap all words in double quotes
    cat temp1 | tr '"' "'" > temp2; # translate all double quotes to single quotes
    awk '{ if ($3 != "") print "PERFORM bdcdaten USING:\n\t" $3 " " $1 " " $2 ","; else print "\t\t" "\47 \47 " $0"," }' temp2 > temp3; # if there is no 3rd argument print PERFORM statement
    # cat temp3 | sed 's/ ,/,/' > bdcoutput.txt;
    # rm temp1;
    # rm temp2;
    # rm temp3;
    # echo "Done.";
}

# $2 and $3 MUST be in '01:00:00' format, $1 and $4 are file names
function splitvid() {
    ffmpeg -v quiet -y -i $1 -vcodec copy -acodec copy -ss $2 -t $3 -sn $4
}

function fm4() {
    if [ "$1" = "on" ]
        then
            ssh pi@192.168.0.16 'tmux; fm4; exit; exit'
    fi
    if [ "$1" = "off" ]
        then
            ssh pi@192.168.0.16 'tmux kill-session'
    fi
}

function lime() {
    subl $1 & #  '&' push everything to background
}

function mynetworks() {
    # first lists all networks, then grep sorts for just the id and psk stuff. finally sed puts a space between each set
    echo ' '
    sudo cat /etc/NetworkManager/system-connections/* | grep -Ew 'id|psk' | grep -v 'key' | sed '/psk/s/$/ \n/'
    echo ' '
    echo ' '
}

function fixjunkynetworking() {
    sudo modprobe -r rt2800pci
    sudo modprobe -v rt2800pci nohwcrypt=1
}

function pushall() {
    sudo git add .
    sudo git commit --all
    sudo git push --all
}

function showusb() {
    cd /media/chris/Banner
    show
}

# some git functinos because they're too damn long to remember
function gitchguser() {
    git config --global user.email $1
}

# personal improvement of this gist: https://gist.github.com/dergachev/4627207
function mov2gif() {
  width=$(mediainfo $1 | grep Width | tr ' Width:pixels' ' ' | sed 's/ //g') # get the height/width metadata, grep out the spaces and crap
  height=$(mediainfo $1 | grep Height | tr ' Height:pixels' ' ' | sed 's/ //g')
  dimensionString=$width # build a string to pass to the ffmpeg command
  dimensionString+="x"
  dimensionString+=$height
  echo "Dimension determined as:" $dimensionString # notify user of dimensions found
  ffmpeg -i -nostats -loglevel 0 $1 -s $dimensionString -pix_fmt rgb24 -r 10 -f gif - | gifsicle --optimize=3 --delay=3 > $1.gif # silent mode
  echo "Saved gif as: $1.gif" # saved gif name
}

#############################
### ENVIRONMENT VARIABLES ###
#############################

# keys for twitter access keys
export EGGHEAD_TWITTER_BOT_CONSUMER_KEY=lulz123456
export EGGHEAD_TWITTER_BOT_CONSUMER_SECRET=lulz123456
export EGGHEAD_TWITTER_BOT_CONSUMER_ACCESS_TOKEN=lulz123456
export EGGHEAD_TWITTER_BOT_CONSUMER_ACCESS_TOKEN_SECRET=lulz123456
export EGGHEAD_TWITTER_BOT_NASA_API_KEY=lulz123456

# google maps geocode API
export SKILLSCOUT_GOOGLE_GEOCODING_KEY=lulz123456

# skillscout private postgresql tunnel server (local)
export SERVER_HOST=lulz123456
export SERVER_PORT=lulz123456
export SERVER_DB_PORT=lulz123456
export SERVER_USER=lulz123456
export SERVER_PASSWORD=lulz123456

# skillscout private postgresql credentials
export PRIVATE_RAIBLOCKS_DB_NAME=lulz123456
export PRIVATE_RAIBLOCKS_DB_USER=lulz123456
export PRIVATE_RAIBLOCKS_DB_PASSWORD=lulz123456
export PRIVATE_RAIBLOCKS_DB_HOST=lulz123456
export PRIVATE_RAIBLOCKS_DB_PORT=lulz123456

# skillscout website heroku postgresql DB
export SKILLSCOUT_DB_HOST=lulz123456
export SKILLSCOUT_DB_NAME=lulz123456
export SKILLSCOUT_DB_USER=lulz123456
export SKILLSCOUT_DB_PORT=lulz123456
export SKILLSCOUT_DB_PASSWORD=lulz123456

# skillscout website mongo mLab DB
export SKILLSCOUT_MONGODB_USER=lulz123456
export SKILLSCOUT_MONGODB_PASSWORD=lulz123456
export SKILLSCOUT_MONGODB_HOST=lulz123456
export SKILLSCOUT_MONGODB_PORT=lulz123456
export SKILLSCOUT_MONGODB_DB_NAME=lulz123456

# skillscout campaign - emails DB (heroku postrgesql)
export SKILLSCOUT_CAMPAIGN_DB_HOST=lulz123456
export SKILLSCOUT_CAMPAIGN_DB_NAME=lulz123456
export SKILLSCOUT_CAMPAIGN_DB_USER=lulz123456
export SKILLSCOUT_CAMPAIGN_DB_PORT=lulz123456
export SKILLSCOUT_CAMPAIGN_DB_PASSWORD=lulz123456

# nlpchamps - postgresql database (just saving member's emails for now)
export NLP_CHAMPS_DB=lulz123456
export NLP_CHAMPS_DB_USER=lulz123456
export NLP_CHAMPS_DB_PASSWORD=lulz123456
export NLP_CHAMPS_DB_HOST=lulz123456
export NLP_CHAMPS_DB_PORT=lulz123456

# export colors for mac
export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced

# android paths
export ANDROID_HOME=/Users/$USER/Library/Android/sdk
export PATH=${PATH}:${ANDROID_HOME}/emulator
export PATH=${PATH}:${ANDROID_HOME}/tools

# default editor
export EDITOR=/usr/bin/nano

# fucking homebrew
export PATH=/usr/local/bin:/usr/local/sbin:~/bin:$PATH # for proper ipython linking
export PATH="/usr/local/opt/python/libexec/bin:$PATH" # for proper python exectuble

export COSMIC_BUCKET=lulz123456
export COSMIC_READ_KEY=lulz123456
export COSMIC_WRITE_KEY=lulz123456

# stripe payments key (TODO: copy to dell server!)
export STRIPE_SECRET_KEY=lulz123456
export STRIPE_PUBLISHABLE_KEY=lulz123456

# stripe payments test
export STRIPE_SECRET_KEY_TEST=lulz123456
export STRIPE_PUBLISHABLE_KEY_TEST=lulz123456

# raspberry pi password and user/host
export RASPBERRY_PI_SSH_PASSWORD=lulz123456
export RASPBERRY_PI_USER_AND_HOST=lulz123456

# npm packages
export PATH="$HOME/.npm-packages/bin:$PATH"

# google cloud platform
source '/Users/chris/opensource/google-cloud-sdk/completion.bash.inc'
source '/Users/chris/opensource/google-cloud-sdk/path.bash.inc'

# added by Anaconda2 5.0.1 installer
export PATH="/Users/chris/anaconda2/bin:$PATH"

export NVM_DIR="/Users/chris/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

# TORCH
export PATH=$PATH:/Users/chris/torch/install/bin
```

For those sharp eagle-eyed readers out there (actually, I now realize they are the very first aliases in my profile, you wouldn't have to be that 'sharp'! :joy:), you may have noticed I even have an alias for opening the bash profile itself (`prof`) and sourcing the profile (`s`) - this adds any of the changes you made in your bash profile - any new commands and whatnot - into the current terminal):

```bash
alias prof='atom /Users/chris/.bash_profile' # opens .bash_profile for editing
alias s='source /Users/chris/.bash_profile' # sources .bash_profile (should be done every time after changing profile)
```

So yes, you could say I modify and add stuff to my bash profile quite often - I recommend you do it too! Improve your workflow and ease of commanding a bash terminal!

-Cheers! :beer:

Chris
