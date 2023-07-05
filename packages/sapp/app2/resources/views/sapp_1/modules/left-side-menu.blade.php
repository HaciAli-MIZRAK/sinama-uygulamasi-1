
@section( 'left-side-menu' )

    <div class="page-sidebar-wrapper">
        <div class="page-sidebar navbar-collapse collapse">
            <ul class="page-sidebar-menu page-header-fixed page-sidebar-menu-light "
                data-keep-expanded="false"
                data-auto-scroll="true"
                data-slide-speed="100"
            >
                @include( 'sApp::' . $pageItems->adminThemes . '.modules.recursive', [
                    'pageItems' => $pageItems->menus,
                    'pageTheme' => $pageItems->adminThemes
                ] )
            </ul>
        </div>
    </div>

@endsection
