import React from 'react'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import axios from 'axios'
import { rhythm, scale } from '../../utils/typography'
import io from 'socket.io-client'; // client side of socket
const sAPI_URL = 'https://chrisfrew.in/market-news-feed-api'; // path for http communication to port 9002
//const sAPI_URL = 'https://chrisfrew.in/market-news-feed-ws'; // path for websocket communication to port 9002
const socket = io(sAPI_URL); 

class MarketNews extends React.Component {    
    constructor() {
      super();
      this.state = {
        aListItems: []
      };
      this.setupNotifications = this.setupNotifications.bind(this);
      this.setupSocketEvent = this.setupSocketEvent.bind(this);
    }
    setupNotifications() {
      // ask the user for permission
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    }
    setupSocketEvent() {
      socket.on('newNews', (oNewsItem) => {
        let aItems = this.state.aListItems;
        let oDate = new Date(oNewsItem.iUnixDateTime*1000);
        aItems.unshift(<li key={oNewsItem.sId} className="newNewsNotification"><a href={oNewsItem.sLink} target="_blank" className="newNewsNotification">{oDate.toLocaleString()}: {oNewsItem.sTitle}</a></li>);
        this.setState({aListItems: aItems});
        if (Notification.permission === "granted") {
          new Notification("Breaking news: \"" + oNewsItem.title + "\"");
        }
      });
    }
    render() {
      console.log("rendering!")
      return (
        <div>
          <Helmet title="Market News Feed" />
          <h1>Market News Feed</h1>
          <p
            style={{
              ...scale(-1 / 5),
              display: 'block',
              marginBottom: rhythm(1),
              marginTop: rhythm(-1),
            }}
          >
            A live stream of Finviz news, so you don't have to refresh. Notifications can be enabled.
          </p>
          <ul>
            {this.state.aListItems}
          </ul>
        </div>
      );
    }
    componentDidMount() {
      this.setupNotifications();
      this.setupSocketEvent();
      let that = this;
      axios.get(sAPI_URL)
        .then(function (response) {
          let aItems = [];
          let oDate;
          console.log("data:")
          response.data.forEach((oNewsItem, iIndex) => {
            oDate = new Date(oNewsItem.unix_time_released*1000);
            aItems.push(<li key={oNewsItem.id}><a href={oNewsItem.link} target="_blank">{oDate.toLocaleString()}: {oNewsItem.title}</a></li>);
            if (iIndex + 1 === response.data.length) {
              that.setState({aListItems: aItems});
            }
          });
        })
        .catch(function (error) {
          that.setState({aListItems: [<li>Coming soon :)</li>]});
          console.log(error);
        });
    }
}

export default MarketNews