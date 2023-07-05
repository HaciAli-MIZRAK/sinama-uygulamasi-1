
@extends( 'sApp::' . $pageItems->adminThemes . '.master' )

    @foreach($pageItems->modules AS $key => $value)
        @if(View::exists('sApp::' . $pageItems->adminThemes . '.modules.' . $value))
            @include( 'sApp::' . $pageItems->adminThemes . '.modules.' . $value )
        @endif
    @endforeach

    @if($pageItems->pages != 'nul')

        @if(View::exists('sApp::' . $pageItems->adminThemes . '.pages.' . $pageItems->pages))
            @include( 'sApp::' . $pageItems->adminThemes . '.pages.' . $pageItems->pages )
        @endif

        @if(View::exists('sApp::' . $pageItems->adminThemes . '.edits.' . $pageItems->pages))
            @include( 'sApp::' . $pageItems->adminThemes . '.edits.' . $pageItems->pages )
        @endif

        @if(View::exists('sApp::' . $pageItems->adminThemes . '.modals.' . $pageItems->pages . '-modals'))
            @include( 'sApp::' . $pageItems->adminThemes . '.modals.' . $pageItems->pages . '-modals' )
        @endif

    @endif
