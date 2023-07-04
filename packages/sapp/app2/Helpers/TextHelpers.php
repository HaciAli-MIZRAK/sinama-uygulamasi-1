<?php
/**
 *
 */

if(!function_exists('_text')):
    function _text( $message = NULL, $data = FALSE ) {

        if(isset($message) && $message != NULL):

            return sprintf($message, $data);

        endif;

    } /** end _text( $message = NULL, $data = FALSE ) **/

endif;
