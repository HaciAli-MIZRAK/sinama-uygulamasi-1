

@section( 'modul-add-locations-cssx' )

    <link href="{!! URL::asset( 'assets/sapp_1/cssx/minimal/_all.css' ) !!}" rel="stylesheet" type="text/css" />

@endsection

@section( 'add-locations' )

    <form id="postLocationForm" class="form-material" action="{!! route( 'createLocation' ) !!}" method="POST" enctype="multipart/form-data">

        <div class="row" style="margin-top: 20px;">
            <div class="col-md-9" style="padding-right: 4px;">
                <div>
                    <div class="portlet light bordered">
                        <div class="portlet-title">
                            <div class="caption">
                                <i class="icon-social-dropbox font-blue-sharp"></i>
                                <span class="caption-subject font-blue-sharp bold">{!! _text('Konum Ekle') !!}</span>
                            </div>
                            <div class="actions" id="actions">
                                <i class="icon-support font-red-thunderbird"></i>
                                <span class="caption-subject font-red-thunderbird">
                                    <small>
                                        <em>
                                            {!! _text('Konum Ekle') !!}
                                            {!! _text( ' Lütfen Tüm Alanları Doldurun!' ) !!}
                                        </em>
                                    </small>
                                </span>
                            </div>
                        </div>
                        <div class="portlet-body padding-0">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="location_title-input">{!! _text( 'Konum Adı' ) !!}</label>
                                    <span class="caption-subject font-red-thunderbird"><small> <em>{!! _text( 'Konum Adı Yazılmalıdır.' ) !!}</em></small></span>
                                    <input type="text" name="location_title" class="form-control vt-validate clearable" id="location_title-input" placeholder="{!! _text( 'Konum Adı Girin' ) !!}" autocomplete="off" />
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

                            <div class="clearfix"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3" style="padding-left: 4px;">
                <div>
                    <div class="portlet light bordered">
                        <div class="portlet-title">
                            <div class="caption">
                                <i class="icon-social-dropbox font-blue-sharp"></i>
                                <span class="caption-subject font-blue-sharp bold">{!! _text( 'Konum Detayları' ) !!}</span>
                            </div>
                            <div class="actions"></div>
                        </div>
                        <div class="portlet-body" style="padding: 0;">
                            <div class="col-md-12" style="margin: 0px;padding: 0;">
                                <div class="form-group">
                                    <label for="marker_colored-input">{!! _text( 'Marker Rengi' ) !!}</label>
                                    <span class="caption-subject font-red-thunderbird"><small> <em>{!! _text( 'Marker Rengi Seçilmedir.' ) !!}</em></small></span>
                                    <input type="color" name="marker_colored" value="#ff0000" class="form-control vt-validate clearable" id="marker_colored-input" />
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                        <hr />
                        <div class="clearfix margin-top-10">
                            <button type="submit" class="btn btn-primary pull-right">{{ _text( 'Değişiklikleri Kaydet' ) }}</button>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>
        </div>
    </form>

@endsection

@section( 'modul-add-locations-jsx' )

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

@endsection

@section( 'modul-add-locations-jsx2' )

    <script>
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                //'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        /**
         * Bu kısımda formunu post ediyoruz.
         */
        $('form#postLocationForm').validate({
            submitHandler: function (form) {
                var formArray = new FormData(form);
                $('#page-loader').show();
                $.ajax({
                    type: 'POST',
                    url: $(form).attr('action'),
                    data: formArray,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data2) {
                        const data = data2.original.data;
                        $('#page-loader').hide();
                        Swal.fire({
                            title: data.title,
                            text: data.text,
                            icon: data.icon,
                            confirmButtonColor: data.color,
                            confirmButtonText: globalText.dataset.globalSweetalertConfirmbuttonText,
                        });
                    },
                    error: function (data) {
                        console.log("error");
                        console.log(data);
                    }
                });

                $(form).submit(function (e) {
                    e.preventDefault();
                });
            }
        });
    </script>

@endsection
