---
title: Warn SAP Users of Locked Objects Then Kill Their Session
description:
date: "2018-05-09"
draft: false
starID: 18
postType: dev
---

## SAP users lockin' up your objects?
### We're gonna write an ABAP report and run it as a batch job to :robot: _Automatically_ :robot: get rid of them!

## Overview

Alright everyone, we're gonna walk through a fun ABAP report that involves functional programming, some challenging and creative BDC techniques, and a _'forbidden' SAP Kernel Call!!!_ :scream: :scream: :scream:

## SAP and it's Locked Objects

Anyone with a bit of technical sided SAP/ABAP experience knows that SAP has a locked object system - that is, a maximum of one entity can change an object at a time, wether it be a human user, a program, or any process. These 'objects' in SAP are numerous - orders, HUs, even warehouse bins are 'objects' that can be 'locked' when they are under modification somewhere in the system.

This can get very annoying when multiple entities want to change multiple objects in similar time frames.

## A Remedy for the Problem

The ABAP report I'm going to go through alleviates this problem and could be useful for any company that has automatic processes applied to objects in the system, but at the same time have human users that _also_ modify these objects.

The example program I will go through is for orders specifically (think TYPE AUFNR). Feel free to modify the code for any locked objects of your liking :blush: - the program logic following the locked object selection will not change, as we will soon see.

## Specific Problem

At my company we had some batch jobs that were attempting to change orders, only to find that the users were locked by some of our employees in their own SAP GUI transactions. Nothing 'bad' per say was happening, we were just seeing in the protocol of those various batch jobs that the orders couldn't be accessed. We realized a human user could easily forget they had a transaction open which locked an order, while they went off to work on something else, or were totally away from their work station.

We decided ultimately to build a timed warning system for users that happened to be locking orders, functioning as follows:

1. A warning popup for the user at 5 minutes of lock time
2. A second warning popup for the user warning at 10 minutes of lock time
3. Forcefully close the transaction that was locking the order at 15 minutes of lock time

And yes, this can all be done from an automatic process with no overseeing required! :blush:

Let's get started!

## Identify Locked Objects

The first thing we need to do is get the locked objects and times of all those locked objects across the whole system. As I said, for this example case, we are only interested in locked _orders_. This is object type `AUFK` - the order head table. To get a list of all locked object across the system with this type, we can use function module `ENQUEUE_READ`

```abap
" Get all AUFK table locks
CALL FUNCTION 'ENQUEUE_READ'
  EXPORTING
    gname                 = 'AUFK'
    guname                = '*'              " Users (all)
  TABLES
    enq                   = gt_enq
  EXCEPTIONS
    communication_failure = 1
    system_failure        = 2
    OTHERS                = 3.
```

So, by now we have our table of objects, and the users who are locking them. We will also need all the sessions open across the system. We can get that with the nice SAP Standard class `cl_server_info` (pretty obvious name, eh? :joy:). 

```abap
" Get all user sessions
CREATE OBJECT server_info.
gt_session_list = server_info->get_session_list( with_application_info = 1 ).
```

However, we can't just kill all of a user's sessions - we only want to shut down (indeed, this is bad luck for the user that has only one SAP application window open that is blocking an order, but hey, they get two warnings before we shut them down)

## The 'Forbidden' Kernel Call

To get the fidelity needed to find exactly which index of SAP application window, we're gonna have go down the system rabbithole and use a f (remember, it is always 1-7 --> the classic SAP limit of 7 open windows per client)

```abap
CALL 'ThUsrInfo' ID 'OPCODE' FIELD opcode_usr_info
          ID 'TID' FIELD gs_session_list-logon_hdl
          ID 'WITH_APPL_INFO' FIELD with_appl_info
          ID 'TABLE' FIELD gt_usr_info[].
```

What this kernel call retrieves and puts in table `gt_user_info` can be also found be found through the standard SAP GUI in transaction `SM04` by selecting a session and going to the top menu bar and selecting User->Technical Information):

![How to navigate to technical information in SAP GUI transaction SM04](technical-information.png)

You will see a giant list of multiple fields for each session number (0-6) that the user has open. So, what can we do with this giant technical information list of key value pairs? 

