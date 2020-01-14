import Emoji from 'react-emoji-render';
import { rhythm } from '../../utils/typography';
import { Link } from 'gatsby';

// custom components
import CodeCopier from '../../components/CodeCopier';

const React = require('react');

// define constanst code snippets
const sCodeSnippet1 = `" Ack! my eyes!
TYPES: BEGIN OF gty_zstructure,
  var1 type i,
  var2 type i,
  var3 type i,
  var4 type i,
  end of gty_zstructure.

DATA: gv_badcodevar1 TYPE i VALUE 10,
gv_badcodevar2 TYPE i VALUE 11,
gv_badcodevar3 TYPE i VALUE 12,
gv_badcodevar4 TYPE i VALUE 13,
gs_zstructure type gty_zstructure.

gs_zstructure-var1 = 96.
gs_zstructure-var2 = 97.
gs_zstructure-var3 = 98.
gs_zstructure-var4 = 99.`;

const sCodeSnippet2= `" Just to demonstrate the code sample, we'll use these variables which are all integer type with various values, but this process works for any variable type
DATA: gv_badcodevar1     TYPE i VALUE 10,
      gv_badcodevar2     TYPE i VALUE 11,
      gv_badcodevar3     TYPE i VALUE 12,
      gv_badcodevar4     TYPE i VALUE 13,
      gv_sy_index_string TYPE string,
      gv_variable_name   TYPE string.

FIELD-SYMBOLS: <fs_variable_value> TYPE any.

DO 4 TIMES. " (or however many times you need to build a string for such patterned variables)
  gv_sy_index_string = sy-index. " convert the sy-index to string type so we can use it in the CONCATENATE statement
  CONCATENATE 'GV_BADCODEVAR' gv_sy_index_string INTO gv_variable_name. " build variable name
  ASSIGN (gv_variable_name) TO <fs_variable_value>.  " the parenthesis, without any spaces from the variable, are required here otherwise this dynamic method wont work!!!!
  WRITE: / gv_variable_name, ' has a value of ', <fs_variable_value>. " should be 'GV_BADCODEVAR1 has a value of 10' and so on
ENDDO.`

const sCodeSnippet3 = `" Just to demonstrate the code sample, we'll use this simple structure variable (again, it will work with any structure types)
TYPES: BEGIN OF gty_zstructure,
         var1 TYPE i,
         var2 TYPE i,
         var3 TYPE i,
         var4 TYPE i,
       END OF gty_zstructure.

DATA:
  gs_zstructure      TYPE gty_zstructure,
  gv_sy_index_string TYPE string,
  gv_component_name  TYPE string.

gs_zstructure-var1 = 96.
gs_zstructure-var2 = 97.
gs_zstructure-var3 = 98.
gs_zstructure-var4 = 99.

FIELD-SYMBOLS: <fs_component_value> TYPE any.

DO 4 TIMES. " (or however many times you need to build a string for such patterned variables)
  gv_sy_index_string = sy-index. " convert the sy-index to string type so we can use it in the CONCATENATE statement
  CONCATENATE 'VAR' gv_sy_index_string INTO gv_component_name. " build variable name
  ASSIGN COMPONENT gv_component_name OF STRUCTURE gs_zstructure TO <fs_component_value>.
  WRITE: / 'Component ', gv_component_name, ' of structure gs_zstructure has a value of ', <fs_component_value>. " should be 'GV_BADCODEVAR1 has a value of 10' and so on
ENDDO.`

class Post extends React.Component {
  render () {
    return (
      <div className="postBackground">
        <div
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: rhythm(24),
            padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
          }}
        >
        <h3
          style={{
            fontFamily: 'Montserrat, sans-serif',
            marginTop: 0,
            marginBottom: rhythm(-1),
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'inherit',
            }}
            to={'/'}
          >
          <div>
            Chris'<br/>
            <span style={{color:'#F92672'}}>Full</span><br/>
            <span style={{color:'#66D9EF'}}>Stack</span><br/>
            <span style={{color:'#A6E22E'}}>Blog</span>.<br/>
            <br/>
          </div>
          </Link>
        </h3>
          <h1>Dynamically Assigning and Retrieving Variables- Both Named and Structured in SAP ABAP</h1>
          <p className="jsPostsDate">12 October, 2018</p>
          <p>So, let's say you've got some, uh, let's just say for now... <i>not perfectly written</i> ABAP code. Something that looks like this:</p>

          <CodeCopier sLanguage='abap' sCode={sCodeSnippet1}/>

          <br/>

          <p>Yep. Super repetitive variable names.</p>

          <p>We don't know why a developer wrote code like that, and we don't know why he or she wouldn't utilize a structure or table, but we don't really care. <Emoji text=":wink:"/></p>

          <p>Let's assume we've gotta make a modification to such a program and we need to loop through all those variables. Instead of otherwise copying a similiar pattern of all those variable names which would be horrible, we can apply dynamic variable assignment by building a string that is identical to the variables actual name in the ABAP source code, and reading that into a field symbol.</p>

          <p>Below are copy/pastable examples showing how to do this for both plain variables and components of a structure you may want to snag.</p>

          <h2>Dynamic Variable Assignment for Global Variables</h2>

          <CodeCopier sLanguage='abap' sCode={sCodeSnippet2}/>

          <h2>Dynamic Variable Assignment for Components of Line Structure Variables</h2>

          <CodeCopier sLanguage='abap' sCode={sCodeSnippet3}/>

          <p>And that's it!</p>

          <p>Cheers! <Emoji text=":beer:"/></p>

          <p>Chris</p>
        </div>
      </div>
    )
  }
}

// front matter, javascript style
export const frontmatter = {
  title: "Dynamically Assigning and Retrieving Variables- Both Named and Structured in SAP ABAP",
  description: "Dynamically Assigning and Retrieving Variables- Both Named and Structured in SAP ABAP",
  date: "2018-10-12",
  draft: false,
  starID: 28,
  postType: "dev"
}

export default Post;
