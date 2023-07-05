
@section( 'modul-blog-items-edits-cssx' )

    <link href="{!! URL::asset( 'assets/admincp_01/cssx/bootstrap/bootstrap-fileinput.css' ) !!}" rel="stylesheet" type="text/css" />
    <link href="{!! URL::asset( 'assets/admincp_01/cssx/minimal/_all.css' ) !!}" rel="stylesheet" type="text/css" />

@endsection

@section( 'blog-items-edits' )

    <form id="postBlogForm" class="form-material" action="{!! route( 'blogs.blogs-update' ) !!}" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="row" style="margin-top: 20px;">
            <div class="col-md-9" style="padding-right: 4px;">
                <div>
                     <div class="portlet light bordered">
                        <div class="portlet-title">
                            <div class="caption">
                                <i class="icon-social-dropbox font-blue-sharp"></i>
                                <span class="caption-subject font-blue-sharp bold">{!! $pageItems->page_header->menu_title !!}</span>
                            </div>
                            <div class="actions" id="actions">
                                <i class="icon-support font-red-thunderbird"></i>
                                <span class="caption-subject font-red-thunderbird">
                                    <small>
                                        <em>
                                            {!! $pageItems->page_header->menu_title !!}
                                            {!! _vtText( ' Lütfen Tüm Alanları Doldurun!' ) !!}
                                        </em>
                                    </small>
                                </span>
                            </div>
                        </div>
                        <div class="portlet-body padding-0">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="post_title-input">{!! _vtText( 'Makale Adı' ) !!}</label>
                                    <span class="caption-subject font-red-thunderbird"><small> <em>{!! _vtText( 'Makale Adı Yazılmalıdır.' ) !!}</em></small></span>
                                    <input type="text" name="post_title" value="{!! $pageItems->pages_edits->post_title !!}" class="form-control vt-validate clearable" id="post_title-input" placeholder="{!! _vtText( 'Makale Adı Girin' ) !!}" autocomplete="off" />
                                </div>
                                <input type="hidden" name="post_id" value="{!! $pageItems->pages_edits->post_id !!}" id="post_id-input" />
                            </div>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="post_seouri-input">{!! _vtText( 'Makale Seo URL' ) !!}</label>
                                    <span class="post-seouri-danger">
                                         <span class="svg-icon svg-icon-1tx svg-icon-danger" style="display: block;margin-top: -5px;margin-left: -30px;">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                   <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"></rect>
                                                   <rect x="11" y="14" width="7" height="2" rx="1" transform="rotate(-90 11 14)" fill="currentColor"></rect>
                                                   <rect x="11" y="17" width="2" height="2" rx="1" transform="rotate(-90 11 17)" fill="currentColor"></rect>
                                              </svg>
                                         </span>
                                         <span style="display: block;margin-top: -25px;">{!! _vtText( 'Bu Blog Sistemde Kayıtlı!' ) !!}</span>
                                    </span>
                                    <span class="post-seouri-success">
                                         <span class="svg-icon svg-icon-1tx svg-icon-success" style="display: block;margin-top: -5px;margin-left: -30px;">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                   <path opacity="0.3" d="M20.5543 4.37824L12.1798 2.02473C12.0626 1.99176 11.9376 1.99176 11.8203 2.02473L3.44572 4.37824C3.18118 4.45258 3 4.6807 3 4.93945V13.569C3 14.6914 3.48509 15.8404 4.4417 16.984C5.17231 17.8575 6.18314 18.7345 7.446 19.5909C9.56752 21.0295 11.6566 21.912 11.7445 21.9488C11.8258 21.9829 11.9129 22 12.0001 22C12.0872 22 12.1744 21.983 12.2557 21.9488C12.3435 21.912 14.4326 21.0295 16.5541 19.5909C17.8169 18.7345 18.8277 17.8575 19.5584 16.984C20.515 15.8404 21 14.6914 21 13.569V4.93945C21 4.6807 20.8189 4.45258 20.5543 4.37824Z" fill="currentColor"></path>
                                                   <path d="M10.5606 11.3042L9.57283 10.3018C9.28174 10.0065 8.80522 10.0065 8.51412 10.3018C8.22897 10.5912 8.22897 11.0559 8.51412 11.3452L10.4182 13.2773C10.8099 13.6747 11.451 13.6747 11.8427 13.2773L15.4859 9.58051C15.771 9.29117 15.771 8.82648 15.4859 8.53714C15.1948 8.24176 14.7183 8.24176 14.4272 8.53714L11.7002 11.3042C11.3869 11.6221 10.874 11.6221 10.5606 11.3042Z" fill="currentColor"></path>
                                              </svg>
                                         </span>
                                         <span style="display: block;margin-top: -25px;">{!! _vtText( 'Bu Blog Sisteme Eklenebilir!' ) !!}</span>
                                    </span>
                                    <span class="caption-subject font-red-thunderbird"><small> <em>{!! _vtText( 'Makale URL Otomatik Oluşuyor İsterseniz Değiştirebilirsiniz.' ) !!}</em></small></span>
                                    <input type="text" name="post_seouri" value="{!! $pageItems->pages_edits->post_seouri !!}" class="form-control clearable" id="post_seouri-input" placeholder="{!! _vtText( 'Makale Seo URL Girin' ) !!}" autocomplete="off" />
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="portlet light bordered">
                                    <div class="portlet-title">
                                        <div class="caption font-red-sunglo">
                                            <i class="icon-settings font-red-sunglo"></i>
                                            <span class="caption-subject bold uppercase">{!! _vtText( 'Meta Bilgileri' ) !!}</span>
                                        </div>
                                        <div class="actions">
                                            <div class="btn-group">
                                                <a class="btn btn-sm green dropdown-toggle" href="javascript:;" data-toggle="dropdown" aria-expanded="false">
                                                    {!! _vtText( 'Hareketler' ) !!}
                                                    <i class="fa fa-angle-down"></i>
                                                </a>
                                                <ul class="dropdown-menu pull-right">
                                                    <li>
                                                        <a href="javascript:;" id="metaShow">
                                                            <i class="fa fa-eye"></i>
                                                            {!! _vtText( 'Göster' ) !!}
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="portlet-body form vt-hide" id="metaStatus">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="__post_title-input">{!! _vtText( 'Makale Meta Adı' ) !!}</label>
                                                <span class="caption-subject font-red-thunderbird"><small> <em>{!! _vtText( 'Makale Meta Adı isteğe bağlı olarak yazılabilir.' ) !!}</em></small></span>
                                                <input type="text" name="__post_title" value="{!! $pageItems->pages_edits->metaInfo( '__post_title' )->meta_value !!}" class="form-control clearable" id="__post_title-input" placeholder="{!! _vtText( 'Makale Meta Adı Girin' ) !!}" autocomplete="off" disabled="disabled" />
                                            </div>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="__post_keywords-input">{!! _vtText( 'Makale Meta Keywords' ) !!}</label>
                                                <span class="caption-subject font-red-thunderbird"><small> <em>{!! _vtText( 'Makale Meta Keywords isteğe bağlı olarak yazılabilir.' ) !!}</em></small></span>
                                                <input type="text" name="__post_keywords" value="{!! $pageItems->pages_edits->metaInfo( '__post_keywords' )->meta_value !!}" class="form-control clearable" id="__post_keywords-input" placeholder="{!! _vtText( 'Makale Meta Keywords Girin' ) !!}" autocomplete="off" disabled="disabled" />
                                            </div>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label for="__post_description-input">{!! _vtText( 'Makale Meta Açıklama' ) !!}</label>
                                                <span class="caption-subject font-red-thunderbird"><small> <em>{!! _vtText( 'Makale Meta Açıklaması isteğe bağlı olarak yazılabilir.' ) !!}</em></small></span>
                                                <input type="text" name="__post_description" value="{!! $pageItems->pages_edits->metaInfo( '__post_description' )->meta_value !!}" class="form-control clearable" id="__post_description-input" placeholder="{!! _vtText( 'Makale Meta Açıklama Girin' ) !!}" autocomplete="off" disabled="disabled" />
                                            </div>
                                        </div>
                                        <div class="clearfix"></div>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="portlet light bordered">
                                    <div class="portlet-title">
                                        <div class="caption font-red-sunglo">
                                            <i class="icon-settings font-red-sunglo"></i>
                                            <span class="caption-subject bold uppercase">{!! _vtText( 'TANITIM YAZISI' ) !!}</span>
                                        </div>
                                        <div class="actions">
                                            <div class="btn-group">
                                                <a class="btn btn-sm green dropdown-toggle" href="javascript:;" data-toggle="dropdown" aria-expanded="false">
                                                    {!! _vtText( 'Hareketler' ) !!}
                                                    <i class="fa fa-angle-down"></i>
                                                </a>
                                                <ul class="dropdown-menu pull-right">
                                                    <li>
                                                        <a href="javascript:;" id="introductionShow">
                                                            <i class="fa fa-eye"></i>
                                                            {!! _vtText( 'Göster' ) !!}
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="portlet-body form vt-hide" id="introductionStatus">
                                        <div class="col-md-12">
                                            <div class="note note-warning bg-red-thunderbird bg-font-red-thunderbird">
                                                <div class="col-md-1" style="padding: 20px 0 0 0;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="44px" height="44px" viewBox="0 0 24 24" version="1.1">
                                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                            <rect x="0" y="0" width="24" height="24"></rect>
                                                            <path d="M4,4 L11.6314229,2.5691082 C11.8750185,2.52343403 12.1249815,2.52343403 12.3685771,2.5691082 L20,4 L20,13.2830094 C20,16.2173861 18.4883464,18.9447835 16,20.5 L12.5299989,22.6687507 C12.2057287,22.8714196 11.7942713,22.8714196 11.4700011,22.6687507 L8,20.5 C5.51165358,18.9447835 4,16.2173861 4,13.2830094 L4,4 Z" fill="#000000" opacity="0.3"></path>
                                                            <path d="M11.1750002,14.75 C10.9354169,14.75 10.6958335,14.6541667 10.5041669,14.4625 L8.58750019,12.5458333 C8.20416686,12.1625 8.20416686,11.5875 8.58750019,11.2041667 C8.97083352,10.8208333 9.59375019,10.8208333 9.92916686,11.2041667 L11.1750002,12.45 L14.3375002,9.2875 C14.7208335,8.90416667 15.2958335,8.90416667 15.6791669,9.2875 C16.0625002,9.67083333 16.0625002,10.2458333 15.6791669,10.6291667 L11.8458335,14.4625 C11.6541669,14.6541667 11.4145835,14.75 11.1750002,14.75 Z" fill="#000000"></path>
                                                        </g>
                                                    </svg>
                                                    <div class="clearfix"></div>
                                                </div>
                                                <div class="col-md-11">
                                                    <h4 class="block">{!! _vtText( 'Sistem Uyarısı' ) !!}</h4>
                                                    <p>{!! _vtText( 'Bu bölüm tanıtım yazısı için gönderilen makalelerin hangi kelimelerine link verileceğini belirleyen alandır.' ) !!}</p>
                                                    <p>{!! _vtText( 'Bu alanın kullanımı opsiyoneldir. Birden fazla kelime ve URL girilecekse "|" işareti ile ayırın.' ) !!}</p>
                                                    <div class="clearfix"></div>
                                                </div>
                                                <div class="clearfix"></div>
                                            </div>
                                            <div class="clearfix"></div>
                                        </div>
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <div class="col-md-12">
                                                    <label for="post_status-input">{!! _vtText( 'Tanıtım Yazısı mı?' ) !!}</label>
                                                </div>
                                                <div class="input-group">
                                                    <div class="icheck-inline">
                                                        <label for="__post_introduction">
                                                            <input type="checkbox" name="post_introduction" class="icheck" id="__post_introduction" {!! $pageItems->pages_edits->post_introduction === 1 ? 'checked': NULL !!} disabled="disabled" />
                                                            {!! _vtText( 'Müşteri mi?' ) !!}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-10">
                                            <div class="form-group">
                                                <span class="help-block"> {!! _vtText( 'Başlangıç ve Bitiş Tarihi Seçin' ) !!} </span>
                                                <div class="input-group date-picker input-daterange" data-date="10-06-2012" data-date-format="dd-mm-yyyy">
                                                    <input type="text" name="__post_word_begins" value="{!! $pageItems->pages_edits->metaInfo( '__post_word_begins' )->meta_value !!}" class="form-control" disabled="disabled" />
                                                    <span class="input-group-addon"> {!! _vtText( 've' ) !!} </span>
                                                    <input type="text" name="__post_word_ends" value="{!! $pageItems->pages_edits->metaInfo( '__post_word_ends' )->meta_value !!}" class="form-control" disabled="disabled" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="__post_private_word-input">{!! _vtText( 'Kelime(leri) Girin' ) !!}</label>
                                                <input type="text" name="__post_private_word" value="{!! $pageItems->pages_edits->metaInfo( '__post_private_word' )->meta_value !!}" class="form-control clearable" id="__post_private_word-input" placeholder="{!! _vtText( 'Kelime(leri) Girin' ) !!}" autocomplete="off" disabled="disabled" />
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="__post_private_uri-input">{!! _vtText( 'URL Girin' ) !!}</label>
                                                <input type="text" name="__post_private_uri" value="{!! $pageItems->pages_edits->metaInfo( '__post_private_uri' )->meta_value !!}" class="form-control clearable" id="__post_private_uri-input" placeholder="{!! _vtText( 'URL Girin' ) !!}" autocomplete="off" disabled="disabled" />
                                            </div>
                                        </div>
                                        <div class="clearfix"></div>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="blogItems">{!! _vtText( 'Makale içeriği girin' ) !!}</label>
                                    <span class="caption-subject font-red-thunderbird"><small><em>{!! _vtText( 'Makale içeriği Yazılmalıdır.' ) !!}</em></small></span>
                                    <textarea name="post_content" id="blogItems" placeholder="{!! _vtText( 'Makale içeriği Yazılmalıdır.' ) !!}" style="visibility: hidden; display: none;">{!! $pageItems->pages_edits->post_content !!}</textarea>
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
                                <span class="caption-subject font-blue-sharp bold">{!! _vtText( 'Makale Detayları' ) !!}</span>
                            </div>
                            <div class="actions"></div>
                        </div>
                        <div class="portlet-body" style="padding: 0;">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="single">{!! _vtText( 'Domain Seçin' ) !!}</label>
                                    <div class="form-group select2-bootstrap-append">
                                        <select name="domain_title"
                                                id="postItemsDomainListSelected2"
                                                class="form-control vt-validate select2"
                                        >
                                            <option value="-1">{!! _vtText( 'Domain Seçin' ) !!}</option>
                                            @foreach(_getDomainList( $domain = NULL ) AS $key => $value)
                                            <option value="{!! $value->domain_value !!}" {!! $value->domain_value == $pageItems->pages_edits->domain_title ? 'selected': NULL !!}>{!! $value->domain_title !!}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="email">{!! _vtText( 'Kategori Seçin' ) !!}</label>
                                    <div class="form-group select2-bootstrap-append">
                                        <select name="categories_id"
                                                id="postItemsCategoriestListSelected2"
                                                class="form-control select2"
                                                data-parent-id="{!! $pageItems->pages_edits->postCategoryInfo()->categoriesInfo->pc_id ?? 1 !!}"
                                        >
                                            <option value="1">{!! _vtText( 'Kategori Seçin' ) !!}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12" style="padding: 5px 0px 25px 0px;">
                                <div class="form-group">
                                    <div class="col-md-12">
                                        <label for="post_status-input">{!! _vtText( 'Makale Durumu' ) !!}</label>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                        <div class="input-group">
                                            <div class="icheck-inline">
                                                <label for="post_status-on">
                                                    <input type="radio" name="post_status" class="icheck" id="post_status-on" {!! $pageItems->pages_edits->post_status === 1 ? 'checked': NULL !!} />
                                                    {!! _vtText( 'Yayınla' ) !!}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div claas="clearfix"></div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                        <div class="input-group">
                                            <div class="icheck-inline">
                                                <label for="post_status-off">
                                                    <input type="radio" name="post_status" class="icheck" id="post_status-off" {!! $pageItems->pages_edits->post_status === 0 ? 'checked': NULL !!} />
                                                    {!! _vtText( 'Yayınlama' ) !!}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label for="email">{!! _vtText( 'Makaleyi Kim Okuyabilir' ) !!}</label>
                                    <div class="form-group select2-bootstrap-append">
                                        <select name="post_rules"
                                                id="postItemsRolesListSelected2"
                                                class="form-control select2"
                                                data-parent-id="2"
                                        >
                                            <option value="2">{!! _vtText( 'Kim Okuyabilir Seçin' ) !!}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-md-12">
                                    <div class="fileinput fileinput-new" data-provides="fileinput" style="width: 100%; height: auto; background-color: #d5d5d5;">
                                        <div class="fileinput-preview thumbnail" data-trigger="fileinput" style="width: 100%; height: auto; background-color: #d5d5d5;">
                                            <img src="https://sitatic.veritakip.net/uploads/blog-images/{!! $pageItems->pages_edits->metaInfo( '__post_images' )->meta_value !!}" class="img-200" />
                                        </div>
                                        <div>
                                            <span class="btn red btn-outline btn-file">
                                                <span class="fileinput-new">
                                                    {!! _vtText( 'Fotoğrafı Seç' ) !!}
                                                </span>
                                                <span class="fileinput-exists">
                                                    {!! _vtText( 'Fotoğrafını Değiştir' ) !!}
                                                </span>
                                                <input type="file" name="__post_image" class="vt-validate" placeholder="{!! _vtText( 'Fotoğraf Yüklemek Zorunlu' ) !!}" accept=".png, .jpg, .jpeg" />
                                                <input type="hidden" name="__post_images" value="{!! $pageItems->pages_edits->metaInfo( '__post_images' )->meta_value !!}" />
                                            </span>
                                            <a href="javascript:;"
                                               class="btn red fileinput-exists"
                                               data-dismiss="fileinput"
                                            >
                                                {!! _vtText( 'Fotoğrafı Sil' ) !!}
                                            </a>
                                        </div>
                                    </div>
                                    <hr />
                                    <div class="clearfix margin-top-10  text-center">
                                        <span class="label label-success">
                                            {!! _vtText( 'Uyari!' ) !!}
                                        </span><br />
                                        {!! _vtText( "<em><small class='font-red-thunderbird'><b>(izin verilen dosya türleri: 'png|jpg|jpeg|webp')</b></small><br /><small>İzin verilen Dosya Boyutu: " . ini_get('upload_max_filesize') . "</small></em>" ) !!}
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                        <hr />
                        <div class="clearfix margin-top-10">
                            <button type="submit" class="btn btn-primary pull-right">{{ _vtText( 'Değişiklikleri Kaydet' ) }}</button>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>
        </div>
    </form>

    @if(View::exists('sApp::' . $pageItems->adminThemes . '.modals.loading-modals'))
        @include( 'sApp::' . $pageItems->adminThemes . '.modals.loading-modals')
        @yield( 'loading-modals' )
    @endif

