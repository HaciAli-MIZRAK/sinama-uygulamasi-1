
@section( 'modul-all-locations-cssx' )

    <link href="{!! URL::asset( 'assets/sapp_1/cssx/datatables.min.css' ) !!}" rel="stylesheet" type="text/css" />
    <style>
        tr.row-selected {
            color: #ffffff;
            background: #2a9055 !important;
        }
        @media (max-width: 991px) {
            .vt-pull-right {
                float: right !important;
            }
        }
        .img-thumbnail {
            width: 95px!important;
        }
    </style>

@endsection

@section( 'all-locations' )

    <div class="row" style="margin-top: 20px;">
        <div class="col-md-12">
            <div class="portlet light portlet-fit bordered">
                <div class="portlet-title">
                    <div class="caption">
                        <i class="icon-settings font-red"></i>
                        <span class="caption-subject font-blue-sharp bold pageTitle"></span>
                    </div>
                    <div class="actions" id="actions">

                    </div>
                </div>
                <div class="portlet-body">
                    <table class="table table-striped table-bordered table-hover dt-responsive" width="100%" id="users-items">
                        <thead>
                        <tr>
                            <th class="dataTables-checked">
                                <label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                    <input type="checkbox" class="group-checkable">
                                    <span></span>
                                </label>
                            </th>
                            <th class="text-center">{!! _text( 'ID' ) !!}</th>
                            <th class="text-center">{!! _text( 'Konum Adı' ) !!}</th>
                            <th class="text-center">{!! _text( 'Kullanıcı' ) !!}</th>
                            <th class="text-center">{!! _text( 'Enlem' ) !!}</th>
                            <th class="text-center">{!! _text( 'Boylam' ) !!}</th>
                            <th class="text-center">{!! _text( 'Marker Rengi' ) !!}</th>
                            <th class="text-center">{!! _text( 'Ekleme Tarihi' ) !!}</th>
                            <th class="dataTables-options">{!! _text( 'İşlemler' ) !!}</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

@endsection

@section( 'modul-all-locations-jsx' )

    <script src="{!! URL::asset( 'assets/sapp_1/jsx/datatables.min.js' ) !!}" type="text/javascript"></script>
    <script>
        const columns = [
            {
                name: 'id',
                data: 'id',
                orderable: false,
                render: function (data, type, full, meta) {
                    return `<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline mt-checkbox-outline-x">
                                <input type="checkbox" name="client_id[${data}]" value="${data}" class="checkboxes">
                                <span></span>
                            </label>`;
                }
            },
            {
                data: 'id',
                name: 'id',
            },
            {
                name: 'location_title',
                data: 'location_title'
            },
            {
                name: 'user_name.name',
                data: 'user_name.name',
            },
            {
                name: 'latitude',
                data: 'latitude',
            },
            {
                name: 'longitude',
                data: 'longitude',
            },
            {
                name: 'marker_colored',
                data: 'marker_colored',
                render: function( data, type, full, meta ) {
                    return `<span class="pull-right bold" style="background-color: ${data}">${data}</span>`;
                }
            },
            {
                name: 'create_at',
                data: 'create_at',
                searchable: false,
                render: function( data, type, full, meta ) {
                    return `<span class="pull-right bold">${data}</span>`;
                }
            },
            {
                data: 'id',
                name: 'id',
            }
        ];

        const dtButtonText = {
            'exportTitle': '{!! _text( 'Makale Listesi' ) !!}',
            'refreshTitle': '{!! _text( 'Yenile' ) !!}',
            'copyTitle': '{!! _text( 'Kopyala' ) !!}',
            'printTitle': '{!! _text( 'Print' ) !!}',
            'colvisTitle': '{!! _text( 'Aç/Kapat' ) !!}',
            'filterTitle': '{!! _text( 'Filitre' ) !!}'
        };

        vtPanel.globalDataTables( '#users-items', '{!! route( 'allListLocation' ) !!}', {'status': '1', 'type': '1'}, columns, true, 0, dtButtonText );
    </script>

@endsection
