<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AdminProfileController;
use App\Http\Controllers\Admin\{
    AdminDashboardController,
    AdminServiceController,
    AdminEventRequestController,
    AdminPaymentController,
    AdminReviewController,
    AdminStatisticsController,
    AdminQuoteController,
    AdminCategoryController,
    AdminBookingController
};

use App\Http\Controllers\Caterer\{
    CatererEventRequestController,
    CatererQuoteController,
    CatererBookingController,
    CatererAvailabilityController,
    CatererMediaController,
    CatererMessageController,
    CatererReviewController,
    CatererPaymentController,
    CatererSubscriptionController,
    CatererNotificationController,
    CatererProfileController,
    CatererServiceController,
    CatererDashboardController,
    CatererSearchController
};

use App\Http\Controllers\Client\ClientQuoteController;
use App\Http\Controllers\Client\ClientCatererSearchController;
use App\Http\Controllers\Client\{
    ClientFavoriteController,
    ClientReviewController,
    ClientBookingController,
    ClientMessageController,
    ClientProfileController,
    ClientEventRequestController,
    ClientCatererProfileController,
    ClientNotificationController
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

Route::middleware(['auth:sanctum'])->group(function () {

    Route::post(
        '/client/quotes/{quote}/accept',
        [CatererQuoteController::class,'accept']
    );


    Route::post(
        '/client/quotes/{quote}/reject',
        [CatererQuoteController::class,'reject']
    );


});


Route::middleware(['auth:sanctum', 'role:client'])->prefix('client')->group(function () {
    Route::get('quotes', [ClientQuoteController::class, 'index']);
    Route::post('quote/{id}/accept', [ClientQuoteController::class, 'accept']);
    Route::post('quote/{id}/reject', [ClientQuoteController::class, 'reject']);

    Route::get('caterers/search', [ClientCatererSearchController::class, 'index']);
    Route::get('categories', [ClientCatererSearchController::class, 'categories']);
    Route::post('favorites/toggle/{catererId}', [ClientFavoriteController::class, 'toggle']);
    Route::get('caterer/{id}', [ClientCatererSearchController::class, 'show']);

    Route::get('reviews', [ClientReviewController::class, 'index']);
    Route::get('reviews/pending', [ClientReviewController::class, 'pending']);
    Route::post('reviews/store', [ClientReviewController::class, 'store']);
    
    Route::get('bookings', [ClientBookingController::class, 'index']);
    Route::get('booking/show/{id}', [ClientBookingController::class, 'show']);

    Route::get('conversations', [ClientMessageController::class, 'conversations']);
    Route::get('conversations/{partnerId}/messages', [ClientMessageController::class, 'messages']);
    Route::post('conversations/{partnerId}/messages', [ClientMessageController::class, 'send']);

    Route::get('profile', [ClientProfileController::class, 'show']);
    Route::put('profile', [ClientProfileController::class, 'update']);
    Route::put('profile/password', [ClientProfileController::class, 'updatePassword']);

    Route::get('event-requests', [ClientEventRequestController::class, 'index']);
    Route::get('event-request/show/{id}', [ClientEventRequestController::class, 'show']);
    Route::post('event-request/store', [ClientEventRequestController::class, 'store']);

    Route::get('caterers/{id}/profile', [ClientCatererProfileController::class, 'show']);
    Route::get('favorites', [ClientFavoriteController::class, 'index']);

    Route::get('notifications', [ClientNotificationController::class, 'index']);
    Route::get('notifications/unread-count', [ClientNotificationController::class, 'unreadCount']);
    Route::put('notifications/{id}/read', [ClientNotificationController::class, 'markAsRead']);

    Route::get('messages/recent', [ClientMessageController::class, 'recent']);
    Route::get('bookings/next', [ClientBookingController::class, 'next']);

});


Route::middleware(['auth:sanctum', 'role:traiteur'])->prefix('caterer')->group(function () {
    Route::get('profile', [CatererProfileController::class, 'show']);
    Route::put('profile', [CatererProfileController::class, 'update']);
    Route::post('profile/logo', [CatererProfileController::class, 'updateLogo']);
    Route::put(
        'profile/password',
        [CatererProfileController::class, 'updatePassword']
    );

    Route::get('services', [CatererServiceController::class, 'index']);
    Route::get('service/show/{id}', [CatererServiceController::class, 'show']);
    Route::post('service/store', [CatererServiceController::class, 'store']);
    Route::put('service/update/{id}', [CatererServiceController::class, 'update']);
    Route::put('service/enable/{id}', [CatererServiceController::class, 'enable']);
    Route::put('service/disable/{id}', [CatererServiceController::class, 'disable']);
    Route::delete('service/delete/{id}', [CatererServiceController::class, 'destroy']);
    Route::get('categories', [CatererServiceController::class, 'categories']);


    // Demandes
    Route::get('event-requests', [CatererEventRequestController::class, 'index']);
    Route::get('event-request/show/{id}', [CatererEventRequestController::class, 'show']);
    Route::put('event-request/status/{id}', [CatererEventRequestController::class, 'updateStatus']);

    // Devis
    Route::get('quotes', [CatererQuoteController::class, 'index']);
    Route::get('quote/show/{id}', [CatererQuoteController::class, 'show']);
    Route::post('quote/store', [CatererQuoteController::class, 'store']);
    Route::put('quote/update/{id}', [CatererQuoteController::class, 'update']);
    Route::delete('quote/delete/{id}', [CatererQuoteController::class, 'destroy']);

    // Réservations
    Route::get('bookings', [CatererBookingController::class, 'index']);
    Route::get('booking/show/{id}', [CatererBookingController::class, 'show']);
    Route::put('booking/status/{id}', [CatererBookingController::class, 'updateStatus']);

    // Disponibilité
    Route::get('calendar', [CatererAvailabilityController::class, 'calendar']);
    Route::get('working-hours', [CatererAvailabilityController::class, 'workingHours']);
    Route::put('working-hours', [CatererAvailabilityController::class, 'updateWorkingHours']);
    Route::post('availability/block', [CatererAvailabilityController::class, 'block']);
    Route::delete('availability/unblock/{id}', [CatererAvailabilityController::class, 'unblock']);

    // Galerie
    Route::get('gallery', [CatererMediaController::class, 'index']);
    Route::post('gallery/upload', [CatererMediaController::class, 'upload']);
    Route::delete('gallery/delete/{id}', [CatererMediaController::class, 'destroy']);

    // Messages
    Route::get('conversations', [CatererMessageController::class, 'conversations']);
    Route::get('conversations/{partnerId}/messages', [CatererMessageController::class, 'messages']);
    Route::post('conversations/{partnerId}/messages', [CatererMessageController::class, 'send']);

    // Avis
    Route::get('reviews', [CatererReviewController::class, 'index']);
    Route::post('reviews/{id}/reply', [CatererReviewController::class, 'reply']);

    // Paiements
    Route::get('payments', [CatererPaymentController::class, 'index']);

    // Abonnement
    Route::get('subscription', [CatererSubscriptionController::class, 'show']);
    Route::post('subscription/subscribe', [CatererSubscriptionController::class, 'subscribe']);
    Route::put('subscription/cancel', [CatererSubscriptionController::class, 'cancel']);

    // Notifications
    Route::get('notifications', [CatererNotificationController::class, 'index']);
    Route::put('notifications/{id}/read', [CatererNotificationController::class, 'markAsRead']);
    Route::put('notifications/read-all', [CatererNotificationController::class, 'markAllAsRead']);

    Route::get('dashboard', [CatererDashboardController::class, 'index']);
    Route::get('dashboard/upcoming', [CatererDashboardController::class, 'upcoming']);
    Route::get('dashboard/revenue-chart', [CatererDashboardController::class, 'revenueChart']);

    Route::get('service/{id}/media', [CatererServiceController::class, 'media']);
    Route::post('service/{id}/media', [CatererServiceController::class, 'uploadMedia']);
    Route::delete('service/media/{mediaId}', [CatererServiceController::class, 'deleteMedia']);

    Route::get('search', [CatererSearchController::class, 'search']);
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

     // --- Devis ---
    Route::get('admin/quotes', [AdminQuoteController::class, 'index']);
    Route::get('admin/quote/show/{id}', [AdminQuoteController::class, 'show']);

    // --- Catégories ---
    Route::get('admin/categories', [AdminCategoryController::class, 'index']);
    Route::post('admin/category/store', [AdminCategoryController::class, 'store']);
    Route::put('admin/category/update/{id}', [AdminCategoryController::class, 'update']);
    Route::delete('admin/category/delete/{id}', [AdminCategoryController::class, 'destroy']);

    // --- Réservations ---
    Route::get('admin/bookings', [AdminBookingController::class, 'index']);
    Route::get('admin/booking/show/{id}', [AdminBookingController::class, 'show']);

    Route::get('admin/profile', [AdminProfileController::class, 'show']);
    Route::put('admin/profile', [AdminProfileController::class, 'update']);
    Route::put('admin/profile/password', [AdminProfileController::class, 'updatePassword']);


});

//pour admin
Route::middleware(['auth:sanctum', 'role:admin'])->get('/admin', function () {

});

