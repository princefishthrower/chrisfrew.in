import React from 'react'
import Helmet from 'react-helmet'
import axios from 'axios'
import { rhythm, scale } from '../../utils/typography'

class SECFilings extends React.Component {    
    constructor() {
      super();
      this.state = {
        aListItems: []
      };
    }
    render() {
      return (
        <div>
          <Helmet title="SEC Filings" />
          <h1>SEC Filings</h1>
          <p
            style={{
              ...scale(-1 / 5),
              display: 'block',
              marginBottom: rhythm(1),
              marginTop: rhythm(-1),
            }}
          >
            My Raspberry Pi is currently running and saving a list of various SEC filings from companies across the S&P500. Here's the list it's built so far:
          </p>
          <ul>
            {this.state.aListItems}
          </ul>
        </div>
      );
    }
    componentDidMount() {
      let that = this;
      axios.get('https://chrisfrew.in/sec-filings-api')
        .then(function (response) {
          let aItems = [];
          console.log(response);
          response.data.forEach((oItem, iIndex) => {
            aItems.push(<li>oItem</li>);
            if (iIndex === response.data.length) {
              that.setState({aListItems: aItems});
            }
          })
        })
        .catch(function (error) {
          that.setState({aListItems: [<li>Coming soon :)</li>]});
          console.log(error);
        });
    }
}

export default SECFilings