@endsection

@section( 'modul-blog-items-edits-jsx' )

    <script src="https://cdn.ckeditor.com/4.19.0/standard-all/ckeditor.js" type="text/javascript"></script>
    <script src="{!! URL::asset( 'assets/admincp_01/jsx/bootstrap/bootstrap-fileinput.js' ) !!}" type="text/javascript"></script>
    <script src="{!! URL::asset( 'assets/admincp_01/jsx/moment.min.js' ) !!}" type="text/javascript"></script>
    <script src="{!! URL::asset( 'assets/admincp_01/jsx/bootstrap/bootstrap-datepicker.min.js' ) !!}" type="text/javascript"></script>

    <script>
        var vtEditor = CKEDITOR.replace('blogItems', {
            filebrowserUploadUrl: '{!! route( 'blogs.blogs-ck-file-uploads', ['_token' => csrf_token()] ) !!}',
            filebrowserImageUploadUrl: '{!! route( 'blogs.blogs-ck-file-uploads', ['_token' => csrf_token()] ) !!}',
            filebrowserFlashUploadUrl: '{!! route( 'blogs.blogs-ck-file-uploads', ['_token' => csrf_token()] ) !!}',
            height: 475,
            allowedContent: true,
        });
        /** -------------------------------------------------------------------------------------------------------- **/
        $('body').on('click', '.cke_dialog_ui_button', function( e ) {
            $('.cke_dialog_ui_input_text').eq(3).val($('input[name="post_title"]').val());
            window.setInterval(function() {
                $('.cke_dialog_ui_input_text').eq(5).val('100%');
                $('.cke_dialog_ui_input_text').eq(7).val('100%');
            }, 1200);
        });
        /** -------------------------------------------------------------------------------------------------------- **/
        /**
         * Bu kısımda CKEditör içn özel butonlar ekliyoruz.
         */
        vtEditor.addCommand( 'setAdsense', {
            exec: function( editor ) {
                editor.insertHtml( '{adsense}' );
            }
        });
        vtEditor.addCommand( 'setSeperator', {
            exec: function( editor ) {
                editor.insertHtml( '{---}' );
            }
        });
        vtEditor.addCommand( 'setSliders', {
            exec: function( editor ) {
                editor.insertHtml( '{SLIDERS}' );
            }
        });
        vtEditor.addCommand( 'setPhotograf', {
            exec: function( editor ) {
                editor.insertHtml( '{pagePhotograf}' );
            }
        });
        vtEditor.ui.addButton('Adsense', {
            label: 'Reklam Ekle',
            command: 'setAdsense',
            toolbar: 'about,1',
            icon: path + 'assets/admincp_01/imgx/ck-image/732201.png',
        });
        vtEditor.ui.addButton('Seperator', {
            label: 'Seperatör Ekle',
            command: 'setSeperator',
            toolbar: 'about,2',
            icon: path + 'assets/admincp_01/imgx/ck-image/56932.png',
        });
        vtEditor.ui.addButton('Sliders', {
            label: 'Benzer Konular',
            command: 'setSliders',
            toolbar: 'about,3',
            icon: path + 'assets/admincp_01/imgx/ck-image/567361.png',
        });
        vtEditor.ui.addButton('Photograf', {
            label: 'Sayfaya Fotoğraf Ekle',
            command: 'setPhotograf',
            toolbar: 'about,4',
            icon: path + 'assets/admincp_01/imgx/ck-image/3004613.png',
        });
        /** -------------------------------------------------------------------------------------------------------- **/
        $('.date-picker').datepicker({orientation:"left",autoclose:!0});
    </script>

