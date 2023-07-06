
<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="tr-TR">
<!--<![endif]-->
    <head>
        <meta charset="utf-8" />
        <title>{!! Meta::get( 'title' ) !!}</title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="#" name="description" />
        <meta name="description" content="{!! Meta::get( 'description' ) !!}" />
        <meta name="keywords" content="{!! Meta::get( 'keywords' ) !!}" />
        <meta name="csrf-token" content="{!! csrf_token() !!}" />
        <meta content="Hacı Ali MIZRAK | mizraklar@hotmail.com" name="author" />
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css" />
        <link href="{!! URL::asset( 'assets/sapp_1/cssx/font-awesome.min.css' ) !!}" rel="stylesheet" type="text/css" />
        <link href="{!! URL::asset( 'assets/sapp_1/cssx/simple-line-icons.css' ) !!}" rel="stylesheet" type="text/css" />
        <link href="{!! URL::asset( 'assets/sapp_1/cssx/bootstrap/bootstrap.min.css' ) !!}" rel="stylesheet" type="text/css" />
        <link href="{!! URL::asset( 'assets/sapp_1/cssx/bootstrap/bootstrap-switch.min.css' ) !!}" rel="stylesheet" type="text/css" />
        <link href="{!! URL::asset( 'assets/sapp_1/cssx/bootstrap/bootstrap-modal-bs3patch.css' ) !!}" rel="stylesheet" type="text/css" />
        <link href="{!! URL::asset( 'assets/sapp_1/cssx/bootstrap/bootstrap-modal.css' ) !!}" rel="stylesheet" type="text/css" />
        <link href="{!! URL::asset( 'assets/sapp_1/cssx/select2/select2.min.css' ) !!}" rel="stylesheet" type="text/css" />
        <link href="{!! URL::asset( 'assets/sapp_1/cssx/select2/select2-bootstrap.min.css' ) !!}" rel="stylesheet" type="text/css" />
        @yield( 'modul-' . $pageItems->pages . '-cssx' )
        @if(request()->segment(2) == NULL)
            @yield( 'modul-main-statistics-cssx' )
        @endif
        <link href="{!! URL::asset( 'assets/sapp_1/cssx/components.min.css' ) !!}" rel="stylesheet" id="style_components" type="text/css" />
        <link href="{!! URL::asset( 'assets/sapp_1/cssx/plugins.min.css' ) !!}" rel="stylesheet" type="text/css" />
        <link href="{!! URL::asset( 'assets/sapp_1/cssx/layout.min.css' ) !!}" rel="stylesheet" type="text/css" />
        <link href="{!! URL::asset( 'assets/sapp_1/cssx/darkblue.min.css' ) !!}" rel="stylesheet" type="text/css" id="style_color" />
        <!-- <link href="{!! URL::asset( 'assets/sapp_1/cssx/private.min.css' ) !!}" rel="stylesheet" type="text/css" /> -->
        <link rel="shortcut icon" href="{!! URL::asset( 'assets/sapp_1/imgx/favico.png' ) !!}" />


        <link href="{{ URL::asset( 'assets/sapp_1/cssx/trakings/leaflets/leaflet.css' ) }}" rel="stylesheet" type="text/css"/>
        <link href="{{ URL::asset( 'assets/sapp_1/cssx/jquery.notific8.min.css' ) }}" rel="stylesheet" type="text/css"/>
        <link href="{{ URL::asset( 'assets/sapp_1/cssx/trakings/maps.style.01.css' ) }}" rel="stylesheet" type="text/css"/>
        <link href="{{ URL::asset( 'assets/sapp_1/cssx/datatables.min.css' ) }}" rel="stylesheet" type="text/css" />

        <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />


        <style>
            .panel {
                background: transparent !important;
            }
            .panel-default {
                border-color: transparent !important;
            }
        </style>


    </head>
    <body class="page-header-fixed page-sidebar-closed-hide-logo page-container-bg-solid page-content-white">
        <div class="page-wrapper"
             id="globalText"
             data-global-sweetalert-success-title="{!! _text( 'İşlem Başarılı!' ) !!}"
             data-global-sweetalert-warning-title="{!! _text( 'Sistem Mesajı!' ) !!}"
             data-global-sweetalert-confirmbutton-text="{!! _text( 'Tamam' ) !!}"
        >

            @yield( $pageItems->modules[0] )

            <div class="clearfix"> </div>

            <div class="page-container">

                @yield( $pageItems->modules[1] )

                <div class="page-content-wrapper">
                    <div class="page-content">

                        @if(request()->segment(2) == NULL)
                            <div class="row">
                                <div class="col-lg-12 col-xs-12 col-sm-12">
                                    <div id="maps-panele"></div>
                                </div>
                            </div>

                        @endif

                        @yield( $pageItems->pages )
                        @yield( $pageItems->pages . '-modals' )

                    </div>
                </div>

            </div>
            <div class="page-footer">
                <div class="page-footer-inner hidden-sm hidden-xs">
                    {!! _text( 'sApp' ) !!}
                    {!! _text( 'Copyright, 2006-2022' ) !!}
                </div>
                <div class="pull-right" style="color: #ffffff;">
                    {!! _text( 'Sistem: ' ) . app()->version() !!} | {!! _text( 'AdminPanel Sistemi v: 4.0.0' ) !!}
                </div>
                <div class="scroll-to-top">
                    <i class="icon-arrow-up"></i>
                </div>
            </div>
        </div>
        <!--[if lt IE 9]>
        <script src="{{ URL::asset( 'assets/sapp_1/jsx/ie9/respond.min.js' ) }}"></script>
        <script src="{{ URL::asset( 'assets/sapp_1/jsx/ie9/excanvas.min.js' ) }}"></script>
        <script src="{{ URL::asset( 'assets/sapp_1/jsx/ie9/ie8.fix.min.js' ) }}"></script>
        <![endif]-->
        <script src="{!! URL::asset( 'assets/sapp_1/jsx/jquery-js/jquery.min.js' ) !!}" type="text/javascript"></script>
        <script src="{!! URL::asset( 'assets/sapp_1/jsx/jquery-js/jquery-ui.min.js' ) !!}" type="text/javascript"></script>
        <script src="{!! URL::asset( 'assets/sapp_1/jsx/jquery-js/jquery.validate.min.js' ) !!}" type="text/javascript"></script>
        <script src="{!! URL::asset( 'assets/sapp_1/jsx/bootstrap/bootstrap.min.js' ) !!}" type="text/javascript"></script>
        <script src="{!! URL::asset( 'assets/sapp_1/jsx/js.cookie.min.js' ) !!}" type="text/javascript"></script>
        <script src="{!! URL::asset( 'assets/sapp_1/jsx/jquery-js/jquery.slimscroll.min.js' ) !!}" type="text/javascript"></script>
        <script src="{!! URL::asset( 'assets/sapp_1/jsx/input.clear.js' ) !!}" type="text/javascript"></script>
        <script src="{!! URL::asset( 'assets/sapp_1/jsx/select2/select2.full.min.js' ) !!}" type="text/javascript"></script>
        <script src="{!! URL::asset( 'assets/sapp_1/jsx/sweetalert.min.js' ) !!}" type="text/javascript"></script>
        <script src="{!! URL::asset( 'assets/sapp_1/jsx/icheck.min.js' ) !!}" type="text/javascript"></script>
        <script src="{!! URL::asset( 'assets/sapp_1/jsx/vtcp/vt.libraries.js' ) !!}?date={!! date( 'i:s' ) !!}" type="text/javascript"></script>
        @yield( 'modul-' . $pageItems->pages . '-jsx' )
        @if(request()->segment(2) == NULL)
            @yield( 'modul-main-statistics-jsx' )
        @endif
        <script src="{!! URL::asset( 'assets/sapp_1/jsx/private.min.js' ) !!}" type="text/javascript"></script>
        <script src="{!! URL::asset( 'assets/sapp_1/jsx/select2/components-select2.min.js' ) !!}" type="text/javascript"></script>
        @yield( 'modul-' . $pageItems->pages . '-jsx2' )
        <script src="{!! URL::asset( 'assets/sapp_1/jsx/layout.min.js' ) !!}" type="text/javascript"></script>

        <!-- MAPS PANEL -->

        <script src="{{ URL::asset( 'assets/sapp_1/jsx/bootstrap/bootstrap-modal.js' ) }}" type="text/javascript"></script>
        <script src="{{ URL::asset( 'assets/sapp_1/jsx/bootstrap/bootstrap-modalmanager.js' ) }}" type="text/javascript"></script>
        <script src="{{ URL::asset( 'assets/sapp_1/jsx/datatables.min.js' ) }}" type="text/javascript"></script>

        <!-- MAPS PANEL -->
        @if(request()->segment(2) == NULL)
        <script src="{{ URL::asset( 'assets/sapp_1/jsx/trakings/leaflets/leaflet.js' ) }}" type="text/javascript"></script>
        <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/mapbox-polyline/1.1.1/polyline.min.js"></script>
        <script src="{{ URL::asset( 'assets/sapp_1/jsx/trakings/leaflets/Leaflet.fullscreen.min.js' ) }}" type="text/javascript"></script>
        <script src="{{ URL::asset( 'assets/sapp_1/jsx/trakings/openLayer.libraries.01.js' ) . '?date=' . date('H-i') }}" type="text/javascript"></script>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>
        @endif

        @if(request()->segment(2) != NULL && request()->segment(1) != 'edits')
            <script>
                $('#{!! request()->segment(2) !!}').addClass('active').parent().css('display', 'block');
                $(".mobile-toggle-menu-bar").click(function(i) {
                    $("body").toggleClass("page-quick-sidebar-open");
                });
                $('.pageTitle').text($('#{!! request()->segment(2) !!}').find('a').text().trim());
                $('.pageTopTitle').text($('#{!! request()->segment(2) !!}').parent().parent().find('a').eq(0).text().trim());
            </script>
        @endif
</body>
</html>
