import React from 'react'
import { Link } from 'gatsby'
import Helmet from 'react-helmet'
import axios from 'axios'
import { rhythm, scale } from '../../utils/typography'

class TalkShop extends React.Component {    
    render() {
      return (
        <div>
           <Helmet title="Hire Me" />
           <h1>Hire Me</h1>
           <p>
             If you've been poking around my blog or found me some other way and think that my skills and interests could be of use to you or your company, feel free to send me an offer on <a href="https://www.moonlightwork.com/app/users/5107">my moonlightwork.com profile</a>.
           </p>
           <p>
             While many recruiters are searching for traditional positions in the direction of SAP ABAP and SAPUI5, 
             <br/>
             <br/>
             <b>for the time being I am only considering remote positions and project offers!</b>
           </p>
           <p>
             If you're not sold yet, here is an exact copy of what is written on my profile there:
           </p>
           <br/>
           <p>
             "Hi everyone, I'm a full stack web developer who has built multiple applications with both real-time WebSocket and/or traditional REST API aspects. I like to use Nodejs, Reactjs, Socket.io, and Postgresql as my main stack tools, and Python for anything and everything else. I'm also experienced in writing automation based programs for things such as warehouse putaway and removal. I've also done some pet projects in machine learning and natural language processing, and native Mac / Windows, Android / iOS applications."
           </p>
           <br/>
           <p>
             If you just want to contact me directly with an idea or offer, send me an email at <a href="mailto:frewin.christopher@gmail.com">frewin.christopher@gmail.com</a> and let's see what we can do!
           </p>
        </div>
      );
    }
}

export default TalkShop