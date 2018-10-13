webpackJsonp([23981824069220],{491:function(e,n){e.exports={data:{site:{siteMetadata:{title:"Gatsby Starter Blog",author:"Kyle Mathews"}},markdownRemark:{id:"/Users/chris/projects/chrisfrew.in/src/pages/sending-windows-commands-from-sap-abap/index.md absPath of file >>> MarkdownRemark",html:'<p>Alright, let’s do a bit of applied stuff today.</p>\n<h1>Backstory</h1>\n<p>For a long time, I had a ticket open for our IT team (I am likewise in the SAP team) for a automatic job that would restart a certain task on a windows server we had - for reasons we still don’t know yet, this particular service would state that it was running, when in fact the job it was supposed to be orchestrating was clearly not running.</p>\n<p>One lazy Friday when I didn’t have much to do, I was brainstorming if it was possible that maybe I could take this ticket into my own hands, writing something on our ABAP stack that could do the trick.</p>\n<h1>The Problem</h1>\n<p>I knew at least that I had to issue specific commands to the command line. That much I already knew how to do - I had used custom command services in SAP/ABAP with transaction SM69 before. The hard thing that I got stuck with: how could I, from our SAP application server, issue a specific command, to the Service Control Manager, to a specific service? Whew. Still with me? With help from one of our basic team members, we discovered that as it turns out, Windows has a very nice command for exactly that.</p>\n<p>It’s called <code>sc</code>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>C:\\>sc\nDESCRIPTION:\n        SC is a command line program used for communicating with the\n        Service Control Manager and services.\nUSAGE:\n        sc <server> [command] [service name] <option1> <option2>...\n\n\n        The option <server> has the form "\\\\ServerName"\n        Further help on commands can be obtained by typing: "sc [command]"\n        Commands:\n          query-----------Queries the status for a service, or enumerates the status for types of services.\n          queryex---------Queries the extended status for a service, or enumerates the status for types of services.\n          start-----------Starts a service.\n          pause-----------Sends a PAUSE control request to a service.\n          interrogate-----Sends an INTERROGATE control request to a service.\n          continue--------Sends a CONTINUE control request to a service.\n          stop------------Sends a STOP request to a service.\n          config----------Changes the configuration of a service (persistent).\n          description-----Changes the description of a service.\n          failure---------Changes the actions taken by a service upon failure.\n          failureflag-----Changes the failure actions flag of a service.\n          sidtype---------Changes the service SID type of a service.\n          privs-----------Changes the required privileges of a service.\n          managedaccount--Changes the service to mark the service account password as managed by LSA.\n          qc--------------Queries the configuration information for a service.\n          qdescription----Queries the description for a service.\n          qfailure--------Queries the actions taken by a service upon failure.\n          qfailureflag----Queries the failure actions flag of a service.\n          qsidtype--------Queries the service SID type of a service.\n          qprivs----------Queries the required privileges of a service.\n          qtriggerinfo----Queries the trigger parameters of a service.\n          qpreferrednode--Queries the preferred NUMA node of a service.\n          qrunlevel-------Queries the run level of a service.\n          qmanagedaccount-Queries whether a services uses an account with a password managed by LSA.\n          qprotection-----Queries the process protection level of a service.\n          delete----------Deletes a service (from the registry).\n          create----------Creates a service. (adds it to the registry).\n          control---------Sends a control to a service.\n          sdshow----------Displays a service\'s security descriptor.\n          sdset-----------Sets a service\'s security descriptor.\n          showsid---------Displays the service SID string corresponding to an arbitrary name.\n          triggerinfo-----Configures the trigger parameters of a service.\n          preferrednode---Sets the preferred NUMA node of a service.\n          runlevel--------Sets the run level of a service.\n          GetDisplayName--Gets the DisplayName for a service.\n          GetKeyName------Gets the ServiceKeyName for a service.\n          EnumDepend------Enumerates Service Dependencies.\n\n        The following commands don\'t require a service name:\n        sc <server> <command> <option>\n          boot------------(ok | bad) Indicates whether the last boot should be saved as the last-known-good boot configuration\n          Lock------------Locks the Service Database\n          QueryLock-------Queries the LockStatus for the SCManager Database\nEXAMPLE:\n        sc start MyService\n\nWould you like to see help for the QUERY and QUERYEX commands? [ y | n ]:</code></pre>\n      </div>\n<p>Wow. That’s a monster of a command documentation. Let’s break down what we need.</p>\n<ul>\n<li>The server name. We know that (for this example, I’m going to just call it AWESOMESERVER01). But wait! There’s a gotchya, we will need to write it like:</li>\n</ul>\n<p><code>\\\\AWESOMESERVER01</code></p>\n<p>That’s not a special setting for server names that we have at my company or anything like that, that’s part of the <code>sc</code> command. Notice the line in the documentation that says exactly that:</p>\n<blockquote>\n<blockquote>\n<p>The option <server> has the form ”\\\\ServerName”</p>\n</blockquote>\n</blockquote>\n<p>Okay, now for our service name. Again, for instruction purposes of the command and for privacy sake, I’m going to call our service <code>ServiceName even with Whitespace</code>.</p>\n<p>Okay, what do I need to send as a command? What command do we need? Let’s check out that wall of text documentation:</p>\n<blockquote>\n<blockquote>\n<p>stop------------Sends a STOP request to a service.</p>\n</blockquote>\n</blockquote>\n<p>Yep, that sounds about as right as you can get. Oh also, hold your thoughts on this one:</p>\n<blockquote>\n<blockquote>\n<p>Commands:\n…\nstart-----------Starts a service.</p>\n</blockquote>\n</blockquote>\n<p>That will be useful later, too.</p>\n<p>Alright… Server name? Check. Service Name? Check. Command name(s)? Check. So, what do we get as a command for our efforts? It looks like this:</p>\n<p><code>sc \\\\AWESOMESERVER01 start "ServiceName even with Whitespace"</code></p>\n<p>In order for this to be a true <em>restart</em> of the service, we would have to issue a stop/start command pair on the service:</p>\n<p><code>sc \\\\AWESOMESERVER01 stop "ServiceName even with Whitespace"</code><br>\n<code>sc \\\\AWESOMESERVER01 start "ServiceName even with Whitespace"</code></p>\n<p>How do we do that in ABAP? Well, to run SM69 commands programmatically, we have the tasty function module <code>SXPG_COMMAND_EXECUTE</code>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-abap"><code><span class="token keyword">CALL</span> <span class="token keyword">FUNCTION</span> <span class="token string">\'SXPG_COMMAND_EXECUTE\'</span>\n  <span class="token keyword">EXPORTING</span>\n    commandname                   <span class="token operator">=</span> gv_commandname\n    additional_parameters         <span class="token operator">=</span> gv_additional_parameters\n    operatingsystem               <span class="token operator">=</span> gv_operatingsystem\n  <span class="token keyword">TABLES</span>\n    exec_protocol                 <span class="token operator">=</span> gt_result\n  <span class="token keyword">EXCEPTIONS</span>\n    no_permission                 <span class="token operator">=</span> <span class="token number">1</span>\n    command_not_found             <span class="token operator">=</span> <span class="token number">2</span>\n    parameters_too_long           <span class="token operator">=</span> <span class="token number">3</span>\n    security_risk                 <span class="token operator">=</span> <span class="token number">4</span>\n    wrong_check_call_interface    <span class="token operator">=</span> <span class="token number">5</span>\n    program_start_error           <span class="token operator">=</span> <span class="token number">6</span>\n    program_termination_error     <span class="token operator">=</span> <span class="token number">7</span>\n    x_error                       <span class="token operator">=</span> <span class="token number">8</span>\n    parameter_expected            <span class="token operator">=</span> <span class="token number">9</span>\n    too_many_parameters           <span class="token operator">=</span> <span class="token number">10</span>\n    illegal_command               <span class="token operator">=</span> <span class="token number">11</span>\n    wrong_asynchronous_parameters <span class="token operator">=</span> <span class="token number">12</span>\n    cant_enq_tbtco_entry          <span class="token operator">=</span> <span class="token number">13</span>\n    jobcount_generation_error     <span class="token operator">=</span> <span class="token number">14</span>\n    <span class="token keyword">OTHERS</span>                        <span class="token operator">=</span> <span class="token number">15</span><span class="token punctuation">.</span>\n</code></pre>\n      </div>\n<p>I’ll just say I maintained the two commands in SM69 as <code>Z_MY_SUPER_AWESOME_COMMAND_START</code> and <code>Z_MY_SUPER_AWESOME_COMMAND_STOP</code>.</p>\n<p>So, all that’s left is to check if the service is not responding, and if it is not, call the command pair with function module <code>SXPG_COMMAND_EXECUTE</code>, check <code>sy-subrc</code>, and we are done! The total code looks like this:</p>\n<div class="gatsby-highlight">\n      <pre class="language-abap"><code>ABAP <span class="token keyword">Code</span> coming soon 😄\n</code></pre>\n      </div>\n<p>We set this report up as a batch job to run every 5 minutes, and the ticket was resolved 😄</p>\n<h1>Review</h1>\n<p>As a review, we determined the specific commands needed to be sent to the windows Service Control Manager, maintained the needed commands in transaction SM69, and wrote a report that we ran as a batch job!</p>\n<h1>Notes and Comments</h1>\n<p>I hope everyone enjoyed this post and learned a thing or two. I’m going to be posting a lot more ABAP as well as SAPUI5 content in the coming months. I’ve found that the learning curve for SAPUI5 is a lot higher than other frontend frameworks like React, Vue, or Cycle. I’ve done specialized projects with SAPUI5 is both the EWM and PP modules - There is A LOT of really cool stuff you can do, (especially in EWM) with websockets, statistics, and SAPUI5. The bottom line is, I’ve got some great content in the coming months for everyone!</p>\n<p>Cheers everyone! 🍺</p>\n<p><em>Intellectual property/privacy disclaimer: the exact source code and use case have been modified from the real use case at the company I work for, <a href="https://www.ospelt.com/en/ospelt/info/home.html">Ospelt</a>.</em></p>',frontmatter:{title:"Sending Windows Server Commands From SAP ABAP",date:"December 13, 2017",draft:null}}},pathContext:{slug:"/sending-windows-commands-from-sap-abap/"}}}});
//# sourceMappingURL=path---sending-windows-commands-from-sap-abap-ebc7b14a49394db262dc.js.map