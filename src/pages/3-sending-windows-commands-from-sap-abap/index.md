---
title: Sending Windows Server Commands From SAP ABAP
date: "2017-12-12"
---

Alright, let's do a bit of applied stuff today.

# Backstory

For a long time, I had a ticket open for our IT for a automatic job that would restart a certain task on a windows server we had - for reasons we still don't know yet, this particular service would state that it was running, when in fact the job it was supposed to be orchestrating was clearly not running.

One lazy Friday when I didn't have much to do, I was brainstorming if it was possible that maybe I could take this ticket into my own hands, writing something on our ABAP stack that could do the trick.

# The Problem

I needed to issue . That much I knew how to do - I had used custom command services with transaction SM69 before. The hard thing that I got stuck with: how could I, from our SAP application server, issue a specific command, on a specific server, to a specific service? Whew. Still with me? With help from one of our basic team members, we discovered that as it turns out, windows has a very nice command for exactly that.

It's called `sc`:

```
C:\>sc
DESCRIPTION:
        SC is a command line program used for communicating with the
        Service Control Manager and services.
USAGE:
        sc <server> [command] [service name] <option1> <option2>...


        The option <server> has the form "\\ServerName"
        Further help on commands can be obtained by typing: "sc [command]"
        Commands:
          query-----------Queries the status for a service, or enumerates the status for types of services.
          queryex---------Queries the extended status for a service, or enumerates the status for types of services.
          start-----------Starts a service.
          pause-----------Sends a PAUSE control request to a service.
          interrogate-----Sends an INTERROGATE control request to a service.
          continue--------Sends a CONTINUE control request to a service.
          stop------------Sends a STOP request to a service.
          config----------Changes the configuration of a service (persistent).
          description-----Changes the description of a service.
          failure---------Changes the actions taken by a service upon failure.
          failureflag-----Changes the failure actions flag of a service.
          sidtype---------Changes the service SID type of a service.
          privs-----------Changes the required privileges of a service.
          managedaccount--Changes the service to mark the service account password as managed by LSA.
          qc--------------Queries the configuration information for a service.
          qdescription----Queries the description for a service.
          qfailure--------Queries the actions taken by a service upon failure.
          qfailureflag----Queries the failure actions flag of a service.
          qsidtype--------Queries the service SID type of a service.
          qprivs----------Queries the required privileges of a service.
          qtriggerinfo----Queries the trigger parameters of a service.
          qpreferrednode--Queries the preferred NUMA node of a service.
          qrunlevel-------Queries the run level of a service.
          qmanagedaccount-Queries whether a services uses an account with a password managed by LSA.
          qprotection-----Queries the process protection level of a service.
          delete----------Deletes a service (from the registry).
          create----------Creates a service. (adds it to the registry).
          control---------Sends a control to a service.
          sdshow----------Displays a service's security descriptor.
          sdset-----------Sets a service's security descriptor.
          showsid---------Displays the service SID string corresponding to an arbitrary name.
          triggerinfo-----Configures the trigger parameters of a service.
          preferrednode---Sets the preferred NUMA node of a service.
          runlevel--------Sets the run level of a service.
          GetDisplayName--Gets the DisplayName for a service.
          GetKeyName------Gets the ServiceKeyName for a service.
          EnumDepend------Enumerates Service Dependencies.

        The following commands don't require a service name:
        sc <server> <command> <option>
          boot------------(ok | bad) Indicates whether the last boot should be saved as the last-known-good boot configuration
          Lock------------Locks the Service Database
          QueryLock-------Queries the LockStatus for the SCManager Database
EXAMPLE:
        sc start MyService

Would you like to see help for the QUERY and QUERYEX commands? [ y | n ]:
```

Wow. That's a monster of a command documentation. Let's break down what we need.

- The server. We know that (for this example, I'm going to just call it AWESOMESERVER01). But wait! There's a gotchya, we will need to write it like:

`\\AWESOMESERVER01`

That's not a special setting for server names that we have at my company or anything like that, that's part of the `sc` command. Notice the line in the documentation that says exactly that:

> > The option <server> has the form "\\\\ServerName"

Okay, now for our service name. Again, for instruction purposes of the command and for privacy sake, I'm going to call our service `ServiceName even with Whitespace`.

Command? What command do we need? Let's check out that wall of text documentation:

> > stop------------Sends a STOP request to a service.

Yep, that sounds about as right as you can get. Oh also, hold your thoughts on this one:

> > Commands:
  . . .
  start-----------Starts a service.

That will be useful later, too.

Okay... Server name? Check. Service Name? Check. Command name(s)? Check. So, what do we get as a command for our efforts? It looks like this:

`sc \\AWESOMESERVER01 start "ServiceName even with Whitespace"`

So, in order for this to be a true _restart_ of the service, we would have to issue a stop/start command pair on the service:


`sc \\AWESOMESERVER01 stop "ServiceName even with Whitespace"`  
`sc \\AWESOMESERVER01 start "ServiceName even with Whitespace"`

How do we do that in ABAP? Well, to run SM69 commands programmatically, we have the tasty function module `SXPG_COMMAND_EXECUTE`:

```abap
CALL FUNCTION 'SXPG_COMMAND_EXECUTE'
  EXPORTING
    commandname                   = gv_commandname
    additional_parameters         = gv_additional_parameters
    operatingsystem               = gv_operatingsystem
  TABLES
    exec_protocol                 = gt_result
  EXCEPTIONS
    no_permission                 = 1
    command_not_found             = 2
    parameters_too_long           = 3
    security_risk                 = 4
    wrong_check_call_interface    = 5
    program_start_error           = 6
    program_termination_error     = 7
    x_error                       = 8
    parameter_expected            = 9
    too_many_parameters           = 10
    illegal_command               = 11
    wrong_asynchronous_parameters = 12
    cant_enq_tbtco_entry          = 13
    jobcount_generation_error     = 14
    OTHERS                        = 15.
```

_Intellectual property disclaimer: the exact source code and use case have been modified from the real use case at the company I work for, [Ospelt](https://www.ospelt.com/en/ospelt/info/home.html)._
