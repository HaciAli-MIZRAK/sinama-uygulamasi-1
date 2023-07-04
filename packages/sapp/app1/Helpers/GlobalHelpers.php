<?php
/**
 *
 */

use Symfony\Component\Finder\Finder;

$finder = new Finder();

$finder->files()->in(__DIR__);

foreach($finder AS $value):

    if($value !== 'GlobalHelpers.php'):

        if(!file_exists($value->getRelativePathname())):

            require_once $value->getRelativePathname();

        endif;

    endif;

endforeach;
