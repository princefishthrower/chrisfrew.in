(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{137:function(e,t,n){"use strict";n.r(t),n.d(t,"pageQuery",function(){return u});n(34);var a=n(0),r=n.n(a),o=n(156),i=n(153),l=n.n(i),c=n(193),s=n(146);t.default=function(e){var t=e.data,n=(e.location,e.pageContext),a=t.markdownRemark,i=a.frontmatter,u=a.html,p=n.next,d=n.prev,m=i.title,f=i.date,h=t.site.siteMetadata.title,b=a.excerpt;return r.a.createElement("div",null,r.a.createElement(l.a,{htmlAttributes:{lang:"en"},meta:[{name:"description",content:b}],title:i.title+" | "+h}),r.a.createElement("div",{style:{marginLeft:"auto",marginRight:"auto",maxWidth:Object(s.a)(24),padding:Object(s.a)(1.5)+" "+Object(s.a)(.75)}},r.a.createElement("h3",{style:{fontFamily:"Montserrat, sans-serif",marginTop:0,marginBottom:Object(s.a)(-1)}},r.a.createElement(o.Link,{style:{boxShadow:"none",textDecoration:"none",color:"inherit"},to:"/"},r.a.createElement("div",null,"Chris's ",r.a.createElement("span",{style:{color:"#F92672"}},"Full Stack"),", ",r.a.createElement("span",{style:{color:"#66D9EF"}},"Web Development"),", ",r.a.createElement("span",{style:{color:"#A6E22E"}},"ABAP"),", ",r.a.createElement("span",{style:{color:"#F92672"}},"SAPUI5"),", ",r.a.createElement("span",{style:{color:"#66D9EF"}},"Machine Learning"),",  & ",r.a.createElement("span",{style:{color:"#A6E22E"}},"Natural Language Processing")," ",r.a.createElement("span",{style:{color:"#F92672"}},"Blog"),".",r.a.createElement("br",null)))),r.a.createElement("h1",null,m),r.a.createElement("p",{style:Object.assign({},Object(s.b)(-.2),{display:"block",marginBottom:Object(s.a)(1),marginTop:Object(s.a)(-1)})},f),r.a.createElement("div",{dangerouslySetInnerHTML:{__html:u}}),r.a.createElement("hr",{style:{marginBottom:Object(s.a)(1)}}),r.a.createElement("p",null,d&&r.a.createElement(o.Link,{to:d.frontmatter.relativeLink},"Previous Post: ",d.frontmatter.title)),r.a.createElement("p",null,p&&r.a.createElement(o.Link,{to:p.frontmatter.relativeLink},"Next Post: ",p.frontmatter.title)),r.a.createElement("hr",{style:{marginBottom:Object(s.a)(1)}}),r.a.createElement(c.a,null)))};var u="2116053912"},146:function(e,t,n){"use strict";n.d(t,"a",function(){return c}),n.d(t,"b",function(){return s});var a=n(151),r=n.n(a),o=n(152),i=n.n(o);i.a.overrideThemeStyles=function(){return{"a.gatsby-resp-image-link":{boxShadow:"none"}}},delete i.a.googleFonts;var l=new r.a(i.a);var c=l.rhythm,s=l.scale},147:function(e,t,n){"use strict";var a=n(9);t.__esModule=!0,t.withPrefix=m,t.navigateTo=t.replace=t.push=t.navigate=t.default=void 0;var r=a(n(167)),o=a(n(168)),i=a(n(7)),l=a(n(48)),c=a(n(49)),s=a(n(4)),u=a(n(0)),p=n(16),d=n(156);function m(e){return function(e){return e.replace(/\/+/g,"/")}("/"+e)}var f={activeClassName:s.default.string,activeStyle:s.default.object},h=function(e){function t(t){var n;n=e.call(this)||this,(0,c.default)((0,l.default)((0,l.default)(n)),"defaultGetProps",function(e){return e.isCurrent?{className:[n.props.className,n.props.activeClassName].filter(Boolean).join(" "),style:(0,o.default)({},n.props.style,n.props.activeStyle)}:null});var a=!1;return"undefined"!=typeof window&&window.IntersectionObserver&&(a=!0),n.state={IOSupported:a},n.handleRef=n.handleRef.bind((0,l.default)((0,l.default)(n))),n}(0,i.default)(t,e);var n=t.prototype;return n.componentDidUpdate=function(e,t){this.props.to===e.to||this.state.IOSupported||___loader.enqueue((0,d.parsePath)(this.props.to).pathname)},n.componentDidMount=function(){this.state.IOSupported||___loader.enqueue((0,d.parsePath)(this.props.to).pathname)},n.handleRef=function(e){var t,n,a,r=this;this.props.innerRef&&this.props.innerRef(e),this.state.IOSupported&&e&&(t=e,n=function(){___loader.enqueue((0,d.parsePath)(r.props.to).pathname)},(a=new window.IntersectionObserver(function(e){e.forEach(function(e){t===e.target&&(e.isIntersecting||e.intersectionRatio>0)&&(a.unobserve(t),a.disconnect(),n())})})).observe(t))},n.render=function(){var e=this,t=this.props,n=t.to,a=t.getProps,i=void 0===a?this.defaultGetProps:a,l=t.onClick,c=t.onMouseEnter,s=(t.activeClassName,t.activeStyle,t.ref,t.innerRef,t.state),f=t.replace,h=(0,r.default)(t,["to","getProps","onClick","onMouseEnter","activeClassName","activeStyle","ref","innerRef","state","replace"]),b=m(n);return u.default.createElement(p.Link,(0,o.default)({to:b,state:s,getProps:i,innerRef:this.handleRef,onMouseEnter:function(e){c&&c(e),___loader.hovering((0,d.parsePath)(n).pathname)},onClick:function(t){return l&&l(t),0!==t.button||e.props.target||t.defaultPrevented||t.metaKey||t.altKey||t.ctrlKey||t.shiftKey||(t.preventDefault(),g(n,{state:s,replace:f})),!0}},h))},t}(u.default.Component);h.propTypes=(0,o.default)({},f,{innerRef:s.default.func,onClick:s.default.func,to:s.default.string.isRequired,replace:s.default.bool});var b=h;t.default=b;var g=function(e,t){window.___navigate(m(e),t)};t.navigate=g;var y=function(e){console.warn('The "push" method is now deprecated and will be removed in Gatsby v3. Please use "navigate" instead.'),window.___push(m(e))};t.push=y;t.replace=function(e){console.warn('The "replace" method is now deprecated and will be removed in Gatsby v3. Please use "navigate" instead.'),window.___replace(m(e))};t.navigateTo=function(e){return console.warn('The "navigateTo" method is now deprecated and will be removed in Gatsby v3. Please use "navigate" instead.'),y(e)}},156:function(e,t,n){"use strict";n.r(t),n.d(t,"graphql",function(){return f}),n.d(t,"StaticQueryContext",function(){return d}),n.d(t,"StaticQuery",function(){return m});var a=n(0),r=n.n(a),o=n(4),i=n.n(o),l=n(147),c=n.n(l);n.d(t,"Link",function(){return c.a}),n.d(t,"withPrefix",function(){return l.withPrefix}),n.d(t,"navigate",function(){return l.navigate}),n.d(t,"push",function(){return l.push}),n.d(t,"replace",function(){return l.replace}),n.d(t,"navigateTo",function(){return l.navigateTo});var s=n(157),u=n.n(s);n.d(t,"PageRenderer",function(){return u.a});var p=n(35);n.d(t,"parsePath",function(){return p.a});var d=r.a.createContext({}),m=function(e){return r.a.createElement(d.Consumer,null,function(t){return e.data||t[e.query]&&t[e.query].data?(e.render||e.children)(e.data?e.data.data:t[e.query].data):r.a.createElement("div",null,"Loading (StaticQuery)")})};function f(){throw new Error("It appears like Gatsby is misconfigured. Gatsby related `graphql` calls are supposed to only be evaluated at compile time, and then compiled away,. Unfortunately, something went wrong and the query was left in the compiled code.\n\n.Unless your site has a complex or custom babel/Gatsby configuration this is likely a bug in Gatsby.")}m.propTypes={data:i.a.object,query:i.a.string.isRequired,render:i.a.func,children:i.a.func}},157:function(e,t,n){var a;e.exports=(a=n(169))&&a.default||a},167:function(e,t){e.exports=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}},168:function(e,t){function n(){return e.exports=n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},n.apply(this,arguments)}e.exports=n},169:function(e,t,n){"use strict";n.r(t);n(34);var a=n(0),r=n.n(a),o=n(4),i=n.n(o),l=n(53),c=n(2),s=function(e){var t=e.location,n=c.default.getResourcesForPathnameSync(t.pathname);return r.a.createElement(l.a,Object.assign({location:t,pageResources:n},n.json))};s.propTypes={location:i.a.shape({pathname:i.a.string.isRequired}).isRequired},t.default=s},170:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a,r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=function(){function e(e,t){for(var n,a=0;a<t.length;a++)(n=t[a]).enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),i=n(0),l=(a=i)&&a.__esModule?a:{default:a};var c=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,i.Component),o(t,[{key:"canUseWebP",value:function(){var e="object"===("undefined"==typeof document?"undefined":r(document))?document.createElement("canvas"):{};return!(!e.getContext||!e.getContext("2d"))&&0===e.toDataURL("image/webp").indexOf("data:image/webp")}},{key:"render",value:function(){var e=this.props,t=e.src,n=e.webp,a=e.alt,r=e.title,o=e.style,i=e.className,c=t;return!0===this.canUseWebP()&&(c=n),l.default.createElement("img",{src:c,alt:a,title:r,style:o,className:i})}}]),t}();t.default=c},171:function(e,t,n){},172:function(e,t,n){},173:function(e,t,n){e.exports=n.p+"static/defaultprofilepicture-7973e7d356a529e889bf6e4314567747.webp"},174:function(e,t,n){e.exports=n.p+"static/defaultprofilepicture-2252194680d3fae4bbb0ad8018604ab6.png"},193:function(e,t,n){"use strict";var a=n(7),r=n.n(a),o=n(0),i=n.n(o),l=n(170),c=n.n(l),s=(n(171),n(172),n(146)),u=function(e){function t(){return e.apply(this,arguments)||this}return r()(t,e),t.prototype.render=function(){return i.a.createElement("div",{id:"mc_embed_signup"},i.a.createElement("form",{action:"https://chrisfrew.us19.list-manage.com/subscribe/post?u=5f7289fbe97df30f673068826&id=b1729bbdce",method:"post",id:"mc-embedded-subscribe-form",name:"mc-embedded-subscribe-form",className:"validate",target:"_blank",noValidate:!0},i.a.createElement("div",{id:"mc_embed_signup_scroll"},i.a.createElement("label",{htmlFor:"mce-EMAIL",style:{fontFamily:"Merriweather",fontWeight:"900"}},"Subscribe for weekly Wednesday updates on new posts (if any)!"),i.a.createElement("input",{type:"email",style:{fontFamily:"Merriweather",fontWeight:"900"},name:"EMAIL",className:"email",id:"mce-EMAIL",placeholder:"you_are@awesome.com",required:!0}),i.a.createElement("div",{style:{position:"absolute",left:"-5000px"},"aria-hidden":"true"},i.a.createElement("input",{type:"text",name:"b_5f7289fbe97df30f673068826_b1729bbdce",tabIndex:"-1"})),i.a.createElement("div",{className:"clear"},i.a.createElement("input",{type:"submit",style:{backgroundColor:"#F92672",fontFamily:"Merriweather",fontWeight:"900"},value:"Subscribe!",name:"subscribe",id:"mc-embedded-subscribe",className:"button"})))))},t}(i.a.Component),p=i.a.createElement(c.a,{webp:n(173),src:n(174),alt:"Chris Frewin",style:{marginRight:Object(s.a)(.5),marginBottom:0,width:Object(s.a)(8),height:Object(s.a)(8),borderRadius:"100%",zIndex:999}}),d=i.a.createElement("p",null,"Hi, I'm ",i.a.createElement("strong",null,"Chris Frewin"),", I run and post on"," ",i.a.createElement("a",{href:"https://nlp-champs.com",target:"_blank",rel:"noopener noreferrer"},"nlp-champs.com")," ","and own the ",i.a.createElement("a",{href:"https://medium.com/@sirenapparel/siren-apparel-all-about-us-43c99839de5d",target:"_blank",rel:"noopener noreferrer"},"charity clothing company")," ",i.a.createElement("a",{href:"https://sirenapparel.us",target:"_blank",rel:"noopener noreferrer"},"Siren Apparel"),".","\n","I'm an ex-mechanical engineer gone full-remote, full-stack application software engineer, and a hobbyist machine learning/natural language processing developer. If I'm not building software, I'll be found hiking, skiing, losing money trading options, or creating music and art. I (mostly) live in Austria."," ",i.a.createElement("a",{href:"https://twitter.com/galt_"},"You can follow me on Twitter, @Galt_,")," ","(though I don't post often), or,"," ",i.a.createElement("a",{href:"mailto:frewin.christopher@gmail.com"},"Send me an email."),i.a.createElement("br",null),i.a.createElement("br",null)," ","Got a project/job that needs doin'? ",i.a.createElement("a",{href:"https://chrisfrew.in/talk-shop",style:{color:"black",textDecorationColor:"black"}},i.a.createElement("span",{style:{color:"black"}},"Get in contact with me"))," and let's get to it! I'm always looking to learn and build new things!",i.a.createElement("br",null),i.a.createElement("br",null),"I'm a proud member of Dev.to, Product Hunt's Makers Community, and Egghead.io's Community!",i.a.createElement("br",null),i.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://dev.to/frewinchristopher",style:{textDecoration:"none"}},i.a.createElement("img",{src:"https://d2fltix0v2e0sb.cloudfront.net/dev-badge.svg",alt:"fullStackChris's DEV Profile",height:"30",width:"30"}))," ",i.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://producthunt.com/@galt_",style:{textDecoration:"none"}},i.a.createElement("svg",{width:"30",height:"30",viewBox:"0 0 40 40",xmlns:"http://www.w3.org/2000/svg"},i.a.createElement("g",{fill:"none",fillRule:"evenodd"},i.a.createElement("path",{d:"M40 20c0 11.046-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0s20 8.954 20 20",fill:"#DA552F"}),i.a.createElement("path",{d:"M22.667 20H17v-6h5.667a3 3 0 0 1 0 6m0-10H13v20h4v-6h5.667a7 7 0 1 0 0-14",fill:"#FFF"}))))," ",i.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://community.egghead.io/members/1420280"},i.a.createElement("img",{src:"https://egghead.io/favicon.ico?v=2",alt:"Egghead.io favicon",width:"30"}))),m=i.a.createElement("div",null,i.a.createElement("sub",null,"If email isn't your thing, no worries! You can subscribe to my RSS feed using:",i.a.createElement("br",null),i.a.createElement("br",null),i.a.createElement("b",null,"https://chrisfrew.in/rss.xml"))),f=function(e){function t(){var t;return(t=e.call(this)||this).state={oBio:null},t}r()(t,e);var n=t.prototype;return n.render=function(){return i.a.createElement("div",null,this.state.oBio)},n.componentDidMount=function(){var e;e=window.innerHeight>=768?i.a.createElement("div",null,i.a.createElement("div",{style:{display:"flex",marginBottom:Object(s.a)(2.5)}},p,d),i.a.createElement(u,null),m):i.a.createElement("div",null,i.a.createElement("div",{style:{display:"flex",marginBottom:Object(s.a)(2.5)}},p),i.a.createElement("div",{style:{display:"flex",marginBottom:Object(s.a)(2.5)}},d),i.a.createElement(u,null),m),this.setState({oBio:e})},t}(i.a.Component);t.a=f}}]);
//# sourceMappingURL=component---src-templates-blog-post-js-c78e770d2e3ae20710c2.js.map