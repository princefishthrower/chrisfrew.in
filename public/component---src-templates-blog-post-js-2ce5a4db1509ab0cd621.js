(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{145:function(e,t,a){"use strict";a.r(t);a(34);var n,r=a(0),l=a.n(r),o=a(152),i=a(157),s=a.n(i),c=a(195),u=a(148),m=(a(154),a(7)),d=a.n(m),p=a(48),f=a.n(p),h=a(177);try{n=a(264)}catch(e){console.log(e)}var b="gold",g="transparent",E=function(e){function t(t){var a;return(a=e.call(this,t)||this).state={sClassName:"star",sOutlineFill:b,sBodyFill:g,sBodyStroke:b,iLocalCount:0,iGlobalCount:0},a.getFavoriteInfo=a.getFavoriteInfo.bind(f()(f()(a))),a.onClickStar=a.onClickStar.bind(f()(f()(a))),a.onMouseOverStar=a.onMouseOverStar.bind(f()(f()(a))),a.onMouseOutStar=a.onMouseOutStar.bind(f()(f()(a))),a.onMouseDownStar=a.onMouseDownStar.bind(f()(f()(a))),a.onMouseUpStar=a.onMouseUpStar.bind(f()(f()(a))),a.getFavoriteInfo(),a}d()(t,e);var a=t.prototype;return a.getFavoriteInfo=function(){var e=this;console.log(this.props.starID),console.log(this.props.starID),h.post("https://chrisfrew.in/star-info",{starID:this.props.starID}).then(function(t){console.log(t.data),t.data.bIsFavorite?e.setState({sClassName:"star star-favorited",sOutlineFill:"#fff099",sBodyFill:"#fff099",sBodyStroke:"#fff099",iLocalCount:parseInt(t.data.iLocalCount,0),iGlobalCount:parseInt(t.data.iGlobalCount,0)}):e.setState({sClassName:"star",sOutlineFill:b,sBodyFill:g,sBodyStroke:b,iLocalCount:0,iGlobalCount:parseInt(t.data.iGlobalCount,0)})}).catch(function(e){})},a.onClickStar=function(){var e=this;console.log(this.state.iLocalCount);var t=this.state.iLocalCount+1,a=this.state.iGlobalCount+1;console.log(this.state.sOutlineFill),t<=50&&(console.log("adding to favorite count and adding favorite styles..."),h.post("https://chrisfrew.in/star-add",{starID:this.props.starID}).then(function(n){n.data.bSuccessful&&(e.setState({sClassName:"star star-favorited",sOutlineFill:"#fff099",sBodyFill:"#fff099",sBodyStroke:"#fff099",iGlobalCount:a}),e._animationTimeline.replay(),e.setState({iLocalCount:t,iGlobalCount:a}))}))},a.onMouseOverStar=function(){"#fff099"!==this.state.sBodyFill&&this.setState({sBodyFill:b})},a.onMouseOutStar=function(){"#fff099"!==this.state.sBodyFill&&this.setState({sBodyFill:g})},a.onMouseDownStar=function(){},a.onMouseUpStar=function(){},a.componentDidMount=function(){if(n){var e=new n.Burst({parent:"#star",radius:{50:95},count:5,angle:30,children:{shape:"polygon",radius:{6:0},scale:1,stroke:"gold",strokeWidth:2,angle:210,delay:30,speed:.2,easing:n.easing.bezier(.1,1,.3,1),duration:300}}),t=new n.Burst({parent:"#star",radius:{50:75},angle:25,duration:300,children:{shape:"circle",fill:"gold",delay:30,speed:.2,radius:{3:0},easing:n.easing.bezier(.1,1,.3,1)}}),a=new n.Html({el:"#star--count",isShowStart:!1,isShowEnd:!0,y:{0:-30},opacity:{0:1},duration:300}).then({opacity:{1:0},y:-80,delay:150}),r=new n.Html({el:"#star--count-total",isShowStart:!1,isShowEnd:!0,opacity:{0:1},delay:450,duration:300,y:{0:-3}}),l=new n.Html({el:"#star",duration:300,scale:{1.3:1},easing:n.easing.out});document.getElementById("star").style.transform="scale(1, 1)",this._animationTimeline=new n.Timeline,this._animationTimeline.add([a,r,l,t,e])}},a.render=function(){var e=this.state,t=e.sOutlineFill,a=e.sBodyFill,n=e.sBodyStroke,r=e.iGlobalCount,o=e.sClassName,i=e.iLocalCount;return l.a.createElement("div",{onMouseOut:this.onMouseOutStar},l.a.createElement("div",{style:Object.assign({},Object(u.b)(-.2),{display:"inline-block",float:"left",marginBottom:Object(u.a)(-.75),marginLeft:Object(u.a)(.5),width:Object(u.a)(2)})},l.a.createElement("div",{id:"star",onClick:this.onClickStar,onMouseOver:this.onMouseOverStar,onMouseDown:this.onMouseDownStar,onMouseOut:this.onMouseOutStar},l.a.createElement("svg",{className:o,xmlns:"http://www.w3.org/2000/svg",version:"1",viewBox:"0 -256 1792 1792"},l.a.createElement("path",{fill:t,d:"M1198 799l306-297-422-62L893 58 704 440l-422 62 306 297-73 421 378-199 377 199zm527-357q0 22-26 48l-363 354 86 500 1 20q0 50-41 50-19 0-40-12l-449-236-449 236q-22 12-40 12-21 0-32-15-10-14-10-35l2-20 86-500L86 490q-25-27-25-48 0-37 56-46l502-73 225-455q19-41 49-41t49 41l225 455 502 73q56 9 56 46z"}),l.a.createElement("path",{fill:a,stroke:n,strokeWidth:"49",strokeLinecap:"round",strokeLinejoin:"round",d:"M522 1204l35-206 34-198-151-148-152-148 210-31 210-30 92-189 92-190 95 189 95 190 207 30 208 30-151 148-151 147 33 195 36 209c3 11-12 6-74-28l-189-99-110-57-107 57c-220 117-262 137-262 129z"})),l.a.createElement("span",{id:"star--count",className:"star--count"},l.a.createElement("span",null,"  "),"+",i),l.a.createElement("span",{id:"star--count-total",className:"star--count-total"},i))),l.a.createElement("div",{style:Object.assign({},Object(u.b)(-.2),{display:"inline-block",marginTop:Object(u.a)(.5),marginLeft:Object(u.a)(.5),float:"left"})},l.a.createElement("span",null,r)),l.a.createElement("br",null),l.a.createElement("br",null),l.a.createElement("span",{className:"starsInfoText"},"Give me some gold stars if you like this post - max 50 :)"),l.a.createElement("br",null),l.a.createElement("span",{className:"starsInfoText"},"Stolen from Medium? Nooooooo :)"))},t}(l.a.Component);a.d(t,"pageQuery",function(){return y});t.default=function(e){var t=e.data,a=(e.location,e.pageContext),n=t.markdownRemark,r=n.frontmatter,i=n.html,m=a.next,d=a.prev,p=r.title,f=r.date,h=r.starID,b=r.postType,g=t.site.siteMetadata.title,y=n.excerpt,v="https://chrisfrew.in?post-type="+b,w="Go to all posts with the #"+b+" tag";return l.a.createElement("div",{className:"postBackground"},l.a.createElement(s.a,{htmlAttributes:{lang:"en"},meta:[{name:"description",content:y}],title:r.title+" | "+g}),l.a.createElement("div",{style:{marginLeft:"auto",marginRight:"auto",maxWidth:Object(u.a)(24),padding:Object(u.a)(1.5)+" "+Object(u.a)(.75)}},l.a.createElement("h3",{style:{fontFamily:"Montserrat, sans-serif",marginTop:0,marginBottom:Object(u.a)(-1)}},l.a.createElement(o.Link,{style:{boxShadow:"none",textDecoration:"none",color:"inherit"},to:"/"},l.a.createElement("div",null,"Chris'",l.a.createElement("br",null),l.a.createElement("span",{style:{color:"#F92672"}},"Full"),l.a.createElement("br",null),l.a.createElement("span",{style:{color:"#66D9EF"}},"Stack"),l.a.createElement("br",null),l.a.createElement("span",{style:{color:"#A6E22E"}},"Blog"),".",l.a.createElement("br",null),l.a.createElement("br",null)))),l.a.createElement("br",null),l.a.createElement(E,{starID:h}),l.a.createElement("br",null),l.a.createElement("h1",null,p),l.a.createElement("p",{style:Object.assign({},Object(u.b)(-.2),{display:"block",marginBottom:Object(u.a)(1),marginTop:Object(u.a)(-1)})},f),l.a.createElement("p",{style:Object.assign({},Object(u.b)(-.2),{display:"block",marginBottom:Object(u.a)(1),marginTop:Object(u.a)(-1)})},l.a.createElement("a",{href:v,ariaLabel:w,title:w},"#",b)),l.a.createElement("div",{dangerouslySetInnerHTML:{__html:i}}),l.a.createElement("hr",{style:{marginBottom:Object(u.a)(1)}}),l.a.createElement("p",null,d&&l.a.createElement(o.Link,{to:d.frontmatter.relativeLink},"Previous Post: ",d.frontmatter.title)),l.a.createElement("p",null,m&&l.a.createElement(o.Link,{to:m.frontmatter.relativeLink},"Next Post: ",m.frontmatter.title)),l.a.createElement("hr",{style:{marginBottom:Object(u.a)(1)}}),l.a.createElement(c.a,null)))};var y="3094877708"},148:function(e,t,a){"use strict";a.d(t,"a",function(){return s}),a.d(t,"b",function(){return c});var n=a(155),r=a.n(n),l=a(156),o=a.n(l);o.a.overrideThemeStyles=function(){return{"a.gatsby-resp-image-link":{boxShadow:"none"}}},delete o.a.googleFonts;var i=new r.a(o.a);var s=i.rhythm,c=i.scale},152:function(e,t,a){"use strict";a.r(t),a.d(t,"graphql",function(){return f}),a.d(t,"StaticQueryContext",function(){return d}),a.d(t,"StaticQuery",function(){return p});var n=a(0),r=a.n(n),l=a(4),o=a.n(l),i=a(147),s=a.n(i);a.d(t,"Link",function(){return s.a}),a.d(t,"withPrefix",function(){return i.withPrefix}),a.d(t,"navigate",function(){return i.navigate}),a.d(t,"push",function(){return i.push}),a.d(t,"replace",function(){return i.replace}),a.d(t,"navigateTo",function(){return i.navigateTo});var c=a(153),u=a.n(c);a.d(t,"PageRenderer",function(){return u.a});var m=a(35);a.d(t,"parsePath",function(){return m.a});var d=r.a.createContext({}),p=function(e){return r.a.createElement(d.Consumer,null,function(t){return e.data||t[e.query]&&t[e.query].data?(e.render||e.children)(e.data?e.data.data:t[e.query].data):r.a.createElement("div",null,"Loading (StaticQuery)")})};function f(){throw new Error("It appears like Gatsby is misconfigured. Gatsby related `graphql` calls are supposed to only be evaluated at compile time, and then compiled away,. Unfortunately, something went wrong and the query was left in the compiled code.\n\n.Unless your site has a complex or custom babel/Gatsby configuration this is likely a bug in Gatsby.")}p.propTypes={data:o.a.object,query:o.a.string.isRequired,render:o.a.func,children:o.a.func}},153:function(e,t,a){var n;e.exports=(n=a(162))&&n.default||n},162:function(e,t,a){"use strict";a.r(t);a(34);var n=a(0),r=a.n(n),l=a(4),o=a.n(l),i=a(50),s=a(2),c=function(e){var t=e.location,a=s.default.getResourcesForPathnameSync(t.pathname);return r.a.createElement(i.a,Object.assign({location:t,pageResources:a},a.json))};c.propTypes={location:o.a.shape({pathname:o.a.string.isRequired}).isRequired},t.default=c},175:function(e,t,a){e.exports=a.p+"static/defaultprofilepicture-7973e7d356a529e889bf6e4314567747.webp"},176:function(e,t,a){e.exports=a.p+"static/defaultprofilepicture-2252194680d3fae4bbb0ad8018604ab6.png"},195:function(e,t,a){"use strict";var n=a(7),r=a.n(n),l=a(0),o=a.n(l),i=a(172),s=a.n(i),c=(a(173),a(174),a(148)),u=function(e){function t(){return e.apply(this,arguments)||this}return r()(t,e),t.prototype.render=function(){return o.a.createElement("div",{id:"mc_embed_signup"},o.a.createElement("form",{action:"https://chrisfrew.us19.list-manage.com/subscribe/post?u=5f7289fbe97df30f673068826&id=b1729bbdce",method:"post",id:"mc-embedded-subscribe-form",name:"mc-embedded-subscribe-form",className:"validate",target:"_blank",noValidate:!0},o.a.createElement("div",{id:"mc_embed_signup_scroll"},o.a.createElement("label",{htmlFor:"mce-EMAIL",style:{fontFamily:"Merriweather",fontWeight:"900"}},"Subscribe for weekly Wednesday updates on new posts (if any)!"),o.a.createElement("input",{type:"email",style:{fontFamily:"Merriweather",fontWeight:"900"},name:"EMAIL",className:"email",id:"mce-EMAIL",placeholder:"you_are@awesome.com",required:!0}),o.a.createElement("div",{style:{position:"absolute",left:"-5000px"},"aria-hidden":"true"},o.a.createElement("input",{type:"text",name:"b_5f7289fbe97df30f673068826_b1729bbdce",tabIndex:"-1"})),o.a.createElement("div",{className:"clear"},o.a.createElement("input",{type:"submit",style:{backgroundColor:"#F92672",fontFamily:"Merriweather",fontWeight:"900"},value:"Subscribe!",name:"subscribe",id:"mc-embedded-subscribe",className:"button"})))))},t}(o.a.Component),m=o.a.createElement(s.a,{webp:a(175),src:a(176),alt:"Chris Frewin",style:{marginRight:Object(c.a)(.5),marginBottom:0,width:Object(c.a)(8),height:Object(c.a)(8),borderRadius:"100%",zIndex:999}}),d=o.a.createElement("p",null,"Hi, I'm ",o.a.createElement("strong",null,"Chris Frewin"),", I run and post on"," ",o.a.createElement("a",{href:"https://nlp-champs.com",target:"_blank",rel:"noopener noreferrer"},"nlp-champs.com")," ","and own the ",o.a.createElement("a",{href:"https://medium.com/@sirenapparel/siren-apparel-all-about-us-43c99839de5d",target:"_blank",rel:"noopener noreferrer"},"charity clothing")," company"," ",o.a.createElement("a",{href:"https://sirenapparel.us",target:"_blank",rel:"noopener noreferrer"},"Siren Apparel"),".","\n","I'm an ex-mechanical engineer gone full-remote, full-stack application software engineer, and a hobbyist machine learning/natural language processing developer. If I'm not building software, I'll be found hiking, skiing, losing money trading options, or creating music and art. I (mostly) live in Austria."," ",o.a.createElement("a",{href:"https://twitter.com/galt_"},"You can follow me on Twitter, @Galt_,")," ","(though I don't post often), or,"," ",o.a.createElement("a",{href:"mailto:frewin.christopher@gmail.com"},"Send me an email."),o.a.createElement("br",null),o.a.createElement("br",null)," ","Got a project/job that needs doin'? ",o.a.createElement("a",{href:"https://chrisfrew.in/talk-shop"},"Get in contact with me")," and let's get to it! I'm always looking to learn and build new things!",o.a.createElement("br",null),o.a.createElement("br",null),"I'm a proud member of ",o.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://dev.to/frewinchristopher"},"DEV Community"),", ",o.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://producthunt.com/@galt_"},"Product Hunt's Makers Community"),", and ",o.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://community.egghead.io/members/1420280"},"Egghead.io's Community"),"!",o.a.createElement("br",null),o.a.createElement("br",null),o.a.createElement("span",null,"Sites I've Built:"),o.a.createElement("br",null),o.a.createElement("a",{href:"https://sirenapparel.us",target:"_blank",rel:"noopener noreferrer"},"sirenapparel.us"),o.a.createElement("br",null),o.a.createElement("a",{href:"https://sirenapparel.eu",target:"_blank",rel:"noopener noreferrer"},"sirenapparel.eu"),o.a.createElement("br",null),o.a.createElement("a",{href:"https://nlp-champs.com",target:"_blank",rel:"noopener noreferrer"},"nlp-champs.com"),o.a.createElement("br",null),o.a.createElement("a",{href:"https://how-do-i.app",target:"_blank",rel:"noopener noreferrer"},"how-do-i.app"),o.a.createElement("br",null),o.a.createElement("a",{href:"https://seelengeflüster-tirol.com",target:"_blank",rel:"noopener noreferrer"},"seelengeflüster-tirol.com"),o.a.createElement("br",null),o.a.createElement("a",{href:"https://wallstreetbetswally.github.io/",target:"_blank",rel:"noopener noreferrer"},"wallstreetbetswally.github.io"),o.a.createElement("br",null),o.a.createElement("br",null),"(Probably more fun to see through my ",o.a.createElement("a",{href:"https://chrisfrew.in/portfolio",target:"_blank",rel:"noopener noreferrer"},"portfolio page"),")",o.a.createElement("br",null)),p=o.a.createElement("div",null,o.a.createElement("sub",null,"If email isn't your thing, no worries! You can subscribe to my RSS feed using:",o.a.createElement("br",null),o.a.createElement("br",null),o.a.createElement("b",null,"https://chrisfrew.in/rss.xml"))),f=function(e){function t(){var t;return(t=e.call(this)||this).state={oBio:null},t}r()(t,e);var a=t.prototype;return a.render=function(){return o.a.createElement("div",null,this.state.oBio)},a.componentDidMount=function(){var e;e=window.innerHeight>=768?o.a.createElement("div",null,o.a.createElement("div",{style:{display:"flex",marginBottom:Object(c.a)(2.5)}},m,d),o.a.createElement(u,null),p):o.a.createElement("div",null,o.a.createElement("div",{style:{display:"flex",marginBottom:Object(c.a)(2.5)}},m),o.a.createElement("div",{style:{display:"flex",marginBottom:Object(c.a)(2.5)}},d),o.a.createElement(u,null),p),this.setState({oBio:e})},t}(o.a.Component);t.a=f}}]);
//# sourceMappingURL=component---src-templates-blog-post-js-2ce5a4db1509ab0cd621.js.map