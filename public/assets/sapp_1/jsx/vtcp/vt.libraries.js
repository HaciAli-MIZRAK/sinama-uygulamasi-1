/**
 * Bu kısımda url için path alanı oluşturuyoruz.
 */
let uriL;
let path;
let parser;
let tables;
let Control;
uriL = window.location.href;

parser = document.createElement('a');
parser.href = uriL;

parser.protocol; /* => "http:" */
parser.hostname; /* => "example.com" */
parser.port;     /* => "3000" */
parser.pathname; /* => "/pathname/" */
parser.search;   /* => "?search=test" */
parser.hash;     /* => "#hash" */
parser.host;     /* => "example.com:3000" */

Control = parser.pathname.split('/');
if(Control.indexOf('veriTakip-04') !== -1) {
    Control = Control.splice(1, 2);
} else {
    Control = Control.splice(1, 1);
}
Control = Control.toString();
Control = Control.replace(',', '/');

if(Control.indexOf('public') !== -1) {
    path = parser.protocol + '//' + parser.hostname + '/' + Control + '/';
} else {
    if(parser.port === '') {
        path = parser.protocol + '//' + parser.hostname + '/';
    } else {
        path = parser.protocol + '//' + parser.hostname + ':' + parser.port + '/';
    }
}
const searchingText = 'Yükleniyor...';
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
//localStorage.clear();

/* ------------------------------------------------------------------------------------------------------------------ */
/* ########################## veriTakip için özel javascript LİBRARİES ############################################## */
/* ------------------------------------------------------------------------------------------------------------------ */

