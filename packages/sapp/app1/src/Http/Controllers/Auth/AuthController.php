<?php
/**
 * Bu Class ile kullanıcı işlemlerini yapıyoruz.
 */

namespace SAPP\APP1\Http\Controllers\Auth;

/** Sabit Class **/
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use SAPP\APP1\Http\Controllers\API\ApiBaseController AS BaseController;

/** Private Class **/
use SAPP\APP1\Models\UsersItems;

class AuthController extends BaseController {

    /**
     * Bu function class girişi
     */
    public function __construct(  ) {

        parent::__construct(  );

    } /** end __construct(  ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ihtiyaç durumunda kullanmak için sabit bir alan.
     */
    public function indexApi( Request $request ) {

    } /** end indexApi( Request $request ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function api üzerinden kullanıcı giriş taleplerini karşılıyor.
     */
    public function loginApi( Request $request ) {

        if ($request->ajax() === false):
            if ($request->isMethod('post')):
                if (Auth::attempt(['email' => $request->username, 'password' => $request->password])):
                    $user = Auth::user();
                    $data = (object)[
                        'token' => $user->createToken('MyApp')-> accessToken,
                        'text'  => _text( 'Yönlendiriliyorsunuz...' ),
                        //'url'   => route( 'home' ),
                        'data'  => $user
                    ];
                    return $this->sendResponse($data, 'User login successfully.');
                else:
                    $data = (object)[
                        'title'             => _text( 'Kullanıcı işlemi' ),
                        'text'              => _text( 'Kullanıcı bilgileri eşleşmiyor!' ),
                        'icon'              => 'warning',
                        'buttonsStyling'    => '!1',
                        'confirmButtonText' => _text( 'Tamam' )
                    ];
                    return $this->sendError('Unauthorised.', $data);
                endif;
            endif;
        else:
            $data = (object)[
                'title'             => _text( 'Sistem Mesajı!' ),
                'text'              => _text( 'Yetkiniz yok!' ),
                'icon'              => 'danger',
                'buttonsStyling'    => '!1',
                'confirmButtonText' => _text( 'Tamam' )
            ];
            return $this->sendError('Roles Error.', $data);
        endif;

    } /** end loginApi( Request $request ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ile api üzerinden kullanıcı kaydını yapıyoruz.
     */
    public function createApi( Request $request ) {

        if ($request->ajax() === false):
            if ($request->isMethod('post')):
                $request->merge([
                    'email' => $request->username,
                ]);
                $validator = Validator::make($request->only('name', 'email', 'password', 'password_confirmation'), [
                    'name'     => 'required|string|min:3|max:255|',
                    'email'    => 'required|string|email|min:3|max:255|unique:users',
                    'password' => 'required|string|confirmed|min:8|max:18',
                ], [
                    'name.required' => _text( 'Bu alan boş geçilemez!' ),
                    'name.min'      => _text( 'Lütfen en az 3 karakter girin!' ),
                    'name.max'      => _text( 'Lütfen en çok 255 karakter girin!' ),

                    'email.required' => _text( 'Bu alan boş geçilemez!' ),
                    'email.email'    => _text( 'Lütfen geçerli bir email girin!' ),
                    'email.unique'   => _text( 'Bu kullancı sistemde kayıtlı!' ),

                    'password.required'  => _text( 'Bu alan boş geçilemez!' ),
                    'password.confirmed' => _text( 'Şifreler eşleşmiyor!' ),
                ]);
                if ($validator->fails()):
                    $data = (object)[
                        'title'             => _text( 'Sistem mesajı!' ),
                        'text'              => $validator->messages()->first(),
                        'icon'              => 'danger',
                        'buttonsStyling'    => '!1',
                        'confirmButtonText' => _text( 'Tamam' ),
                        'status'            => 'not'
                    ];
                    return $this->sendError('Validation Error.', $data);
                else:
                    $create = UsersItems::create([
                        'name'     => $request->name,
                        'email'    => $request->email,
                        'password' => Hash::make($request->password),
                    ]);
                    if ($create):
                        $data = (object)[
                            'title'             => _text( 'Sistem mesajı!' ),
                            'text'              => _text( 'Kullanıcı kaydı başarılı.' ),
                            'icon'              => 'success',
                            'buttonsStyling'    => '!1',
                            'confirmButtonText' => _text( 'Tamam' ),
                        ];
                        return $this->sendResponse($data, 'User register successfully.');
                    else:
                        $data = (object)[
                            'title'             => _text( 'Sistem mesajı!' ),
                            'text'              => _text( 'Bir sorun oluştur tekrar deneyin.' ),
                            'icon'              => 'warning',
                            'buttonsStyling'    => '!1',
                            'confirmButtonText' => _text( 'Tamam' ),
                        ];
                        return $this->sendError('Register Error.', $data);
                    endif;
                endif;
            endif;
        else:
            $data = (object)[
                'title'             => _text( 'Sistem mesajı!' ),
                'text'              => _text( 'yetkiniz yok.' ),
                'icon'              => 'warning',
                'buttonsStyling'    => '!1',
                'confirmButtonText' => _text( 'Tamam' ),
            ];
            return $this->sendError('Roles Error.', $data);
        endif;

    } /** end createApi( equest $request ) **/

}   /** end class AuthController extends Controller **/
