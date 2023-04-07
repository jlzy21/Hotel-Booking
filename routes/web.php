<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\Auth\LoginController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Auth::routes();

// Completed routes 

/* Initial route */
Route::get('/', function () {
    return redirect('/login/admin');
});

/* Login Routes */
// Short-handed login route
Route::get('/login', function () {
    return redirect('/login/admin');
});

// Admin login routes
Route::get('/login/admin', [LoginController::class, 'showAdminLoginForm']);
Route::post('/login/admin', [LoginController::class, 'adminLogin']);

// Clerk login routes
Route::get('/login/clerk', [LoginController::class, 'showClerkLoginForm']);
Route::post('/login/clerk', [LoginController::class, 'clerkLogin']);

/* Clerk route middlewares */
Route::group(['middleware' => 'auth'], function () {
    Route::view('/home', 'home');

    /* Clerk complaints routes */
    Route::get('/complaints', [ComplaintController::class, 'viewComplaints']);
    Route::post('/complaints', [ComplaintController::class, 'addComplaint']);
}); 

/* Admin route middlewares */
Route::group(['middleware' => 'auth'], function () {
    Route::view('/admin/dashboard', 'dashboard')->middleware('can:isAdmin');

    /* Admin complaints routes */
    Route::get('/admin/complaints', [ComplaintController::class, 'viewComplaints'])->middleware('can:isAdmin');
    Route::post('/admin/complaints', [ComplaintController::class, 'addComplaint'])->middleware('can:isAdmin');
    Route::post('/admin/complaints/update', [ComplaintController::class, 'updateComplaint'])->middleware('can:isAdmin');
}); 

/* Logout route */
Route::get('logout', [LoginController::class, 'logout']);

// Incompleted routes 
Route::view("clerkProfile",'clerkProfile');

// View booking list
// Route::view("bookings",'bookings');
// Route::get('/bookings-table', function () {
//     return redirect('/bookings#bookings-table');
// });

// Get reservation-form
Route::get('/reservation-form', function () {
    return redirect('/home#submitReservationForm');
});

// Booking Routes
Route::get('/bookings', [BookingController::class, 'viewBookings']);
Route::post('/home', [BookingController::class, 'createBooking']);
Route::post('/bookings/edit/{id}', [BookingController::class, 'editBooking']);
Route::get('/bookings/delete/{id}', [BookingController::class, 'deleteBooking']);


Route::view("about",'about');
Route::view('/admin/staff', 'staff');
Route::view("/admin/bookings",'adminBooking');
Route::view('/admin/profile', 'adminProfile');