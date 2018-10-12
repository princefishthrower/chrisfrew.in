import React from 'react'
import PropTypes from 'prop-types'

import { CopyToClipboard } from 'react-copy-to-clipboard';
import SyntaxHighlighter from "react-syntax-highlighter";
import { monokaiSublime } from 'react-syntax-highlighter/styles/hljs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let copySVG = require('../images/copy.svg');

// style so it matches the CSS styles for gatsby prism plugin (oCustomStyle is applied to the wrapping <pre> tag of each code peice)
const oCustomStyle = {
  'padding': '1em',
  'margin': '.5em 0',
  'overflow': 'auto',
  'borderRadius': '0.3em'
}

class CodeCopier extends React.Component {
  constructor() {
    super();
    this.state = {
      bCopied: false
    };
    this.notify = this.notify.bind(this);
  }
  notify() {
    toast.info("Code copied to clipboard!", {
      className: "custom-toast",
      position: toast.POSITION.BOTTOM_CENTER
    });
    
    
  }
  render () {  
    return (
      <div style={{'position': 'relative'}}>
        <SyntaxHighlighter language={this.props.sLanguage} style={monokaiSublime} customStyle={oCustomStyle}>
        {this.props.sCode}
        </SyntaxHighlighter>    
        <CopyToClipboard text={this.props.sCode}
          onCopy={this.notify}>
          <a className="copyButton">
            <span><img width="25px" style={{marginBottom: '0px'}} src={copySVG}/></span>
          </a>
        </CopyToClipboard>
        <ToastContainer autoClose={2000} hideProgressBar={true} pauseOnHover={false} closeButton={false}/>
      </div>
    );
  }
}

export default CodeCopier;