<?php
/**
 * NINT web Hizmetleri Harafından Kodlanmıştır.
 * veriTakip.net, benimsehrimde.com, sehrimde.com, yakinimdaara.com ve sehirehberi.org
 * Hacı Ali MIZRAK | mizraklar@hotmail.com
 */
?>

@section( 'all-users-lists-modals' )

    <div class="modal fade draggable-modal ui-draggable in" id="filterModalPanel" tabindex="-1" data-backdrop="static" data-keyboard="false" role="dialog" data-attention-animation="false">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
            <h4 class="modal-title" style="font-weight: 600;">
                {!! _vtText( 'Filtre Paneli' ) !!}
            </h4>
        </div>
        <div class="modal-body">

            <div class="clearfix"></div>
        </div>
        <div class="modal-footer">
            <button type="button" data-dismiss="modal" class="btn red-flamingo">
                {!! _vtText( 'Kapat' ) !!}
            </button>
        </div>
    </div>

@endsection
