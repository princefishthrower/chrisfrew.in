(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{142:function(t,e,n){"use strict";n.r(e);n(77),n(76),n(34);var a=n(7),i=n.n(a),s=n(0),r=n.n(s),o=n(162),l=n.n(o),c=n(179),u=n.n(c),m=n(149),f=function(t){function e(){var e;return(e=t.call(this)||this).state={aListItems:[]},e}i()(e,t);var n=e.prototype;return n.render=function(){return r.a.createElement("div",null,r.a.createElement(l.a,{title:"SEC Filings"}),r.a.createElement("h1",null,"SEC Filings"),r.a.createElement("p",{style:Object.assign({},Object(m.b)(-.2),{display:"block",marginBottom:Object(m.a)(1),marginTop:Object(m.a)(-1)})},"My Raspberry Pi is currently running and saving a list of various SEC filings from companies across the S&P500. Here's the list it's built so far:"),r.a.createElement("ul",null,this.state.aListItems))},n.componentDidMount=function(){var t=this;u.a.get("https://chrisfrew.in/sec-filings-api").then(function(e){var n=[];console.log(e),e.data.forEach(function(a,i){n.push(r.a.createElement("li",null,"oItem")),i===e.data.length&&t.setState({aListItems:n})})}).catch(function(e){t.setState({aListItems:[r.a.createElement("li",null,"Coming soon :)")]}),console.log(e)})},e}(r.a.Component);e.default=f},149:function(t,e,n){"use strict";n.d(e,"a",function(){return l}),n.d(e,"b",function(){return c});var a=n(156),i=n.n(a),s=n(157),r=n.n(s);r.a.overrideThemeStyles=function(){return{"a.gatsby-resp-image-link":{boxShadow:"none"}}},delete r.a.googleFonts;var o=new i.a(r.a);var l=o.rhythm,c=o.scale}}]);
//# sourceMappingURL=component---src-pages-sec-filings-index-js-f4d0c70b69a01eebf9f4.js.map