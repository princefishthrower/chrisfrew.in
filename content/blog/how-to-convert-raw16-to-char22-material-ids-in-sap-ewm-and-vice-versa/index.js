import Emoji from 'react-emoji-render';
import { rhythm } from '../../utils/typography'

// custom components
import CodeCopier from '../../components/CodeCopier';

const React = require('react');

const sCodeSnippet1 = `DATA: lv_matid_16 TYPE /SCWM/DE_MATID, " used in EWM monitor fields like 
lv_matid_22 TYPE /SAPAPO/MATID. " used in database table key field as in database table /SAPAPO/MARM

CALL FUNCTION '/SCMB/MDL_GUID_CONVERT'
  EXPORTING
    IV_GUID16       = lv_matid_16
  IMPORTING
    EV_GUID22       = lv_matid_22.`;
    
const sCodeSnippet2 = `CALL FUNCTION '/SCMB/MDL_GUID_CONVERT'
EXPORTING
  IV_GUID22       = lv_matid_22
IMPORTING
  EV_GUID16       = lv_matid_16.`;

class Post extends React.Component {
  render () {
    return (
      <div>
        <div
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: rhythm(24),
            padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
          }}
        >
          <h1>How to Convert RAW16 to CHAR22 Material IDs in SAP EWM (and vice-versa)</h1>
          <p className="jsPostsDate">09 September, 2018</p>
          <p>So, in SAP EWM, there are a few formats that material IDs, MATID are stored (similar to material numbers, MATNR, in ERP systems). Some of the two most popular formats are the <code>RAW16</code> format, as is used many EWM monitor functions usually, in the export structure that is often named simply <code>et_data</code>, for example in the EWM monitor function module <code>/SCWM/HUITM_OVERVIEW_MON</code>, of type <code>/scwm/tt_huitm_mon</code>, in which it's line type <code>/SCWM/S_HUITM_MON</code> uses the <code>RAW16</code> type <code>/SCWM/DE_MATID</code>. Then there is the larger <code>CHAR22</code> format, which is used as the type for the key field of MATID in the database table <code>/SAPAPO/MARM</code>.</p>

          <p>I'll admit, this is nearly a copy of the post by John Kristensen at <a href="https://sap.sd/matid">https://sap.sd/matid</a>, and I give him 99% of the credit, <em>however,</em> for your benefit, I've provided **complete copy-paste-able code examples** so you can see exactly how the function works:</p>
          
          <CodeCopier sLanguage='abap' sCode={sCodeSnippet1}/>

          <p>...and, the nice thing about this function is that it can do the conversion the other way around (note the change in the name of the input and output parameters):</p>

          <CodeCopier sLanguage='abap' sCode={sCodeSnippet2}/>

          <p>And that's it!</p>

          <p>I know in starting this blog I originally stated I would be adding a lot more about SAPUI5 and EWM and other neat ERP programs. While I <em>have</em> written some posts on ERP-sided programs, I've yet to touch SAPUI5 or EWM. I promise I'll get to it at some point!</p>

          <p>Cheers! <Emoji text=":beer:"/></p>

          <p>Chris</p>
        </div>
      </div>
    )
  }
}

// front matter, javascript style
export const frontmatter = {
  title: "How to Convert RAW16 to CHAR22 Material IDs in SAP EWM (and vice-versa)",
  description: "How to Convert RAW16 to CHAR22 Material IDs in SAP EWM (and vice-versa)",
  date: "2018-09-09",
  draft: false,
  starID: 26,
  postType: "dev"
}

export default Post;