In SAP, this works as follows: each _login_ by a user (not session number, we're not there yet :smile:)  is assigned a unique login ID which is generated based on things you log in with: the client number, system, and language. This session ID has the form of `TXX_UXXXXX`, where `X` can be any number 0-9. 

Each session then has a session ID which is comprised of first the login ID as described above, with an appended `_MX`, where `X` in this case is the session number, 0-6 (session 1-7). So, we are interested in the `.session` value of this technical list:

![Session ID in the technical information.](session-id.png)

You can notice then that session 2 would have 

`modeinfo[1].session = T23_U31974_M1` 

session 3 would have

`modeinfo[2].session = T23_U31974_M2` 

and so on, all the way up to session 7 - or index 6. We will see in the code that I leverage this pattern. The only way to find the true session that is blocking the order is to first guess the logon instance for the user (in the case for example that htey have logged on with multiple languages), then you can back out all the session ID's until you get a match of the `session_hdl` from the returned list of `gt_sessions_list`.

```abap
CLEAR gt_sessions_user.
LOOP AT gt_session_list INTO gs_session_list WHERE tenant EQ sy-mandt. " loop at all open sessions to build a list of just the user sessions

  " if a user is not in the given so, we continue (that means with exclude users, they are skipped, those with equals and all others keep going)
  IF gs_session_list-user_name NOT IN so_bname.
    CONTINUE.
  ENDIF.

  gv_user_name   = gs_session_list-user_name.

  " Only add to list if user is current lock user - also get the session id for this user
  IF gv_user_name EQ gs_enq-guname.
    CLEAR gv_modus_index.
    CLEAR gt_usr_info[].
    CLEAR gs_usr_info.
    " get detailed technical info for this user to find which specific session to close
    CALL 'ThUsrInfo' ID 'OPCODE' FIELD opcode_usr_info
      ID 'TID' FIELD gs_session_list-logon_hdl
      ID 'WITH_APPL_INFO' FIELD with_appl_info
      ID 'TABLE' FIELD gt_usr_info[].
    CONCATENATE gs_enq-gusrvb '/UPD' INTO gv_value. " We need to use the '/UPD' value in the technical info to get the exact session assigned to the specific locked object
    LOOP AT gt_usr_info INTO gs_usr_info WHERE value EQ gv_value. " find the field from the value
      gv_modus_index = gs_usr_info-field+9(1). " the key for the value is 'modeinfo[X].enq_info'.... we need just the X.. so we +9 then take the single character (1)
    ENDLOOP.
    " If we found a session with that number, we know we had the correct logon... we can add this to the user list
    IF gv_modus_index IS NOT INITIAL.
      " convert to type ssi_session_handle for later lookup
      gv_modus_num_found = gv_modus_index.
      " get the session id for this specific
      CONCATENATE 'modeinfo[' gv_modus_index '].session' INTO gv_field. " this time we need to find the value from the field
      LOOP AT gt_usr_info INTO gs_usr_info WHERE field EQ gv_field.
        gv_ssi_session_id = gs_usr_info-value.
      ENDLOOP.
      APPEND gs_session_list TO gt_sessions_user.
    ENDIF.
  ENDIF.
ENDLOOP.
```

Here - as will make more sense in the full code - I am building a `gt_sessions_user` list on the fly, which is what is passed to a BDC method to close that specific session ID for that user alone (explained below). I decided to run the program with this one-user-at-a-time method in order to have the minimum amount of time between finding a session that was locking an object and messaging / deleting that session. 

If we had say, 1000 locked orders on our system, and I built an entire list of all blocking sessions across all users, it could be the case that by the time we get to the BDC method (which, by the way, is slow itself, especially when you need it to be synchronous as we need in this process), the user could have already closed that blocking session, or worse, switched to a transaction in that session number which was no longer blocking the order! In such a case we would be unnecessarily sending warning messages or closing the transaction to a session which didn't apply anymore! Bad.

So - we've pinpointed the exact user and their session number that is blocking the order - let's send them our warning messages at 5 and 10 minutes.

## No Way! A _SECOND_ 'Forbidden' Module?!

To send a popup message to a user, we need to now make use of _second_ `TH*` function, `TH_POPUP` (though at least this time it is at least a SAP function, and not a sneaky system function):

```abap
CONCATENATE 'You are locking' gv_aufnr_string 'in TC' gv_tcode ' for >5min. Please save and leave the transaction.' INTO gv_message SEPARATED BY space.
    CALL FUNCTION 'TH_POPUP'
      EXPORTING
        client         = sy-mandt
        user           = gs_enq-guname
        message        = gv_message
      EXCEPTIONS
        user_not_found = 1
        OTHERS         = 2.
```

This function module actually heads to the kernel as well, because the user won't get a popup directly in the SAP GUI, but rather a warning message directly in the their operating system. It looks like this when testing from `SE37`:

![Testing TH_POPUP in transaction SE37.](TH_POPUP-function-test.png)

And our resulting system popup (at least how it looks on windows operating system)

![What a successful call of TH_POPUP from SE37 looks like.](TH_POPUP-result.png)

Ok, so we've warned the users twice by now with our popup, but they still are blocking a dang order! Remember, each run we've still got their exact session number that is blocking the order, so let's finally go in for the kill and shut down that session! Once we do that, we log which session/user/transaction combo we deleted to the spool, and this report is done!

## BDC Tricks To Finally Close The User Session

I searched and searched, but there seems to be no function module that can explicitely close a specific user session - there's probably good reason for this! (Though I can't _possibly_ think of why :thinking: :wink:) 

