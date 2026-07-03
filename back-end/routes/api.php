<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\{
    AdminDashboardController,
    AdminServiceController,
    AdminEventRequestController,
    AdminPaymentController,
    AdminReviewController,
    AdminStatisticsController,
};

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::post('/register', [AuthController::class, 'register']);
Route::post('/register/caterer', [AuthController::class, 'registerCaterer']);
Route::post('/login', [AuthController::class, 'login']);

//authentification par gmail
Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('admin/user', [UserController::class, 'index']);
    Route::delete('admin/user/delete/{id}', [UserController::class, 'destroy']);
    Route::post('admin/user/update-role/{id}', [UserController::class, 'updateRole']);

    Route::get('admin/caterer/show/{id}', [UserController::class, 'showCaterer']);
    Route::get('admin/caterer/update-status/{id}', [UserController::class, 'updateStatusCaterer']);
    Route::post('admin/create/admin', [UserController::class, 'storeAdmin']);

     Route::put('admin/user/suspend/{id}', [UserController::class, 'suspend']);
    Route::put('admin/user/unsuspend/{id}', [UserController::class, 'unsuspend']);
    Route::get('admin/clients', [UserController::class, 'clients']);
    Route::get('admin/caterers', [UserController::class, 'caterers']);


    // Dashboard
    Route::get('admin/dashboard', [AdminDashboardController::class, 'index']);
    Route::get('admin/dashboard/charts', [AdminDashboardController::class, 'charts']);

    // Services
    Route::get('admin/services', [AdminServiceController::class, 'index']);
    Route::get('admin/services/{id}', [AdminServiceController::class, 'show']);
    Route::put('admin/services/disable/{id}', [AdminServiceController::class, 'disable']);
    Route::put('admin/services/enable/{id}', [AdminServiceController::class, 'enable']);
    Route::delete('admin/services/delete/{id}', [AdminServiceController::class, 'destroy']);

    // Demandes
    Route::get('admin/event-requests', [AdminEventRequestController::class, 'index']);
    Route::get('admin/event-requests/{id}', [AdminEventRequestController::class, 'show']);

    // Paiements
    Route::get('admin/payments', [AdminPaymentController::class, 'index']);
    Route::get('admin/payments/{id}', [AdminPaymentController::class, 'show']);

    // Avis
    Route::get('admin/reviews', [AdminReviewController::class, 'index']);
    Route::put('admin/reviews/hide/{id}', [AdminReviewController::class, 'hide']);
    Route::put('admin/reviews/show/{id}', [AdminReviewController::class, 'unhide']);
    Route::delete('admin/reviews/delete/{id}', [AdminReviewController::class, 'destroy']);

    // Statistiques
    Route::get('admin/statistics', [AdminStatisticsController::class, 'index']);



});

//pour admin
Route::middleware(['auth:sanctum', 'role:admin'])->get('/admin', function () {

});