const vtPanel = {

    /**
     * 1.
     * SeoURI çevirici function
     */
    createSEOLink: function (link) {

        const trMap = {
            'çÇ': 'c',
            'ğĞ': 'g',
            'şŞ': 's',
            'üÜ': 'u',
            'ıİ': 'i',
            'öÖ': 'o'
        };

        for (const key in trMap) {
            link = link.replace(new RegExp('[' + key + ']', 'g'), trMap[key]);
        }

        return link.replace(/[^-a-zA-Z0-9\s]+/ig, '')
            .replace(/^\s+|\s+$/gm, '')
            .replace(/\s/gi, "-")
            .replace(/[-]+/gi, "-")
            .toLowerCase();

    }, /* end createSEOLink: function( link ) */
    /* -------------------------------------------------------------------------------------------------------------- */
    /**
     * 2.
     * Bu function ile Global bir dataTables Listesi Oluşturuyoruz.
     * Bu function için ilgili liste panelinde oluşturulan
     * değişkenler bu funtion ile işleniyor.
     */
    globalDataTables: function (idSelector, url, dataSet, columns, responsive = false, orders, dtButtonText) {

        tables = $(idSelector).DataTable({
            'dom': "<'row' <'col-md-12'B>>" +
                "<'row'<'col-md-4 col-sm-12 select-resetx'l><'col-md-6 col-sm-12 checkboxs'><'col-md-2 col-sm-12'f>r><'table-scrollable't>" +
                "<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
            'buttons': [
                {
                    'text': dtButtonText.refreshTitle,
                    'action': function (e, dt, node, config) {
                        dt.ajax.reload(null, false);
                    },
                    'className': 'btn purple-seance'
                },
                {
                    'extend': 'copy',
                    'text': dtButtonText.copyTitle,
                    'exportOptions': {
                        'columns': ':visible'
                    },
                    'className': 'btn dark'
                },
                {
                    'extend': 'excel',
                    'exportOptions': {
                        'columns': ':visible'
                    },
                    'className': 'btn blue',
                    'title': dtButtonText.exportTitle
                },
                {
                    'extend': 'print',
                    'exportOptions': {
                        'columns': ':visible'
                    },
                    'className': 'btn red-thunderbird',
                    'title': dtButtonText.printTitle
                },
                {
                    'extend': 'colvis',
                    'text': 'Aç/Kapat',
                    'columns': ':not(.noVis)',
                    'className': 'btn yellow-gold',
                    'title': dtButtonText.colvisTitle
                }
            ],
            'lengthMenu': [
                [10, 25, 50, 100, 250, 500, 1000, -1],
                [10, 25, 50, 100, 250, 500, 1000, "Tümü"]
            ],
            'language': {
                'sProcessing': 'Yükleniyor...',
                'sZeroRecords': 'Eşleşen Kayıt Bulunmadı',
                'sInfo': '  _TOTAL_ Kayıttan _START_ - _END_ Arası kayıt listeleniyor',
                'sInfoEmpty': 'Kayıt Yok',
                'sInfoFiltered': '( _MAX_ Kayıt içerisinden Bulunan)',
                'search': 'Arama _INPUT_',
                'lengthMenu': '_MENU_ Kayıt Göster',
                'oPaginate': {
                    'sFirst': 'İlk',
                    'sPrevious': 'Önceki',
                    'sNext': 'Sonraki',
                    'sLast': 'Son'
                }
            },
            'searchDelay': 500,
            'processing': true,
            'serverSide': true,
            'order': [[orders, 'desc']],
            'responsive': responsive,
            'ordering': true,
            'stateSave': true,
            'destroy': true,
            'select': {
                'style': 'multi',
                'selector': 'td:first-child input[type="checkbox"]',
                'className': 'row-selected'
            },
            'ajax': {
                'url': url,
                'type': 'GET',
                'data': dataSet,
            },
            'columns': columns,
            'columnDefs': [
                {
                    'orderable': !1,
                    'targets': 0
                }, {
                    'orderable': !1,
                    'targets': 4,
                    'className': 'text-center',
                }, {
                    'orderable': !1,
                    'targets': -1,
                    'className': 'text-end',
                    render: function (data, type, row ) {
                        if(Array.isArray(data) === true) {
                            var dropMenu = '';
                            $.each(data, function (index, value) {
                                if (index > 0) {
                                    dropMenu += `<li>
                                                     <a href="${value.href}" class="${value.className}" data-dropmenu-id="${value.buttonId}">
                                                         <i class="${value.icon}"></i>
                                                         ${value.text}
                                                      </a>
                                                 </li>`;
                                }
                            });

                            return `<div class="btn-group pull-right">
                                         <button class="btn green btn-sm btn-outline dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                             <span class="ladda-label">
                                                 ${data[0].main}
                                                 <i class="fa fa-angle-down"></i>
                                             </span>
                                         </button>
                                         <ul class="dropdown-menu pull-right">
                                              ${dropMenu}
                                         </ul>
                                   </div>
                                   <div class="clearfix"></div>`;
                        } else {
                            return '<div class="col-md-6"><a><i class="fa fa-edit" data-location-id="' + data + '" id="updateModalButton"></i></a></div><div class="col-md-6"><i class="fa fa-trash ClearAjax"></i></div>';
                        }
                    }
                }
            ],
            'drawCallback': function (settings, json) {
                $('.dataTables-checked').removeClass('sorting_desc');
                $('td:first-child').addClass('text-center');
                $('.mt-checkbox-outline-x').css({'marginLeft': '-19px'});
                $('.text-end').removeAttr('style');
                if($('img').hasClass('img-thumbnail')) {
                    $('tbody').find('tr > td:nth-child(3)').addClass('text-center').css({'width': '98px'});
                }
                $('.group-checkable').change(function () {
                    var set = $('tbody').find('tr > td:nth-child(1) input[type="checkbox"]');
                    var checked = $(this).prop("checked");
                    $(set).each(function () {
                        $(this).prop("checked", checked);
                    });
                });
            }
        });

    }, /* end dataTablesFunction: function( items ) */
    /* -------------------------------------------------------------------------------------------------------------- */
    /**
     * 3. düzenleme buradan devam edecek.
     * Bu function ile datatables işlemler menüsünü Oluşturucaz.
     */
    tableDroupMenu: function (item) {

        var buttonHTML = '';
        for (var i = 1; i < item.length; i++) {
            buttonHTML += `<li>
                                <a href="` + item[i].href + `" class="` + item[i].class_name + `" data-clear-id="` + item[i].clear_id + `" data-domain-id="` + item[i].domain_id + `">
                                    <i class="` + item[i].icon + `"></i>
                                    ` + item[i].text + `
                                </a>
                            </li>`;
        }

        return `<div class="btn-group pull-right">
                    <button class="btn btn-sm green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                        ` + item[0].main + ` ` + `
                        <i class="fa fa-angle-down"></i>
                    </button>
                    <ul class="dropdown-menu pull-left dropdown-menu-zIndex" role="menu">
                        ` + buttonHTML + `
                    </ul>
                </div><br />`;
    }, /* end tableDroupmenu: function() */
    /* ---------------------------------------------------------------------- */
    /**
     * 4.
     * Bu function ile Yetki Select2 alanını dolduruyoruz.
     */
    roleItemsSelect2Lists: function (selector) {

        $.post($(selector).data('roles-lists-route'), {}, function (data) {
            var newOption;
            var selected;
            $(selector).empty();
            $(selector).append('<option value="-1">' + $(selector).data('placeholder') + '</option>');
            $.each(data, function (i, value) {
                if ($(selector).data('roles-users') === value.role_id) {
                    selected = true;
                } else {
                    selected = false;
                }
                newOption = new Option(value.role_title, value.role_id, false, selected);
                $(selector).append(newOption);
            });
        });

    }, /* end roleItemsSelect2Lists: function( selector ) */
    /* ---------------------------------------------------------------------- */
    /**
     * 5.
     * Bu function ile Ana Domain Select2 alanını dolduruyoruz.
     */
    mainDomainItemsSelect2Lists: function (selector) {

        $.post($(selector).data('main-domain-lists-route'), {}, function (data) {
            var newOption;
            $(selector).append('<option value="-1">' + $(selector).data('placeholder') + '</option>');
            $.each(data, function (i, value) {
                newOption = new Option(value.domain_title, value.domain_id, false, false);
                $(selector).append(newOption);
            });
        });

    }, /* end roleItemsSelect2Lists: function( selector ) */
    /* ---------------------------------------------------------------------- */
    /**
     * 6.
     * Bu function ile Rollerimizi Yönetiyoruz.
     * Bu function iki yerde kullanılıyor;
     * 1. Yetki Yönetimi
     * 2. Kullanıcı Listesi İşelmler Altında Bulunan Yetki Modal penceresinde.
     */
    userRolesPanel: function (items, string = 0) {

        var elementMenu = '';
        for (var i = 0; i < items.length; i++) {

            elementMenu += '<tr ' + (items[i].parent_id == -1 ? 'class="fw-bolder bg-danger text-white bg-dark bg-font-dark"' : '') + ' id="' + items[i].parent_id + '">' +
                '<td>' + '-'.repeat(string) + items[i].menu_title + '</td>' +
                '<td class="">' +
                '<label class="mt-checkbox mt-checkbox-outline">' +
                '<input type="checkbox" name="menu_id[' + items[i].menu_id + ']" class="form-check-input" id="role_id-' + items[i].menu_id + '" value="' + items[i].menu_id + '" />' +
                '<span></span>' +
                '</label>' +
                (items[i].parent_id == -1 ? '<span class="modul-groups-checked" id="' + items[i].menu_id + '"> Tümü </span>' : '') +
                '</td>' +
                '<td>' +
                (items[i].menu_type == 'lists' ?
                    '<label class="mt-checkbox mt-checkbox-outline">' +
                    '<input type="checkbox" name="edits[' + items[i].menu_id + ']" class="form-check-input" id="edits-' + items[i].menu_id + '" value="' + items[i].menu_id + '" />' +
                    '<span></span>' +
                    '</label>' +
                    (items[i].parent_id == -1 ? '<span class="modul-groups-checked" id="' + items[i].menu_id + '"> Tümü </span>' : '') : '') +
                '</td>' +
                '<td>' +
                (items[i].menu_type == 'lists' ?
                    '<label class="mt-checkbox mt-checkbox-outline">' +
                    '<input type="checkbox" name="clear[' + items[i].menu_id + ']" class="form-check-input" id="clears-' + items[i].menu_id + '" value="' + items[i].menu_id + '" />' +
                    '<span></span>' +
                    '</label>' +
                    (items[i].parent_id == -1 ? '<span class="modul-groups-checked" id="' + items[i].menu_id + '"> Tümü </span>' : '') : '') +
                '</td>' +
                this.userRolesPanel(items[i].children, (string + 2)) +
                '</tr>';

        }

        return elementMenu;

    }, /* end userRolesPanel: function( items, string = 2) */
    /* ---------------------------------------------------------------------- */
    /**
     * 7.
     * Bu function ile Yetki Select2 alanını dolduruyoruz.
     */
    cargoItemsSelect2Lists: function (selector) {

        $.post($(selector).data('cargo-select2-lists-route'), {}, function (data) {
            var newOption;
            var selected;
            $(selector).empty();
            $(selector).append('<option value="-1">' + $(selector).data('placeholder') + '</option>');
            $.each(data, function (i, value) {
                if ($(selector).data('cargo-parent-id') === value.cargo_id) {
                    selected = true;
                } else {
                    selected = false;
                }
                newOption = new Option(value.cargo_title, value.cargo_id, false, selected);
                $(selector).append(newOption);
            });
        });

    }, /* end cargoItemsSelect2Lists: function( selector ) */
    /* ---------------------------------------------------------------------- */
    /**
     * 8.
     * Bu function ile Kullanıcı Select2 alanını dolduruyoruz.
     */
    userItemsSelect2Lists: function (selector, userType) {

        $.post($(selector).data('user-select2-lists-route'), {'user_type': userType}, function (data) {
            var newOption;
            var selected;
            $(selector).empty();
            $(selector).append('<option value="blank">' + $(selector).data('placeholder') + '</option>');
            $.each(data, function (i, value) {
                if ($(selector).data('user-parent-id') === value.id) {
                    selected = true;
                } else {
                    selected = false;
                }
                newOption = new Option(value.name, value.id, false, selected);
                $(selector).append(newOption);
            });
        });

    }, /* end cargoItemsSelect2Lists: function( selector ) */
};

