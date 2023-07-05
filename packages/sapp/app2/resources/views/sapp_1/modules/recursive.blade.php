
@foreach($pageItems AS $key => $value)

    @if($value->seouri === '/')

        <li class="nav-item active">
            <a href="{!! route( 'admin' ) !!}"
               class="{!! $value->parent_id != -1 ? 'nav-link': NULL !!}"
            >
                <i class="{!! $value->icon_class !!}"></i>
                <span class="title">{!! $value->title !!}</span>
            </a>
        </li>

    @else

        <li class="nav-item start open {!! $value->seouri == 'javascript:;' ? 'nav-item start ': 'nav-item active ' !!}" id="{!! $value->seouri !!}">
            <a href="{!! $value->seouri == 'javascript:;' ? 'javascript:;': route( 'admin', [$value->seouri] ) !!}"
               class="nav-link {!! $value->seouri == 'javascript:;' ? ' nav-toggle' : NULL !!}"
            >
                <i class="{!! $value->icon_class !!}" style="padding-right: 5px;"></i>
                <span class="title">{!! $value->title !!}</span>
                {!! $value->seouri == 'javascript:;' ? '<span class="arrow"></span>': NULL !!}
            </a>

            @if(count($value->children) > 0)

                <ul class="sub-menu">

                    @include( 'sApp::' . $pageTheme . '.modules.recursive', [
                        'pageItems' => $value->children
                    ] )

                </ul>

            @else

                {!! NULL !!}

            @endif

        </li>

    @endif

@endforeach
