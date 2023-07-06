
@section( 'update-locations-modals' )

    <div class="modal fade draggable-modal ui-draggable in" id="updateModalPanel" tabindex="-1" data-backdrop="static" data-keyboard="false" role="dialog" data-attention-animation="false">
        <form id="updateLocationForm" class="form-material" action="{!! route( 'updateLocation' ) !!}" method="POST" enctype="multipart/form-data">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                <h4 class="modal-title" style="font-weight: 600;">
                    {!! _text( 'Konum Düzenleme Paneli' ) !!}
                </h4>
            </div>
            <div class="modal-body">
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="location_title-input">{!! _text( 'Konum Adı' ) !!}</label>
                        <span class="caption-subject font-red-thunderbird"><small> <em>{!! _text( 'Konum Adı Yazılmalıdır.' ) !!}</em></small></span>
                        <input type="text" name="location_title" class="form-control vt-validate clearable" id="location_title-input" placeholder="{!! _text( 'Konum Adı Girin' ) !!}" autocomplete="off" />
                        <input type="hidden" name="id"  id="id-input"value="" />
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="latitude-input">{!! _text( 'Enlem Değeri' ) !!}</label>
                        <span class="caption-subject font-red-thunderbird"><small> <em>{!! _text( 'Enlem Değeri Yazılmalıdır.' ) !!}</em></small></span>
                        <input type="text" name="latitude" class="form-control vt-validate clearable" id="latitude-input" placeholder="{!! _text( 'Enlem Değeri Girin' ) !!}" autocomplete="off" />
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="longitude-input">{!! _text( 'Boylam Değeri' ) !!}</label>
                        <span class="caption-subject font-red-thunderbird"><small> <em>{!! _text( 'Boylam Değeri Yazılmalıdır.' ) !!}</em></small></span>
                        <input type="text" name="longitude" class="form-control vt-validate clearable" id="longitude-input" placeholder="{!! _text( 'Boylam Değeri Girin' ) !!}" autocomplete="off" />
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="marker_colored-input">{!! _text( 'Marker Rengi' ) !!}</label>
                        <span class="caption-subject font-red-thunderbird"><small> <em>{!! _text( 'Marker Rengi Seçilmedir.' ) !!}</em></small></span>
                        <input type="color" name="marker_colored" value="#ff0000" class="form-control vt-validate clearable" id="marker_colored-input" />
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-primary pull-right" id="modalButton">{{ _text( 'Değişiklikleri Kaydet' ) }}</button>
                <button type="button" data-dismiss="modal" class="btn red-flamingo">
                    {!! _text( 'Kapat' ) !!}
                </button>
            </div>
        </form>
    </div>

@endsection
