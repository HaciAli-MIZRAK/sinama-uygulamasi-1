<?php
    ?>

@section( 'loading-modals' )

    <div id="page-loader" style="display: none">
        <div class="overlay"></div>
        <div class="loader-wrap">
            <div class="loader">
                <img src="{!! 'https://www.veritakip.net/uploads/logox/rk2y29tyetln6s3h1orc-nintio-logo.png' !!}" alt="Icon" />
            </div>
            <p class="text">{!! _vtText( 'Yükleniyor...' ) !!}</p>
        </div>
    </div>

@endsection