@endsection

@section( 'modul-blog-items-edits-jsx2' )

    <script>
        /**
         * Bu kısımda SeoURL alanını otomatik oluşturuyoruz.
         */
        $('#post_title-input').on('keyup', function() {
            var seoURI = vtPanel.createSEOLink( document.getElementById('post_title-input').value );
            /**
             * Seo URI alanımızı dolduruyoruz.
             */
            document.getElementById('post_seouri-input').value = seoURI;
        });
        /** -------------------------------------------------------------------------------------------------------- **/
        /**
         * Bu kısımda Meta Bilgileri Panelini Açıp Kapatıyoruz.
         */
        $('body').on('click', '#metaShow', function() {
            if($('#metaStatus').hasClass('vt-hide')) {
                $('#metaStatus').removeClass('vt-hide').addClass('vt-show').find('input').attr('disabled', false);
                $(this).html('<i class="fa fa-eye-slash"></i> ' + '{!! _vtText( 'Gizle' ) !!}');
            } else {
                $('#metaStatus').removeClass('vt-show').addClass('vt-hide').find('input').attr('disabled', true);
                $(this).html('<i class="fa fa-eye"></i> ' + '{!! _vtText( 'Göster' ) !!}');
            }
        });
        /** -------------------------------------------------------------------------------------------------------- **/
        /**
         * Bu kısımda Tanıtım Yazısı Panelini Açıp Kapatıyoruz.
         */
        $('body').on('click', '#introductionShow', function() {
            if($('#introductionStatus').hasClass('vt-hide')) {
                $('#introductionStatus').removeClass('vt-hide').addClass('vt-show').find('input').attr('disabled', false);
                $(this).html('<i class="fa fa-eye-slash"></i> ' + '{!! _vtText( 'Gizle' ) !!}');
            } else {
                $('#introductionStatus').removeClass('vt-show').addClass('vt-hide').find('input').attr('disabled', true);
                $(this).html('<i class="fa fa-eye"></i> ' + '{!! _vtText( 'Göster' ) !!}');
            }
        });
        /** -------------------------------------------------------------------------------------------------------- **/
        $.post('{!! route( 'blogs.blogs-list-select2' ) !!}', function( data ) {
            vtPanel.globalSelect2Lists( 'postItemsCategoriestListSelected2', data );
        });
        $.post('{!! route( 'blogs.blogs-role-list-select2' ) !!}', function( data ) {
            vtPanel.globalSelect2Lists( 'postItemsRolesListSelected2', data );
        });
        /** -------------------------------------------------------------------------------------------------------- **/
        /**
         * Bu kısımda Makale Detayını Düzenleme post ediyoruz.
         */
        $('form#postBlogForm').validate({
            submitHandler: function (form) {
                const formArray = new FormData(form);
                      formArray.append('post_content', CKEDITOR.instances['blogItems'].getData());
                      formArray.append('post_type', 'blogs');
                      formArray.append('__post_image', $('[name="__post_image"]')[0].files[0]);

                if(CKEDITOR.instances['blogItems'].getData() === '') {
                    Swal.fire({
                        title: globalText.dataset.globalSweetalertWarningTitle,
                        text: 'İçerik Girişi Zorunludur.',
                        icon: 'warning',
                        confirmButtonColor: '#f91942',
                        confirmButtonText: globalText.dataset.globalSweetalertConfirmbuttonText
                    });
                } else {
                    $('#page-loader').show();
                    $.ajax({
                        type: 'POST',
                        url: $(form).attr('action'),
                        data: formArray,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function (data) {
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
                }

                $(form).submit(function (e) {
                    e.preventDefault();
                });
            }
        });
        @if($pageItems->pages_edits->metaInfo( '__post_title' )->meta_value !== '')
            $('#metaShow').trigger('click');
        @endif
        @if($pageItems->pages_edits->metaInfo( '__post_word_begins' )->meta_value !== '')
        $('#introductionShow').trigger('click');
        @endif
    </script>

@endsection
