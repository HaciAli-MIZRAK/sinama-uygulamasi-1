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


/**
 * 1.
 * Bu functionnun Amacı dinamik listeleri listesini array ağacı haline getirmekdir.
 */
if(!function_exists('subSelect2Lists')):
    function subSelect2Lists( $arrayData = NULL, $parent_id = -1 ) {
        $arrayLists = [];
        foreach($arrayData AS $key => $value):
            if($value->parent_id == $parent_id):
                $children = subSelect2Lists( $arrayData, $value->id );
                if($children):
                    $value->children = $children;
                else:
                    $value->children = [];
                endif;
                $arrayLists[] = $value;
            endif;
        endforeach;
        return $arrayLists;
    } /** end subSelect2Lists( $arrayData = NULL, $parent_id = -1 ) **/
endif;

