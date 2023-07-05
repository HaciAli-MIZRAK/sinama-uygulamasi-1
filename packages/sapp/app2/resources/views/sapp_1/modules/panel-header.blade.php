
@section( 'panel-header' )

    <div class="page-header navbar navbar-fixed-top">
        <div class="page-header-inner ">
            <div class="page-logo">
                <a href="{!! route( 'admin' ) !!}">
                    <img src="{!! URL::asset('assets/sapp_1/imgx/logo.png') !!}" alt="logo" class="logo-default img-150" />
                </a>
                <div class="menu-toggler sidebar-toggler">
                    <span></span>
                </div>
            </div>
            <a href="javascript:;"
               class="menu-toggler responsive-toggler mobile-toggle-menu-bar"
               data-toggle="collapse"
               data-target=".navbar-collapse"
            >
                <span></span>
            </a>
            <div class="top-menu mobile-top-menu">
                <ul class="nav navbar-nav pull-right mobile-top-menu-ul">
                    <li class="dropdown dropdown-user">
                        <a href="javascript:;"
                           class="dropdown-toggle"
                           data-toggle="dropdown"
                           data-hover="dropdown"
                           data-close-others="true"
                        >
                            <img alt="{!! $pageItems->userInfo->name !!}" class="img-circle" src="{!! 'https://sitatic.veritakip.net/uploads/users/image/webp/2021/10/l2qtew7hnjtzjudsr83y-ali.webp' !!}" />
                            <span class="username username-hide-on-mobile">
                                {!! $pageItems->userInfo->name !!}
                            </span>
                            <i class="fa fa-angle-down"></i>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-default">
                            <li>
                                <a href="{!! _text( 'profil link' ) !!}">
                                    <i class="icon-user"></i>
                                    {!! _text( 'profil link' ) !!}
                                </a>
                            </li>
                            <li>
                                <a href="{!! route( 'logout' ) !!}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                                    <i class="icon-logout"></i>
                                    {!! _text( 'Çıkış Yap' ) !!}
                                </a>
                                <form id="logout-form" action="{!! route( 'logout' ) !!}" method="POST" style="display: none;">
                                    @csrf
                                </form>
                            </li>

                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>

@endsection
