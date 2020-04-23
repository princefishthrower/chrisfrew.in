---
title: Calculating Activity Amounts for Production and Process Orders with SAP ABAP
description:
date: "2018-01-03"
draft: false
starID: 10
postType: dev
---

_Edit June 1st, 2018:_

_There was ANOTHER issue with this code! There is something you need to add if you want to book custom goods movements for the retrograde materials. You can see how to do this in <a href="#footnote-6">footnote 6</a> for more._

_Edit April 19th, 2018:_

_There was a bug with this code! When we make the conversion to MIN, we forgot to overwrite_ `lv_unit` _to_ `MIN`_, so the conversion was correct, but the unit was left in hours, or_ `H` _! You can see this in the code comments with date 2018.04.19._

# First off, Congratulations! :confetti_ball:
<sup>And a happy new year! (If you're viewing this in the summer or something, see the date! :wink:)</sup>
## You've found the only post on the entire internet that describes the full process of calculating activity amounts for production order confirmations by programming it directly using SAP ABAP! :scream::scream::scream:
## I hope you use this post to maximum effectiveness, because it took me _four_ days to find, build, and get a working answer. :smile:

## The Problem

Let's jump right into ABAP programming: the go-to function module to calculate time ticket proposals for production orders is with function module `BAPI_PRODORDCONF_GET_TT_PROP`:

```abap
CALL FUNCTION 'BAPI_PRODORDCONF_GET_TT_PROP'
* EXPORTING
*   PROPOSE                  = ' '
* IMPORTING
*   RETURN                   =
  TABLES
    timetickets              =
*   GOODSMOVEMENTS           =
*   LINK_CONF_GOODSMOV       =
*   DETAIL_RETURN            =
          .
```

Likewise, there is a very similiar `BAPI_PROCORDCONF_GET_TT_PROP` for process orders:

```abap
CALL FUNCTION 'BAPI_PROCORDCONF_GET_TT_PROP'
* EXPORTING
*   PROPOSE                  = ' '
* IMPORTING
*   RETURN                   =
  TABLES
    timetickets              =
*   GOODSMOVEMENTS           =
*   LINK_CONF_GOODSMOV       =
*   DETAIL_RETURN            =
          .
```

Pretty similar. However, as part of my indentured servitude that is being a full-time employee, I spent a day tinkering, writing, and testing code with these function modules. No matter what combinations of inputs I provided, I couldn't get the _activity confirmation amount_ to be calculated, which are a very important part of the final calculation of the confirmation! (more on the actual final confirmation submission is also included in later on) From scrounging around on SCN and the SAP blog, I learned that many developers had the same issue with these functions. (Things like date, yield/scrap amounts, and the goods movements would be proposed just fine by these BAPIs.)

So, **calculating these activity confirmation amounts programmatically (in ABAP) will be the main focus of this post <sup><a href="#footnote-1">1</a></sup>.**

Unfortunately, with much more digging, the reason the two functions wouldn't produce activity confirmation amounts never became quite clear to me. I realized I would have to calculate them in a more manual manner and then add them to those BAPI structures `lt_timetickets` manually.

## The Calculation Function Module

Through SAP GUI in transaction `CO11N`, determining system-proposed confirmation amounts is easy enough by and asking the system to do the calculation for us <sup><a href="#footnote-2">2</a></sup>. My struggle was finding the programmatic way to do this in ABAP.

Anyone with significant production planning experience (i.e., not me :joy: ) knows that the actual formula behind the activity calculation is not with the activity itself, but with the work center _behind_ the activity <sup><a href="#footnote-3">3</a></sup>.

In transaction `CR03` (display work center), in the 'Costing' Tab, there is a 'Formula' button with the check symbol on it:

![GUI testing calculation](./test-formula.jpg)

This was my starting point to find any sort of function that could do this programmatically - with more time, I learned from SCN of a function that does exactly that! It's called `CR_WORKCENTER_FORMULA_CALC`!

Let's head on over to transaction `SE37` and test it ourselves!

![Yep, that's SAP](./error-test-frame.jpg)

:expressionless::expressionless::expressionless: shit... SAP, you had one job to do!

Fine. We'll do it ourselves. We can open up the source code of `CR_WORKCENTER_FORMULA_CALC` and set a breakpoint in the first line:

![The first possible line in the function we can breakpoint](./function-breakpoint.png)

and in CR03, drag our [debugging shortcut into the calculation window](https://chrisfrew.in/debugging-abap-with-sap-shortcut), and we press return SAP debugging's return button to jump out to whatever parent program is calling this function... <img src="return.png"/> and...

:pray: Violá! :pray: We've found where `CR_WORKCENTER_FORMULA_CALC` is called out in the wild!

![There you are `CR_WORKCENTER_FORMULA_CALC`](./function-found.png)

(For those deeply interested, you can find exactly where the function is called in SAP Program `SAPLCRA0`, Include `LCRA0F71`, line 55, at least for SAPGUI 740.)

![Calling program details](./form-program.png)

## The Details (The Hard Part)

So what the heck does SAP do with this function? Well, first, they are doing a do loop six times. Aha, we know why - because there can be a total of six confirmation values <sup><a href="#footnote-4">4</a></sup>  - SAP is by default looping over all of them.

Now for the function parameters themselves: they pass the work center code (`arbid`), the operation number (`rcrop`), the index of the confirmation (a value of 1-6), our 4 default values (`vgw`), and the date (`date`).

In turn, the function spits out the fixed value amount of the activity calculation (`value_fix`), the variable part (`value_var`), both in whatever unit the function gives out in `unit`, and `co_a` is for the cost center accounting <sup><a href="#footnote-5">5</a></sup>. There are actually four exceptions to this function, so I'm not sure why SAP internal is taking only two of them. In any case, there are other `IMPORTING` and `EXPORTING` parameters in the function signature, but this looks like a good starting point as a minimum. In fact, as you'll see below, the final working version of the code I created is almost exactly the same except where I found out with a bit of playing around.

So I mentioned the default values that must go into `vgw` - these are the four values that are the equivalent of those four fields we can type into in `COR3` for checking the formula, things like setup time, machine time, personnel setup, and personnel time. It might sound like a lot of work to hunt down these values, but luckily these are master data and can be determined with a few select statements, first from table `AFVC` 'operation within an order', and then table `PLPO` 'task list - operation/activity':

```abap
" this is the full key for table AFVC - operation within an order - for the routing number and counter - should always work with SELECT SINGLE
SELECT SINGLE * FROM afvc INTO ls_afvc
  WHERE aufpl = ls_operation-routing_no
  AND   aplzl = ls_operation-counter.

" this is the full key for table PLPO - task list - operation/activity - so it should always work with SELECT SINGLE
SELECT SINGLE * FROM plpo INTO ls_plpo
  WHERE plnty EQ ls_afvc-plnty
  AND plnnr EQ ls_afvc-plnnr
  AND plnkn EQ ls_afvc-plnkn
  AND zaehl EQ ls_afvc-zaehl.
```

The routing number `ls_operation-routing_no` and counter `ls_operation-counter` we've gotten from function `BAPI_PRODORD_GET_DETAIL`:

```abap
" need only the operations from the function
    ls_order_objects-operations = 'X'.
    lv_number = ls_orderid_so-low.

    CALL FUNCTION 'BAPI_PRODORD_GET_DETAIL'
      EXPORTING
        number        = lv_number
*       COLLECTIVE_ORDER       =
        order_objects = ls_order_objects
*     IMPORTING
*       RETURN        =
      TABLES
*       HEADER        =
*       POSITION      =
*       SEQUENCE      =
        operation     = lt_operation
*       TRIGGER_POINT =
*       COMPONENT     =
*       PROD_REL_TOOL =
      .
```

(There is plenty of SAP standard documentation and discussion on SCN on how to use `BAPI_PRODORD_GET_DETAIL`, so I'll leave that to you if you need more info :wink:. Here we are just getting the operation information from the order - that's all we need.)

We can finally move the corresponding fields of `ls_plpo` to `ls_vgw`:

```abap
MOVE-CORRESPONDING ls_plpo TO ls_vgw.
```

However, in addition to these four values, there are two more that are essential, that is the yield amount (`mgvrg`), and the unit (`meinh`)! We can pass them right into `ls_op` as well:

```abap
MOVE-CORRESPONDING ls_plpo TO ls_op.
ls_op-mgvrg = ls_yield_so-low.
ls_op-meinh = ls_conf_quan_unit_so-low.
```

Armed with our structures `ls_afvc`, `ls_op`, and `ls_vgw`, we are ready to call our function:

```abap
CALL FUNCTION 'CR_WORKCENTER_FORMULA_CALC' " You can see a SAP standard example with the function in the source code for transaction CR03 for costing formula: Program SAPLCRA0, Include LCRA0F71, Form FORMEL_RESULT_CALC, line 55
  EXPORTING
    arbid             = ls_afvc-arbid
    op                = ls_op
    vgw               = ls_vgw
    index             = sy-index
    date              = sy-datum
  IMPORTING
    value_fix          = lv_value_fix
    value_var         = lv_value_var
    unit              = lv_unit
  EXCEPTIONS
    missing_parameter = 1
    not_found         = 2
    division_by_zero  = 3
    OTHERS            = 4.
IF sy-subrc <> 0.
  CONCATENATE sy-msgno sy-msgid sy-msgv1 sy-msgv2 sy-msgv3 sy-msgv4 INTO es_entityset-error_message.
  APPEND es_entityset TO et_entityset.
ENDIF.
```

We want the total, right? Okay, we just add the fixed value and variable value part:

```abap
lv_value = lv_value_fix + lv_value_var. " total value is the sum of the fixed and variable values for this activity
```

A requirement by my company was to have all the activity confirmation values with the same unit (I find it cleaner anyway to have all the activity confirmation values in the same unit anyway). Unfortunately, the default unit for some of the activities was hours, so we have to take a small intermediary step and call a conversion function before we are truly done:

```abap
" convert any 'H' values to 'MIN'
IF lv_unit NE 'MIN'.
  CALL FUNCTION 'UNIT_CONVERSION_SIMPLE'
    EXPORTING
      input                = lv_value
      unit_in              = lv_unit
      unit_out             = 'MIN'
    IMPORTING
      output               = lv_output
    EXCEPTIONS
      conversion_not_found = 1
      division_by_zero     = 2
      input_invalid        = 3
      output_invalid       = 4
      overflow              = 5
      type_invalid         = 6
      units_missing        = 7
      unit_in_not_found    = 8
      unit_out_not_found   = 9
      OTHERS               = 10.
  IF sy-subrc <> 0.
    lo_logger->create_message( EXPORTING iv_log_handle = lv_log_handle iv_message = '' ). " add custom message to message log
    CONCATENATE sy-msgno sy-msgid sy-msgv1 sy-msgv2 sy-msgv3 sy-msgv4 INTO es_entityset-error_message.
    APPEND es_entityset TO et_entityset.
  ENDIF.
```
We then finally carry over this converted `lv_output` over to the `conf_activity` field for `lt_timetickets`, doing this for all 1-6 `conf_activity`'s:

```abap
CASE sy-index.
  WHEN 1.
    ls_timetickets-conf_activity1  = lv_output.
    ls_timetickets-conf_acti_unit1 = 'MIN'.
  WHEN 2.
    ls_timetickets-conf_activity2  = lv_output.
    ls_timetickets-conf_acti_unit2 = 'MIN'.
  WHEN 3.
    ls_timetickets-conf_activity3  = lv_output.
    ls_timetickets-conf_acti_unit3 = 'MIN'.
  WHEN 4.
    ls_timetickets-conf_activity4  = lv_output.
    ls_timetickets-conf_acti_unit4 = 'MIN'.
  WHEN 5.
    ls_timetickets-conf_activity5  = lv_output.
    ls_timetickets-conf_acti_unit5 = 'MIN'.
  WHEN 6.
    ls_timetickets-conf_activity6  = lv_output.
    ls_timetickets-conf_acti_unit6 = 'MIN'.
ENDCASE.
```

With that, we can call the final confirmation function, with all our calculated values wrapped up in `lt_timetickets`:

```abap
" create confirmation
CALL FUNCTION 'BAPI_PRODORDCONF_CREATE_TT'
*     EXPORTING
*       POST_WRONG_ENTRIES             = '0'
*       TESTRUN                        =
*       CALL_ON_INBOUND_QUEUE          = ' '
  IMPORTING
    return         = ls_return
  TABLES
    timetickets    = lt_timetickets
    goodsmovements = lt_goodsmovements
*       LINK_CONF_GOODSMOV             =
*       CHARACTERISTICS_WIPBATCH       =
*       LINK_CONF_CHAR_WIPBATCH        =
    detail_return  = lt_detail_return
*       CHARACTERISTICS_BATCH          =
*       LINK_GM_CHAR_BATCH             =
  EXCEPTIONS
    OTHERS         = 1.
IF sy-subrc <> 0.
  lo_logger->create_message( EXPORTING iv_log_handle = lv_log_handle iv_message = '' ). " add custom message to message log
  CONCATENATE sy-msgno sy-msgid sy-msgv1 sy-msgv2 sy-msgv3 sy-msgv4 INTO es_entityset-error_message.
  APPEND es_entityset TO et_entityset.
ENDIF.
```
If you were sharp, you realized all of this code is only on the operation level - so indeed, the six-level loop must be done each time, for each operation - we have to throw all the above code into a loop over our operations! See below for the full result!

## Production Orders
In summary, the full code looks like this:

**NOTE: the full code examples were written for a SAP Gateway environment - i.e. the server environment from a SAPUI5 OData call! If you try to copy and paste this code directly into something like a report or function, ABAP statements like:**

```abap
lt_filters = io_tech_request_context->get_filter( )->get_filter_select_options( ).
```

won't be in scope and won't compile without errors! However, if you are familiar with the CRUD based methods of the SAP Gateway backend, these will fit nicely into the `GET_ENTITYSET` method :smile:

```abap
DATA : lt_filters           TYPE           /iwbep/t_mgw_select_option,
           ls_filters           LIKE LINE OF lt_filters,
           lt_select_options    TYPE TABLE OF  /iwbep/s_cod_select_option,
           ls_plant_so          LIKE LINE OF lt_select_options,
           ls_orderid_so        LIKE LINE OF lt_select_options,
           ls_fin_conf_so       LIKE LINE OF lt_select_options,
           ls_dev_reason_so     LIKE LINE OF lt_select_options,
           ls_conf_text_so      LIKE LINE OF lt_select_options,
           ls_conf_quan_unit_so LIKE LINE OF lt_select_options,
           ls_yield_so          LIKE LINE OF lt_select_options,
           ls_scrap_so          LIKE LINE OF lt_select_options,
           lt_stg_loc           TYPE TABLE OF  /iwbep/s_cod_select_option,
           ls_stg_loc           LIKE LINE OF lt_stg_loc,
           lt_batch             TYPE TABLE OF  /iwbep/s_cod_select_option,
           ls_batch             LIKE LINE OF lt_batch,
           lt_reserv_no         TYPE TABLE OF  /iwbep/s_cod_select_option,
           ls_reserv_no         LIKE LINE OF lt_reserv_no,
           lt_res_item          TYPE TABLE OF  /iwbep/s_cod_select_option,
           ls_res_item          LIKE LINE OF lt_res_item,
           lt_entry_qnt         TYPE TABLE OF  /iwbep/s_cod_select_option,
           ls_entry_qnt         LIKE LINE OF lt_entry_qnt,
           lt_entry_uom         TYPE TABLE OF  /iwbep/s_cod_select_option,
           ls_entry_uom         LIKE LINE OF lt_entry_uom,
           ls_return            TYPE bapiret1,
           lt_goodsmovements    TYPE TABLE OF bapi2017_gm_item_create,
           ls_goodsmovements    LIKE LINE OF lt_goodsmovements,
           lv_reserv_lines      TYPE int4,
           lv_index             TYPE int4 VALUE 1,
           lt_detail_return     TYPE TABLE OF bapi_coru_return,
           ls_detail_return     LIKE LINE OF lt_detail_return,
           lv_log_handle        TYPE balloghndl,
           lv_message           TYPE char200,
           lo_logger            TYPE REF TO zcl_bc_app_logger,
           es_entityset         LIKE LINE OF et_entityset,
           lv_error_message     TYPE bapi_msg,
           ls_order_objects     TYPE bapi_pp_order_objects,
           lt_operation         TYPE TABLE OF bapi_order_operation1,
           ls_operation         LIKE LINE OF lt_operation,
           lt_timetickets       TYPE TABLE OF  bapi_pp_timeticket,
           ls_timetickets       LIKE LINE OF lt_timetickets,
           lv_number            TYPE bapi_order_key-order_number,
           ls_propose           TYPE bapi_pp_conf_prop,
           ls_op                TYPE rcrop,
           ls_vgw               TYPE rcrvgw,
           ls_afvc              TYPE afvc,
           ls_plpo              TYPE plpo,
           lv_value_fix         TYPE p DECIMALS 4,
           lv_value_var         TYPE p DECIMALS 4,
           lv_value             TYPE p DECIMALS 4,
           lv_unit              TYPE rcrvgw-vge01,
           lv_output            TYPE p DECIMALS 3.

           " Create a log instance
    CREATE OBJECT lo_logger
      EXPORTING
        iv_subobject = 'ZPP_APP'.
    lo_logger->create_log( IMPORTING ev_log_handle = lv_log_handle ).
    lo_logger->create_message( EXPORTING iv_log_handle = lv_log_handle iv_message = 'Begin Method PRODCONFIRMATION_GET_ENTITYSET.' ). " add custom message to message log

    "get $filter through the io_tech request (odata request)
    lt_filters = io_tech_request_context->get_filter( )->get_filter_select_options( ).

    " Process filters

    " for these below we just need the singular select option structure
    READ TABLE lt_filters WITH TABLE KEY property = 'PLANT' INTO ls_filters.
    lt_select_options = ls_filters-select_options.
    READ TABLE lt_select_options INTO ls_plant_so INDEX 1.

    CLEAR ls_filters.
    READ TABLE lt_filters WITH TABLE KEY property = 'ORDERID' INTO ls_filters.
    lt_select_options = ls_filters-select_options.
    READ TABLE lt_select_options INTO ls_orderid_so INDEX 1.

    CLEAR ls_filters.
    READ TABLE lt_filters WITH TABLE KEY property = 'FIN_CONF' INTO ls_filters.
    lt_select_options = ls_filters-select_options.
    READ TABLE lt_select_options INTO ls_fin_conf_so INDEX 1.

    CLEAR ls_filters.
    READ TABLE lt_filters WITH TABLE KEY property = 'DEV_REASON' INTO ls_filters.
    lt_select_options = ls_filters-select_options.
    READ TABLE lt_select_options INTO ls_dev_reason_so INDEX 1.

    CLEAR ls_filters.
    READ TABLE lt_filters WITH TABLE KEY property = 'CONF_TEXT' INTO ls_filters.
    lt_select_options = ls_filters-select_options.
    READ TABLE lt_select_options INTO ls_conf_text_so INDEX 1.

    CLEAR ls_filters.
    READ TABLE lt_filters WITH TABLE KEY property = 'CONF_QUAN_UNIT' INTO ls_filters.
    lt_select_options = ls_filters-select_options.
    READ TABLE lt_select_options INTO ls_conf_quan_unit_so INDEX 1.

    CLEAR ls_filters.
    READ TABLE lt_filters WITH TABLE KEY property = 'YIELD' INTO ls_filters.
    lt_select_options = ls_filters-select_options.
    READ TABLE lt_select_options INTO ls_yield_so INDEX 1.

    CLEAR ls_filters.
    READ TABLE lt_filters WITH TABLE KEY property = 'SCRAP' INTO ls_filters.
    lt_select_options = ls_filters-select_options.
    READ TABLE lt_select_options INTO ls_scrap_so INDEX 1.

    " for the following we need tables (make a loop and get the values from each)
    CLEAR ls_filters.
    READ TABLE lt_filters WITH TABLE KEY property = 'STGE_LOC' INTO ls_filters.
    lt_stg_loc = ls_filters-select_options.

    CLEAR ls_filters.
    READ TABLE lt_filters WITH TABLE KEY property = 'BATCH' INTO ls_filters.
    lt_batch = ls_filters-select_options.

    CLEAR ls_filters.
    READ TABLE lt_filters WITH TABLE KEY property = 'RESERV_NO' INTO ls_filters.
    lt_reserv_no = ls_filters-select_options.

    CLEAR ls_filters.
    READ TABLE lt_filters WITH TABLE KEY property = 'RES_ITEM' INTO ls_filters.
    lt_res_item = ls_filters-select_options.

    CLEAR ls_filters.
    READ TABLE lt_filters WITH TABLE KEY property = 'ENTRY_QNT' INTO ls_filters.
    lt_entry_qnt = ls_filters-select_options.

    CLEAR ls_filters.
    READ TABLE lt_filters WITH TABLE KEY property = 'ENTRY_UOM' INTO ls_filters.
    lt_entry_uom = ls_filters-select_options.

" Create goodsmovement structure for all the retroactive items
    DESCRIBE TABLE lt_reserv_no LINES lv_reserv_lines.
    DO lv_reserv_lines TIMES.
      ls_stg_loc = lt_stg_loc[ lv_index ].
      ls_batch = lt_batch[ lv_index ].
      ls_reserv_no = lt_reserv_no[ lv_index ].
      ls_res_item = lt_res_item[ lv_index ].
      ls_entry_qnt = lt_entry_qnt[ lv_index ].
      ls_entry_uom = lt_entry_uom[ lv_index ].
      ls_goodsmovements-plant = ls_plant_so-low. " fixed factory
      ls_goodsmovements-stge_loc = ls_stg_loc-low.
      ls_goodsmovements-batch = ls_batch-low.
      ls_goodsmovements-move_type = '261'. " fixed movement type
      ls_goodsmovements-item_text = 'Warenbewegung für Rückmeldung PP APP'.
      ls_goodsmovements-reserv_no = ls_reserv_no-low.
      ls_goodsmovements-res_item = ls_res_item-low.
      ls_goodsmovements-entry_qnt = ls_entry_qnt-low.
      ls_goodsmovements-entry_uom = ls_entry_uom-low.
      APPEND ls_goodsmovements TO lt_goodsmovements.
      lv_index = lv_index + 1.
    ENDDO.

    " need only the operations from the function
    ls_order_objects-operations = 'X'.
    lv_number = ls_orderid_so-low.

    CALL FUNCTION 'BAPI_PRODORD_GET_DETAIL'
      EXPORTING
        number        = lv_number
*       COLLECTIVE_ORDER       =
        order_objects = ls_order_objects
*     IMPORTING
*       RETURN        =
      TABLES
*       HEADER        =
*       POSITION      =
*       SEQUENCE      =
        operation     = lt_operation
*       TRIGGER_POINT =
*       COMPONENT     =
*       PROD_REL_TOOL =
      .

    " build structures for each step (each operation)
    LOOP AT lt_operation INTO ls_operation.
      CLEAR ls_timetickets.

      " this is the full key for table AFVC - Auftragsarbeitsvorgang for the routing number and counter - should always work with SELECT SINGLE
      SELECT SINGLE * FROM afvc INTO ls_afvc
        WHERE aufpl = ls_operation-routing_no
        AND   aplzl = ls_operation-counter.

      " this is the full key for table PLPO - Plan: Vorgang - so it should always work with SELECT SINGLE
      SELECT SINGLE * FROM plpo INTO ls_plpo
        WHERE plnty EQ ls_afvc-plnty
        AND plnnr EQ ls_afvc-plnnr
        AND plnkn EQ ls_afvc-plnkn
        AND zaehl EQ ls_afvc-zaehl.

      " now provide all the standard values (vorgabewert) VGW01, 02, etc into the calculation formula
      MOVE-CORRESPONDING ls_plpo TO ls_op.
      ls_op-mgvrg = ls_yield_so-low.
      ls_op-meinh = ls_conf_quan_unit_so-low.
      MOVE-CORRESPONDING ls_plpo TO ls_vgw.
      DO 6 TIMES. " for each activity (usually 4 activities here at my company, but there can be up to 6 activities total)
        IF sy-index EQ 1 AND ls_vgw-vgw01 EQ 0
        OR sy-index EQ 2 AND ls_vgw-vgw02 EQ 0
        OR sy-index EQ 3 AND ls_vgw-vgw03 EQ 0
        OR sy-index EQ 4 AND ls_vgw-vgw04 EQ 0f
        OR sy-index EQ 5 AND ls_vgw-vgw05 EQ 0
        OR sy-index EQ 6 AND ls_vgw-vgw06 EQ 0.
          CONTINUE. " skip and 0 values
        ENDIF.
        CALL FUNCTION 'CR_WORKCENTER_FORMULA_CALC' " You can see a SAP standard example with the function in the source code for transaction CR03 for costing formula: Program SAPLCRA0, Include LCRA0F71, Form FORMEL_RESULT_CALC, line 55
          EXPORTING
            arbid             = ls_afvc-arbid
            op                = ls_op
            vgw               = ls_vgw
            index             = sy-index
            date              = sy-datum
          IMPORTING
            value_fix          = lv_value_fix
            value_var         = lv_value_var
            unit              = lv_unit
          EXCEPTIONS
            missing_parameter = 1
            not_found         = 2
            division_by_zero  = 3
            OTHERS            = 4.
        IF sy-subrc <> 0.
          CONCATENATE sy-msgno sy-msgid sy-msgv1 sy-msgv2 sy-msgv3 sy-msgv4 INTO es_entityset-error_message.
          APPEND es_entityset TO et_entityset.
        ENDIF.

        lv_value = lv_value_fix + lv_value_var. " total value is the sum of the fixed and varible values for this activity

        " convert any 'H' values to 'MIN'
        IF lv_unit NE 'MIN'.
          CALL FUNCTION 'UNIT_CONVERSION_SIMPLE'
            EXPORTING
              input                = lv_value
              unit_in              = lv_unit
              unit_out             = 'MIN'
            IMPORTING
              output               = lv_output
            EXCEPTIONS
              conversion_not_found = 1
              division_by_zero     = 2
              input_invalid        = 3
              output_invalid       = 4
              overflow              = 5
              type_invalid         = 6
              units_missing        = 7
              unit_in_not_found    = 8
              unit_out_not_found   = 9
              OTHERS               = 10.
          IF sy-subrc <> 0.
            lo_logger->create_message( EXPORTING iv_log_handle = lv_log_handle iv_message = '' ). " add custom message to message log
            CONCATENATE sy-msgno sy-msgid sy-msgv1 sy-msgv2 sy-msgv3 sy-msgv4 INTO es_entityset-error_message.
            APPEND es_entityset TO et_entityset.
          ENDIF.
          lv_unit = 'MIN'. " 2018.04.19 - need to overwrite unit to MIN!
        ELSE.
          lv_output = lv_value. " copy over MIN value
        ENDIF.

        CASE sy-index.
          WHEN 1.
            ls_timetickets-conf_activity1  = lv_output.
            ls_timetickets-conf_acti_unit1 = 'MIN'.
          WHEN 2.
            ls_timetickets-conf_activity2  = lv_output.
            ls_timetickets-conf_acti_unit2 = 'MIN'.
          WHEN 3.
            ls_timetickets-conf_activity3  = lv_output.
            ls_timetickets-conf_acti_unit3 = 'MIN'.
          WHEN 4.
            ls_timetickets-conf_activity4  = lv_output.
            ls_timetickets-conf_acti_unit4 = 'MIN'.
          WHEN 5.
            ls_timetickets-conf_activity5  = lv_output.
            ls_timetickets-conf_acti_unit5 = 'MIN'.
          WHEN 6.
            ls_timetickets-conf_activity6  = lv_output.
            ls_timetickets-conf_acti_unit6 = 'MIN'.
        ENDCASE.
      ENDDO.

      " Now build the table to confirm the operations (Vorgänge)
      ls_timetickets-conf_no     = ls_operation-conf_no.
      ls_timetickets-orderid     = ls_orderid_so-low.
      ls_timetickets-sequence    = ls_operation-sequence_no.
      ls_timetickets-operation   = ls_operation-operation_number.
      ls_timetickets-work_cntr   = ls_operation-work_center. " Resource for process order, logdate, logtime, and posting date added to the table
      ls_timetickets-plant       = ls_plant_so-low.
      ls_timetickets-logdate     = sy-datlo.
      ls_timetickets-logtime     = sy-timlo.
      ls_timetickets-postg_date  = sy-datlo.
      ls_timetickets-yield = ls_yield_so-low.
      ls_timetickets-scrap = ls_scrap_so-low.
      ls_timetickets-fin_conf = ls_fin_conf_so-low. " also overwrite the proposed partial or final confirmation - take what the user provides!
      ls_timetickets-conf_quan_unit = ls_conf_quan_unit_so-low. " Also the unit
      APPEND ls_timetickets TO lt_timetickets.
    ENDLOOP.

    " create confirmation
    CALL FUNCTION 'BAPI_PRODORDCONF_CREATE_TT'
*     EXPORTING
*       POST_WRONG_ENTRIES             = '0'
*       TESTRUN                        =
*       CALL_ON_INBOUND_QUEUE          = ' '
      IMPORTING
        return         = ls_return
      TABLES
        timetickets    = lt_timetickets
        goodsmovements = lt_goodsmovements
*       LINK_CONF_GOODSMOV             =
*       CHARACTERISTICS_WIPBATCH       =
*       LINK_CONF_CHAR_WIPBATCH        =
        detail_return  = lt_detail_return
*       CHARACTERISTICS_BATCH          =
*       LINK_GM_CHAR_BATCH             =
      EXCEPTIONS
        OTHERS         = 1.
    IF sy-subrc <> 0.
      lo_logger->create_message( EXPORTING iv_log_handle = lv_log_handle iv_message = '' ). " add custom message to message log
      CONCATENATE sy-msgno sy-msgid sy-msgv1 sy-msgv2 sy-msgv3 sy-msgv4 INTO es_entityset-error_message.
      APPEND es_entityset TO et_entityset.
    ENDIF.

```

## Process Orders

Because SAP is ever-so-special, process orders have a slightly different program process due to a few name changes. Here is a summary of some of those name and type changes:

<hr/>

| Topic | Production Orders | Process Orders |
| ------- | ----------------- | -------------- |
| Name of the 'steps' in your process or production order | phase/activity (I've seen both names, ABAP uses mostly 'phase') | operation |
| Get order detail of order | `BAPI_PRODORD_GET_DETAIL` | `BAPI_PROCORD_GET_DETAIL` |
| detail of order 'step' type | `bapi_order_phase`  |  `bapi_order_operation1` |
| Function for timeticket proposals | `BAPI_PRODORD_GET_DETAIL` | `BAPI_PROCORD_GET_DETAIL` |
| Function for order confirmation | `BAPI_PRODORDCONF_CREATE_TT` | `BAPI_PROCORDCONF_CREATE_TT` |
| `timetickets` `TYPE` in order confirmation function | `bapi_pp_timeticket` | `bapi_pi_timeticket1` |

<hr/>

There are more, but you can find those in the code for yourself. The important thing to notice is that the key challenging part here, calculating the confirmation activity amounts, uses the same internal function module, ``

Here's the code for calculating activities for process orders - _note the slight change in all the variable names!_ - and be careful with your types (carefully look over the `DATA:` statement), otherwise you'll get :boom:**exploding runtime errors**:boom: when you try to confirm something with one of our two main functions and you pass, for example, the  `lt_timetickets` with the production type ``, and you pass it into the of the _process_ order function module.

```abap
  DATA : lt_filters           TYPE           /iwbep/t_mgw_select_option,
         ls_filters           LIKE LINE OF lt_filters,
         lt_select_options    TYPE TABLE OF  /iwbep/s_cod_select_option,
         ls_plant_so          LIKE LINE OF lt_select_options,
         ls_orderid_so        LIKE LINE OF lt_select_options,
         ls_fin_conf_so       LIKE LINE OF lt_select_options,
         ls_dev_reason_so     LIKE LINE OF lt_select_options,
         ls_conf_text_so      LIKE LINE OF lt_select_options,
         ls_conf_quan_unit_so LIKE LINE OF lt_select_options,
         ls_yield_so          LIKE LINE OF lt_select_options,
         ls_scrap_so          LIKE LINE OF lt_select_options,
         ls_stge_loc_so       LIKE LINE OF lt_select_options,
         ls_batch_so          LIKE LINE OF lt_select_options,
         ls_reserv_no_so      LIKE LINE OF lt_select_options,
         ls_res_item_so       LIKE LINE OF lt_select_options,
         ls_entry_qnt_so      LIKE LINE OF lt_select_options,
         ls_entry_uom_so      LIKE LINE OF lt_select_options,
         lt_stg_loc           TYPE TABLE OF  /iwbep/s_cod_select_option,
         ls_stg_loc           LIKE LINE OF lt_stg_loc,
         lt_batch             TYPE TABLE OF  /iwbep/s_cod_select_option,
         ls_batch             LIKE LINE OF lt_batch,
         lt_reserv_no         TYPE TABLE OF  /iwbep/s_cod_select_option,
         ls_reserv_no         LIKE LINE OF lt_reserv_no,
         lt_res_item          TYPE TABLE OF  /iwbep/s_cod_select_option,
         ls_res_item          LIKE LINE OF lt_res_item,
         lt_entry_qnt         TYPE TABLE OF  /iwbep/s_cod_select_option,
         ls_entry_qnt         LIKE LINE OF lt_entry_qnt,
         lt_entry_uom         TYPE TABLE OF  /iwbep/s_cod_select_option,
         ls_entry_uom         LIKE LINE OF lt_entry_uom,
         ls_return            TYPE bapiret1,
         lt_goodsmovements    TYPE TABLE OF bapi2017_gm_item_create,
         ls_goodsmovements    LIKE LINE OF lt_goodsmovements,
         lv_reserv_lines      TYPE int4,
         lv_index             TYPE int4 VALUE 1,
         lt_detail_return     TYPE TABLE OF bapi_coru_return,
         ls_detail_return     LIKE LINE OF lt_detail_return,
         lv_log_handle        TYPE balloghndl,
         lv_message           TYPE char200,
         lo_logger            TYPE REF TO zcl_bc_app_logger,
         es_entityset         LIKE LINE OF et_entityset,
         lv_error_message     TYPE bapi_msg,
         ls_order_objects     TYPE bapi_pi_order_objects,
         lt_phase             TYPE TABLE OF bapi_order_phase,
         ls_phase             LIKE LINE OF lt_phase,
         lt_timetickets       TYPE TABLE OF bapi_pi_timeticket1,
         ls_timetickets       LIKE LINE OF lt_timetickets,
         lv_number            TYPE bapi_order_key-order_number,
         ls_op                TYPE rcrop,
         ls_vgw               TYPE rcrvgw,
         ls_afvc              TYPE afvc,
         ls_plpo              TYPE plpo,
         lv_value_fix         TYPE p DECIMALS 4,
         lv_value_var         TYPE p DECIMALS 4,
         lv_value             TYPE p DECIMALS 4,
         lv_unit              TYPE rcrvgw-vge01,
         lv_output            TYPE p DECIMALS 3.

  FIELD-SYMBOLS: <fs_timetickets> LIKE LINE OF lt_timetickets.

  " create a log instance
  CREATE OBJECT lo_logger
    EXPORTING
      iv_subobject = 'ZPP_APP'.
  lo_logger->create_log( IMPORTING ev_log_handle = lv_log_handle ).
  lo_logger->create_message( EXPORTING iv_log_handle = lv_log_handle iv_message = 'Begin Method PROCCONFIRMATION_GET_ENTITYSET.' ). " add custom message to message log

  "get $filter through the io_tech request (odata request)
  lt_filters = io_tech_request_context->get_filter( )->get_filter_select_options( ).

  " Process filters

  " for these below we just need the singular select option structure
  READ TABLE lt_filters WITH TABLE KEY property = 'PLANT' INTO ls_filters.
  lt_select_options = ls_filters-select_options.
  READ TABLE lt_select_options INTO ls_plant_so INDEX 1.

  CLEAR ls_filters.
  READ TABLE lt_filters WITH TABLE KEY property = 'ORDERID' INTO ls_filters.
  lt_select_options = ls_filters-select_options.
  READ TABLE lt_select_options INTO ls_orderid_so INDEX 1.

  CLEAR ls_filters.
  READ TABLE lt_filters WITH TABLE KEY property = 'FIN_CONF' INTO ls_filters.
  lt_select_options = ls_filters-select_options.
  READ TABLE lt_select_options INTO ls_fin_conf_so INDEX 1.

  CLEAR ls_filters.
  READ TABLE lt_filters WITH TABLE KEY property = 'DEV_REASON' INTO ls_filters.
  lt_select_options = ls_filters-select_options.
  READ TABLE lt_select_options INTO ls_dev_reason_so INDEX 1.

  CLEAR ls_filters.
  READ TABLE lt_filters WITH TABLE KEY property = 'CONF_TEXT' INTO ls_filters.
  lt_select_options = ls_filters-select_options.
  READ TABLE lt_select_options INTO ls_conf_text_so INDEX 1.

  CLEAR ls_filters.
  READ TABLE lt_filters WITH TABLE KEY property = 'CONF_QUAN_UNIT' INTO ls_filters.
  lt_select_options = ls_filters-select_options.
  READ TABLE lt_select_options INTO ls_conf_quan_unit_so INDEX 1.

  CLEAR ls_filters.
  READ TABLE lt_filters WITH TABLE KEY property = 'YIELD' INTO ls_filters.
  lt_select_options = ls_filters-select_options.
  READ TABLE lt_select_options INTO ls_yield_so INDEX 1.

  CLEAR ls_filters.
  READ TABLE lt_filters WITH TABLE KEY property = 'SCRAP' INTO ls_filters.
  lt_select_options = ls_filters-select_options.
  READ TABLE lt_select_options INTO ls_scrap_so INDEX 1.

  " for the following we need tables (make a loop and get the values from each)
  CLEAR ls_filters.
  READ TABLE lt_filters WITH TABLE KEY property = 'STGE_LOC' INTO ls_filters.
  lt_stg_loc = ls_filters-select_options.

  CLEAR ls_filters.
  READ TABLE lt_filters WITH TABLE KEY property = 'BATCH' INTO ls_filters.
  lt_batch = ls_filters-select_options.

  CLEAR ls_filters.
  READ TABLE lt_filters WITH TABLE KEY property = 'RESERV_NO' INTO ls_filters.
  lt_reserv_no = ls_filters-select_options.

  CLEAR ls_filters.
  READ TABLE lt_filters WITH TABLE KEY property = 'RES_ITEM' INTO ls_filters.
  lt_res_item = ls_filters-select_options.

  CLEAR ls_filters.
  READ TABLE lt_filters WITH TABLE KEY property = 'ENTRY_QNT' INTO ls_filters.
  lt_entry_qnt = ls_filters-select_options.

  CLEAR ls_filters.
  READ TABLE lt_filters WITH TABLE KEY property = 'ENTRY_UOM' INTO ls_filters.
  lt_entry_uom = ls_filters-select_options.

  " Create goodsmovement structure for all the retroactive items
  DESCRIBE TABLE lt_reserv_no LINES lv_reserv_lines.
  DO lv_reserv_lines TIMES.
    ls_stg_loc = lt_stg_loc[ lv_index ].
    ls_batch = lt_batch[ lv_index ].
    ls_reserv_no = lt_reserv_no[ lv_index ].
    ls_res_item = lt_res_item[ lv_index ].
    ls_entry_qnt = lt_entry_qnt[ lv_index ].
    ls_entry_uom = lt_entry_uom[ lv_index ].
    ls_goodsmovements-plant = ls_plant_so-low. " fixed factory
    ls_goodsmovements-stge_loc = ls_stg_loc-low.
    ls_goodsmovements-batch = ls_batch-low.
    ls_goodsmovements-move_type = '261'. " fixed movement type
    ls_goodsmovements-item_text = 'Warenbewegung für Rückmeldung PP APP'.
    ls_goodsmovements-reserv_no = ls_reserv_no-low.
    ls_goodsmovements-res_item = ls_res_item-low.
    ls_goodsmovements-entry_qnt = ls_entry_qnt-low.
    ls_goodsmovements-entry_uom = ls_entry_uom-low.
    APPEND ls_goodsmovements TO lt_goodsmovements.
    lv_index = lv_index + 1.
  ENDDO.

  ls_order_objects-phases = 'X'.
  lv_number = ls_orderid_so-low.

  CALL FUNCTION 'BAPI_PROCORD_GET_DETAIL'
    EXPORTING
      number        = lv_number
*       COLLECTIVE_ORDER       =
      order_objects = ls_order_objects
*     IMPORTING
*       RETURN        =
    TABLES
*       HEADER        =
*       POSITION      =
*       SEQUENCE      =
      phase         = lt_phase
*       TRIGGER_POINT =
*       COMPONENT     =
*       PROD_REL_TOOL =
    .

  LOOP AT lt_phase INTO ls_phase. " for each phase - create both the activities table and timetickets table
    CLEAR ls_timetickets.

    " this is the full key for table AFVC - Auftragsarbeitsvorgang for the routing number and counter - should always work with SELECT SINGLE
    SELECT SINGLE * FROM afvc INTO ls_afvc
      WHERE aufpl = ls_phase-routing_no
      AND   aplzl = ls_phase-counter.

    " this is the full key for table PLPO - Plan: Vorgang - so it should always work with SELECT SINGLE
    SELECT SINGLE * FROM plpo INTO ls_plpo
      WHERE plnty EQ ls_afvc-plnty
      AND plnnr EQ ls_afvc-plnnr
      AND plnkn EQ ls_afvc-plnkn
      AND zaehl EQ ls_afvc-zaehl.

    " now provide all the standard values (vorgabewert) VGW01, 02, etc into the calculation formula
    MOVE-CORRESPONDING ls_plpo TO ls_op.
    ls_op-mgvrg = ls_yield_so-low.
    ls_op-meinh = ls_conf_quan_unit_so-low.
    MOVE-CORRESPONDING ls_plpo TO ls_vgw.
    DO 6 TIMES. " for each activity (usually 4 activities here at company, but there can be up to 6 activities total)
      IF sy-index EQ 1 AND ls_vgw-vgw01 EQ 0
      OR sy-index EQ 2 AND ls_vgw-vgw02 EQ 0
      OR sy-index EQ 3 AND ls_vgw-vgw03 EQ 0
      OR sy-index EQ 4 AND ls_vgw-vgw04 EQ 0
      OR sy-index EQ 5 AND ls_vgw-vgw05 EQ 0
      OR sy-index EQ 6 AND ls_vgw-vgw06 EQ 0.
        CONTINUE. " skip and 0 values
      ENDIF.
      CALL FUNCTION 'CR_WORKCENTER_FORMULA_CALC' " You can see a SAP standard example with the function in the source code for transaction CR03 for costing formula: Program SAPLCRA0, Include LCRA0F71, Form FORMEL_RESULT_CALC, line 55
        EXPORTING
          arbid             = ls_afvc-arbid
          op                = ls_op
          vgw               = ls_vgw
          index             = sy-index
          date              = sy-datum
        IMPORTING
          value_fix         = lv_value_fix
          value_var         = lv_value_var
          unit              = lv_unit
        EXCEPTIONS
          missing_parameter = 1
          not_found         = 2
          division_by_zero  = 3
          OTHERS            = 4.
      IF sy-subrc <> 0.
        CONCATENATE sy-msgno sy-msgid sy-msgv1 sy-msgv2 sy-msgv3 sy-msgv4 INTO es_entityset-error_message.
        APPEND es_entityset TO et_entityset.
      ENDIF.

      lv_value = lv_value_fix + lv_value_var. " total value is the sum of the fixed and varible values for this activity

      " Convert any 'H' values to 'MIN'
      IF lv_unit NE 'MIN'.
        CALL FUNCTION 'UNIT_CONVERSION_SIMPLE'
          EXPORTING
            input                = lv_value
            unit_in              = lv_unit
            unit_out             = 'MIN'
          IMPORTING
            output               = lv_output
          EXCEPTIONS
            conversion_not_found = 1
            division_by_zero     = 2
            input_invalid        = 3
            output_invalid       = 4
            overflow             = 5
            type_invalid         = 6
            units_missing        = 7
            unit_in_not_found    = 8
            unit_out_not_found   = 9
            OTHERS               = 10.
        IF sy-subrc <> 0.
          lo_logger->create_message( EXPORTING iv_log_handle = lv_log_handle iv_message = '' ). " add custom message to message log
          CONCATENATE sy-msgno sy-msgid sy-msgv1 sy-msgv2 sy-msgv3 sy-msgv4 INTO es_entityset-error_message.
          APPEND es_entityset TO et_entityset.
        ENDIF.
        lv_unit = 'MIN'. " 2018.04.19 - need to overwrite unit to MIN!
      ELSE.
        lv_output = lv_value. " copy over MIN value
      ENDIF.

      CASE sy-index.
        WHEN 1.
          ls_timetickets-conf_activity1  = lv_output.
          ls_timetickets-conf_acti_unit1 = 'MIN'.
        WHEN 2.
          ls_timetickets-conf_activity2  = lv_output.
          ls_timetickets-conf_acti_unit2 = 'MIN'.
        WHEN 3.
          ls_timetickets-conf_activity3  = lv_output.
          ls_timetickets-conf_acti_unit3 = 'MIN'.
        WHEN 4.
          ls_timetickets-conf_activity4  = lv_output.
          ls_timetickets-conf_acti_unit4 = 'MIN'.
        WHEN 5.
          ls_timetickets-conf_activity5  = lv_output.
          ls_timetickets-conf_acti_unit5 = 'MIN'.
        WHEN 6.
          ls_timetickets-conf_activity6  = lv_output.
          ls_timetickets-conf_acti_unit6 = 'MIN'.
      ENDCASE.
    ENDDO.

    " Also build the table to confirm the operations (Vorgänge)
    ls_timetickets-conf_no    = ls_phase-conf_no.
    ls_timetickets-orderid    = ls_orderid_so-low.
    ls_timetickets-phase      = ls_phase-operation_number.
    ls_timetickets-resource   = ls_phase-resource. " Resource in process orders is the equivalent of work_center (wrk_cntr) for production orders
    ls_timetickets-plant      = ls_plant_so-low.
    ls_timetickets-logdate    = sy-datlo.
    ls_timetickets-logtime    = sy-timlo.
    ls_timetickets-postg_date = sy-datlo.
    ls_timetickets-yield = ls_yield_so-low.
    ls_timetickets-scrap = ls_scrap_so-low.
    ls_timetickets-fin_conf = ls_fin_conf_so-low. " also overwrite the proposed tiel oder endruckmeldung - take what the user provides!
    ls_timetickets-conf_quan_unit = ls_conf_quan_unit_so-low. " Also the unit
    APPEND ls_timetickets TO lt_timetickets.
  ENDLOOP.

  CALL FUNCTION 'BAPI_PROCORDCONF_CREATE_TT'
*     EXPORTING
*       POST_WRONG_ENTRIES             = '0'
*       TESTRUN                        =
    IMPORTING
      return         = ls_return
    TABLES
      timetickets    = lt_timetickets
      goodsmovements = lt_goodsmovements
*       LINK_CONF_GOODSMOV             =
*       CHARACTERISTICS_WIPBATCH       =
*       LINK_CONF_CHAR_WIPBATCH        =
*       CHARACTERISTICS_BATCH          =
*       LINK_GM_CHAR_BATCH             =
      detail_return  = lt_detail_return
    EXCEPTIONS
      OTHERS         = 1.
  IF sy-subrc <> 0.
    lo_logger->create_message( EXPORTING iv_log_handle = lv_log_handle iv_message = '' ). " add custom message to message log
    CONCATENATE sy-msgno sy-msgid sy-msgv1 sy-msgv2 sy-msgv3 sy-msgv4 INTO es_entityset-error_message.
    APPEND es_entityset TO et_entityset.
  ENDIF.
  IF ls_return IS NOT INITIAL.
    LOOP AT lt_detail_return INTO ls_detail_return WHERE type EQ 'E'.
      lv_error_message = ls_detail_return-message.
    ENDLOOP.
    CONCATENATE 'Fehler bei der Rückmeldung: ' lv_error_message INTO lv_message.
    lo_logger->create_message( EXPORTING iv_log_handle = lv_log_handle iv_message = lv_message ). " add custom message to message log
    es_entityset-error_message = lv_error_message.
    APPEND es_entityset TO et_entityset.
  ENDIF.

  lo_logger->create_message( EXPORTING iv_log_handle = lv_log_handle iv_message = 'Ende Method PROCCONFIRMATION_GET_ENTITYSET.' ). " add custom message to message log
  lo_logger->save_log( EXPORTING iv_log_handle = lv_log_handle ).

  " FB Documentation says COMMIT WORK is required
  CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'
    EXPORTING
      wait = 'X'.
  COMMIT WORK AND WAIT.
```

## Final Comments

Whew. Did it feel like a marathon? :runner: Because it felt to _me_ like a marathon all that time I was scratching my head. I hope you all enjoyed and found this post useful for a not-so-often programmed function of this production planning section of SAP.

Another note and quick plug :smile: I hope everyone can appreciate the time I put into creating these posts (_hint:_ posts this long take a **LONG** time to write!). It would make me happy and give me the motivation to keep writing these detailed ABAP posts if you'd consider donating (in the footer of any page on this blog) I have a [PayPal.me link](https://www.paypal.me/chrisfrewin), and I'm also an Ethereum developer if you'd like to donate Ether or if you would like to donate some RaiBlocks, as I am a RaiBlocks enthusiast if you would prefer to donate in that way.

:poop: Ok, plug done! :poop:

Cheers! :beer:

<hr/>

# Footnotes

<div id="footnote-1">
1. Activities/phases are for production orders; Operations are for process orders. From this point onward, I will refer just to activities, since this post focuses on production orders. I also post the adjacent code for process orders in this post.
</div>

<div id="footnote-2">
2. I have to give credit where credit is due! I received a lot of assistance from our production planning module supervisor - he showed me the transactions that finally got me to a working result. :thumbsup:
</div>

<div id="footnote-3">
3. You can set up your production planning (PP) module to give you a proposal amount for the activities, directly when you are doing confirmations transaction <span style="font-family:'Courier New'">CO11N</span>:

Upon pressing 'enter' for with a new amount:
![Automatic calculation of confirmation activities by the System in transaction CO11N](./co11n-1.jpg)

Pressing 'OK' for this window, we get a popup:

![Filling confirmation activities by hand in transaction CO11N](./co11n-2.jpg)

We see that the Labor time is provided here. It's likely 30 min for a full 100 KG, since the system is proposing only 15 minutes for 50 KG, half of what the full order amount should be. (I know, it's not a full four field example - but values would also be proposed if you had more fields like machine time, machine set-up, etc.)
</div>

<div id="footnote-4">
4. Note: At my company, we usually use only up to four confirmation activities. Note that there can be up to six, but for this example, we'll say that the confirmation process has only a maximum of four.
</div>

<div id="footnote-5">
5. I ended up determining that you can exclude parameter `co_a` without any issues - however, this may be how the settings at my own company work - you can look deeper into the SAP example to include it.
</div>

<div id="footnote-6">
6. This issue does not affect the confirmation formulas, but rather the goods movements in the retrograde ingredients - specifically when the goods movements are to be overridden, for example with a batch split for a retrograde material, or a custom under- or over- amount of a retrograde material. For the rare case where an employee wanted to book some of our retrograde materials from various batch numbers and warehouse locations, they noticed in these custom goods movements with the confirmation were not being added; but rather always the default SAP-calculated amounts. After some head scratching, I found it all has to do with function module <span style="font-family:'Courier New'">BAPI_PRODORDCONF_CREATE_TT</span> (or <span style="font-family:'Courier New'">BAPI_PROCORDCONF_CREATE_TT</span> depending on your use case) - I was not passing in an important parameter which allows exactly this desired override behavior:

<pre>
LinkConfGoodsmov
The assignment of the goods movements to a confirmation is effected
via the LinkConfGoodsmov table. There must be an entry in this table
for every entry in the Goodsmovements table. The index in the
LinkConfGoodsmov-Index_Confirm field refers to the line of the
associated confirmation in the Timetickets table and the index in
the LinkConfGoodsmov-Index_Goodsmov field refers the associated
goods movement in the Goodsmovements table.
If you want to prevent a goods movement from being posted for a
confirmation according to the standard logic, make an entry in the
LinkConfGoodsmov table as well as in the Timetickets table. The
index in the LinkConfGoodsmov-Index_Confirm field refers to the line
of the associated confirmation in the Timetickets table. Enter the
initial value 0 in the LinkConfGoodsmov-Index_Goodsmov field. It is
not necessary to make an entry in the Goodsmovements table in this
case.
If there is no entry in the LinkConfGoodsmov table for a
confirmation, goods movements are determined for backflushing and
automatic goods receipt using the standard logic.
</pre>

We needed to add the following too our goods movements loop (already added in the code above! :smile:):

```abap
BLAH
```

</div>