/* -------------------------------------------------------------------------- */
$(document).ready(function () {

    /**
     * 1.
     * Bu kısımda yeni yetki Eklemek için Modal Açıyoruz.
     */
    $('body').on('click', '.role-title-modal-open', function() {
        $('#roleTitleCreateModal').modal('show');
        $('#roleModalButton').removeClass('role-title-update-button').addClass('role-title-create-button');
    });
    /* ---------------------------------------------------------------------- */
    /**
     * 2.
     * Bu kısımda yeni Yetki Adını Sisteme Ekliyoruz.
     */
    $('body').on('click', '.role-title-create-button', function() {

        $.post(this.dataset.roleTitleCeateRoute,
        {
            'role_title': document.getElementById('role_title-input').value
        }, function( data ) {
            swal({
                title: data.title,
                text: data.text,
                type: data.icon,
                confirmButtonText: data.confirmButtonText,
            }).then(function( willDelete ) {
                if(willDelete) {
                    woPanel.roleItemsSelect2Lists( '#roleItemsLists' );
                    document.getElementById('role_title-input').value = '';
                }
            });
        });

    });
    /* ---------------------------------------------------------------------- */
    /**
     * 3.
     * Bu kısımda Yetki adını düzenliyoruz veya aktif paisf yapıyoruz.
     */
    $('body').on('click', '.role-title-update-button', function() {

        $.post(this.dataset.roleTitleUpdateRoute,
        {
            'role_id': document.getElementById('role_title-input').dataset.roleId,
            'role_title': document.getElementById('role_title-input').value,
            'role_status': $("input[name='role_status']:checked").val()
        }, function( data ) {
            swal({
                title: data.title,
                text: data.text,
                type: data.icon,
                confirmButtonText: data.confirmButtonText,
            }).then(function( willDelete ) {
                if(willDelete) {
                    woPanel.roleItemsSelect2Lists( '#roleItemsLists' );
                    document.getElementById('role_title-input').value = '';
                }
            });
        });

    });
    /* ---------------------------------------------------------------------- */
    /**
     * 4.
     * Bu function ile Toplu Seçim ve Bırakma İşlemi Yapıyoruz.
     */
    $('body').on('change', '#roleAllCheckbox', function () {

        var set = $('tbody').find('tr > td:nth-child(2) input[type="checkbox"]');

        var checked = $(this).prop('checked');

        $(set).each(function () {
            $(this).prop('checked', checked);
        });
    });
    /* ---------------------------------------------------------------------- */
    /**
     * 5.
     * Bu function ile Toplu Seçim ve Bırakma İşlemi Yapıyoruz.
     */
    $('body').on('change', '#roleEditCheckbox', function () {

        var set = $('tbody').find('tr > td:nth-child(3) input[type="checkbox"]');

        var checked = $(this).prop('checked');

        $(set).each(function () {
            $(this).prop('checked', checked);
        });
    });
    /* ---------------------------------------------------------------------- */
    /**
     * 6.
     * Bu function ile Toplu Seçim ve Bırakma İşlemi Yapıyoruz.
     */
    $('body').on('change', '#roleClearCheckbox', function () {

        var set = $('tbody').find('tr > td:nth-child(4) input[type="checkbox"]');

        var checked = $(this).prop('checked');

        $(set).each(function () {
            $(this).prop('checked', checked);
        });
    });
    /* ---------------------------------------------------------------------- */
    /**
     * 7.
     * Bu function ile Domain Silme işlemi yapıyoruz.
     */
    $('body').on('click', '.DomainSweetAjax', function() {
        var itemId = this.dataset.clearId;

        swal({
            title: "Silme işlemi",
            text: "Silmek istediğinizden emin misiniz?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Evet, Sil!",
            cancelButtonText: "Vazgeç",
            closeOnConfirm: false
        }).then(function(t) {

            if(t === true) {
                var tableRefresh = $('body').find('table').attr('id');
                var deletesClear = $('body').find('table').data('delete-domain-route');

                $.post(deletesClear,
                {
                    clear_id: itemId,
                }, function( data ) {
                    swal({
                        title: data.title,
                        html: data.text,
                        type: data.icon,
                        confirmButtonText: data.confirmButtonText,
                    }).then(function(t) {
                        if(data.refresh == 'ok') {
                            $('#' + tableRefresh).DataTable().ajax.reload(null, false);
                        }
                    });
                });
            }

        });
    });

});
