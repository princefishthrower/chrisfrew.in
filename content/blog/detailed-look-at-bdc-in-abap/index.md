---
title: A Detailed Look at ABAP's BDC Method
description:
date: "2018-01-24"
draft: true
starID: 52
postType: dev
---

## And some common gotchyas, too

```abap
* -------------------------------------------------------------------
*                          S A P M S S Y 0
*                  system routines for ABAP processing
*
*                  (must be declared as FUNCTION-POOL)
* -------------------------------------------------------------------
function-pool sapmssy0  message-id 02.
include <%_list>.
include <sys000>.
include tskhincl.
tables: tfdir.
data:  orders          type standard table of %_commit_orders,
                                                  "ON COMMIT orders
       rb_orders       type standard table of %_commit_orders,
                                                  "ON ROLLBACK orders
       imode_orders    type standard table of %_commit_orders,
                                                  "POC in CALL DIALOG
       imode_rb_orders type standard table of %_commit_orders.
"POR in CALL DIALOG
* for RTM test concerning POC during OS event handling
data: os_orders        type hashed table of %_commit_orders
                            with unique key prog rout.      "#EC NEEDED
"OS ON COMMIT orders
* end RTM

data:  %_vbkey type %_vbkey value '%_',                     "#EC *
       %%vbkey type %_vbkey value '%%',
       %_vb_calls type %_vb_calls occurs 50 with header line."#EC *
data:  i_level type i value 0.

data : arfc_pending type c,
       trfc_nowait_for_update type c.

* bgRFC: something todo at COMMIT / ROLLBACK
data : bgrfc_eot_action type i.

* LDQ: something todo at COMMIT / ROLLBACK
data : ldq_writer_eot_action type i.
data : ldq_reader_eot_action type i.

* -------------------------------------------------------------------
* O R D E R _ F O R M _ L E V E L
* order given form to be run when work is committed
*
* Input : program name, form name, execution level
* -------------------------------------------------------------------
form %_order_form_level using prog rout u_level.            "#EC *
  data: allow_nested_poc(1) type c,
        caller type sy-repid.
  data: mpar1(80), mpar2(80), mpar3(80), mpar4(80).
  data: imode_orders_wa type %_commit_orders,
        orders_wa type %_commit_orders.

  if sy-oncom = 'N'.
    call 'ThVBCall' id 'OPCODE' field get_vb_key  "#EC CI_CCALL
                    id 'VBKEY'  field %_vbkey-vbkey.
    import imode_orders imode_rb_orders from memory id %_vbkey.
    read table imode_orders
      into imode_orders_wa
      with key prog = prog
               rout = rout
      binary search.
    if sy-subrc ne 0.
      describe table imode_orders lines i_level.
      imode_orders_wa-prog = prog.
      imode_orders_wa-rout = rout.
      imode_orders_wa-i_level = i_level.
      imode_orders_wa-u_level = u_level.
      insert imode_orders_wa into imode_orders index sy-tabix.
      export imode_orders imode_rb_orders to memory id %_vbkey.
    endif.
  else.
    if sy-oncom = 'P'.
*     already in PERFORM ON COMMIT
      call 'C_SAPGPARAM' id 'NAME'  field 'abap/allow_nested_poc'  "#EC CI_CCALL
                         id 'VALUE' field allow_nested_poc.
      if allow_nested_poc <> 'X'.
*       nested PERFORM ON COMMIT not allowed
        call 'AB_GET_CALLER' id 'PROGRAM' field caller.  "#EC CI_CCALL
        if caller <> 'SAPMSSY0'.
          mpar1 = 'NESTED_PERFORM_ON_COMMIT'.
          concatenate 'caller:'  caller into mpar2 separated by ' '.
          concatenate 'program:' prog   into mpar3 separated by ' '.
          concatenate 'form:'    rout   into mpar4 separated by ' '.
*         switch back kernel flag: just for sure.
          call 'SET_SWITCH_TXEND' id 'STATE' field ' '.  "#EC CI_CCALL
*         issue short dump
          message x081(00) with mpar1 mpar2 mpar3 mpar4.
        endif.
      endif.
    endif.
    read table orders
      into orders_wa
      with key prog = prog
               rout = rout
      binary search.
    if sy-subrc ne 0.
      describe table orders lines i_level.
      orders_wa-prog = prog.
      orders_wa-rout = rout.
      orders_wa-i_level = i_level.
      orders_wa-u_level = u_level.
      insert orders_wa into orders index sy-tabix.
    endif.
*   for RTM test concerning POC during OS event handling
    if sy-oncom = 'E'.
      orders_wa-prog = prog.
      orders_wa-rout = rout.
      insert orders_wa into table os_orders.
    endif.
*   end RTM

  endif.
endform.                    "%_order_form_level

* -------------------------------------------------------------------
* O R D E R _ F O R M _ F O R _ R O L L B A C K
* order given form to be run when work is rolled back
* Input : program name, form name
* -------------------------------------------------------------------
form %_order_form_for_rollback using prog rout.             "#EC *
  data: mpar1(80), mpar2(80), mpar3(80), mpar4(80),
        caller type sy-repid.
  data: rb_orders_wa       type %_commit_orders,
        imode_rb_orders_wa type %_commit_orders.

  if sy-oncom = 'N'.
    call 'ThVBCall' id 'OPCODE' field get_vb_key  "#EC CI_CCALL
                    id 'VBKEY'  field %_vbkey-vbkey.
    import imode_orders imode_rb_orders from memory id %_vbkey.
    read table imode_rb_orders
      into imode_rb_orders_wa
      with key prog = prog
           rout = rout
      binary search.
    if sy-subrc ne 0.
      describe table imode_rb_orders lines i_level.
      imode_rb_orders_wa-prog = prog.
      imode_rb_orders_wa-rout = rout.
      imode_rb_orders_wa-i_level = i_level.
      imode_rb_orders_wa-u_level = 0.
      insert imode_rb_orders_wa into imode_rb_orders index sy-tabix.
      export imode_orders imode_rb_orders to memory id %_vbkey.
    endif.
  else.
    if sy-oncom = 'P'.
      call 'AB_GET_CALLER' id 'PROGRAM' field caller.  "#EC CI_CCALL
      mpar1 = 'NESTED_PERFORM_ON_ROLLBACK'.
      concatenate 'caller:'  caller into mpar2 separated by ' '.
      concatenate 'program:' prog   into mpar3 separated by ' '.
      concatenate 'form:'    rout   into mpar4 separated by ' '.
*     switch back kernel flag: just for sure.
      call 'SET_SWITCH_TXEND' id 'STATE' field ' '.
*     already in PERFORM ON ROLLBACK issue short dump
      message x081(00) with mpar1 mpar2 mpar3 mpar4.
    endif.
    read table rb_orders into rb_orders_wa
      with key prog = prog
               rout = rout
      binary search.
    if sy-subrc ne 0.
      describe table rb_orders lines i_level.
      rb_orders_wa-prog = prog.
      rb_orders_wa-rout = rout.
      rb_orders_wa-i_level = i_level.
      insert rb_orders_wa into rb_orders index sy-tabix.
    endif.
  endif.
endform.                    "%_order_form_for_rollback


*---------------------------------------------------------------------*
*  %_COMMIT_PREPARE                                                   *
*  Set date and time for aRFC
*---------------------------------------------------------------------*
form %_commit_prepare using date time.                      "#EC *

  %_sys000-arfc-send_time = time.
  %_sys000-arfc-send_date = date.

endform.                    "%_commit_prepare

* ---------------------------------------------------------------------
* FORM %_BEFORE_COMMIT
* called from RSYN commit.rs1
* ---------------------------------------------------------------------
form %_before_commit.                                       "#EC *
  data: l_oncom like sy-oncom.
  data: txend type c.

* forbid COMMIT if already in ON ROLLBACK handling
* allow COMMIT during ON COMMIT for backward compatibilty
  call 'GET_SWITCH_TXEND' id 'STATE' field txend.
  if txend = 'R'.
    message x085(00).
  endif.

* COMMIT during CALL DIALOG/SUBMIT, POC, Update task
* or End Transaction event?
  check sy-oncom <> 'N' and sy-oncom <> 'P' and
        sy-oncom <> 'E' and sy-oncom <> 'V'.
* change sy-oncom to avoid recursion
  l_oncom = sy-oncom.
  sy-oncom = 'E'.                      "E = Event Handling

* no escape out off this form other than ENDFORM
  system-call state_limit set.
* Hook for Process Information Infrastructure
  call function 'SPI_AGENT_COMMIT'.
* Raise event 'Commit Requested' for Object Manager
  call method cl_os_transaction_end_notifier=>raise_commit_requested.
* restore sy-oncom
  sy-oncom = l_oncom.

* reset marker on call stack.
  system-call state_limit reset.
endform.                    "%_before_commit

* -------------------------------------------------------------------
* C O M M I T
* commit work
* -------------------------------------------------------------------
form %_commit.                                              "#EC *
  data: %_state, %_direct_utask_active.                     "#EC *
  data: l_lines   like sy-tabix.
  data: %_enqkey  type eqeusrvb.                            "#EC *
  data: %_enqdone type c.                                   "#EC *

* status processing of set update task local
* value 'E': local update is active. Export tRFC/qRFC to memory!
* value 'S': local update is active. Map the dialog tRFC/qRFC to called update trfc/qRFC.
*            Import tRFC/qRFC form memory! Save it to the Database.
* value 'X': local update is active. Execute the tRFC/qRFC within the Dialog workprocess.

  data: l_local_vb_status type c.

* COMMIT during POC, Update task or End Transaction event?
  check sy-oncom <> 'P' and sy-oncom <> 'E' and sy-oncom <> 'V'.

* no escape out off this form other than ENDFORM
  system-call state_limit set.

  call 'ThVBCall' id 'OPCODE'  field get_vb_key
                  id 'VBKEY'   field %%vbkey-vbkey.
  if sy-oncom <> 'N'.
*   Not in CALL DIALOG
    %_vbkey-vbkey = %%vbkey-vbkey.
    perform %_process_p_o_c.

*   Check if local update task is switched on?
    call 'GET_SWITCH_UTASK' id 'MODE'  field 'S'
                            id 'STATE' field %_state.
    if %_state eq 'N'.
      free %_vb_calls.
      import %_vb_calls from memory id %%vbkey.
      describe table %_vb_calls lines l_lines.
      if l_lines ne 0.
*       Local update task is active,
*       export the called tRFC/qRFCs from dialog to memory within arfc_end_transaction.
        l_local_vb_status = 'E'.
      endif.

*     Within sapmssy4 (commit work) we have to import and save all dia tRFC/qRFC
*     in arfc_end_transaction
      if sy-cprog = 'SAPMSSY4'.
        l_local_vb_status = 'S'.
        arfc_pending = 'X'.
      endif.
    endif.


    if arfc_pending <> space.
      arfc_pending = space.
      if %_sys000-arfc-dontsend <> space.
        %_sys000-arfc-send_date  = sy-datum.
        %_sys000-arfc-send_time  = sy-uzeit + 3600.
      endif.

      call function 'ARFC_END_TRANSACTION'
        exporting
          mode              = 'COMMIT'
          starttime         = %_sys000-arfc-send_time
          startdate         = %_sys000-arfc-send_date
          utask_local_state = l_local_vb_status
          vbkey             = %%vbkey-vbkey
          bgrfc_active      = bgrfc_eot_action.
*      clear %_sys000-arfc-send_time.
*      clear %_sys000-arfc-send_date.
*      clear %_sys000-arfc-dontsend.

***************
*   bgRFC
***************
*     Update task in Asynchronous mode!
*     Wenn arfc_pending <> SPACE dann wurde bereits durch classic qRFC der arfc_end_vb
*     getriggert, falls lokale Verbuchung nicht aktiv ist.
*     N = asynch. update task switched off: direct updates
      if bgrfc_eot_action  ne 0.  "something happened with bgRFC
*       In current LUW classic t/qRFC and bgRFC was called

        if trfc_nowait_for_update <> space OR %_sys000-arfc-send_date is not initial.  "ARFC_END_VB wurde nicht im tRFC/qRFC gerufen
          clear %_sys000-arfc-send_time.
          clear %_sys000-arfc-send_date.
          clear %_sys000-arfc-dontsend.
          call method ('CL_BGRFC_DB_HELPER')=>on_commit
            exporting
              arfc_end_vb_already_called = space.
        else. " ARFC_END_VB wurde bereits im tRFC/qrfc gerufen.
          clear %_sys000-arfc-send_time.
          clear %_sys000-arfc-send_date.
          clear %_sys000-arfc-dontsend.
          call method ('CL_BGRFC_DB_HELPER')=>on_commit
            exporting
              arfc_end_vb_already_called = 'X'.
        endif.
      else.
        clear %_sys000-arfc-send_time.
        clear %_sys000-arfc-send_date.
        clear %_sys000-arfc-dontsend.
      endif.
*      clear %_sys000-arfc-send_time.
*      clear %_sys000-arfc-send_date.
*      clear %_sys000-arfc-dontsend.

*   Wenn kein classic qRFC getriggert und keine lokale Verbuchung, dann
*   muss ARFC_END_VB von bgRFC getriggert werden.
    else.
      if bgrfc_eot_action  ne 0.  "something happened with bgRFC
*       In current LUW only bgRFC was called
        call method ('CL_BGRFC_DB_HELPER')=>on_commit
          exporting
            arfc_end_vb_already_called = space.
      endif.
    endif.

***************************
*   Local Data Queue (LDQ)
***************************
    if ldq_writer_eot_action  ne 0.  "something happened with LDQ-Writer
      call method ('CL_LDQ_UNIT_WRITER')=>on_commit.
    endif.

    if ldq_reader_eot_action  ne 0.  "something happened with LDQ-Reader
      call method ('CL_LDQ_UNIT_READER')=>on_commit.
    endif.

    if %_state eq 'N'.
*     N = asynch. update task switched off: direct updates
*     free %_vb_calls.
*     import %_vb_calls from memory id %%vbkey.
*     describe table %_vb_calls lines l_lines.
      if l_lines ne 0.
*       process direct updates (with the same vbkey)
        call 'ThVBCall' id 'OPCODE'  field get_vb_key
                        id 'VBKEY'   field %%vbkey-vbkey
                        id 'ENQKEY'  field %_enqkey
                        id 'ENQDONE' field %_enqdone.

        submit sapmssy4 with vbkey_id = %%vbkey
                        with enqkey   = %_enqkey
                        with enqdone  = %_enqdone and return.
*       Start new LUW, release locks that were acquired during dialog part
        call 'ThVBCall' id 'OPCODE'       field reset_vb_enq_key
                        id 'SYNC_DEQUEUE' field 'X'.
      endif.
    endif.
  endif.

* Call Dialog wurde gerufen; gerufene tRFC/qRFC Verarbeitung wie gehabt.
  if sy-oncom = 'N' or l_local_vb_status = 'E'.
    if l_local_vb_status = 'E'.
*     Lokale Verbuchung ist aktiv Ausführung im Dialog und UPD.
      l_local_vb_status = 'X'.     "Umsetzen auf Ausführung der trfc/qRFC im Dialog.
      arfc_pending      = 'X'.
    endif.
    if arfc_pending <> space.
      arfc_pending = space.
      if %_sys000-arfc-dontsend <> space.
        %_sys000-arfc-send_date  = sy-datum.
        %_sys000-arfc-send_time  = sy-uzeit + 3600.
      endif.

      call function 'ARFC_END_TRANSACTION'
        exporting
          mode              = 'COMMIT'
          starttime         = %_sys000-arfc-send_time
          startdate         = %_sys000-arfc-send_date
          utask_local_state = l_local_vb_status
          vbkey             = %%vbkey-vbkey
          bgrfc_active      = bgrfc_eot_action.
      clear %_sys000-arfc-send_time.
      clear %_sys000-arfc-send_date.
      clear %_sys000-arfc-dontsend.
    endif.
  endif.

  if sy-binpt eq 'X' .
    call function 'BDC_END_TRANSACTION'.       "ende einer trans in BI
  endif.

* clear memory containing registrations for PERFORM ON ROLLBACK.
* delete imode_orders and imode_rb_orders only if not in CALL DIALOG
  if sy-oncom <> 'N'.
    free memory id %_vbkey.
  endif.
  free rb_orders.

* reset marker on call stack.
  system-call state_limit reset.
endform.                    "%_commit

* ---------------------------------------------------------------------
* FORM %_AFTER_COMMIT
* called from RSYN commit.rs1
* ---------------------------------------------------------------------
form %_after_commit.                                        "#EC *
  data: %_direct_utask_active, %_task_state(4) type x.      "#EC *
  data: i type i, j type i, x4(4) type x.
  data: l_update_task type boolean value '-'.
  data: l_oncom like sy-oncom.
  data: l_subrc like sy-subrc.

* COMMIT during CALL DIALOG/SUBMIT, POC, Update task
* or End Transaction event?
  check sy-oncom <> 'N' and sy-oncom <> 'P' and
        sy-oncom <> 'E' and sy-oncom <> 'V'.
* change sy-oncom to avoid recursion
  l_oncom = sy-oncom.
  sy-oncom = 'E'.                      "E = Event Handling
  l_subrc = sy-subrc.

* no escape out off this form other than ENDFORM
  system-call state_limit set.
*
* bgRFC
*
  if bgrfc_eot_action  ne 0. "something happened with bgRFC
    call method ('CL_BGRFC_DB_HELPER')=>AFTER_COMMIT.
  endif.

*
* Local DATA Queue (LDQ)
*
  if ldq_writer_eot_action  ne 0. "something happened with LDW-Writer
    call method ('CL_LDQ_UNIT_WRITER')=>after_commit.
  endif.

  if ldq_reader_eot_action  ne 0. "something happened with LDW-Reader
    call method ('CL_LDQ_UNIT_READER')=>after_commit.
  endif.

* Raise event 'Commit Finished' for Object Manager
* for synchronous update task this is after all database changes.
* for asynchronous update task this is after triggering the updates.
  call method cl_os_transaction_end_notifier=>raise_commit_finished.

* COMMIT in (classic) update task?
  call function 'TH_USER_INFO'
    importing
      task_state = i.
  %_task_state = i.
  j = task_vb. x4 = j.
  if not %_task_state z x4.            "update task must not be active
    l_update_task = 'X'.
  endif.

  if l_update_task <> 'X'.
*   COMMIT in local update task?
    call 'GET_SWITCH_UTASK' id 'MODE'  field 'A'          "A = active?
                            id 'STATE' field %_direct_utask_active.
    if %_direct_utask_active = 'Y' or sy-cprog = 'SAPMSSY4'.
      l_update_task = 'X'.
    endif.
  endif.

* raise event 'transaction_finished' only if not in update task.
  if l_update_task <> 'X'.
    call method
      cl_system_transaction_state=>raise_transaction_finished
      exporting
        kind = cl_system_transaction_state=>commit_work.
  endif.

* restore sy-oncom
  sy-oncom = l_oncom.
  sy-subrc = l_subrc.

* reset marker on call stack.
  system-call state_limit reset.
endform.                                                "%_after_commit

* ---------------------------------------------------------------------
* FORM %_PROCESS_P_O_C
* Process PERFORM ON COMMIT orders
* ---------------------------------------------------------------------
form %_process_p_o_c.                                       "#EC *
  data: last_oncom like sy-oncom.
  data: imode_orders_wa type %_commit_orders,
        orders_wa       type %_commit_orders.

  last_oncom = sy-oncom.
  import imode_orders from memory id %_vbkey.
  sy-subrc = 0.
  sort imode_orders by u_level i_level.
  loop at imode_orders into imode_orders_wa.
    perform %_order_form_level using imode_orders_wa-prog
                                     imode_orders_wa-rout
                                     imode_orders_wa-u_level.
  endloop.
  free imode_orders.
  sort orders by u_level i_level.

* signal begin of ON COMMIT handling
  sy-oncom = 'P'.
  call 'SET_SWITCH_TXEND' id 'STATE' field 'C'.

  loop at orders into orders_wa.
    perform (orders_wa-rout)
          in program (orders_wa-prog).
  endloop.
  free orders.
* for RTM test concerning POC during OS events
  free os_orders.
* end RTM

* signal end of ON COMMIT
  sy-oncom = last_oncom.
  call 'SET_SWITCH_TXEND' id 'STATE' field ' '.
endform.                    "%_process_p_o_c

* ---------------------------------------------------------------------
* FORM %_GET_VB_KEY
* Update task without update task
* ---------------------------------------------------------------------
form %_get_vb_key using vb_func_name changing vb_data_key.  "#EC *

  data: %_vb_calls    type standard table of %_vb_calls,       "#EC *
        %_vb_calls_wa type %_vb_calls.

  data: utask_on,                  "flag: asynchronous update task on?
        direct_utask_active.       "flag: already in local update task?

  clear vb_data_key.
  call 'GET_SWITCH_UTASK' id 'MODE' field 'S'
                          id 'STATE' field utask_on.
  call 'GET_SWITCH_UTASK' id 'MODE'  field 'A'
                          id 'STATE' field direct_utask_active.
  if utask_on eq 'N' and direct_utask_active eq 'N'.
*   update task switched to "local", but not yet inside update task.
    select single * from tfdir where funcname = vb_func_name.
    if sy-subrc ne 0.
      message a400 with vb_func_name.
    endif.
    cl_abap_restrmode_utils=>check_in_restr_mode_updtask( ).
    if tfdir-utask = '1'     "direct update task call
       or tfdir-utask = '3'.  "direct update task call, no later update

*     get identifier for current LUW
      call 'ThVBCall' id 'OPCODE' field get_vb_key
                      id 'VBKEY'  field %%vbkey-vbkey.
      free %_vb_calls.
      clear %_vb_calls_wa.

*     import table with already registered function modules
      import %_vb_calls from memory id %%vbkey.

      if sy-subrc = 0.
*       already got UUID for the parameters of the function module
        read table %_vb_calls index 1
          into %_vb_calls_wa transporting daten_id.
        if sy-subrc <> 0.
          message x675(00).
        endif.
      else.
*       get new UUID as key for the parameters of the function module
        try.
          %_vb_calls_wa-daten_id-vbkey = cl_system_uuid=>create_uuid_c22_static( ).
        catch cx_uuid_error.
          message x675(00).
        endtry.
      endif.

*     fill in name of function module
      %_vb_calls_wa-func_name = vb_func_name.
*     identify the function call by consecutive number
      describe table %_vb_calls lines %_vb_calls_wa-daten_id-vbkey+22.
      %_vb_calls_wa-data_temperature = cl_abap_stack_temperature=>get_temperature( ).
      append %_vb_calls_wa to %_vb_calls.

*     (re-) export the table to memory
      export %_vb_calls to memory id %%vbkey.
      free %_vb_calls.
*     return the identifier of this function call to call.rs1 to export
*     the corresponding parameters with the same identifier.
      vb_data_key = %_vb_calls_wa-daten_id.
    endif.
  endif.
endform.                    "%_get_vb_key

*----------------------------------------------------------------------
* FORM %_CALL_ROLLBACK
* Call ROLLBACK-Handling
* To be called by kernel code to perform rollback handling in ABAP
*----------------------------------------------------------------------
form %_call_rollback.                                       "#EC *
* Save SUBRC for returncode after EXCEPTION ERROR_MESSAGE
  local: sy-subrc, sy-msgty, sy-msgid, sy-msgno,
         sy-msgv1, sy-msgv2, sy-msgv3, sy-msgv4.
* Perform ROLLBACK with all registered rollback hooks
  rollback work.
endform.                    "%_call_rollback

* -------------------------------------------------------------------
* R O L L B A C K
* rollback work
* when called within CALL DIALOG --> no effect i.e. symmetrical to
* COMMIT WORK
* -------------------------------------------------------------------
form %_rollback.                                            "#EC *
  data: txend type c.
  data: l_oncom like sy-oncom.

* forbid ROLLBACK if already in ON COMMIT/ROLLBACK handling
  call 'GET_SWITCH_TXEND' id 'STATE' field txend.
  if txend = 'C' or txend = 'R'.
    message x086(00).
  endif.

  check sy-oncom <> 'N' and sy-oncom <> 'V' and
        sy-oncom <> 'E' and sy-oncom <> 'P'.

* change sy-oncom to avoid recursion
  l_oncom = sy-oncom.
  sy-oncom = 'E'.                      "E = Event Handling

* no escape out off this form other than ENDFORM
  system-call state_limit set.
* Hook for Process Information Infrastructure
  call function 'SPI_AGENT_ROLLBACK'.
* restore sy-oncom
  sy-oncom = l_oncom.

  call 'ThVBCall' id 'OPCODE'  field get_vb_key
                  id 'VBKEY'  field %%vbkey-vbkey.
  %_vbkey-vbkey = %%vbkey-vbkey.

* perform ON ROLLBACK orders
  perform %_process_p_o_r.
* free contents of memory and tables for update task
  free %_vb_calls.
  import %_vb_calls from memory id %%vbkey.
  loop at %_vb_calls.
    free memory id %_vb_calls-daten_id.
  endloop.
  free memory id %%vbkey.
  free %_vb_calls.

* free contents of memory and tables
  %_vbkey-vbkey = %%vbkey-vbkey.
  free memory id %_vbkey.
  free imode_orders.
  free orders.
  free imode_rb_orders.
  free rb_orders.
* for RTM test concerning POC during OS events
  free os_orders.
* end RTM

  if arfc_pending <> space.
    arfc_pending = space.
    call function 'ARFC_END_TRANSACTION'
      exporting
        mode = 'ROLLBACK'.
  endif.

*
* bgRFC
*
  if bgrfc_eot_action  ne 0. "something happened with bgRFC
    call method ('CL_BGRFC_DB_HELPER')=>ON_ROLLBACK.
  endif.

*
* Local DATA Queue (LDQ)
*
  if ldq_writer_eot_action  ne 0.  "something happened with LDQ-Writer
    call method ('CL_LDQ_UNIT_WRITER')=>on_rollback.
  endif.

  if ldq_reader_eot_action  ne 0.  "something happened with LDQ-Writer
    call method ('CL_LDQ_UNIT_READER')=>on_rollback.
  endif.

* reset marker on call stack.
  system-call state_limit reset.
endform.                    "%_rollback

* ---------------------------------------------------------------------
* FORM %_AFTER_ROLLBACK
* called from RSYN rollback.rs1
* ---------------------------------------------------------------------
form %_after_rollback.                                      "#EC *
  data: l_oncom like sy-oncom.

* ROLLBACK during POC, Update task or End Transaction event?
  check sy-oncom <> 'P' and sy-oncom <> 'E' and
        sy-oncom <> 'N' and sy-oncom <> 'V'.
* change sy-oncom to avoid recursion
  l_oncom = sy-oncom.
  sy-oncom = 'E'.                      "E = Event Handling
* no escape out off this form other than ENDFORM
  system-call state_limit set.
  call method cl_os_transaction_end_notifier=>raise_rollback_finished.
  call method cl_system_transaction_state=>raise_transaction_finished
    exporting
      kind = cl_system_transaction_state=>rollback_work.

* switch local update task to 'inactive'
  call 'SET_SWITCH_UTASK_OFF' id 'STATE' field 'N'.
* restore sy-oncom
  sy-oncom = l_oncom.

* reset marker on call stack.
  system-call state_limit reset.
endform.                    "%_after_rollback

* ---------------------------------------------------------------------
* FORM %_PROCESS_P_O_R
* Process PERFORM ON ROLLBACK orders
* ---------------------------------------------------------------------
form %_process_p_o_r.                                       "#EC *
  data: last_oncom like sy-oncom.
  data: rb_orders_wa       type %_commit_orders,
        imode_rb_orders_wa type %_commit_orders.

  last_oncom = sy-oncom.
  import imode_rb_orders from memory id %_vbkey.
  loop at imode_rb_orders into imode_rb_orders_wa.
    perform %_order_form_for_rollback
      using imode_rb_orders_wa-prog
            imode_rb_orders_wa-rout.
  endloop.
  free imode_rb_orders.
  sort rb_orders by u_level i_level.

* signal begin of ON ROLLBACK handling
  sy-oncom = 'P'.
  call 'SET_SWITCH_TXEND' id 'STATE' field 'R'.

  system-call state_limit set.
  loop at rb_orders into rb_orders_wa.
    perform (rb_orders_wa-rout)
          in program (rb_orders_wa-prog).
  endloop.
  system-call state_limit reset.
  free rb_orders.

* signal end of ON ROLLBACK
  sy-oncom = last_oncom.
  call 'SET_SWITCH_TXEND' id 'STATE' field ' '.
endform.                    "%_process_p_o_r

* ---------------------------------------------------------------------
* FORM SYSTEM_HOOK
* ---------------------------------------------------------------------
form system_hook.                                           "#EC CALLED
  sy-subrc = 0.
endform.                    "system_hook

* -------------------------------------------------------------------
* R E G I S T E R _ A F R C
* register ARFC call
* -------------------------------------------------------------------
form %_register_arfc.                                       "#EC *
  arfc_pending = 'X'.
endform.                    "%_register_arfc

* -------------------------------------------------------------------
* R E G I S T E R _ t R F C / q R F C independent from Update TASK
* -------------------------------------------------------------------
form %_register_trfc_no_wait_for_update.                    "#EC PREFIX_OK
  trfc_nowait_for_update = 'X'.
endform.

*-------------------------------------------------------------------
* register bgRFC actions
*-------------------------------------------------------------------
form %_register_bgrfc.                                       "#EC *
  bgrfc_eot_action = 1.
endform.                    "%_register_bgrfc

*-------------------------------------------------------------------
* register Local Data Queue (ldq) actions
*-------------------------------------------------------------------
form %_register_ldq_writer.                                 "#EC *
  ldq_writer_eot_action = 1.
endform.                    "%_register_ldq_writer

*&---------------------------------------------------------------------*
*&      Form  %_register_ldq_reader
*&---------------------------------------------------------------------*
*       text
*----------------------------------------------------------------------*
form %_register_ldq_reader.                                 "#EC *
  ldq_reader_eot_action = 1.
endform.                    "%_register_ldq_reader

* -------------------------------------------------------------------
* L I S T _ C O M M A N D
* -------------------------------------------------------------------
module list_command input.                                  "#EC *
  data: result type i.
*  IF sy-xcode(5) EQ 'PFILE'.
*    MESSAGE ID '02' TYPE 'I' NUMBER '016'.
*    CLEAR sy-xcode.
*  ENDIF.
  result = 0.

  call 'QUERY_LIST_TO_MEMORY' id 'RESULT' field result.
  if result = 1.
    sy-xcode = '%SMEX'.
  endif.

  check sy-xcode(1) = '%'.
  call function 'LIST_COMMAND'
    exporting
      command         = sy-xcode
    exceptions
      unknown_command = 4
      others          = 0.
  check sy-subrc = 0.
  clear: sy-ucomm, sy-xcode.
endmodule.                    "list_command INPUT

* R/3-Drucken Anfang
* -------------------------------------------------------------------
* P R I N T _ S T A R T
* -------------------------------------------------------------------
module print_start input.                                   "#EC *
  data: hex02 type x value '02'.
  data: display_mode.

* Korrektur Ralf Wendelgaß 20.5.98

  if sy-xcode = 'PRI'   or
     sy-xcode = 'PRINT' or
     sy-xcode = '%PRI' or
     sy-xcode = '%PRN'.

    display_mode = cl_abap_list_layout=>get_display_mode( ).

    sy-callr = 'OKPRI'.
* no print dialog if print icon was pressed
    if sy-xcode = '%PRN'.
      call function 'PRINT_REPORT_DEFAULT'
        exporting
          report = sy-cprog
          uc_display_mode = display_mode
        exceptions
          others = 99.
    else.
      call function 'PRINT_REPORT'
        exporting
          report = sy-cprog
          uc_display_mode = display_mode
        exceptions
          others = 99.
    endif.

* printing ok
    if sy-subrc = 0.

* cover page
      if sy-subty o hex02 and %_print-prbig <> space.
        perform %_%_cover_page(rsdbrunt).
      endif.
      sy-xcode = 'PRI'.

* errors occured or printout cancelled
    else.
      clear sy-xcode.
      message s015.
    endif.

  endif.

endmodule.                    "print_start INPUT
* R/3-Drucken Ende


* -------------------------------------------------------------------
* S Y N T A X C H E C K - Popup (143)
* -------------------------------------------------------------------
module sc_init output.                                      "#EC *
  tables: trdir, abmsg.
  set titlebar '001'.                                       "#EC *
  set pf-status 'SCMS' immediately.                         "#EC *
  select single * from trdir where name = abmsg-irepid.
endmodule.                    "sc_init OUTPUT

*---------------------------------------------------------------------*
*       MODULE SC_RESET                                               *
*---------------------------------------------------------------------*
*       ........                                                      *
*---------------------------------------------------------------------*
module sc_reset.                                            "#EC *
  leave to transaction ' '.
endmodule.                    "sc_reset


* -------------------------------------------------------------------
* L I S T _ E X I T
* return from "Listprocessing" (main list of report -> LIST_RETURN)
* -------------------------------------------------------------------
form %_list_exit.                                           "#EC *
  leave.
endform.                    "%_list_exit

* -------------------------------------------------------------------
* L I S T _ R E T U R N
* return from main list of report -> selection screen
* -------------------------------------------------------------------
form %_list_return.                                         "#EC *
  perform %_return_to_selscreen in program rsdbrunt if found.
endform.                    "%_list_return

*???????????????????????????????????????????????????????????????????????
form list_command ##NEEDED.                                 "#EC CALLED
endform.

* -------------------------------------------------------------------
* N E W - L I N E
* called by ab_trigg to force a line-skip after GET processing
* -------------------------------------------------------------------
form new-line ##FIELD_HYPHEN.                               "#EC CALLED
  new-line.
endform.

*&---------------------------------------------------------------------*
*&      Module  LEAVE_LIST  OUTPUT
*&---------------------------------------------------------------------*
*       text                                                           *
*----------------------------------------------------------------------*
*odule %_list_return output.
* perform %_return_to_selscreen in program rsdbrunt if found.
* leave screen.
*ndmodule.                             " LEAVE_LIST  OUTPUT
*&---------------------------------------------------------------------*
*&      Module  LIST_STRUCTURE_RECOGNIZER  OUTPUT
*&---------------------------------------------------------------------*
*       text
*----------------------------------------------------------------------*
module list_structure_recognizer output.
   cl_abap_list_parser=>refresh_lsr_container( ).
endmodule.                 " LIST_STRUCTURE_RECOGNIZER  OUTPUT
*&---------------------------------------------------------------------*
*&      Form  thew_list_masking
*&---------------------------------------------------------------------*
*       text
*----------------------------------------------------------------------*
*  -->  p1        text
*  <--  p2        text
*----------------------------------------------------------------------*
FORM thew_list_masking .

  DATA:
    lv_func       TYPE rs38l_fnam VALUE '/UIM/PBO_120_HOOK_LIST'.

  TRY.
      CALL FUNCTION 'FUNCTION_EXISTS'
        EXPORTING
          funcname           = lv_func
        EXCEPTIONS
          function_not_exist = 1
          OTHERS             = 2.
      IF sy-subrc = 0.
        CALL FUNCTION lv_func.
      ENDIF.
    CATCH cx_root.
  ENDTRY.


ENDFORM.

*&---------------------------------------------------------------------*
*&      Form  thew_list_masking2
*&---------------------------------------------------------------------*
*       advanced UI masking of special fields with helpid
*       called from kernel by ab_rperf from abwrite
*----------------------------------------------------------------------*
FORM thew_list_masking2.

  DATA:
    lv_func       TYPE rs38l_fnam VALUE '/UIM/PBO_WRITE_HOOK'.

  TRY.
      CALL FUNCTION 'FUNCTION_EXISTS'
        EXPORTING
          funcname           = lv_func
        EXCEPTIONS
          function_not_exist = 1
          OTHERS             = 2.
      IF sy-subrc = 0.

        FIELD-SYMBOLS:
          <in_p1>    TYPE any,
          <in_p2>    TYPE any,
          <inout_p3> TYPE any,
          <out_p4>   TYPE any.

        CALL 'AB_GET_C_PARMS' ID 'P1' FIELD <in_p1>    "field name
                              ID 'P2' FIELD <in_p2>    "ddic name
                              ID 'P3' FIELD <inout_p3>    "field value
                              ID 'P4' FIELD <out_p4>.    "flag is list masking

        CALL FUNCTION lv_func
          EXPORTING
            fieldname       = <in_p1>
            ddicname        = <in_p2>
          IMPORTING
            is_list_masking = <out_p4>
          CHANGING
            fieldvalue      = <inout_p3>.

        CALL 'AB_SET_C_PARMS' ID 'P3' FIELD <inout_p3>
                      ID 'P4' FIELD <out_p4>.    "#EC CI_CCALL CI_CCALL
      ENDIF.

    CATCH cx_root.
  ENDTRY.

ENDFORM.
```