I couldn't even find another 'forbidden' `Th****` function module that can do this. However, this _is_ possible through the standard SAP GUI, and we've already mentioned it in this post, our friend transaction `SM04`. By double clicking on a user (using me for an example), we get a list like this (sorry for the black boxes - don't want to inadvertantly reveal anything that may be proprietary):

![List of user sessions on the server.](server-sessions-list.png)

Then you need only select the desired session number and click "Delete Session", then :cloud:POOF!:cloud: that user's session will be gone!

![Deleting a user session by session number.](delete-session.png)

Thank me later, but in BDC form, this can be written as follows:

```abap
" First ensure that sm04 is called and set to the sessions view
      CLEAR bdcdata[].
      PERFORM bdcdaten USING:
        'X' 'SAPMSSY0' '0120',
          ' ' 'BDC_CURSOR' '04/03',
          ' ' 'BDC_OKCODE' '=SESSIONS'.
      " call transaction SM04, sync (S), no screens unless debugger (P)
      CALL TRANSACTION 'SM04'
              USING bdcdata
              MODE 'P'
              UPDATE 'S'.

      " Now use bdc to end the session with that session id
      CLEAR bdcdata[].
      PERFORM bdcdaten USING:
        'X' 'SAPMSSY0' '0120',
          ' ' 'BDC_CURSOR' '04/03',
          ' ' 'BDC_OKCODE' '=&OL0'.
      PERFORM bdcdaten USING:
        'X' 'SAPLSKBH' '0800',
          ' ' 'BDC_CURSOR' 'GT_FIELD_LIST-SELTEXT(01)',
          ' ' 'BDC_OKCODE' '=WLSE',
          ' ' 'GT_FIELD_LIST-MARK(01)' 'X',
          ' ' 'BDC_SUBSCR' 'SAPLSKBH                                0810SUB810'.
      PERFORM bdcdaten USING:
        'X' 'SAPLSKBH' '0800',
          ' ' 'BDC_CURSOR' 'GT_FIELD_LIST-SELTEXT(01)',
          ' ' 'BDC_OKCODE' '=CONT',
          ' ' 'BDC_SUBSCR' 'SAPLSKBH                                0810SUB810'.
      PERFORM bdcdaten USING:
        'X' 'SAPMSSY0' '0120',
          ' ' 'BDC_CURSOR' '04/03',
          ' ' 'BDC_OKCODE' '=PS 63'.
      PERFORM bdcdaten USING:
        'X' 'SAPMSSY0' '0120',
          ' ' 'BDC_CURSOR' '02/76',
          ' ' 'BDC_OKCODE' '=&IC1'.
      PERFORM bdcdaten USING:
        'X' 'SAPMSSY0' '0120',
          ' ' 'BDC_CURSOR' '02/76',
          ' ' 'BDC_OKCODE' '=&ILT'.
      PERFORM bdcdaten USING:
        'X' 'SAPLSSEL' '1104',
          ' ' 'BDC_OKCODE' '=CRET',
          ' ' 'BDC_SUBSCR' 'SAPLSSEL                                1105%_SUBSCREEN_FREESEL',
          ' ' 'BDC_CURSOR' '%%DYN001-LOW',
          ' ' '%%DYN001-LOW' gv_ssi_session_id.
      PERFORM bdcdaten USING:
        'X' 'SAPMSSY0' '0120',
          ' ' 'BDC_CURSOR' '04/15',
          ' ' 'BDC_OKCODE' '=&IC1'.
      PERFORM bdcdaten USING:
        'X' 'RSM04000_ALV_NEW' '2000',
          ' ' 'BDC_CURSOR' gv_modus_string,
          ' ' 'BDC_OKCODE' '=DEL'.
      PERFORM bdcdaten USING:
        'X' 'SAPMSSY0' '0120',
          ' ' 'BDC_CURSOR' '04/15',
          ' ' 'BDC_OKCODE' '=&F15'.
      " call transaction SM04, sync (S), no screens unless debugger (P)
      CALL TRANSACTION 'SM04'
              USING bdcdata
              MODE 'P'
              UPDATE 'S'.
```

If you stick around the blog and or read other ABAP BDC posts of mine, you'll see for BDC I always use the following helper form `bdcdaten` that allows me to write the BDC so cleanly (as it is above):

```abap
*&---------------------------------------------------------------------*
*&      Form  BDCDATEN
*&---------------------------------------------------------------------*
FORM bdcdaten USING start fnam fval.

  CLEAR bdcdata.
  IF start = 'X'.
    bdcdata-dynbegin = start.
    bdcdata-program  = fnam.
    bdcdata-dynpro   = fval.
  ELSE.
    bdcdata-fnam = fnam.
    bdcdata-fval = fval.
  ENDIF.
  APPEND bdcdata.

ENDFORM.                               " BDCDATEN
```

The only thing worth noting here is in our first step we always ensure the server view of `SM04` is active - we need to always run in server view, because we don't want all sessions across all servers. In this way, this report can run in parallel on all your servers and concern it self only with users logged on to the server instance that this report is running on. This will make the run time a bit faster, and of course splits up the search work across all servers.

# Full Code

The full code of the report is as follows:

```abap
REPORT z_user_session_kill.
*&---------------------------------------------------------------------*
*& Report: Z_USER_SESSION_KILL                                         *
*& Author: Christopher Frewin                                          *
*& Creation Date: 2018.05.09                                           *
*&---------------------------------------------------------------------*
*&                                                                     *
*&                                                                     *
*&                                                         __          *
*&                                           Christophe_r_|  |_F_rewin *
*&                                                     |__    __|      *
*&                                                        |  |         *
*&                                "Z_USER_SESSION_KILL"   |  |         *
*&                                                        |__|  17'    *
*&---------------------------------------------------------------------*

" table needed for FOR in select-options statement
TABLES: usr02.

" Data...  :)
DATA: gv_time_dif_sperr   TYPE tims,
      gv_tcode            TYPE eqetcode,
      gv_aufnr            TYPE aufnr,
      gv_message          TYPE sm04dic-popupmsg,
      gv_objnr            TYPE j_objnr,
      gv_stat             TYPE j_status,
      gt_enq              TYPE TABLE OF seqg3,
      gs_enq              LIKE LINE OF gt_enq,
      server_info         TYPE REF TO cl_server_info,
      gt_session_list     TYPE TABLE OF ssi_session_info,
      gs_session_list     LIKE LINE OF gt_session_list,
      gt_sessions_user    TYPE TABLE OF ssi_session_info,
      gs_sessions_user    LIKE LINE OF gt_sessions_user,
      bdcdata             LIKE bdcdata OCCURS 0 WITH HEADER LINE,
      gv_modus_string     TYPE string,
      gv_modus_index      TYPE string,
      gv_user_name        TYPE eqeuname,
      th_opcode(1)        TYPE x,
      with_appl_info      TYPE ssi_bool VALUE 1,
      gv_field(40),
      gv_value(80),
      gv_ssi_session_id   TYPE ssi_session_id,
      gv_modus_num        TYPE ssi_session_hdl,
      gv_modus_num_found  TYPE ssi_session_hdl,
      gv_modus_index_char TYPE numc1,
      gv_aufnr_string     TYPE string,
      BEGIN OF gt_usr_info OCCURS 10,
        field(40),
        VALUE(80),
      END OF gt_usr_info,
      gs_usr_info LIKE LINE OF gt_usr_info,
      gv_autyp    TYPE auftyp,
      gv_uzeit    TYPE sy-uzeit,
      gv_string   TYPE string.

" select option to exlude user
SELECT-OPTIONS: so_bname FOR usr02-bname MEMORY ID xus NO INTERVALS.

CONSTANTS: opcode_usr_info LIKE th_opcode VALUE 52. " this is the internal SAP number used for the system function module 'ThUsrInfo'
gv_uzeit = sy-uzeit. " moved up here to have time before the enqueue_read function

" Get all AUFK table locks
CALL FUNCTION 'ENQUEUE_READ'
  EXPORTING
    gname                 = 'AUFK'
    guname                = '*'              " Users (all)
  TABLES
    enq                   = gt_enq
  EXCEPTIONS
    communication_failure = 1
    system_failure        = 2
    OTHERS                = 3.
IF sy-subrc <> 0.
  EXIT.
ENDIF.

" Get all user sessions
CREATE OBJECT server_info.
gt_session_list = server_info->get_session_list( with_application_info = 1 ).

" Loop through each locked object (production orders)
LOOP AT gt_enq INTO gs_enq.

  " Auftrag and Tcode for nice printing in the messages
  gv_tcode = gs_enq-gtcode.
  gv_aufnr_string = gs_enq-garg+3.
  SHIFT gv_aufnr_string LEFT DELETING LEADING '0'.
  CONDENSE gv_tcode.

  " We keep only the orders that have the status FREI ---> stat 'I0002' in table JEST
  gv_aufnr = gs_enq-garg+3. " GARG for aufnr is in the format '10000000XXXXXXX' therefore with +3 we should have the standard aufnr format 00000XXXXXXX (12 CHAR long)

  " Only orders with type 10 or 40 (production and proess orders)
  CLEAR gv_autyp.
  SELECT SINGLE autyp FROM aufk INTO gv_autyp
    WHERE aufnr EQ gv_aufnr.
  IF gv_autyp NE '10' AND gv_autyp NE '40'.
    DELETE gt_enq INDEX sy-tabix. " delete this line
    CONTINUE. " and go on to the next lock object in gt_enq
  ENDIF.

  " Also check JEST table - first format to OR0000XXXXXXX form
  CLEAR gv_objnr.
  CONCATENATE 'OR' gv_aufnr INTO gv_objnr.
  SELECT SINGLE stat FROM jest INTO gv_stat
    WHERE objnr EQ gv_objnr
    AND   stat  EQ 'I0002'
    AND   inact EQ ' '.
  IF sy-subrc <> 0. " FREI status not found, delete the entry
    DELETE gt_enq INDEX sy-tabix. " delete this line
    CONTINUE. " and go on to the next lock object in gt_enq
  ENDIF.

  " Determine how long object has been locked
  IF gs_enq-gttime GT gv_uzeit. " check to make sure the current time is at least as big as the lock time - otherwise we get giant times 23:59:59 when subtracting
    CONTINUE. " if this is the case, go to the next locked object
  ENDIF.
  gv_time_dif_sperr = gv_uzeit - gs_enq-gttime. " locked object time calculation itself is simple, difference of current time and time when it was first locked

  " Finally take action depending on the time 15 minute most sever, 10 minute strong warning, 5 minute weak warning.
  IF gv_time_dif_sperr > '001500'. " kill the user sessions after 15 minutes - will kill those that are in the transaction of the locked object

    CLEAR gt_sessions_user.
    LOOP AT gt_session_list INTO gs_session_list WHERE tenant EQ sy-mandt. " loop at all open sessions to build a list of just the user sessions

      " if a user is not in the given so, we continue (that means with exclude users, they are skipped, those with equals and all others keep going)
      IF gs_session_list-user_name NOT IN so_bname.
        CONTINUE.
      ENDIF.

      gv_user_name   = gs_session_list-user_name.

      " Only add to list if user is current lock user - also get the session id for this user
      IF gv_user_name EQ gs_enq-guname.
        CLEAR gv_modus_index.
        CLEAR gt_usr_info[].
        CLEAR gs_usr_info.
        " get detailed technical info for this user to find which specific session to close
        CALL 'ThUsrInfo' ID 'OPCODE' FIELD opcode_usr_info
          ID 'TID' FIELD gs_session_list-logon_hdl
          ID 'WITH_APPL_INFO' FIELD with_appl_info
          ID 'TABLE' FIELD gt_usr_info[].
        CONCATENATE gs_enq-gusrvb '/UPD' INTO gv_value. " We need to use the '/UPD' value in the technical info to get the exact session assigned to the specific locked object
        LOOP AT gt_usr_info INTO gs_usr_info WHERE value EQ gv_value. " find the field from the value
          gv_modus_index = gs_usr_info-field+9(1). " the key for the value is 'modeinfo[X].enq_info'.... we need just the X.. so we +9 then take the single character (1)
        ENDLOOP.
        " If we found a session with that number, we know we had the correct logon... we can add this to the user list
        IF gv_modus_index IS NOT INITIAL.
          " convert to type ssi_session_handle for later lookup
          gv_modus_num_found = gv_modus_index.
          " get the session id for this specific
          CONCATENATE 'modeinfo[' gv_modus_index '].session' INTO gv_field. " this time we need to find the value from the field
          LOOP AT gt_usr_info INTO gs_usr_info WHERE field EQ gv_field.
            gv_ssi_session_id = gs_usr_info-value.
          ENDLOOP.
          APPEND gs_session_list TO gt_sessions_user.
        ENDIF.
      ENDIF.
    ENDLOOP.
    " last step is the bdc index - no matter what the order of the dynpro numbers or if there are skips between the numbers, the BDC is always 01, 02, 03, 04... counting number so we need sy-tabix
    IF gt_sessions_user IS NOT INITIAL. " check if there is anything for the user sessions, or if the index found
      SORT gt_sessions_user BY session_hdl ASCENDING. " this is how they are shown in the gui, so since we are using bdc we also have to do this
      LOOP AT gt_sessions_user INTO gs_sessions_user. " loop at all open sessions for the USER within the correct logon ID
        gv_modus_num   = gs_sessions_user-session_hdl. " current session
        " Kill only the session from the table that matches the index of the modus found
        IF gv_modus_num = gv_modus_num_found.
          gv_modus_index_char = sy-tabix. " then the index of the modus for this user is sy-tabix - we need the index, rather than the actual number of the session for the BDC
          CLEAR gv_modus_string.
          CONCATENATE 'MODUS-MTCODE(0' gv_modus_index_char ')' INTO gv_modus_string. " build the bdcfield name using the index of where in the user's list the
        ENDIF.
      ENDLOOP.

      IF gv_modus_index_char EQ '0'. " Then we have the false server and we have to continue ahead
        CONTINUE.
      ENDIF.

      " First ensure that sm04 is called and set to the sessions view
      CLEAR bdcdata[].
      PERFORM bdcdaten USING:
        'X' 'SAPMSSY0' '0120',
          ' ' 'BDC_CURSOR' '04/03',
          ' ' 'BDC_OKCODE' '=SESSIONS'.
      " call transaction SM04, sync (S), no screens unless debugger (P)
      CALL TRANSACTION 'SM04'
              USING bdcdata
              MODE 'P'
              UPDATE 'S'.

      " Now use bdc to end the session with that session id
      CLEAR bdcdata[].
      PERFORM bdcdaten USING:
        'X' 'SAPMSSY0' '0120',
          ' ' 'BDC_CURSOR' '04/03',
          ' ' 'BDC_OKCODE' '=&OL0'.
      PERFORM bdcdaten USING:
        'X' 'SAPLSKBH' '0800',
          ' ' 'BDC_CURSOR' 'GT_FIELD_LIST-SELTEXT(01)',
          ' ' 'BDC_OKCODE' '=WLSE',
          ' ' 'GT_FIELD_LIST-MARK(01)' 'X',
          ' ' 'BDC_SUBSCR' 'SAPLSKBH                                0810SUB810'.
      PERFORM bdcdaten USING:
        'X' 'SAPLSKBH' '0800',
          ' ' 'BDC_CURSOR' 'GT_FIELD_LIST-SELTEXT(01)',
          ' ' 'BDC_OKCODE' '=CONT',
          ' ' 'BDC_SUBSCR' 'SAPLSKBH                                0810SUB810'.
      PERFORM bdcdaten USING:
        'X' 'SAPMSSY0' '0120',
          ' ' 'BDC_CURSOR' '04/03',
          ' ' 'BDC_OKCODE' '=PS 63'.
      PERFORM bdcdaten USING:
        'X' 'SAPMSSY0' '0120',
          ' ' 'BDC_CURSOR' '02/76',
          ' ' 'BDC_OKCODE' '=&IC1'.
      PERFORM bdcdaten USING:
        'X' 'SAPMSSY0' '0120',
          ' ' 'BDC_CURSOR' '02/76',
          ' ' 'BDC_OKCODE' '=&ILT'.
      PERFORM bdcdaten USING:
        'X' 'SAPLSSEL' '1104',
          ' ' 'BDC_OKCODE' '=CRET',
          ' ' 'BDC_SUBSCR' 'SAPLSSEL                                1105%_SUBSCREEN_FREESEL',
          ' ' 'BDC_CURSOR' '%%DYN001-LOW',
          ' ' '%%DYN001-LOW' gv_ssi_session_id.
      PERFORM bdcdaten USING:
        'X' 'SAPMSSY0' '0120',
          ' ' 'BDC_CURSOR' '04/15',
          ' ' 'BDC_OKCODE' '=&IC1'.
      PERFORM bdcdaten USING:
        'X' 'RSM04000_ALV_NEW' '2000',
          ' ' 'BDC_CURSOR' gv_modus_string,
          ' ' 'BDC_OKCODE' '=DEL'.
      PERFORM bdcdaten USING:
        'X' 'SAPMSSY0' '0120',
          ' ' 'BDC_CURSOR' '04/15',
          ' ' 'BDC_OKCODE' '=&F15'.
      " call transaction SM04, sync (S), no screens unless debugger (P)
      CALL TRANSACTION 'SM04'
              USING bdcdata
              MODE 'P'
              UPDATE 'S'.

      " proper logging. times, order number, and transaction added as well as
      WRITE: / 'User session from user ', gs_enq-guname, 'with session number', gv_modus_index_char, 'was deleted.'.
      WRITE: / 'System Time (sy-uzeit): ', gv_uzeit.
      WRITE: / 'Object Lock Time Length:', gs_enq-gttime.
      WRITE: / 'Lock Time: ', gv_time_dif_sperr.
      WRITE: / 'Order: ', gv_aufnr_string, ',Transaction', gv_tcode.

      CALL FUNCTION 'SO_STRUCT_TO_CHAR'
        EXPORTING
          ip_struct = gs_enq
        IMPORTING
          ep_string = gv_string.
      CONDENSE gv_string.
      WRITE: / 'Lock object entry contains:', gv_string.

    ENDIF.
  ELSEIF gv_time_dif_sperr > '001000'. " Second warning message after 10 minutes
    CONCATENATE 'You are locking' gv_aufnr_string ' in TC ' gv_tcode ' still. Please save and leave the transaction, otherwise your session will be ended in 5 min. Thank you!' INTO gv_message SEPARATED BY space.
    CALL FUNCTION 'TH_POPUP'
      EXPORTING
        client         = sy-mandt
        user           = gs_enq-guname
        message        = gv_message
      EXCEPTIONS
        user_not_found = 1
        OTHERS         = 2.
    IF sy-subrc <> 0.
      CONTINUE.
    ENDIF.
  ELSEIF gv_time_dif_sperr > '000500'. " First warning message after 5 minutes
    CONCATENATE 'You are locking' gv_aufnr_string 'in TC' gv_tcode ' for >5min. Please save and leave the transaction.' INTO gv_message SEPARATED BY space.
    CALL FUNCTION 'TH_POPUP'
      EXPORTING
        client         = sy-mandt
        user           = gs_enq-guname
        message        = gv_message
      EXCEPTIONS
        user_not_found = 1
        OTHERS         = 2.
    IF sy-subrc <> 0.
      CONTINUE.
    ENDIF.
  ENDIF.
ENDLOOP.

*&---------------------------------------------------------------------*
*&      Form  BDCDATEN
*&---------------------------------------------------------------------*
FORM bdcdaten USING start fnam fval.

  CLEAR bdcdata.
  IF start = 'X'.
    bdcdata-dynbegin = start.
    bdcdata-program  = fnam.
    bdcdata-dynpro   = fval.
  ELSE.
    bdcdata-fnam = fnam.
    bdcdata-fval = fval.
  ENDIF.
  APPEND bdcdata.

ENDFORM.                               " BDCDATEN
```

Whew. That's about it for this one, hope you enjoyed!
